export function ClientExperienceSection() {
  return (
    <section className="py-32 px-8 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <h2 className="text-5xl font-black font-headline tracking-tighter max-w-xl">
            TUDO O QUE PRECISAS PARA APARECER MELHOR.
          </h2>
          <p className="text-on-surface/60 font-label uppercase tracking-widest pb-2">Experiência do Cliente</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-8 bg-surface-container border-t-2 border-primary-container/20 hover:border-primary-container transition-all">
            <p className="text-4xl font-black opacity-10 mb-6">01</p>
            <h4 className="font-bold mb-2 font-headline">Inspirar</h4>
            <p className="text-sm opacity-60">Navega no feed e guarda referências visuais para o teu próximo look.</p>
          </div>
          <div className="p-8 bg-surface-container border-t-2 border-primary-container/20 hover:border-primary-container transition-all md:mt-8">
            <p className="text-4xl font-black opacity-10 mb-6">02</p>
            <h4 className="font-bold mb-2 font-headline">Descobrir</h4>
            <p className="text-sm opacity-60">Encontra o profissional ideal perto de ti com base no estilo desejado.</p>
          </div>
          <div className="p-8 bg-surface-container border-t-2 border-primary-container/20 hover:border-primary-container transition-all">
            <p className="text-4xl font-black opacity-10 mb-6">03</p>
            <h4 className="font-bold mb-2 font-headline">Marcar</h4>
            <p className="text-sm opacity-60">Agenda em tempo real sem chamadas ou esperas desnecessárias.</p>
          </div>
          <div className="p-8 bg-surface-container border-t-2 border-primary-container/20 hover:border-primary-container transition-all md:mt-8">
            <p className="text-4xl font-black opacity-10 mb-6">04</p>
            <h4 className="font-bold mb-2 font-headline">Viver</h4>
            <p className="text-sm opacity-60">Desfruta do serviço premium e da atenção que mereces.</p>
          </div>
          <div className="p-8 bg-surface-container border-t-2 border-primary-container/20 hover:border-primary-container transition-all">
            <p className="text-4xl font-black opacity-10 mb-6">05</p>
            <h4 className="font-bold mb-2 font-headline">Manter</h4>
            <p className="text-sm opacity-60">Compra os produtos usados pelo pro e mantém o resultado em casa.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
