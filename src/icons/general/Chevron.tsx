import React, { SVGProps } from "react";

type TChevron = SVGProps<SVGSVGElement> & {
  variant?: keyof typeof directions;
};

const directions = {
  left: "rotate(0)",
  right: "rotate(180deg)",
  top: "rotate(90deg)",
  bottom: "rotate(270deg)",
};

const Chevron = ({ variant = "left", ...props }: TChevron) => {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: directions[variant],
      }}
      {...props}
    >
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Chevron;
