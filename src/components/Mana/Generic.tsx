import * as React from "react";

function SvgManaGeneric(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 70 70" fill="none" {...props}>
      <circle
        cx={35}
        cy={35}
        r={30}
        stroke="#000"
        strokeWidth={3}
        fill="url(#manaGeneric_svg__a)"
      />
      <linearGradient
        id="manaGeneric_svg__a"
        x1={35}
        y1={0}
        x2={35}
        y2={60}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#C6CEDA" />
        <stop offset={1} stopColor="#7D7F91" />
      </linearGradient>
    </svg>
  );
}

export default SvgManaGeneric;