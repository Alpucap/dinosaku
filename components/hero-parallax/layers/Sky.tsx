import React from 'react';

export default function Sky() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {/* Gradient: starts from app bg color, transitions to soft sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAF5] via-[#e8f5e9] to-[#c8e6c9]" />
      
      {/* Soft warm sun glow */}
      <div className="absolute top-[12%] right-[18%] md:right-[22%]">
        <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-[#fff9c4] opacity-80 blur-lg" />
        <div className="absolute inset-0 w-20 h-20 md:w-32 md:h-32 rounded-full bg-[#ffecb3] opacity-40 blur-2xl" />
      </div>
    </div>
  );
}
