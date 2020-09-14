import * as React from "react";

function SvgWater(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 111 142" fill="none" {...props}>
      <mask
        id="water_svg__a"
        maskUnits="userSpaceOnUse"
        x={-0.156}
        y={-0.648}
        width={111}
        height={142}
        fill="#000"
      >
        <path fill="#fff" d="M-.156-.648h111v142h-111z" />
        <path d="M102.36 89.456c0 24.241-19.651 43.892-43.892 43.892-24.24 0-42.931-23.454-46.83-38.221-6.827-25.854.077-44.184 7.626-57.485 7.55-13.3 32.501-35.583 61.791-27.61-20.433 0-33.139 8.903-33.139 21.937 0 6.1 5.554 12.84 15.274 15.056 20.078 4.577 39.17 15.876 39.17 42.431z" />
        <path d="M78.918 37.642a7.7 7.7 0 100-15.399 7.7 7.7 0 000 15.399z" />
      </mask>
      <path
        d="M102.36 89.456c0 24.241-19.651 43.892-43.892 43.892-24.24 0-42.931-23.454-46.83-38.221-6.827-25.854.077-44.184 7.626-57.485 7.55-13.3 32.501-35.583 61.791-27.61-20.433 0-33.139 8.903-33.139 21.937 0 6.1 5.554 12.84 15.274 15.056 20.078 4.577 39.17 15.876 39.17 42.431z"
        fill="url(#water_svg__paint0_linear)"
      />
      <path
        d="M78.918 37.642a7.7 7.7 0 100-15.399 7.7 7.7 0 000 15.399z"
        fill="url(#water_svg__paint1_linear)"
      />
      <path
        d="M102.36 89.456c0 24.241-19.651 43.892-43.892 43.892-24.24 0-42.931-23.454-46.83-38.221-6.827-25.854.077-44.184 7.626-57.485 7.55-13.3 32.501-35.583 61.791-27.61-20.433 0-33.139 8.903-33.139 21.937 0 6.1 5.554 12.84 15.274 15.056 20.078 4.577 39.17 15.876 39.17 42.431z"
        stroke="#101217"
        strokeWidth={16}
        strokeLinejoin="round"
        mask="url(#water_svg__a)"
      />
      <path
        d="M78.918 37.642a7.7 7.7 0 100-15.399 7.7 7.7 0 000 15.399z"
        stroke="#101217"
        strokeWidth={16}
        strokeLinejoin="round"
        mask="url(#water_svg__a)"
      />
      <defs>
        <linearGradient
          id="water_svg__paint0_linear"
          x1={56.587}
          y1={7.109}
          x2={56.587}
          y2={133.348}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3BA0FD" />
          <stop offset={1} stopColor="#3B42F4" />
        </linearGradient>
        <linearGradient
          id="water_svg__paint1_linear"
          x1={56.587}
          y1={7.109}
          x2={56.587}
          y2={133.348}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3BA0FD" />
          <stop offset={1} stopColor="#3B42F4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default SvgWater;