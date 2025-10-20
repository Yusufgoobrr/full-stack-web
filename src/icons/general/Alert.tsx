import React, { SVGProps } from "react";

const Alert = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.6297 11.1543V16.4876M16.6297 21.821H16.6431M29.9631 16.4876C29.9631 23.8514 23.9935 29.821 16.6297 29.821C9.26592 29.821 3.29639 23.8514 3.29639 16.4876C3.29639 9.12383 9.26592 3.1543 16.6297 3.1543C23.9935 3.1543 29.9631 9.12383 29.9631 16.4876Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Alert;
