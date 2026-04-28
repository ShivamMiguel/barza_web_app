import Link from "next/link";
import Image from "next/image";

type TopNavProps = {
  onDownloadClick: () => void;
  onLoginClick: () => void;
};

export function TopNav({ onDownloadClick, onLoginClick }: TopNavProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-xl border-t border-[#ff9156]/20 shadow-[0_-40px_60px_-15px_rgba(255,255,255,0.04)]">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-none">
        <Link href="/">
          <Image
            src="/barza_logo.png"
            alt="BARZA Logo"
            width={64}
            height={64}
            className="h-10 sm:h-12 lg:h-14 w-auto"
            style={{ mixBlendMode: "screen" }}
          />
        </Link>

        <div className="flex gap-3 sm:gap-4 lg:gap-6 items-center">
          <button
            onClick={onLoginClick}
            className="text-[#e5e2e1] opacity-80 font-bold hover:text-[#ff9156] transition-all hidden sm:block text-sm lg:text-base"
          >
            Login
          </button>
          <button
            onClick={onDownloadClick}
            className="bg-primary-container text-on-primary-container px-4 sm:px-6 py-2 sm:py-2.5 font-bold rounded-lg active:scale-95 transition-transform text-xs sm:text-sm lg:text-base whitespace-nowrap"
          >
            Get the App
          </button>
        </div>
      </div>
    </nav>
  );
}
