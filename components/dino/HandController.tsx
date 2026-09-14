'use client';

import React, { useEffect, useRef, useState } from 'react';
import { initHandLandmarker } from '@/lib/gesture-control';
import { HandLandmarker } from '@mediapipe/tasks-vision';
import { Camera, CameraOff, Info } from 'lucide-react';

export type Gesture = 'Open_Palm' | 'Closed_Fist' | 'Pointing_Up' | 'Thumb_Up' | 'Thumb_Down' | 'None';

interface Props {
  onGesture?: (gesture: Gesture) => void;

  mode?: 'comic' | 'quiz';
}

export default function HandController({ onGesture, mode = 'quiz' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestRef = useRef<number>(0);
  const lastVideoTime = useRef(-1);
  const [isEnabled, setIsEnabled] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dino_camera_enabled') === 'true';
      if (saved) setIsEnabled(true);
    }
  }, []);

  const toggleCamera = () => {
    setIsEnabled(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dino_camera_enabled', String(next));
      }
      return next;
    });
  };
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState('Kamera mati');
  const [currentGesture, setCurrentGesture] = useState<Gesture>('None');
  const [holdProgress, setHoldProgress] = useState(0);
  const pendingGesture = useRef<Gesture>('None');
  const gestureStartTime = useRef<number>(0);
  const [showInfo, setShowInfo] = useState(false);

  const gestureHistory = useRef<Gesture[]>([]);
  const lastFiredGesture = useRef<Gesture>('None');
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let landmarker: HandLandmarker | null = null;
    let active = true;

    async function start() {
      if (!isEnabled) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
        setIsReady(false);
        setStatus('Kamera mati');
        return;
      }

      try {
        setStatus('Mengaktifkan Kamera...');
        landmarker = await initHandLandmarker();
        if (!active || !isEnabled) return;
        setStatus('Kamera menyala');
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => {
            setIsReady(true);
            predict();
          };
        }
      } catch (err) {
        console.error(err);
        setStatus('Kamera diblokir');
        setIsEnabled(false);
      }
    }

    function predict() {
      if (!active || !isEnabled || !videoRef.current || !landmarker) return;
      if (videoRef.current.currentTime !== lastVideoTime.current) {
        lastVideoTime.current = videoRef.current.currentTime;
        const result = landmarker.detectForVideo(videoRef.current, performance.now());
        if (result.handednesses.length > 0) {
          const landmarks = result.landmarks[0];
          
          // Thumb
          const thumbTip = landmarks[4];
          const thumbIp = landmarks[3];
          const thumbMcp = landmarks[2];
          // Index
          const indexTip = landmarks[8];
          const indexMcp = landmarks[5];
          // Middle
          const middleTip = landmarks[12];
          const middleMcp = landmarks[9];
          // Ring & Pinky (folded check)
          const ringTip = landmarks[16];
          const ringMcp = landmarks[13];
          const pinkyTip = landmarks[20];
          const pinkyMcp = landmarks[17];

          const indexFolded = indexTip.y > indexMcp.y;
          const middleFolded = middleTip.y > middleMcp.y;
          const ringFolded = ringTip.y > ringMcp.y;
          const pinkyFolded = pinkyTip.y > pinkyMcp.y;
          
          const indexUp = indexTip.y < indexMcp.y;
          const middleUp = middleTip.y < middleMcp.y;

          let gesture: Gesture = 'None';

          if (indexUp && !middleUp && ringFolded && pinkyFolded) {
            gesture = 'Pointing_Up';
          } else if (indexUp && middleUp && !ringFolded && !pinkyFolded) {
            gesture = 'Open_Palm';
          } else if (indexFolded && middleFolded && ringFolded && pinkyFolded) {
            // Check for thumb up: thumb is pointing up significantly, and it's higher than its IP
            const isThumbUp = thumbTip.y < thumbIp.y && thumbTip.y < indexMcp.y;
            if (isThumbUp) {
              gesture = 'Thumb_Up';
            } else {
              gesture = 'Closed_Fist';
            }
          }

          gestureHistory.current.push(gesture);
          if (gestureHistory.current.length > 30) gestureHistory.current.shift();
          
          const counts = gestureHistory.current.reduce((acc, g) => {
            acc[g] = (acc[g] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const mostFrequent = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b) as Gesture;
          
          setCurrentGesture(mostFrequent);
          
          const now = performance.now();
          if (mostFrequent !== 'None' && counts[mostFrequent] >= 15) {
             if (pendingGesture.current !== mostFrequent) {
                 pendingGesture.current = mostFrequent;
                 gestureStartTime.current = now;
                 setHoldProgress(0);
             } else {
                 if (lastFiredGesture.current !== mostFrequent) {
                     const elapsed = now - gestureStartTime.current;
                     const progress = Math.min((elapsed / 1500) * 100, 100);
                     setHoldProgress(progress);
                     if (progress === 100) {
                         lastFiredGesture.current = mostFrequent;
                         if (onGesture) onGesture(mostFrequent);
                        window.dispatchEvent(new CustomEvent('dino-gesture', { detail: mostFrequent }));
                     }
                 }
             }
          } else if (counts[mostFrequent] < 10 || mostFrequent === 'None') {
             if (pendingGesture.current !== 'None') {
                 pendingGesture.current = 'None';
                 setHoldProgress(0);
                 if (lastFiredGesture.current !== 'None' && mostFrequent === 'None') {
                     lastFiredGesture.current = 'None';
                 }
             }
          }
        }
      }
      requestRef.current = requestAnimationFrame(predict);
    }

    start();

    return () => {
      active = false;
      cancelAnimationFrame(requestRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [isEnabled, onGesture]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Instructions Popup */}
      {showInfo && (
        <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-brand-primary w-64 text-sm font-medium text-secondary">
          <h4 className="font-bold text-primary mb-2 flex items-center gap-2"><Info size={16} /> Cara Main</h4>
          {mode === 'quiz' ? (
            <ul className="space-y-2">
              <li>☝️ <b>Tunjuk:</b> Pilih A</li>
              <li>✋ <b>Buka Tangan:</b> Pilih B</li>
              <li>✊ <b>Genggam:</b> Pilih C</li>
              <li>👍 <b>Jempol:</b> Lanjut Soal</li>
            </ul>
          ) : (
            <ul className="space-y-2">
              <li>👍 <b>Jempol:</b> Lanjut ke Kuis</li>
            </ul>
          )}
        </div>
      )}

      {/* Main Controller Area */}
      <div className="flex flex-row-reverse items-end gap-2">
        <div className="relative">
          <div className={`w-32 h-32 rounded-full overflow-hidden border-4 transition-colors duration-300 shadow-lg relative ${isEnabled ? 'border-brand-primary bg-surface-soft' : 'border-border-strong bg-border'}`}>
            {isEnabled ? (
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-secondary opacity-50">
                <CameraOff size={40} />
              </div>
            )}
            {!isReady && isEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface-soft/80 text-xs text-center p-2 font-bold text-secondary">
                {status}
              </div>
            )}
          </div>
          
          {isEnabled && isReady && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-xl shadow-md text-xs font-bold text-primary border-2 border-border whitespace-nowrap flex flex-col items-center gap-1 min-w-[80px]">
              <div>
                {currentGesture === 'Pointing_Up' ? '☝️ Opsi A' :
                 currentGesture === 'Open_Palm' ? '✋ Opsi B' :
                 currentGesture === 'Closed_Fist' ? '✊ Opsi C' :
                 currentGesture === 'Thumb_Up' ? '👍 Lanjut' : '👀 Cari...'}
              </div>
              {holdProgress > 0 && holdProgress < 100 && (
                 <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div className="bg-brand-primary h-full transition-all duration-75" style={{ width: `${holdProgress}%` }} />
                 </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={toggleCamera}
            className={`p-3 rounded-full shadow-card border-2 transition-transform hover:scale-105 ${isEnabled ? 'bg-danger border-danger text-white' : 'bg-brand-primary border-brand-primary text-white'}`}
            title={isEnabled ? "Matikan Kamera" : "Nyalakan Kamera"}
          >
            {isEnabled ? <CameraOff size={20} /> : <Camera size={20} />}
          </button>
          
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="p-3 rounded-full bg-white shadow-sm border-2 border-border text-secondary hover:text-brand-primary hover:border-brand-primary transition-transform hover:scale-105"
            title="Cara Main"
          >
            <Info size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
