export function SocialProofSection() {
  return (
    <section className="py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black font-headline mb-20 tracking-tighter">O QUE DIZEM OS NOSSOS LÍDERES.</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-surface-variant/20 p-10 rounded-2xl refractive-edge">
            <p className="text-xl italic mb-8 opacity-80 leading-relaxed">"A Barza deu-me visibilidade que nunca consegui com boca-a-boca. Clientes que nunca me conheciam encontraram o meu trabalho e entraram em contacto directamente."</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-700"></div>
              <div>
                <p className="font-bold">Mauro Jorge</p>
                <p className="text-xs uppercase tracking-widest opacity-40">Pro Barber &amp; Educador</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-variant/20 p-10 rounded-2xl refractive-edge">
            <p className="text-xl italic mb-8 opacity-80 leading-relaxed">"Finalmente uma plataforma que entende a diversidade da beleza africana. Consigo encontrar especialistas em tranças em qualquer bairro que esteja."</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-700"></div>
              <div>
                <p className="font-bold">Helena Santos</p>
                <p className="text-xs uppercase tracking-widest opacity-40">Criadora de Conteúdo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
