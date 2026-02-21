"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Search, ShoppingBag, ChevronRight } from "lucide-react"
import { NAV_ITEMS, type CategoryItem } from "@/lib/constants"
import { supabase } from "@/lib/supabase"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryItem[]>([])

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true })
      if (data && !error) setCategories(data)
    }
    fetchCategories()
  }, [])

  const parentCategories = categories.filter(c => !c.parent_id)
  const getChildren = (parentId: string) =>
    categories.filter(c => c.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order)

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left: Hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="메뉴 열기"
              className="flex size-10 items-center justify-center text-foreground transition-opacity hover:opacity-60"
            >
              <Menu className="size-5" strokeWidth={1.5} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-background p-0 overflow-y-auto">
            <SheetHeader className="px-6 pt-8 pb-4">
              <SheetTitle className="text-lg font-bold tracking-tight text-foreground">
                Dint
              </SheetTitle>
              <SheetDescription className="sr-only">
                사이트 전체 메뉴를 확인하고 원하는 카테고리로 이동하세요.
              </SheetDescription>
            </SheetHeader>
            <Separator className="bg-foreground/10" />

            {/* Navigation */}
            <nav className="flex flex-col px-6 pt-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-foreground/5 py-4 text-sm font-medium tracking-wide text-foreground transition-opacity hover:opacity-60"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Categories */}
            {categories.length > 0 && (
              <>
                <Separator className="bg-foreground/10 mt-2" />
                <div className="px-6 pt-5 pb-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    카테고리
                  </p>
                  <div className="flex flex-col">
                    {parentCategories.map((parent) => {
                      const children = getChildren(parent.id)
                      return (
                        <div key={parent.id}>
                          <Link
                            href={`/shop?category=${encodeURIComponent(parent.name)}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-between py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-60"
                          >
                            {parent.name}
                            {children.length > 0 && (
                              <ChevronRight className="size-3.5 text-muted-foreground" />
                            )}
                          </Link>
                          {children.map((child) => (
                            <Link
                              key={child.id}
                              href={`/shop?category=${encodeURIComponent(child.name)}`}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-2 py-2.5 pl-4 text-xs text-muted-foreground transition-opacity hover:text-foreground hover:opacity-80"
                            >
                              <span className="text-[10px]">ㄴ</span>
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Center: Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-base font-bold tracking-tight text-foreground sm:text-lg"
        >
          Dint
        </Link>

        {/* Right: empty for balance */}
        <div className="w-10" />
      </div>
    </header>
  )
}