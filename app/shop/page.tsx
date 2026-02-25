"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PRODUCTS, CATEGORIES, type Category, type Product, type CategoryItem } from "@/lib/constants"
import { ProductCard } from "@/components/product-card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { supabase } from "@/lib/supabase"

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("전체")
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

  useEffect(() => {
    const categoryQuery = searchParams.get("category")
    const availableCategories = dbCategories.length > 0 ? dbCategories : CATEGORIES
    if (categoryQuery && availableCategories.includes(categoryQuery)) {
      setActiveCategory(categoryQuery)
    }
  }, [searchParams, dbCategories])

  const filteredProducts =
    activeCategory === "전체"
      ? products
      : products.filter((p) => {
        const productCategory = p.category?.trim()
        const productBrand = p.brand?.trim()
        const target = activeCategory.trim()
        return productCategory === target || productBrand === target
      })

  return (
    <div className="pb-16">
      {/* Page Title */}
      <div className="border-b border-foreground/10 px-4 py-6">
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          쇼핑
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          엄선된 프리미엄 럭셔리 아이템
        </p>
      </div>

      {/* Product Grid */}
      <div className="px-4 pt-6">
        <p className="mb-4 text-xs text-muted-foreground">
          {isLoading ? "불러오는 중..." : `${filteredProducts.length}개 상품`}
        </p>
        {isLoading ? (
          <div className="flex py-20 items-center justify-center text-xs italic text-muted-foreground">불러오는 중...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  )
}
