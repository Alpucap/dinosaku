import React from 'react';

export default function Foreground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[20] overflow-hidden">
      
      {/* --- LEFT SIDE: FOREGROUND LAYER --- */}
      <svg
        viewBox="0 0 400 1000"
        preserveAspectRatio="xMinYMax meet"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-[-5%] left-[-170px] md:left-[-120px] lg:left-[-80px] h-[105%] w-auto transition-all duration-500"
      >
        <g>
          <ellipse cx="103" cy="-52" rx="82" ry="118" fill="#83D451" transform="rotate(34 103 -52)" />
          <ellipse cx="38" cy="-19" rx="179" ry="184" fill="#98CE36" transform="rotate(2 38 -19)" />
          <ellipse cx="35" cy="141" rx="118" ry="106" fill="#6BC95B" transform="rotate(10 35 141)" />
          <ellipse cx="13" cy="236" rx="232" ry="227" fill="#55BE55" transform="rotate(28 13 236)" />
          <ellipse cx="-20" cy="201" rx="137" ry="168" fill="#55BE55" transform="rotate(-14 -20 201)" />
          <ellipse cx="8" cy="268" rx="98" ry="67" fill="#98CE36" transform="rotate(-25 8 268)" />
          <ellipse cx="83" cy="367" rx="215" ry="183" fill="#6BC95B" transform="rotate(-13 83 367)" />
          <ellipse cx="25" cy="387" rx="176" ry="145" fill="#83D451" transform="rotate(17 25 387)" />
          <ellipse cx="204" cy="528" rx="74" ry="56" fill="#83D451" transform="rotate(14 204 528)" />
          <ellipse cx="4" cy="629" rx="116" ry="75" fill="#55BE55" transform="rotate(-18 4 629)" />
          <ellipse cx="91" cy="591" rx="122" ry="122" fill="#83D451" transform="rotate(-13 91 591)" />
          <ellipse cx="34" cy="715" rx="224" ry="136" fill="#83D451" transform="rotate(-19 34 715)" />
          <ellipse cx="69" cy="784" rx="193" ry="163" fill="#55BE55" transform="rotate(-5 69 784)" />
          <ellipse cx="-3" cy="805" rx="232" ry="169" fill="#83D451" transform="rotate(5 -3 805)" />
          <ellipse cx="-44" cy="908" rx="163" ry="176" fill="#83D451" transform="rotate(-15 -44 908)" />
          <ellipse cx="96" cy="992" rx="204" ry="188" fill="#83D451" transform="rotate(25 96 992)" />
          <ellipse cx="-44" cy="1095" rx="175" ry="175" fill="#6BC95B" transform="rotate(-17 -44 1095)" />
        </g>
      </svg>

      {/* --- RIGHT SIDE: FOREGROUND LAYER --- */}
      <svg
        viewBox="0 0 400 1000"
        preserveAspectRatio="xMaxYMax meet"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-[-5%] right-[-170px] md:right-[-120px] lg:right-[-80px] h-[105%] w-auto transition-all duration-500"
      >
        <g>
          <ellipse cx="350" cy="-86" rx="233" ry="168" fill="#98CE36" transform="rotate(-24 350 -86)" />
          <ellipse cx="432" cy="16" rx="214" ry="189" fill="#55BE55" transform="rotate(-22 432 16)" />
          <ellipse cx="323" cy="66" rx="214" ry="138" fill="#55BE55" transform="rotate(15 323 66)" />
          <ellipse cx="481" cy="158" rx="244" ry="300" fill="#6BC95B" transform="rotate(-34 481 158)" />
          <ellipse cx="267" cy="237" rx="98" ry="59" fill="#6BC95B" transform="rotate(8 267 237)" />
          <ellipse cx="216" cy="333" rx="145" ry="153" fill="#98CE36" transform="rotate(17 216 333)" />
          <ellipse cx="319" cy="346" rx="165" ry="192" fill="#83D451" transform="rotate(24 319 346)" />
          <ellipse cx="309" cy="489" rx="200" ry="228" fill="#98CE36" transform="rotate(7 309 489)" />
          <ellipse cx="228" cy="467" rx="113" ry="91" fill="#6BC95B" transform="rotate(-31 228 467)" />
          <ellipse cx="408" cy="623" rx="191" ry="162" fill="#6BC95B" transform="rotate(13 408 623)" />
          <ellipse cx="206" cy="623" rx="126" ry="145" fill="#6BC95B" transform="rotate(15 206 623)" />
          <ellipse cx="259" cy="767" rx="138" ry="83" fill="#83D451" transform="rotate(-4 259 767)" />
          <ellipse cx="286" cy="818" rx="129" ry="147" fill="#98CE36" transform="rotate(8 286 818)" />
          <ellipse cx="206" cy="760" rx="186" ry="252" fill="#55BE55" transform="rotate(-8 206 760)" />
          <ellipse cx="431" cy="845" rx="246" ry="274" fill="#6BC95B" transform="rotate(-4 431 845)" />
          <ellipse cx="355" cy="920" rx="227" ry="249" fill="#55BE55" transform="rotate(-31 355 920)" />
          <ellipse cx="370" cy="996" rx="137" ry="193" fill="#98CE36" transform="rotate(-25 370 996)" />
        </g>
      </svg>

    </div>
  );
}
