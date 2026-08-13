import React from "react";
import "./RunningMan.css";

export default function RunningMan() {
  return (
    <div className="runner-wrapper">
      <svg
        className="running-man"
        viewBox="0 0 300 500"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Animated runner"
        role="img"
      >

        {/* Hair */}
        <g className="hair">
          <path
            d="M115 72 C92 52, 96 20, 130 18
               C160 5, 190 28, 184 58
               C174 44, 157 40, 145 48
               C136 57, 127 68, 115 72Z"
            fill="#111111"
          />
        </g>

        {/* Head */}
        <circle
          cx="145"
          cy="78"
          r="38"
          fill="#D99A6C"
        />

        {/* Neck */}
        <path
          d="M132 108 L158 108 L162 132 L130 132Z"
          fill="#D99A6C"
        />

        {/* Yellow Running Shirt */}
        <path
          className="shirt"
          d="M126 120
             C105 123 92 140 91 166
             L103 230
             C115 239 142 242 166 229
             L174 165
             C171 141 160 125 158 120
             Z"
          fill="#FFD21C"
        />

        {/* Left Arm */}
        <g className="arm-left">
          <path
            d="M105 132
               C90 138 79 153 72 171
               L51 214
               C47 224 53 231 62 228
               L91 187
               L119 157Z"
            fill="#D99A6C"
          />
        </g>

        {/* Right Arm */}
        <g className="arm-right">
          <path
            d="M164 132
               C181 139 192 151 201 168
               L225 205
               C230 214 225 222 216 219
               L183 185
               L153 157Z"
            fill="#D99A6C"
          />
        </g>

        {/* Left Blue Pant */}
        <g className="leg-left">
          <path
            d="M111 225
               L139 229
               L137 307
               L104 371
               L76 360
               L103 290Z"
            fill="#1769D1"
          />

          {/* Left Black Shoe */}
          <path
            d="M76 349
               C62 351 48 359 42 370
               C40 376 48 381 60 380
               L92 374
               L102 360Z"
            fill="#111111"
          />
        </g>

        {/* Right Blue Pant */}
        <g className="leg-right">
          <path
            d="M139 229
               L166 225
               L173 292
               L208 347
               L182 365
               L145 316
               L132 275Z"
            fill="#1769D1"
          />

          {/* Right Black Shoe */}
          <path
            d="M181 348
               C194 350 210 354 224 364
               C230 370 225 376 215 377
               L182 369
               L169 357Z"
            fill="#111111"
          />
        </g>

        {/* Shirt Highlight */}
        <path
          d="M113 143 C108 160 108 185 114 211"
          stroke="#FFF2A3"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Eye */}
        <circle
          cx="132"
          cy="78"
          r="4"
          fill="#111111"
        />

        {/* Smile */}
        <path
          d="M142 94 Q151 100 160 94"
          stroke="#111111"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

      </svg>

      {/* Ground shadow */}
      <div className="runner-shadow" />
    </div>
  );
}
