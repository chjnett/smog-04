"use client"

import Image from "next/image"
import { notFound } from "next/navigation"
import { use, useState } from "react"
import { PRODUCTS, formatPrice, type Product } from "@/lib/constants"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single()

        if (data && !error) {
          setProduct(data as Product)
        } else {
          // Fallback to constants if not found in DB (for local-only products)
          const localProduct = PRODUCTS.find((p) => p.id === id)
          if (localProduct) setProduct(localProduct)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (!api) return

    setCurrentSlide(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap())
    })
  }, [api])

  if (isLoading) {
    return <div className="flex h-[70vh] items-center justify-center text-xs italic text-muted-foreground uppercase tracking-widest">불러오는 중...</div>
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="pb-28">
      {/* Image Carousel */}
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {product.images.map((img, idx) => (
            <CarouselItem key={idx}>
              <div className="relative aspect-square w-full overflow-hidden bg-secondary">
                <Image
                  src={img}
                  alt={`${product.name} - 이미지 ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={idx === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Slide Indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {product.images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 w-6 transition-colors ${idx === currentSlide
                  ? "bg-foreground"
                  : "bg-foreground/30"
                  }`}
              />
            ))}
          </div>
        )}
      </Carousel>

      {/* Product Info */}
      <div className="px-4 pt-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {product.brand}
        </p>
        <h1 className="mt-2 text-xl font-bold tracking-tight text-foreground">
          {product.name}
        </h1>
        <p className="mt-2 text-lg font-bold text-foreground">
          {formatPrice(product.price)}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </div>

      {/* Accordions */}
      <div className="mt-8 px-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="shipping" className="border-foreground/10">
            <AccordionTrigger className="text-sm font-medium text-foreground">
              배송 및 반품 안내
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {product.shipping_info || "모든 상품은 주문 확인 후 2-5 영업일 내에 발송됩니다. 배송비는 50,000원 이상 구매 시 무료이며, 그 이하의 경우 3,000원이 부과됩니다. 상품 수령 후 7일 이내에 미착용 상태로 반품 신청이 가능합니다. 반품 시 배송비는 고객 부담입니다."}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="details" className="border-foreground/10">
            <AccordionTrigger className="text-sm font-medium text-foreground">
              상품 상세 정보
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {product.product_details || `카테고리: ${product.category} | 브랜드: ${product.brand}\n모든 상품은 정품 인증서와 함께 배송됩니다. 자세한 사이즈 및 소재 정보는 카카오톡 문의를 통해 확인해 주세요.`}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-0 border-t border-foreground/10 bg-background">
        <a
          href="https://open.kakao.com/o/seH2Jkhi"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center bg-foreground py-4 text-sm font-bold tracking-wide text-background transition-opacity hover:opacity-90"
        >
          카카오톡 문의하기
        </a>
      </div>
    </div>
  )
}
