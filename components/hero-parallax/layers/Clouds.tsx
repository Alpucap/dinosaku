import React from 'react';

export default function Clouds() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {/* Cloud 1 - Left */}
      <svg className="absolute top-[8%] left-[3%] w-36 md:w-52 opacity-85" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="50" rx="90" ry="30" fill="white" />
        <ellipse cx="60" cy="40" rx="50" ry="25" fill="white" />
        <ellipse cx="140" cy="42" rx="45" ry="22" fill="white" />
        <ellipse cx="100" cy="35" rx="60" ry="28" fill="white" />
      </svg>
      
      {/* Cloud 2 - Center-right */}
      <svg className="absolute top-[15%] right-[8%] w-28 md:w-44 opacity-70" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="50" rx="85" ry="28" fill="white" />
        <ellipse cx="65" cy="40" rx="45" ry="23" fill="white" />
        <ellipse cx="135" cy="38" rx="50" ry="25" fill="white" />
        <ellipse cx="100" cy="30" rx="55" ry="25" fill="white" />
      </svg>
      
      {/* Cloud 3 - Far right small */}
      <svg className="absolute top-[5%] right-[30%] w-24 md:w-36 opacity-50" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="45" rx="80" ry="25" fill="white" />
        <ellipse cx="70" cy="38" rx="42" ry="20" fill="white" />
        <ellipse cx="130" cy="36" rx="48" ry="22" fill="white" />
      </svg>
    </div>
  );
}
