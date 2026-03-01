"use client"

import Link from "next/link"
import { Menu, ChevronDown } from "lucide-react"
import { type CategoryItem } from "@/lib/constants"
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
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

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

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

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
              <SheetTitle className="text-2xl font-bold tracking-tight text-foreground">
                Dint
              </SheetTitle>
              <SheetDescription className="sr-only">
                카테고리를 선택하세요.
              </SheetDescription>
            </SheetHeader>
            <Separator className="bg-foreground/10" />

            {/* Categories Only */}
            {categories.length > 0 && (
              <div className="px-6 pt-5 pb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  카테고리
                </p>
                <div className="flex flex-col">
                  {parentCategories.map((parent) => {
                    const children = getChildren(parent.id)
                    const isExpanded = expandedIds.has(parent.id)
                    return (
                      <div key={parent.id}>
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/shop?category=${encodeURIComponent(parent.name)}`}
                            onClick={() => setOpen(false)}
                            className="flex-1 py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-60"
                          >
                            {parent.name}
                          </Link>
                          {children.length > 0 && (
                            <button
                              onClick={() => toggleExpand(parent.id)}
                              className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                              aria-label={isExpanded ? "하위 카테고리 접기" : "하위 카테고리 펼치기"}
                            >
                              <ChevronDown
                                className={`size-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>
                          )}
                        </div>
                        {children.length > 0 && isExpanded && (
                          <div className="pb-1">
                            {children.map((child) => (
                              <Link
                                key={child.id}
                                href={`/shop?category=${encodeURIComponent(parent.name)}&sub=${encodeURIComponent(child.name)}`}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 py-2.5 pl-4 text-xs text-muted-foreground transition-colors hover:text-foreground"
                              >
                                <span className="text-[10px]">ㄴ</span>
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Center: Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-tight text-foreground sm:text-2xl"
        >
          Dint
        </Link>

        {/* Right: empty for balance */}
        <div className="w-10" />
      </div>
    </header>
  )
}