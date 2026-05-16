'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PurchaseModal } from '@/components/PurchaseModal'
import type { ProductWithSpace } from '@/lib/supabase/products'

interface Props {
  product: ProductWithSpace
}

export function ProductCard({ product }: Props) {
  const [buyOpen, setBuyOpen] = useState(false)
  const space = product.professional_space
  const hasPromo = product.promo_price != null && product.promo_price < product.price
  const displayPrice = hasPromo ? product.promo_price! : product.price

  return (
    <>
      <div className="rounded-3xl bg-surface-container border border-[rgba(86,67,58,0.1)] overflow-hidden">
        {/* Space header */}
        <Link
          href={`/community/space/${space.id}`}
          className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(86,67,58,0.08)] hover:bg-surface-container-high transition-colors group"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high flex items-center justify-center">
            {space.logo ? (
              <img src={space.logo} alt={space.space_name} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-on-surface-variant/30 text-base">store</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-on-surface group-hover:text-primary-container transition-colors truncate">
              {space.space_name}
            </p>
            {product.category && (
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50 truncate">
                {product.category}
              </p>
            )}
          </div>
          <span className="material-symbols-outlined text-on-surface-variant/20 text-base group-hover:text-primary-container/50 transition-colors">
            chevron_right
          </span>
        </Link>

        {/* Product image */}
        {product.image_url && (
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-container-high">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {hasPromo && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary-container text-on-primary text-[9px] font-black uppercase tracking-widest">
                Promoção
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-5 py-4 space-y-3">
          <div>
            {!product.image_url && product.category && (
              <span className="inline-block text-[9px] font-label uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-primary-container/10 text-primary-container mb-2">
                {product.category}
              </span>
            )}
            <h3 className="font-bold text-base text-on-surface leading-snug">{product.name}</h3>
            {product.description && (
              <p className="text-sm text-on-surface-variant/60 mt-1.5 leading-relaxed line-clamp-2">
                {product.description}
              </p>
            )}
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between pt-1 border-t border-[rgba(86,67,58,0.08)]">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-on-surface">
                {displayPrice.toLocaleString('pt-AO')} Kz
              </span>
              {hasPromo && (
                <span className="text-xs text-on-surface-variant/40 line-through">
                  {product.price.toLocaleString('pt-AO')} Kz
                </span>
              )}
            </div>
            <button
              onClick={() => setBuyOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full volcanic-gradient text-on-primary text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-sm">shopping_bag</span>
              Comprar
            </button>
          </div>
        </div>
      </div>

      <PurchaseModal
        isOpen={buyOpen}
        onClose={() => setBuyOpen(false)}
        product={product}
      />
    </>
  )
}
