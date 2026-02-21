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
      </section>

      {/* Search Bar */}
      <section className="px-4 pt-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="상품 검색..."
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
