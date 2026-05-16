'use client'

import { useState } from 'react'
import { PurchaseModal } from '@/components/PurchaseModal'
import type { Product } from '@/lib/supabase/products'
import type { ProductWithSpace } from '@/lib/supabase/products'

interface Props {
  products: Product[]
  space: { id: string; space_name: string; logo: string | null; owner: string }
}

export function SpaceProductsSection({ products, space }: Props) {
  const [selected, setSelected] = useState<ProductWithSpace | null>(null)

  if (products.length === 0) return null

  function toProductWithSpace(p: Product): ProductWithSpace {
    return { ...p, professional_space: space }
  }

  return (
    <div>
      <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/40 mb-5">
        Produtos <span className="text-on-surface-variant/25">({products.length})</span>
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {products.map((product) => {
          const hasPromo = product.promo_price != null && product.promo_price < product.price
          const displayPrice = hasPromo ? product.promo_price! : product.price

          return (
            <div
              key={product.id}
              className="rounded-2xl bg-surface-container border border-[rgba(86,67,58,0.1)] overflow-hidden flex flex-col"
            >
              {product.image_url ? (
                <div className="w-full aspect-square overflow-hidden bg-surface-container-high relative flex-shrink-0">
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  {hasPromo && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary-container text-on-primary text-[8px] font-black uppercase tracking-widest">
                      Promo
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-square bg-surface-container-high flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant/20 text-3xl">inventory_2</span>
                </div>
              )}

              <div className="p-3 flex flex-col gap-2 flex-1">
                <div className="flex-1">
                  <p className="font-bold text-xs text-on-surface leading-snug line-clamp-2">{product.name}</p>
                  {product.category && (
                    <p className="text-[9px] font-label uppercase tracking-wider text-on-surface-variant/40 mt-0.5 truncate">
                      {product.category}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-1">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-on-surface leading-none">
                      {displayPrice.toLocaleString('pt-AO')} Kz
                    </p>
                    {hasPromo && (
                      <p className="text-[9px] text-on-surface-variant/40 line-through mt-0.5">
                        {product.price.toLocaleString('pt-AO')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelected(toProductWithSpace(product))}
                    className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full volcanic-gradient text-on-primary text-[9px] font-bold uppercase tracking-widest active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-xs">shopping_bag</span>
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <PurchaseModal
          isOpen={true}
          onClose={() => setSelected(null)}
          product={selected}
        />
      )}
    </div>
  )
}
