export function ProductsSection() {
  const products = [
    {
      category: 'Capilar',
      name: 'Óleo de Rícino Premium',
      price: '12.500 Kz',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW6RWDf6OYRIoSvTNG4IWcuDLMpA6mf8vGma75h5_q7_puSWn5ujI7r9cqqskDUHU32MECi6CtX3MVX-QGHSrUMD9gduoYXERprLnFt6I7CzcYAGbEhnVIOWjrg1-OLFDs-YKqQeD3-KH7fF1ToblFL0-lTe3gz1te0eDGknxrWjTZoI52tENYFFfsek0KslZVknGukMf3PXJZUj0OWOifNNuKedjuhlifGrouApqbMtiMFIBBXjKRG9g1RCgas1JXelVk0JFpuoc',
      alt: 'Elegant black matte bottle of hair oil with copper accents against a minimalist dark background'
    },
    {
      category: 'Estética',
      name: 'Creme Hidratante Noite',
      price: '8.900 Kz',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPVRUyNVehbZnVzb3xEYOo1xngFR_0MZ6mWoHSXF51fVIlVzdZrKm7r0AcIoH6zlewFS9vHu-2AuTBiSD5e26YSqJ1ojKRC7qXHR757nZqjKt-jbUp1z30nYV-J3LfviuI80cIrXjehhBJaZOranKLxElWenPruaXlVV9thSJvU3uG_AuYfe6J1Pc5qBKIsyRww8k80Y87zs3WdDP9CuR3o2OqMHzqJGv1q7Q16d686vFa6sQZ65VC_rVEQ6NJ_UVmOEEUomcAT8Q',
      alt: 'A jar of premium facial cream with a smooth texture visible, reflecting soft warm light on an obsidian surface'
    },
    {
      category: 'Barbearia',
      name: 'Pomada Clay Matte',
      price: '6.500 Kz',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAida_sm8h4EKQ-tJ9PTYfAoYs3yDwucY4a594jfAbIyaYYRDJIKseTKWehuFonjZ8FybRAr7IC_Y4kNPasb8ea7fBiypwFNlIlWzcEK6_MXANNC81k2HvhgJNM_yRltLkPOQM-kU6D3JjDel9AlzUf4pSyaFGUoRM9Mt49JS4krnNrJhRuhYWzAsLzyBeUPe_6mt3cSqhv5neveug1VrawAwX8wgmvAUxJuVOREILogj9dGLprwwz5sQz_SUsLVXhPsJtNEK7Pnvw',
      alt: 'Selection of high-end barbering tools and styling pomades arranged professionally in a luxury kit'
    },
    {
      category: 'Fragrâncias',
      name: 'Barza Noir Eau de Parfum',
      price: '24.000 Kz',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMIMTxokqgCwX8sOmg6307g1Pr8ZPsXBLCShRNpKtjWHyFiOJr359gF2Atf3hW5SRWDr5TAoPew8FvNuW8WxE8lcZ2i63WJOi4mZb4M97Glo1n_0Q-3Aa2DcH800qL96gzL0WXfLs7c-b2AyjjNo6HdyCaiQFqBXAgsnVOJs6NQFQ7nj7KR5Hpve66gwYC7-lvizU79m5NUYPnfjlEcOLCA8va4TkRIbd6PBI7F4m1dfLjpIDOhcLUKk9q2YPVEoiM_5ZjIGPJ32Y',
      alt: 'Two premium perfume bottles on a reflective dark surface with dramatic orange light leaks'
    },
  ];

  return (
    <section className="py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-black font-headline tracking-tighter mb-4">O CUIDADO CONTINUA DEPOIS DO SERVIÇO.</h2>
            <p className="text-on-surface/60">Produtos premium selecionados pelos nossos especialistas.</p>
          </div>
          <button className="text-primary-container font-bold flex items-center gap-2 group">Ver todos os produtos <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">keyboard_arrow_right</span></button>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={index} className="group">
              <div className="aspect-square bg-surface-container rounded-xl overflow-hidden mb-6 relative">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={product.alt} data-alt={product.alt} src={product.image} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <button className="bg-white text-black px-6 py-2 font-bold rounded-full">Comprar</button>
                </div>
              </div>
              <p className="text-xs font-label uppercase tracking-widest text-primary-container mb-1">{product.category}</p>
              <h4 className="font-bold mb-1 font-headline">{product.name}</h4>
              <p className="text-sm opacity-60">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
