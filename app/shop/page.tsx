import { Suspense } from "react"
import { type Product, type CategoryItem } from "@/lib/constants"
import { supabase } from "@/lib/supabase"
import { ShopContent } from "@/components/shop-content"

async function getInitialData() {
  const [productsRes, categoriesRes] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("sort_order", { ascending: true })
  ])

  return {
    products: (productsRes.data || []) as Product[],
    categories: (categoriesRes.data || []) as CategoryItem[]
  }
}

export default async function ShopPage() {
  const { products, categories } = await getInitialData()

  return (
    <Suspense>
      <ShopContent initialProducts={products} initialCategories={categories} />
    </Suspense>
  )
}
