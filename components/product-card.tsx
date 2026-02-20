import Link from "next/link"
import Image from "next/image"
import { formatPrice, type Product } from "@/lib/constants"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.id}`}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden border border-foreground/10 bg-secondary">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>
      <div className="pt-3 pb-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {product.brand}
        </p>
        <h3 className="mt-1 text-sm font-medium leading-snug text-foreground">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-semibold text-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}
