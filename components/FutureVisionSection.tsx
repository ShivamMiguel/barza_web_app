export function FutureVisionSection() {
  return (
    <section className="py-32 px-8 bg-surface-container-low overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
        <div className="flex-1">
          <h2 className="text-4xl font-black font-headline tracking-tighter mb-6">COMEÇAMOS EM ANGOLA.</h2>
          <h3 className="text-4xl font-headline text-primary-container mb-8">PENSAMOS ÁFRICA. CONSTRUÍMOS GLOBALMENTE.</h3>
          <p className="text-lg opacity-60 leading-relaxed max-w-md">Estamos a construir a infraestrutura digital para a economia do cuidado em todo o continente. Da Talatona ao Cairo, de Luanda a Lagos.</p>
        </div>
        <div className="flex-1 relative">
          <div className="w-full aspect-video bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden relative">
            <img className="w-full h-full object-cover opacity-50 grayscale contrast-125" alt="Stylized map of Africa glowing in vibrant orange lines over a dark obsidian world map, symbolizing digital connectivity" data-alt="Stylized map of Africa glowing in vibrant orange lines over a dark obsidian world map, symbolizing digital connectivity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHuhn-ovywwagXl6PfbPnX5xlJWLolJ96ARlzIeV64lt0PBmFBN-QyF94VmkbNql-1kjfsNgT6s3qW9zLu8mojO6H_VXaYVOXwmYBxN3e3IqWgSkaJ3qx_Bch7LZDKoyZp5VfZ8IG3aQYn_TffyuamK32RkX6iB5fa063sA2eRAukSPD_KCdM8sw9dZV8tc3FnpNfMSacOneKVNoUJAi044JnrYXwfb3P-EK8KboYmelg7NsP55yzDz-KlAoaDa_CmNYVQqIr2p-A" />
            <div className="absolute top-1/2 left-[45%] w-3 h-3 bg-primary-container rounded-full shadow-[0_0_20px_#ff9156]"></div>
            <div className="absolute top-1/2 left-[45%] w-3 h-3 bg-primary-container rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
