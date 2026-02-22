# 🏗️ Dint — 프로젝트 아키텍처 문서

> **Dint** | Premium Luxury E-Commerce App  
> Next.js 16 · React 19 · Supabase · TailwindCSS v4 · Radix UI

---

## 📌 기술 스택 요약

| 영역 | 기술 | 버전 |
|------|------|------|
| **프레임워크** | Next.js (App Router) | 16.1.6 |
| **UI 라이브러리** | React | 19.2.4 |
| **스타일링** | TailwindCSS | v4.2.0 |
| **UI 컴포넌트** | Radix UI (shadcn/ui) | 최신 |
| **백엔드/DB** | Supabase (PostgreSQL) | ^2.97.0 |
| **배포** | Vercel | - |
| **언어** | TypeScript | 5.7.3 |
| **폰트** | Inter (Google Fonts) | - |
| **아이콘** | Lucide React | ^0.564.0 |
| **차트** | Recharts | 2.15.0 |
| **폼** | React Hook Form + Zod | - |

---

## 🗂️ 디렉토리 구조

```
luxury-e-commerce-app/
├── app/                          # Next.js App Router (페이지)
│   ├── layout.tsx                # 루트 레이아웃 (Header, Footer, 전역 컴포넌트)
│   ├── page.tsx                  # 🏠 홈페이지 (Hero + 상품 그리드)
│   ├── globals.css               # 글로벌 스타일
│   ├── shop/
│   │   ├── page.tsx              # 🛍️ 전체 상품 목록 (카테고리 필터)
│   │   └── [id]/
│   │       └── page.tsx          # 📦 상품 상세 페이지 (동적 라우트)
│   ├── admin/
│   │   ├── layout.tsx            # 🔐 관리자 인증 레이아웃
│   │   └── page.tsx              # ⚙️ 관리자 대시보드 (CRUD)
│   ├── about/
│   │   └── page.tsx              # ℹ️ 소개 페이지
│   ├── blog/
│   │   └── page.tsx              # 📝 블로그 목록
│   ├── reviews/
│   │   └── page.tsx              # ⭐ 리뷰 목록
│   └── notice/
│       └── page.tsx              # 📢 공지사항 목록
│
├── components/                   # 재사용 컴포넌트
│   ├── hero-section.tsx          # 히어로 배너 (타이핑 애니메이션)
│   ├── product-card.tsx          # 상품 카드
│   ├── site-header.tsx           # 사이트 헤더 (네비게이션 + 카테고리 메뉴)
│   ├── notice-popup.tsx          # 공지 팝업
│   ├── kakao-button.tsx          # 카카오톡 상담 버튼
│   ├── visitor-tracker.tsx       # 방문자 추적
│   ├── theme-provider.tsx        # 테마 프로바이더
│   └── ui/                       # shadcn/ui 기반 UI 컴포넌트 (57개)
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       ├── tabs.tsx
│       ├── carousel.tsx
│       ├── ... (50+ 컴포넌트)
│       └── toast.tsx
│
├── lib/                          # 유틸리티 & 설정
│   ├── supabase.ts               # Supabase 클라이언트 & DB 쿼리 함수
│   ├── constants.ts              # 타입 정의, 상수, 포맷 함수
│   └── utils.ts                  # cn() 유틸리티 (clsx + tailwind-merge)
│
├── hooks/                        # 커스텀 훅
│   ├── use-mobile.ts             # 모바일 감지 훅
│   └── use-toast.ts              # 토스트 알림 훅
│
├── styles/                       # 추가 스타일
├── public/                       # 정적 파일 (이미지, 파비콘)
├── next.config.mjs               # Next.js 설정
├── tsconfig.json                 # TypeScript 설정
└── package.json                  # 의존성 관리
```

---

## 🏛️ 전체 아키텍처 다이어그램

```mermaid
graph TB
    subgraph Client["🌐 클라이언트 (브라우저)"]
        Browser["사용자 브라우저"]
    end

    subgraph NextJS["⚡ Next.js 16 App Router"]
        subgraph Pages["📄 페이지 라우트"]
            Home["/ 홈"]
            Shop["/ shop 전체상품"]
            ShopDetail["/shop/[id] 상품상세"]
            Admin["/admin 관리자"]
            About["/about 소개"]
            Blog["/blog 블로그"]
            Reviews["/reviews 리뷰"]
            Notice["/notice 공지"]
        end

        subgraph Components["🧩 컴포넌트"]
            Header["SiteHeader"]
            Hero["HeroSection"]
            ProductCard["ProductCard"]
            NoticePopup["NoticePopup"]
            KakaoBtn["KakaoButton"]
            Visitor["VisitorTracker"]
            UI["shadcn/ui (57개)"]
        end

        subgraph Lib["📚 라이브러리"]
            SupaClient["supabase.ts"]
            Constants["constants.ts"]
            Utils["utils.ts"]
        end
    end

    subgraph Supabase["☁️ Supabase Backend"]
        Auth["🔐 Auth"]
        DB["🗄️ PostgreSQL"]
        Storage["📁 Storage"]
    end

    subgraph Vercel["🚀 Vercel"]
        Analytics["Analytics"]
        Deploy["배포 & CDN"]
    end

    Browser --> NextJS
    Pages --> Components
    Pages --> Lib
    SupaClient --> Supabase
    Visitor --> Analytics
    NextJS --> Deploy

    style Client fill:#1a1a2e,color:#fff
    style NextJS fill:#0a0a0a,color:#fff
    style Supabase fill:#1a472a,color:#fff
    style Vercel fill:#111,color:#fff
```

---

## 📊 데이터베이스 스키마 (Supabase)

```mermaid
erDiagram
    products {
        uuid id PK
        text brand
        text name
        int price
        text category
        text[] images
        text description
        text shipping_info
        text product_details
        timestamp created_at
    }

    categories {
        uuid id PK
        text name
        uuid parent_id FK
        int sort_order
        timestamp created_at
    }

    blog_posts {
        uuid id PK
        text title
        text excerpt
        text date
        timestamp created_at
    }

    reviews {
        uuid id PK
        text author
        text product
        int rating
        text content
        text date
        text image_url
        timestamp created_at
    }

    notices {
        uuid id PK
        text title
        text content
        text date
        text type
        timestamp exposure_start
        timestamp exposure_end
        timestamp created_at
    }

    about {
        uuid id PK
        text description
        text mission_title
        text mission_content
        text contact_title
        text contact_content
    }

    categories ||--o{ categories : "parent_id (self-ref)"
```

---

## 🔄 페이지별 데이터 흐름

```mermaid
flowchart LR
    subgraph 홈페이지["🏠 홈페이지 (/)"]
        HP_Load["페이지 로드"] --> HP_Fetch["products + categories 조회"]
        HP_Fetch --> HP_Filter["카테고리/검색 필터"]
        HP_Filter --> HP_Grid["상품 그리드 (최대 8개)"]
    end

    subgraph 상품페이지["🛍️ 상품 (/shop)"]
        SP_Load["페이지 로드"] --> SP_Fetch["products + categories 조회"]
        SP_Fetch --> SP_Filter["카테고리 필터 탭"]
        SP_Filter --> SP_Grid["전체 상품 그리드"]
    end

    subgraph 상세페이지["📦 상세 (/shop/[id])"]
        DP_Load["페이지 로드"] --> DP_Fetch["상품 ID로 조회"]
        DP_Fetch --> DP_Gallery["이미지 갤러리"]
        DP_Fetch --> DP_Info["상품 정보 표시"]
    end

    subgraph 관리자["⚙️ 관리자 (/admin)"]
        AD_Auth["Supabase Auth 인증"]
        AD_Auth --> AD_Tabs["탭 전환"]
        AD_Tabs --> AD_Products["상품 CRUD"]
        AD_Tabs --> AD_Blog["블로그 CRUD"]
        AD_Tabs --> AD_Notice["공지 CRUD"]
        AD_Tabs --> AD_Review["리뷰 CRUD"]
        AD_Tabs --> AD_About["소개 수정"]
        AD_Tabs --> AD_Category["카테고리 관리"]
    end

    HP_Grid -.->|"클릭"| DP_Load
    HP_Grid -.->|"View All"| SP_Load
```

---

## 🧩 컴포넌트 관계도

```mermaid
graph TD
    RootLayout["RootLayout (app/layout.tsx)"]

    RootLayout --> SiteHeader["SiteHeader<br/>• 로고 (Dint)<br/>• 햄버거 메뉴<br/>• 카테고리 사이드바"]
    RootLayout --> Main["main (children)"]
    RootLayout --> NoticePopup["NoticePopup<br/>• 팝업 공지<br/>• 노출 기간 필터"]
    RootLayout --> KakaoButton["KakaoButton<br/>• 카카오톡 상담"]
    RootLayout --> VisitorTracker["VisitorTracker<br/>• 방문자 수 기록"]
    RootLayout --> Analytics["Vercel Analytics"]

    Main --> HomePage["HomePage"]
    Main --> ShopPage["ShopPage"]
    Main --> ProductDetail["ProductDetail"]
    Main --> AdminPage["AdminPage"]
    Main --> AboutPage["AboutPage"]
    Main --> BlogPage["BlogPage"]
    Main --> ReviewsPage["ReviewsPage"]
    Main --> NoticePage["NoticePage"]

    HomePage --> HeroSection["HeroSection<br/>• 타이핑 애니메이션<br/>• 배경 이미지"]
    HomePage --> ProductCard["ProductCard<br/>• 상품 이미지/브랜드/가격"]

    ShopPage --> ProductCard

    AdminPage --> Tabs["Tabs (상품/블로그/공지/리뷰/소개/카테고리)"]

    SiteHeader --> Sheet["Sheet (사이드바)"]
    SiteHeader --> categories_api["Supabase: categories"]
    
    style RootLayout fill:#1e293b,color:#fff
    style SiteHeader fill:#334155,color:#fff
    style NoticePopup fill:#334155,color:#fff
    style HeroSection fill:#334155,color:#fff
    style ProductCard fill:#334155,color:#fff
    style AdminPage fill:#7c2d12,color:#fff
```

---

## 🔐 인증 플로우 (Admin)

```mermaid
sequenceDiagram
    participant User as 관리자
    participant Layout as AdminLayout
    participant Supabase as Supabase Auth
    participant Dashboard as AdminPage

    User->>Layout: /admin 접속
    Layout->>Supabase: getSession() 확인
    
    alt 세션 없음
        Supabase-->>Layout: null
        Layout-->>User: 로그인 폼 표시
        User->>Layout: 이메일/비밀번호 입력
        Layout->>Supabase: signInWithPassword()
        
        alt 인증 성공
            Supabase-->>Layout: User 객체
            Layout-->>Dashboard: children 렌더링
        else 인증 실패
            Supabase-->>Layout: error
            Layout-->>User: 에러 메시지
        end
    else 세션 있음
        Supabase-->>Layout: User 객체
        Layout-->>Dashboard: children 렌더링
    end
    
    User->>Layout: 로그아웃 클릭
    Layout->>Supabase: signOut()
    Layout-->>User: 로그인 폼 표시
```

---

## 📱 라우팅 구조

| 경로 | 컴포넌트 | 설명 | 데이터 소스 |
|------|----------|------|-------------|
| `/` | `HomePage` | 히어로 + 상품 미리보기 (8개) | `products`, `categories` |
| `/shop` | `ShopPage` | 전체 상품 + 카테고리 필터 | `products`, `categories` |
| `/shop/[id]` | `ProductDetail` | 상품 상세 (이미지, 설명, 가격) | `products` (by ID) |
| `/admin` | `AdminPage` | 관리자 CRUD 대시보드 | 모든 테이블 |
| `/about` | `AboutPage` | 브랜드 소개 | `about` |
| `/blog` | `BlogPage` | 블로그 글 목록 | `blog_posts` |
| `/reviews` | `ReviewsPage` | 고객 리뷰 (별점 + 이미지) | `reviews` |
| `/notice` | `NoticePage` | 공지사항 목록 | `notices` |

---

## 🛠️ 관리자 대시보드 기능

```mermaid
mindmap
  root((Admin Dashboard))
    상품 관리
      상품 등록
      상품 수정
      상품 삭제
      이미지 업로드
    블로그 관리
      글 작성
      글 수정
      글 삭제
    공지 관리
      공지 작성
      노출 기간 설정
      공지 삭제
    리뷰 관리
      리뷰 작성
      이미지 첨부
      리뷰 삭제
    소개 관리
      소개글 수정
    카테고리 관리
      카테고리 생성
      계층 구조 설정
      정렬 순서 관리
      카테고리 삭제
```

---

## ⚙️ 핵심 함수 (lib/supabase.ts)

| 함수 | 테이블 | 설명 |
|------|--------|------|
| `getProducts()` | `products` | 전체 상품 조회 (최신순) |
| `getProductById(id)` | `products` | ID로 상품 1건 조회 |
| `getAbout()` | `about` | 소개 정보 조회 |
| `getBlogPosts()` | `blog_posts` | 블로그 글 목록 조회 |
| `getNotices()` | `notices` | 공지사항 목록 조회 |
| `getReviews()` | `reviews` | 리뷰 목록 조회 |
| `getCategories()` | `categories` | 카테고리 목록 조회 (정렬순) |

---

## 🎨 UI 컴포넌트 목록 (shadcn/ui)

총 **57개**의 UI 컴포넌트가 `components/ui/` 에 포함되어 있습니다:

| 카테고리 | 컴포넌트 |
|----------|----------|
| **입력** | Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider, Calendar |
| **레이아웃** | Separator, Sidebar, Scroll Area, Accordion, Collapsible, Tabs |
| **피드백** | Toast, Alert, Spinner, Skeleton, Badge, Progress |
| **오버레이** | Dialog, Drawer, Sheet, Popover, Tooltip, Hover Card |
| **내비게이션** | Menubar, Command, Breadcrumb, Navigation Menu, Dropdown Menu |
| **데이터** | Table, Carousel, Avatar, Aspect Ratio |
| **기타** | Button, Toggle, Toggle Group, Form, Label, KBD |

---

## 📦 외부 서비스 연동

```mermaid
graph LR
    App["Dint App"] --> Supabase_DB["Supabase DB<br/>(PostgreSQL)"]
    App --> Supabase_Auth["Supabase Auth<br/>(이메일/비밀번호)"]
    App --> Supabase_Storage["Supabase Storage<br/>(이미지 업로드)"]
    App --> Vercel_Analytics["Vercel Analytics<br/>(방문자 분석)"]
    App --> Kakao["KakaoTalk<br/>(고객 상담)"]

    style App fill:#0a0a0a,color:#fff
    style Supabase_DB fill:#1a472a,color:#fff
    style Supabase_Auth fill:#1a472a,color:#fff
    style Supabase_Storage fill:#1a472a,color:#fff
    style Vercel_Analytics fill:#111,color:#fff
    style Kakao fill:#fee500,color:#000
```

---

## 🔄 렌더링 전략

| 구분 | 방식 | 이유 |
|------|------|------|
| **모든 페이지** | `"use client"` (CSR) | Supabase 실시간 데이터 + 인터랙티브 UI |
| **데이터 페칭** | `useEffect` + `useState` | 클라이언트 사이드 데이터 로딩 |
| **이미지** | `next/image` | 자동 최적화 + lazy loading |
| **라우팅** | App Router (파일 기반) | Next.js 16 표준 |

---

> 📅 마지막 업데이트: 2026-02-21
