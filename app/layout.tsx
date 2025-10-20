import type { Metadata } from "next";

import { inter } from "../src/fonts";
import "../src/globals.css";

export const metadata: Metadata = {
  title: "Amigoscode",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter`}>{children}</body>
    </html>
  );
};

export default RootLayout;
