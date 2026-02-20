export type Category = "전체" | "가방" | "신발" | "시계" | "의류" | string

export interface CategoryItem {
  id: string
  name: string
  parent_id: string | null
  sort_order: number
  created_at?: string
}

export interface Product {
  id: string
  brand: string
  name: string
  price: number
  category: Category
  images: string[]
  description: string
  shipping_info?: string
  product_details?: string
}

export const CATEGORIES: Category[] = ["전체", "가방", "신발", "시계", "의류"]

export const PRODUCTS: Product[] = [
  {
    id: "1",
    brand: "MAISON DE LUXE",
    name: "클래식 레더 토트백",
    price: 320000,
    category: "가방",
    images: [
      "/white-placeholder.png",
      "/white-placeholder.png"
    ],
    description:
      "최상급 이탈리아 가죽으로 제작된 클래식 토트백입니다. 넉넉한 수납공간과 세련된 디자인으로 데일리 백으로 적합합니다.",
  },
  {
    id: "2",
    brand: "NOIR STUDIO",
    name: "미니멀 클러치백",
    price: 189000,
    category: "가방",
    images: [
      "/white-placeholder.png",
      "/white-placeholder.png"
    ],
    description:
      "심플하면서도 우아한 디자인의 미니멀 클러치백. 파티룩이나 포멀룩에 완벽한 액세서리입니다.",
  },
  {
    id: "3",
    brand: "ELEGANTE",
    name: "프리미엄 옥스포드 슈즈",
    price: 278000,
    category: "신발",
    images: [
      "/white-placeholder.png",
      "/white-placeholder.png"
    ],
    description:
      "장인의 손길로 완성된 프리미엄 옥스포드 슈즈. 고급 소가죽과 견고한 솔이 특징입니다.",
  },
  {
    id: "4",
    brand: "BLANC WALK",
    name: "모던 화이트 스니커즈",
    price: 198000,
    category: "신발",
    images: [
      "/white-placeholder.png",
      "/white-placeholder.png"
    ],
    description:
      "캐주얼과 포멀을 넘나드는 모던 화이트 스니커즈. 쿠셔닝 인솔로 편안한 착용감을 제공합니다.",
  },
  {
    id: "5",
    brand: "CHRONOS",
    name: "오토매틱 드레스 워치",
    price: 890000,
    category: "시계",
    images: [
      "/white-placeholder.png"
    ],
    description:
      "스위스 무브먼트를 탑재한 오토매틱 드레스 워치. 사파이어 크리스탈 글래스와 스테인리스 스틸 케이스가 돋보입니다.",
  },
  {
    id: "6",
    brand: "ATELIER",
    name: "캐시미어 오버코트",
    price: 580000,
    category: "의류",
    images: [
      "/white-placeholder.png"
    ],
    description:
      "100% 캐시미어 소재의 럭셔리 오버코트. 클래식한 실루엣과 부드러운 촉감이 특징입니다.",
  },
  {
    id: "7",
    brand: "MAISON DE LUXE",
    name: "체인 숄더백",
    price: 420000,
    category: "가방",
    images: [
      "/white-placeholder.png",
      "/white-placeholder.png"
    ],
    description:
      "골드 체인 스트랩이 포인트인 럭셔리 숄더백. 크로스바디로도 활용 가능한 멀티 스타일 백입니다.",
  },
  {
    id: "8",
    brand: "NOIR STUDIO",
    name: "울 블렌드 재킷",
    price: 450000,
    category: "의류",
    images: [
      "/white-placeholder.png"
    ],
    description:
      "프리미엄 울 블렌드 소재의 테일러드 재킷. 모던한 핏과 디테일이 돋보이는 아이템입니다.",
  },
]

export const NAV_ITEMS = [
  { label: "전체보기", href: "/shop" },
  { label: "소개", href: "/about" },
  { label: "블로그", href: "/blog" },
  { label: "리뷰", href: "/reviews" },
  { label: "공지사항", href: "/notice" },
]

export function formatPrice(price: number): string {
  return `₩${price.toLocaleString("ko-KR")}`
}
