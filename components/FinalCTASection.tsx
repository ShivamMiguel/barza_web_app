type FinalCTASectionProps = {
  onDownloadClick: () => void;
};

export function FinalCTASection({ onDownloadClick }: FinalCTASectionProps) {
  return (
    <section className="py-32 px-8 bg-primary-container relative">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-5xl md:text-[5.5rem] font-black font-headline tracking-tighter text-on-primary mb-12 leading-[0.9]">
          A PRÓXIMA VERSÃO DA BELEZA COMEÇA AGORA.
        </h2>
        <div className="flex justify-center">
          <button
            onClick={onDownloadClick}
            className="bg-on-primary text-white font-bold px-12 py-6 rounded-2xl text-xl flex items-center gap-4 hover:brightness-125 transition-all shadow-2xl active:scale-95"
          >
            <span className="material-symbols-outlined text-3xl">download</span>
            Baixar a App
          </button>
        </div>
      </div>
    </section>
  );
}
