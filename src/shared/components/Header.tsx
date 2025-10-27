import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

const Header = () => {
  return (
    <div className="comic-border-thick flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-center transition-all hover:translate-y-[-2px]">
      <div className="animate-float">
        <Image
          src={"/logo.png"}
          height={60}
          width={60}
          alt="logo"
          className="drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
        />
      </div>

      <ConnectButton chainStatus="name" />
    </div>
  );
};

export default Header;
