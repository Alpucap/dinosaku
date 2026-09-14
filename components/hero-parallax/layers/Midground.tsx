import React from 'react';

export default function Midground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[10] overflow-hidden">
      
      {/* --- MIDGROUND LEFT LEAVES --- */}
      <svg
        viewBox="0 0 300 1000"
        preserveAspectRatio="xMinYMax meet"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-[-70px] h-[76%] w-auto opacity-95"
      >
        <g>
          <ellipse cx="93" cy="-85" rx="64" ry="64" fill="#369C50" transform="rotate(20 93 -85)" />
          <ellipse cx="62" cy="74" rx="99" ry="108" fill="#369C50" transform="rotate(30 62 74)" />
          <ellipse cx="-9" cy="125" rx="76" ry="54" fill="#369C50" transform="rotate(-23 -9 125)" />
          <ellipse cx="19" cy="168" rx="151" ry="126" fill="#45B25C" transform="rotate(-30 19 168)" />
          <ellipse cx="151" cy="239" rx="102" ry="87" fill="#2A8543" transform="rotate(2 151 239)" />
          <ellipse cx="132" cy="448" rx="98" ry="113" fill="#369C50" transform="rotate(23 132 448)" />
          <ellipse cx="151" cy="500" rx="69" ry="72" fill="#2A8543" transform="rotate(-23 151 500)" />
          <ellipse cx="-17" cy="579" rx="124" ry="113" fill="#45B25C" transform="rotate(7 -17 579)" />
          <ellipse cx="-2" cy="643" rx="148" ry="180" fill="#369C50" transform="rotate(-4 -2 643)" />
          <ellipse cx="78" cy="765" rx="63" ry="45" fill="#2A8543" transform="rotate(11 78 765)" />
          <ellipse cx="-4" cy="790" rx="128" ry="123" fill="#2A8543" transform="rotate(-24 -4 790)" />
          <ellipse cx="178" cy="916" rx="51" ry="62" fill="#369C50" transform="rotate(27 178 916)" />
          <ellipse cx="53" cy="887" rx="80" ry="99" fill="#369C50" transform="rotate(-11 53 887)" />
          <ellipse cx="-36" cy="962" rx="137" ry="181" fill="#45B25C" transform="rotate(-21 -36 962)" />
        </g>
      </svg>

      {/* --- MIDGROUND RIGHT LEAVES --- */}
      <svg
        viewBox="0 0 300 1000"
        preserveAspectRatio="xMaxYMax meet"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 right-[-70px] h-[76%] w-auto opacity-95"
      >
        <g>
          <ellipse cx="153" cy="-59" rx="110" ry="68" fill="#45B25C" transform="rotate(15 153 -59)" />
          <ellipse cx="147" cy="77" rx="79" ry="80" fill="#2A8543" transform="rotate(-14 147 77)" />
          <ellipse cx="308" cy="172" rx="125" ry="178" fill="#2A8543" transform="rotate(28 308 172)" />
          <ellipse cx="313" cy="202" rx="96" ry="65" fill="#45B25C" transform="rotate(-28 313 202)" />
          <ellipse cx="302" cy="365" rx="71" ry="78" fill="#2A8543" transform="rotate(10 302 365)" />
          <ellipse cx="235" cy="432" rx="114" ry="70" fill="#45B25C" transform="rotate(-15 235 432)" />
          <ellipse cx="259" cy="422" rx="145" ry="136" fill="#2A8543" transform="rotate(13 259 422)" />
          <ellipse cx="121" cy="600" rx="69" ry="68" fill="#45B25C" transform="rotate(13 121 600)" />
          <ellipse cx="305" cy="586" rx="79" ry="84" fill="#45B25C" transform="rotate(-2 305 586)" />
          <ellipse cx="325" cy="714" rx="127" ry="112" fill="#2A8543" transform="rotate(-31 325 714)" />
          <ellipse cx="212" cy="754" rx="103" ry="122" fill="#2A8543" transform="rotate(-3 212 754)" />
          <ellipse cx="277" cy="825" rx="134" ry="135" fill="#45B25C" transform="rotate(-12 277 825)" />
          <ellipse cx="213" cy="917" rx="62" ry="52" fill="#2A8543" transform="rotate(17 213 917)" />
          <ellipse cx="329" cy="1078" rx="151" ry="120" fill="#45B25C" transform="rotate(23 329 1078)" />
        </g>
      </svg>
      {/* --- MAIN TERRAIN SVG (SLICED ON MOBILE) --- */}
      <svg 
        viewBox="0 0 1440 1000" 
        preserveAspectRatio="xMidYMax slice"
        fill="none" 
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        {/* Subsurface Dirt/Soil Layer */}
        <path 
          d="M-200 1420 Q 720 770 1640 1420 L1640 1700 L-200 1700 Z" 
          fill="#5d4037"
        />
        <path 
          d="M-200 1370 Q 720 740 1640 1370 L1640 1700 L-200 1700 Z" 
          fill="#795548"
        />
        
        {/* Deep Grass Layer */}
        <path 
          d="M-200 1350 Q 720 720 1640 1350 L1640 1420 L-200 1420 Z" 
          fill="#388e3c"
        />
        
        {/* Top Grass Surface (The massive rounded dome) */}
        <path 
          d="M-200 1320 Q 720 700 1640 1320 L1640 1350 Q 720 750 -200 1350 Z" 
          fill="#4caf50"
        />
        
        {/* Light Grass Highlight sweeping across the peak */}
        <path 
          d="M200 1020 Q 720 690 1240 1020 Q 720 720 200 1020 Z" 
          fill="#81c784" 
          opacity="0.8"
        />

        {/* --- ORGANIC DETAILS (Rocks & Small Ferns) --- */}
        <g opacity="0.9">
          {/* Left slope rocks */}
          <path d="M400 810 Q420 780 450 795 Q455 820 440 830 Q400 830 400 810 Z" fill="#9e9e9e" />
          <path d="M405 813 Q420 785 440 805 Q442 815 432 822 Q405 822 405 813 Z" fill="#e0e0e0" />
          
          {/* Right slope rocks */}
          <path d="M1040 810 Q1065 780 1085 795 Q1090 820 1075 830 Q1040 830 1040 810 Z" fill="#757575" />
          <path d="M1045 813 Q1065 788 1080 805 Q1082 815 1072 822 Q1045 822 1045 813 Z" fill="#9e9e9e" />
        </g>

        {/* --- DINOSAKU (Perfectly grounded on the exact peak of the lowered hill) --- */}
        {/* Subtle, small contact shadow right at his feet */}
        <ellipse cx="720" cy="705" rx="60" ry="10" fill="#1b5e20" opacity="0.3" />
        
        {/* Dinosaku standing naturally on the terrain */}
        <foreignObject x="570" y="465" width="300" height="260">
          <div {...{ xmlns: "http://www.w3.org/1999/xhtml" }} className="w-full h-full flex justify-center items-end pb-[5px]">
            <video 
              src="/mascot/dinosaku-hero.webm" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-[85%] object-contain drop-shadow-2xl"
            />
          </div>
        </foreignObject>

      </svg>
    </div>
  );
}
