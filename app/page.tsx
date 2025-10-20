import type { Metadata } from "next";

import Orb from "@/components/Orb";
import Logo from "@/icons/logos/logo";

export const metadata: Metadata = {
  title: "Home",
};

const Home = () => {
  return (
    <main className="flex flex-col w-full items-center justify-center h-screen space-y-8">
      <div style={{ width: "100%", height: "600px", position: "relative" }}>
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        >
          <div className="flex flex-col items-center justify-center">
            <Logo />
          </div>
        </Orb>
      </div>
      <p className="text-lg md:text-2xl font-semibold">
        Amigoscode Starter Template
      </p>
    </main>
  );
};

export default Home;
