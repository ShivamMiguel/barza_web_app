import Link from 'next/link';
import Image from 'next/image';

type TopNavProps = {
  onDownloadClick: () => void;
};

export function TopNav({ onDownloadClick }: TopNavProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-xl border-t border-[#ff9156]/20 shadow-[0_-40px_60px_-15px_rgba(255,255,255,0.04)]">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-none">
        <Link href="/">
          <Image
            src="/barza_logo.png"
            alt="BARZA Logo"
            width={96}
            height={96}
            className="h-24 w-auto"
            style={{ mixBlendMode: 'screen' }}
          />
        </Link>
        <div className="hidden md:flex gap-10 items-center">
          <a className="text-[#ff9156] border-b-2 border-[#ff9156] pb-1 font-headline tracking-tight font-bold transition-all duration-300" href="#">Ecosystem</a>
          <a className="text-[#e5e2e1] opacity-80 font-headline tracking-tight font-bold hover:opacity-100 hover:text-[#ff9156] transition-all duration-300" href="#">Community</a>
          <a className="text-[#e5e2e1] opacity-80 font-headline tracking-tight font-bold hover:opacity-100 hover:text-[#ff9156] transition-all duration-300" href="#">Services</a>
          <a className="text-[#e5e2e1] opacity-80 font-headline tracking-tight font-bold hover:opacity-100 hover:text-[#ff9156] transition-all duration-300" href="#">Products</a>
        </div>
        <div className="flex gap-6 items-center">
          <Link className="text-[#e5e2e1] opacity-80 font-bold hover:text-[#ff9156] transition-all" href="/community">Login</Link>
          <button onClick={onDownloadClick} className="bg-primary-container text-on-primary-container px-6 py-2.5 font-bold rounded-lg active:scale-95 transition-transform">Get the App</button>
        </div>
      </div>
    </nav>
  );
}
