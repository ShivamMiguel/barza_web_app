export function Footer() {
  return (
    <footer className="w-full py-12 px-8 bg-[#0e0e0e] border-t border-[#353534]/30">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
        <div className="text-xl font-black text-[#ff9156] font-headline uppercase">BARZA</div>
        <div className="flex flex-wrap justify-center gap-8 font-body text-[0.6875rem] uppercase tracking-[0.1em]">
          <a className="text-[#e5e2e1]/60 hover:text-[#ff9156] transition-colors" href="/privacy">Privacy Policy</a>
          <a className="text-[#e5e2e1]/60 hover:text-[#ff9156] transition-colors" href="/terms">Terms of Service</a>
          <a className="text-[#e5e2e1]/60 hover:text-[#ff9156] transition-colors" href="#">Brand Kit</a>
          <a className="text-[#e5e2e1]/60 hover:text-[#ff9156] transition-colors" href="#">Press Enquiries</a>
          <a className="text-[#e5e2e1]/60 hover:text-[#ff9156] transition-colors" href="#">Contact Support</a>
        </div>
        <div className="font-body text-[0.6875rem] uppercase tracking-[0.1em] text-[#e5e2e1]/60">
          © 2024 Barza Ecosystem. Carved from Liquid Obsidian.
        </div>
      </div>
    </footer>
  );
}
