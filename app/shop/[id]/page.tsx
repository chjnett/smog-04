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
        <Accordion type="multiple">
          <AccordionItem value="shipping" className="border-foreground/10">
            <AccordionTrigger className="text-sm font-medium text-foreground">
              배송안내
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              <p className="font-semibold text-foreground mb-3">통관 보장 무료배송 : 조건 없이 국내까지 무료배송됩니다.</p>
              <p className="text-xs text-muted-foreground/80 mb-4">(초기 불량을 줄이기 위해서)</p>
              <ul className="space-y-2.5 text-xs">
                <li><span className="font-medium text-foreground">배송 방법</span> : 자체 특수운송, 혹은 EMS (상황에 따라 운송 방식은 수시로 변할 수 있습니다.)</li>
                <li><span className="font-medium text-foreground">배송 지역</span> : 한국 전국 지역 / 동남아 제외한 모든 국가. (한국 이외의 국가로 배송을 원할 시 관리자에게 문의 바랍니다.)</li>
                <li><span className="font-medium text-foreground">배송 비용</span> : 중국→국내까지 배송비 조건 없이 무료입니다.</li>
                <li><span className="font-medium text-foreground">배송 기간</span> : 고객주문후 수령까지 보통 2~3주 정도소요. (중국현지 연휴 및 물류상황에 따라서 더 오래 걸릴 수도 있습니다.)</li>
                <li><span className="font-medium text-foreground">배송 안내</span> : 상품 종류에 따라서 (주문 제작 상품 등) 상품의 배송이 다소 지연될 수 있습니다. 해외 배송인 관계로 반품 및 교환의 번거로움을 줄이고자 배송 시에는 철저하게 검수과정을 거치게 됩니다. 조금이라도 빠른 배송을 위해 더욱 노력하겠습니다.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="purchase" className="border-foreground/10">
            <AccordionTrigger className="text-sm font-medium text-foreground">
              구매정보
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">구매방법</p>
              <p className="text-xs text-muted-foreground/80 mb-4">(구매 관련 궁금하신 사항이 있으시면 언제든 카카오톡 고객센터로 연락주세요 😀)</p>
              <ol className="space-y-2 text-xs list-decimal list-inside mb-6">
                <li>구매 원하시는 제품들을 캡쳐하신후 카카오 문의하기 눌러주세요</li>
                <li>제품사진, 성함, 번호, 주소, 개인통관고유부호를 카톡상담사에게 전달해주세요<br /><span className="text-muted-foreground/70 ml-4">*주소 꼭 올바르게 동호수까지 작성 부탁드려요!</span></li>
                <li>저희 상담 직원이 계좌안내 드릴거에요. 😊 결제 해주시면 됩니다.</li>
              </ol>

              <p className="font-semibold text-foreground mb-2">배송소요시간</p>
              <p className="text-xs mb-6">제품 준비기간 2주, 배송 1주 - 대략적으로 3주 안내드리고 있고 특이사항 발생할 경우 안내드린 기간보다 좀 더 길어질 수 있어요. 😥 (재고가 없을 경우 생산되는 시간, 제품이 나왔는데 불량인 경우 교환되는 시간 등)</p>

              <p className="font-semibold text-foreground mb-2">교환 &amp; 환불 정책</p>
              <ul className="space-y-2 text-xs mb-6">
                <li>• 단순 변심으로 인한 환불은 불가능해요 😥<br /><span className="text-muted-foreground/70 ml-3">&apos;그냥&apos; 마음에 안들어요, 성에 안차요 이런 사유로 환불 불가.</span></li>
                <li>• 배송 지연으로 인한 환불, 교환은 불가능해요 😥<br /><span className="text-muted-foreground/70 ml-3">(입금일로부터 60일 경과했을 경우 가능)</span></li>
                <li>• 불량 상품은 상품 수령일 기준 일주일 내 연락주시면 교환 가능해요</li>
                <li>• 제품에 사용 흔적이 있을 경우 교환, 환불처리 불가능해요 😥<br /><span className="text-muted-foreground/70 ml-3">(향수냄새, 오염, 택제거, 구성품 누락 등) 제품 수령하신 상태 그대로 온전히 보내주셔야 처리됩니다.</span></li>
              </ul>

              <p className="font-semibold text-foreground mb-2">AS가능 여부</p>
              <p className="text-xs">수령 하시고 한달 이내로 발생하는 문제들에 한해 무료로 AS 가능, 한달 이후 발생하는 문제들은 유상 AS 가능합니다.</p>
              <p className="text-xs mt-2 text-muted-foreground/70">&apos;두번 밖에 안들었는데 고장났어요&apos; &apos;받자마자 옷장에 넣어놨다가 지금 발견했어요&apos; 라고 말씀하셔도 무료로 AS는 불가능합니다. 😥</p>
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
