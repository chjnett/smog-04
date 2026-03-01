"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PRODUCTS, CATEGORIES, type Category, type Product, type CategoryItem } from "@/lib/constants"
import { ProductCard } from "@/components/product-card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { supabase } from "@/lib/supabase"
import { normalizeText, isMatch } from "@/lib/utils"

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("전체")
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)
  const [dbCategories, setDbCategories] = useState<CategoryItem[]>([])

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
        if (categoriesRes.data && !categoriesRes.error) {
          setDbCategories(categoriesRes.data as CategoryItem[])
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const categoryQuery = searchParams.get("category")
    const subQuery = searchParams.get("sub")

    if (categoryQuery) {
      const matchedCategory = dbCategories.find(c =>
        !c.parent_id && (
          normalizeText(c.name) === normalizeText(categoryQuery) ||
          normalizeText(c.name).includes(normalizeText(categoryQuery))
        )
      )

      if (matchedCategory) {
        setActiveCategory(matchedCategory.name)
      } else {
        setActiveCategory(categoryQuery)
      }
    } else {
      setActiveCategory("전체")
    }

    if (subQuery) {
      setActiveSubCategory(subQuery)
    } else {
      setActiveSubCategory(null)
    }
  }, [searchParams, dbCategories])

  const filteredProducts = products.filter((p) => {
    if (activeCategory === "전체") return true

    const normCategory = normalizeText(activeCategory)
    const normSub = activeSubCategory ? normalizeText(activeSubCategory) : null

    // Find the current category item if it exists
    const categoryItem = dbCategories.find(c => !c.parent_id && normalizeText(c.name) === normCategory)

    if (normSub) {
      // If we have a sub-category/brand filter
      // 1. Matches as a sub-category directly
      const isSubCategoryMatch = normalizeText(p.category) === normSub
      // 2. Matches as a brand filter within the parent category
      const isBrandMatch = normalizeText(p.brand).includes(normSub)

      // Ensure it belongs to the parent category
      const belongsToParent = normalizeText(p.category) === normCategory ||
        dbCategories.some(c => normalizeText(c.name) === normalizeText(p.category) && c.parent_id === categoryItem?.id)

      return belongsToParent && (isSubCategoryMatch || isBrandMatch)
    } else {
      // If we only have a parent category filter
      // 1. Matches the parent category itself
      const isParentMatch = normalizeText(p.category) === normCategory
      // 2. Matches any child category of this parent
      const isChildMatch = dbCategories.some(c =>
        c.parent_id === categoryItem?.id && normalizeText(c.name) === normalizeText(p.category)
      )

      return isParentMatch || isChildMatch
    }
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
