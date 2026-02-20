"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { PRODUCTS, CATEGORIES, type Category, type Product, type CategoryItem } from "@/lib/constants"
import { ProductCard } from "@/components/product-card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { supabase } from "@/lib/supabase"
import { useEffect } from "react"

import { Search } from "lucide-react"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("전체")
  const [searchQuery, setSearchQuery] = useState("")
  const [dbCategories, setDbCategories] = useState<string[]>([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from("products").select("*").order("created_at", { ascending: false }),
          supabase.from("categories").select("*").order("sort_order", { ascending: true })
        ])

        if (productsRes.data && !productsRes.error) {
          setProducts(productsRes.data as Product[])
        }
        if (categoriesRes.data && !categoriesRes.error && categoriesRes.data.length > 0) {
          setDbCategories(["전체", ...categoriesRes.data.map((c: CategoryItem) => c.name)])
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "전체" || p.category === activeCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }).slice(0, activeCategory === "전체" && !searchQuery ? 8 : undefined)

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[16/9] md:aspect-[2/1]">
        <Image
          src="/hero-image.jpg"
          alt="Luxury Showroom"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-12 text-center sm:justify-center sm:pb-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-background/80 sm:text-xs">
            Premium Luxury Collection
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-background sm:text-5xl md:text-6xl">
            광저우 삼촌
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-background/70 sm:text-base">
            엄선된 프리미엄 럭셔리 아이템을 만나보세요
          </p>
          <Link
            href="/shop"
            className="mt-6 border border-background px-8 py-3 text-xs font-medium uppercase tracking-widest text-background transition-colors hover:bg-background hover:text-foreground"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="sticky top-14 z-30 border-b border-foreground/10 bg-background/95 backdrop-blur-sm">
        <ScrollArea className="w-full">
          <div className="flex gap-2 px-4 py-3">
            {(dbCategories.length > 0 ? dbCategories : CATEGORIES).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setSearchQuery("") // Clear search when category changes for cleaner UX
                }}
                className={`shrink-0 border px-4 py-2 text-xs font-medium tracking-wide transition-colors ${activeCategory === cat
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/20 bg-background text-foreground hover:border-foreground/40"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* Search Bar */}
      <section className="px-4 pt-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={`${activeCategory === "전체" ? "상품" : activeCategory} 검색...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-foreground/10 bg-secondary py-3 pl-10 pr-4 text-sm transition-colors focus:border-foreground/30 focus:outline-none"
          />
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-4 pt-10">
        {isLoading ? (
          <div className="flex py-20 items-center justify-center text-xs italic text-muted-foreground">불러오는 중...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>
          </div>
        )}

        {activeCategory === "전체" && (
          <div className="mt-12 flex justify-center">
            <Link
              href="/shop"
              className="border border-foreground px-8 py-3 text-xs font-medium uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              View All Products
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
