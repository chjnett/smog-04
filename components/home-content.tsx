"use client"

import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { useState } from "react"
import { type Product, type CategoryItem } from "@/lib/constants"
import { ProductCard } from "@/components/product-card"
import { isMatch } from "@/lib/utils"
import { Search } from "lucide-react"

interface HomeContentProps {
    initialProducts: Product[]
    initialCategories: CategoryItem[]
}

export function HomeContent({ initialProducts, initialCategories }: HomeContentProps) {
    const [products] = useState<Product[]>(initialProducts)
    const [activeCategory] = useState<string>("전체")
    const [searchQuery, setSearchQuery] = useState("")
    const [dbCategories] = useState<string[]>(["전체", ...initialCategories.map(c => c.name)])

    const filteredProducts = products.filter((p) => {
        const matchesCategory = isMatch(p.category, activeCategory) || isMatch(p.brand, activeCategory)
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    }).slice(0, (activeCategory === "전체" && !searchQuery) ? 8 : undefined)

    return (
        <div className="pb-16">
            {/* Hero Section */}
            <HeroSection />

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
                {filteredProducts.length > 0 ? (
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
