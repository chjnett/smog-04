import { type Product, type CategoryItem } from "@/lib/constants"
import { supabase } from "@/lib/supabase"
import { HomeContent } from "@/components/home-content"

export const dynamic = 'force-dynamic'

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

export default async function HomePage() {
  const { products, categories } = await getInitialData()

  return (
    <HomeContent initialProducts={products} initialCategories={categories} />
  )
}
