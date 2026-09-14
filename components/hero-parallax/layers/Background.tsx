import React from 'react';

export default function Background() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[2] overflow-hidden">
      
      {/* --- BACKGROUND LEFT LEAVES --- */}
      <svg
        viewBox="0 0 300 1000"
        preserveAspectRatio="xMinYMax meet"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-[-30px] h-[52%] w-auto opacity-60"
      >
        <g>
          <ellipse cx="41" cy="-29" rx="124" ry="123" fill="#0C3B1C" transform="rotate(6 41 -29)" />
          <ellipse cx="31" cy="95" rx="102" ry="77" fill="#1B6B37" transform="rotate(-24 31 95)" />
          <ellipse cx="83" cy="170" rx="48" ry="69" fill="#1B6B37" transform="rotate(10 83 170)" />
          <ellipse cx="71" cy="222" rx="113" ry="74" fill="#1B6B37" transform="rotate(26 71 222)" />
          <ellipse cx="30" cy="210" rx="88" ry="116" fill="#14532D" transform="rotate(10 30 210)" />
          <ellipse cx="-25" cy="281" rx="117" ry="111" fill="#0C3B1C" transform="rotate(29 -25 281)" />
          <ellipse cx="18" cy="454" rx="73" ry="62" fill="#14532D" transform="rotate(18 18 454)" />
          <ellipse cx="7" cy="445" rx="59" ry="36" fill="#0C3B1C" transform="rotate(-19 7 445)" />
          <ellipse cx="164" cy="570" rx="61" ry="40" fill="#14532D" transform="rotate(19 164 570)" />
          <ellipse cx="8" cy="626" rx="54" ry="51" fill="#1B6B37" transform="rotate(-25 8 626)" />
          <ellipse cx="-30" cy="668" rx="130" ry="98" fill="#0C3B1C" transform="rotate(-4 -30 668)" />
          <ellipse cx="104" cy="867" rx="74" ry="69" fill="#0C3B1C" transform="rotate(33 104 867)" />
          <ellipse cx="149" cy="841" rx="88" ry="76" fill="#14532D" transform="rotate(-20 149 841)" />
          <ellipse cx="66" cy="1017" rx="94" ry="60" fill="#0C3B1C" transform="rotate(-4 66 1017)" />
          <ellipse cx="18" cy="1061" rx="79" ry="52" fill="#0C3B1C" transform="rotate(6 18 1061)" />
        </g>
      </svg>

      {/* --- BACKGROUND RIGHT LEAVES --- */}
      <svg
        viewBox="0 0 300 1000"
        preserveAspectRatio="xMaxYMax meet"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 right-[-30px] h-[52%] w-auto opacity-60"
      >
        <g>
          <ellipse cx="212" cy="-2" rx="118" ry="90" fill="#14532D" transform="rotate(22 212 -2)" />
          <ellipse cx="174" cy="17" rx="69" ry="56" fill="#1B6B37" transform="rotate(22 174 17)" />
          <ellipse cx="244" cy="185" rx="54" ry="71" fill="#1B6B37" transform="rotate(16 244 185)" />
          <ellipse cx="297" cy="193" rx="127" ry="164" fill="#14532D" transform="rotate(-25 297 193)" />
          <ellipse cx="329" cy="291" rx="129" ry="93" fill="#1B6B37" transform="rotate(17 329 291)" />
          <ellipse cx="325" cy="392" rx="119" ry="80" fill="#1B6B37" transform="rotate(-24 325 392)" />
          <ellipse cx="333" cy="495" rx="144" ry="88" fill="#1B6B37" transform="rotate(-10 333 495)" />
          <ellipse cx="331" cy="510" rx="149" ry="200" fill="#0C3B1C" transform="rotate(-33 331 510)" />
          <ellipse cx="310" cy="614" rx="87" ry="90" fill="#1B6B37" transform="rotate(-22 310 614)" />
          <ellipse cx="313" cy="648" rx="87" ry="56" fill="#14532D" transform="rotate(-26 313 648)" />
          <ellipse cx="208" cy="765" rx="51" ry="50" fill="#0C3B1C" transform="rotate(-26 208 765)" />
          <ellipse cx="327" cy="856" rx="125" ry="134" fill="#0C3B1C" transform="rotate(13 327 856)" />
          <ellipse cx="287" cy="886" rx="68" ry="81" fill="#14532D" transform="rotate(-32 287 886)" />
          <ellipse cx="266" cy="935" rx="50" ry="68" fill="#1B6B37" transform="rotate(16 266 935)" />
          <ellipse cx="307" cy="979" rx="139" ry="172" fill="#0C3B1C" transform="rotate(22 307 979)" />
        </g>
      </svg>
      {/* --- HORIZON SVG --- */}
      <svg 
        viewBox="0 0 1440 1000" 
        preserveAspectRatio="xMidYMax slice"
        fill="none" 
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        {/* Simple Distant Horizon / Haze */}
        <path d="M-200 1350 Q 720 700 1640 1350 L1640 1700 L-200 1700 Z" fill="#1B6B37" opacity="0.45" />
        <path d="M-200 1400 Q 720 800 1640 1400 L1640 1700 L-200 1700 Z" fill="#14532D" opacity="0.3" />
        
        {/* Tiny pterosaur silhouettes */}
        <g fill="#14532D" opacity="0.45">
          <path d="M300 350 Q310 340 320 350 Q310 355 300 350 Z" />
          <path d="M350 320 Q358 315 365 320 Q358 322 350 320 Z" />
          <path d="M1100 280 Q1115 270 1130 280 Q1115 285 1100 280 Z" />
        </g>
      </svg>
    </div>
  );
}
