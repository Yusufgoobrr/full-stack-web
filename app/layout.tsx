import type { Metadata } from "next";

import { DarkModeProvider } from "../src/contexts/DarkModeContext";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('darkMode');
                  if (savedTheme !== null) {
                    const isDark = JSON.parse(savedTheme);
                    if (isDark) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } else {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  }
                } catch (e) {
                  // Fallback to light mode if there's an error
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-inter`}>
        <DarkModeProvider>{children}</DarkModeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
