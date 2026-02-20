"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Search, ShoppingBag } from "lucide-react"
import { NAV_ITEMS } from "@/lib/constants"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

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
          <SheetContent side="left" className="w-72 bg-background p-0">
            <SheetHeader className="px-6 pt-8 pb-4">
              <SheetTitle className="text-lg font-bold tracking-tight text-foreground">
                광저우 삼촌
              </SheetTitle>
              <SheetDescription className="sr-only">
                사이트 전체 메뉴를 확인하고 원하는 카테고리로 이동하세요.
              </SheetDescription>
            </SheetHeader>
            <Separator className="bg-foreground/10" />
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
          </SheetContent>
        </Sheet>

        {/* Center: Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-base font-bold tracking-tight text-foreground sm:text-lg"
        >
          광저우 삼촌
        </Link>

        {/* Right: Icons */}
        <div className="flex items-center gap-1">
          <button
            aria-label="검색"
            onClick={() => router.push("/shop")}
            className="flex size-10 items-center justify-center text-foreground transition-opacity hover:opacity-60"
          >
            <Search className="size-5" strokeWidth={1.5} />
          </button>
          <Link
            href="/shop"
            aria-label="쇼핑"
            className="flex size-10 items-center justify-center text-foreground transition-opacity hover:opacity-60"
          >
            <ShoppingBag className="size-5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  )
}