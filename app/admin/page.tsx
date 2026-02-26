"use client"

import { useState, useEffect } from "react"
import { PRODUCTS, CATEGORIES, type Category, type Product, type CategoryItem } from "@/lib/constants"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Trash2, ChevronRight, FolderOpen, Folder } from "lucide-react"
import { toast } from "sonner"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [blogs, setBlogs] = useState<any[]>([])
  const [notices, setNotices] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [about, setAbout] = useState<any>(null)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [todayVisitors, setTodayVisitors] = useState(0)
  const [totalVisitors, setTotalVisitors] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Form States
  const [productForm, setProductForm] = useState({
    name: "",
    brand: "",
    price: "",
    category: "" as Category | "",
    description: "",
    shipping_info: "모든 상품은 주문 확인 후 2-5 영업일 내에 발송됩니다. 배송비는 50,000원 이상 구매 시 무료이며, 그 이하의 경우 3,000원이 부과됩니다. 상품 수령 후 7일 이내에 미착용 상태로 반품 신청이 가능합니다. 반품 시 배송비는 고객 부담입니다.",
    product_details: "모든 상품은 정품 인증서와 함께 배송됩니다. 자세한 사이즈 및 소재 정보는 카카오톡 문의를 통해 확인해 주세요."
  })
  const [productImages, setProductImages] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [blogForm, setBlogForm] = useState({ title: "", excerpt: "", date: new Date().toLocaleDateString("ko-KR") })
  const [noticeForm, setNoticeForm] = useState({ title: "", content: "", date: new Date().toLocaleDateString("ko-KR"), is_popup: true, start_date: "", end_date: "", image_url: "" })
  const [noticeImage, setNoticeImage] = useState<File | null>(null)
  const [reviewForm, setReviewForm] = useState({ author: "", rating: "5", product: "", content: "", date: new Date().toLocaleDateString("ko-KR"), image_url: "" })
  const [reviewImage, setReviewImage] = useState<File | null>(null)
  const [aboutForm, setAboutForm] = useState({ description: "", mission_title: "", mission_content: "", contact_title: "", contact_content: "" })
  const [categoryForm, setCategoryForm] = useState({ name: "", parent_id: "" as string, sort_order: "0" })

  // Editing States
  const [editingId, setEditingId] = useState<{ [key: string]: string | null }>({
    products: null,
    blog_posts: null,
    notices: null,
    reviews: null,
    categories: null
  })

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setIsLoading(true)
    try {
      const [resProducts, resBlogs, resNotices, resReviews, resAbout, resCategories] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
        supabase.from("notices").select("*").order("created_at", { ascending: false }),
        supabase.from("reviews").select("*").order("created_at", { ascending: false }),
        supabase.from("about").select("*").single(),
        supabase.from("categories").select("*").order("sort_order", { ascending: true })
      ])

      if (resProducts.data) setProducts(resProducts.data)
      if (resBlogs.data) setBlogs(resBlogs.data)
      if (resNotices.data) setNotices(resNotices.data)
      if (resReviews.data) setReviews(resReviews.data)
      if (resAbout.data) {
        setAbout(resAbout.data)
        setAboutForm(resAbout.data)
      }
      if (resCategories.data) setCategories(resCategories.data)

      // Visitor Stats
      const today = new Date().toISOString().split("T")[0]
      const { data: todayData } = await supabase
        .from("visitor_stats")
        .select("count")
        .eq("date", today)
        .single()
      setTodayVisitors(todayData?.count || 0)

      const { data: allData } = await supabase
        .from("visitor_stats")
        .select("count")
      const total = (allData || []).reduce((sum: number, row: any) => sum + (row.count || 0), 0)
      setTotalVisitors(total)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Submit Handlers
  async function uploadImage(file: File) {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `products/${fileName}`

    const { error: uploadError, data } = await supabase.storage
      .from("product-images")
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath)

    return publicUrl
  }

  async function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!productForm.category) return toast.error("카테고리를 선택해주세요.")

    // In update mode, image is optional. In creation mode, it's required.
    const isEditing = editingId.products !== null;
    if (!isEditing && productImages.length === 0) return toast.error("최소 한 개의 이미지를 선택해주세요.")

    setIsUploading(true)
    try {
      let publicUrls: string[] = []
      if (productImages.length > 0) {
        const uploadPromises = productImages.map(file => uploadImage(file))
        publicUrls = await Promise.all(uploadPromises)
      }

      const productPayload: any = {
        name: productForm.name.trim(),
        brand: productForm.brand.trim(),
        category: productForm.category.trim(),
        description: productForm.description.trim(),
        shipping_info: productForm.shipping_info.trim(),
        product_details: productForm.product_details.trim(),
        price: parseInt(productForm.price)
      }
      if (publicUrls.length > 0) {
        productPayload.images = publicUrls
      }

      if (isEditing) {
        const { error } = await supabase.from("products").update(productPayload).eq("id", editingId.products)
        if (error) throw error
        toast.success("수정 완료")
      } else {
        const { error } = await supabase.from("products").insert([{ ...productPayload, images: publicUrls }])
        if (error) throw error
        toast.success("등록 완료")
      }

      setProductForm({
        name: "", brand: "", price: "", category: "", description: "",
        shipping_info: "모든 상품은 주문 확인 후 2-5 영업일 내에 발송됩니다. 배송비는 50,000원 이상 구매 시 무료이며, 그 이하의 경우 3,000원이 부과됩니다. 상품 수령 후 7일 이내에 미착용 상태로 반품 신청이 가능합니다. 반품 시 배송비는 고객 부담입니다.",
        product_details: "모든 상품은 정품 인증서와 함께 배송됩니다. 자세한 사이즈 및 소재 정보는 카카오톡 문의를 통해 확인해 주세요."
      })
      setProductImages([])
      setEditingId(prev => ({ ...prev, products: null }))
      fetchAll()
    } catch (error: any) {
      console.error(error)
      toast.error(`오류 발생: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  async function handleBlogSubmit(e: React.FormEvent) {
    e.preventDefault()
    const isEditing = editingId.blog_posts !== null;
    let error;
    if (isEditing) {
      const { error: err } = await supabase.from("blog_posts").update(blogForm).eq("id", editingId.blog_posts)
      error = err;
    } else {
      const { error: err } = await supabase.from("blog_posts").insert([blogForm])
      error = err;
    }

    if (error) return toast.error("오류 발생")
    toast.success(isEditing ? "수정 완료" : "등록 완료")
    setBlogForm({ title: "", excerpt: "", date: new Date().toLocaleDateString("ko-KR") })
    setEditingId(prev => ({ ...prev, blog_posts: null }))
    fetchAll()
  }

  async function handleNoticeSubmit(e: React.FormEvent) {
    e.preventDefault()
    const isEditing = editingId.notices !== null;

    setIsUploading(true)
    try {
      let finalImageUrl = noticeForm.image_url;
      if (noticeImage) {
        finalImageUrl = await uploadImage(noticeImage)
      }

      const payload: any = {
        title: noticeForm.title,
        content: noticeForm.content,
        date: noticeForm.date,
        is_popup: true,
        image_url: finalImageUrl,
      }
      if (noticeForm.start_date) payload.start_date = noticeForm.start_date
      if (noticeForm.end_date) payload.end_date = noticeForm.end_date

      let error;
      if (isEditing) {
        const { error: err } = await supabase.from("notices").update(payload).eq("id", editingId.notices)
        error = err;
      } else {
        const { error: err } = await supabase.from("notices").insert([payload])
        error = err;
      }

      if (error) throw error
      toast.success(isEditing ? "수정 완료" : "등록 완료")
      setNoticeForm({ title: "", content: "", date: new Date().toLocaleDateString("ko-KR"), is_popup: true, start_date: "", end_date: "", image_url: "" })
      setNoticeImage(null)
      setEditingId(prev => ({ ...prev, notices: null }))
      fetchAll()
    } catch (err: any) {
      console.error(err)
      toast.error(`오류 발생: ${err.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault()
    const isEditing = editingId.reviews !== null;
    let error;

    setIsUploading(true)
    try {
      let finalImageUrl = reviewForm.image_url;
      if (reviewImage) {
        finalImageUrl = await uploadImage(reviewImage)
      }

      const payload = { ...reviewForm, rating: parseInt(reviewForm.rating), image_url: finalImageUrl }

      if (isEditing) {
        const { error: err } = await supabase.from("reviews").update(payload).eq("id", editingId.reviews)
        error = err;
      } else {
        const { error: err } = await supabase.from("reviews").insert([payload])
        error = err;
      }

      if (error) throw error
      toast.success(isEditing ? "수정 완료" : "등록 완료")
      setReviewForm({ author: "", rating: "5", product: "", content: "", date: new Date().toLocaleDateString("ko-KR"), image_url: "" })
      setReviewImage(null)
      setEditingId(prev => ({ ...prev, reviews: null }))
      fetchAll()
    } catch (err: any) {
      console.error(err)
      toast.error(`오류 발생: ${err.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  async function handleAboutUpdate(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from("about").update(aboutForm).eq("id", 1)
    if (error) return toast.error("오류 발생")
    toast.success("수정 완료")
    fetchAll()
  }

  // Edit Handlers
  function startEditProduct(p: Product) {
    setProductForm({
      name: p.name,
      brand: p.brand,
      price: p.price.toString(),
      category: p.category,
      description: p.description || "",
      shipping_info: p.shipping_info || "",
      product_details: p.product_details || ""
    })
    setEditingId(prev => ({ ...prev, products: p.id }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function startEditBlog(b: any) {
    setBlogForm({ title: b.title, excerpt: b.excerpt, date: b.date })
    setEditingId(prev => ({ ...prev, blog_posts: b.id }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function startEditNotice(n: any) {
    setNoticeForm({ title: n.title, content: n.content, date: n.date, is_popup: true, start_date: n.start_date || "", end_date: n.end_date || "", image_url: n.image_url || "" })
    setNoticeImage(null)
    setEditingId(prev => ({ ...prev, notices: n.id }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function startEditReview(r: any) {
    setReviewForm({ author: r.author, rating: r.rating.toString(), product: r.product, content: r.content, date: r.date, image_url: r.image_url || "" })
    setReviewImage(null)
    setEditingId(prev => ({ ...prev, reviews: r.id }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function startEditCategory(c: CategoryItem) {
    setCategoryForm({ name: c.name, parent_id: c.parent_id || "", sort_order: c.sort_order.toString() })
    setEditingId(prev => ({ ...prev, categories: c.id }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function cancelEdit(tab: string) {
    setEditingId(prev => ({ ...prev, [tab]: null }))
    if (tab === "products") setProductForm({ name: "", brand: "", price: "", category: "", description: "", shipping_info: "모든 상품은 주문 확인 후 2-5 영업일 내에 발송됩니다. 배송비는 50,000원 이상 구매 시 무료이며, 그 이하의 경우 3,000원이 부과됩니다. 상품 수령 후 7일 이내에 미착용 상태로 반품 신청이 가능합니다. 반품 시 배송비는 고객 부담입니다.", product_details: "모든 상품은 정품 인증서와 함께 배송됩니다. 자세한 사이즈 및 소재 정보는 카카오톡 문의를 통해 확인해 주세요." })
    if (tab === "blog_posts") setBlogForm({ title: "", excerpt: "", date: new Date().toLocaleDateString("ko-KR") })
    if (tab === "notices") {
      setNoticeForm({ title: "", content: "", date: new Date().toLocaleDateString("ko-KR"), is_popup: true, start_date: "", end_date: "", image_url: "" })
      setNoticeImage(null)
    }
    if (tab === "reviews") {
      setReviewForm({ author: "", rating: "5", product: "", content: "", date: new Date().toLocaleDateString("ko-KR"), image_url: "" })
      setReviewImage(null)
    }
    if (tab === "categories") setCategoryForm({ name: "", parent_id: "", sort_order: (categories.length + 1).toString() })
  }

  // Category Submit Handler
  async function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!categoryForm.name.trim()) return toast.error("카테고리 이름을 입력해주세요.")

    const isEditing = editingId.categories !== null
    const newSortOrder = parseInt(categoryForm.sort_order) || 0
    const payload: any = {
      name: categoryForm.name.trim(),
      parent_id: categoryForm.parent_id || null,
      sort_order: newSortOrder
    }

    let error
    if (isEditing) {
      // Cascade Update: If name changes, update all products
      const oldCategory = categories.find(c => c.id === editingId.categories)
      if (oldCategory && oldCategory.name !== payload.name) {
        toast.loading("관련 상품들의 카테고리 정보를 업데이트 중입니다...")
        const { error: cascadeError } = await supabase
          .from("products")
          .update({ category: payload.name })
          .eq("category", oldCategory.name)

        if (cascadeError) {
          console.error("Cascade update failed:", cascadeError)
          toast.error("일부 상품의 카테고리 정보 업데이트에 실패했습니다.")
        } else {
          toast.dismiss()
        }
      }

      const { error: err } = await supabase.from("categories").update(payload).eq("id", editingId.categories)
      error = err
    } else {
      // 기존 카테고리 중 sort_order >= newSortOrder인 것들을 +1씩 밀어주기
      const toShift = categories.filter(c => c.sort_order >= newSortOrder)
      for (const cat of toShift) {
        await supabase.from("categories").update({ sort_order: cat.sort_order + 1 }).eq("id", cat.id)
      }
      const { error: err } = await supabase.from("categories").insert([payload])
      error = err
    }

    if (error) return toast.error(`오류 발생: ${error.message}`)
    toast.success(isEditing ? "카테고리 수정 완료" : "카테고리 등록 완료")
    setCategoryForm({ name: "", parent_id: "", sort_order: (categories.length + 1).toString() })
    setEditingId(prev => ({ ...prev, categories: null }))
    fetchAll()
  }

  // Helper: get child categories
  function getChildCategories(parentId: string | null): CategoryItem[] {
    return categories.filter(c => c.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order)
  }

  // Helper: get parent category name
  function getCategoryName(id: string | null): string {
    if (!id) return ""
    const cat = categories.find(c => c.id === id)
    return cat ? cat.name : ""
  }

  // Helper: check if a category can be a parent (prevent circular reference)
  function getAvailableParents(excludeId?: string | null): CategoryItem[] {
    if (!excludeId) return categories.filter(c => !c.parent_id)
    // Exclude self and any descendant
    const descendants = new Set<string>()
    function collectDescendants(id: string) {
      descendants.add(id)
      categories.filter(c => c.parent_id === id).forEach(c => collectDescendants(c.id))
    }
    collectDescendants(excludeId)
    return categories.filter(c => !descendants.has(c.id))
  }

  // Delete Handlers
  async function handleDelete(table: string, id: string) {
    if (table === "categories") {
      // Deletion Protection: Check if any product uses this category
      const categoryToDelete = categories.find(c => c.id === id)
      if (categoryToDelete) {
        const { data: linkedProducts, error: checkError } = await supabase
          .from("products")
          .select("id")
          .eq("category", categoryToDelete.name)
          .limit(1)

        if (checkError) {
          console.error("Deletion check failed:", checkError)
        } else if (linkedProducts && linkedProducts.length > 0) {
          return toast.error("이 카테고리를 사용 중인 상품이 있습니다. 상품들의 카테고리를 먼저 변경하거나 삭제해주세요.")
        }
      }

      const children = categories.filter(c => c.parent_id === id)
      if (children.length > 0) {
        if (!confirm(`이 카테고리에 ${children.length}개의 하위 카테고리가 있습니다. 모두 삭제됩니다. 계속하시겠습니까?`)) return
      } else {
        if (!confirm("정말 삭제하시겠습니까?")) return
      }
    } else {
      if (!confirm("정말 삭제하시겠습니까?")) return
    }
    const { error } = await supabase.from(table).delete().eq("id", id)
    if (error) return toast.error("삭제 실패")
    toast.success("삭제 완료")
    if (editingId[table] === id) cancelEdit(table)
    fetchAll()
  }

  return (
    <div className="px-4 py-6 sm:px-6">
      {/* Visitor Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="border border-foreground/10 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">오늘 방문자</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{todayVisitors.toLocaleString()}</p>
        </div>
        <div className="border border-foreground/10 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">총 방문자</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{totalVisitors.toLocaleString()}</p>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary overflow-x-auto h-auto">
          <TabsTrigger value="products" className="text-[10px] uppercase font-bold tracking-tight py-3">상품</TabsTrigger>
          <TabsTrigger value="categories" className="text-[10px] uppercase font-bold tracking-tight py-3">카테고리</TabsTrigger>
          <TabsTrigger value="reviews" className="text-[10px] uppercase font-bold tracking-tight py-3">리뷰</TabsTrigger>
          <TabsTrigger value="notice" className="text-[10px] uppercase font-bold tracking-tight py-3">공지</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">상품 목록</h2>
            <form onSubmit={handleProductSubmit} className="mt-6 flex flex-col gap-4 border border-foreground/10 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">{editingId.products ? "상품 수정 중" : "새 상품 등록"}</span>
                {editingId.products && <button type="button" onClick={() => cancelEdit("products")} className="text-[10px] underline">반환</button>}
              </div>
              <Input placeholder="브랜드" value={productForm.brand} onChange={e => setProductForm({ ...productForm, brand: e.target.value })} required />
              <Input placeholder="상품명" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required />
              <textarea
                placeholder="상품 설명"
                className="w-full min-h-72 border border-foreground/20 p-3 text-sm focus:outline-none text-foreground bg-secondary/20"
                value={productForm.description}
                onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                required
              />
              <Input type="number" placeholder="가격" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required />
              <Select
                value={categories.find(c => c.name === productForm.category)?.id || productForm.category}
                onValueChange={val => {
                  const found = categories.find(c => c.id === val)
                  setProductForm({ ...productForm, category: found ? found.name : val })
                }}
              >
                <SelectTrigger><SelectValue placeholder="카테고리" /></SelectTrigger>
                <SelectContent>
                  {categories.length > 0
                    ? categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.parent_id ? `ㄴ ${cat.name}` : cat.name}</SelectItem>)
                    : CATEGORIES.filter(c => c !== "전체").map((cat, idx) => <SelectItem key={`${cat}-${idx}`} value={cat}>{cat}</SelectItem>)
                  }
                </SelectContent>
              </Select>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">상품 이미지 ({productImages.length}개 선택됨)</Label>
                <p className="text-[10px] text-muted-foreground">{editingId.products ? "새 이미지를 선택하면 기존 이미지가 교체됩니다." : "필수 항목입니다."}</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => setProductImages(Array.from(e.target.files || []))}
                  className="text-xs file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-foreground file:text-background hover:file:opacity-90 cursor-pointer"
                  required={!editingId.products}
                />
              </div>
              <button
                type="submit"
                disabled={isUploading}
                className="bg-foreground py-3 text-xs font-bold text-background disabled:opacity-50"
              >
                {isUploading ? "처리 중..." : (editingId.products ? "수정 완료" : "상품 등록")}
              </button>
            </form>

            <div className="mt-8 space-y-4">
              {products.map(p => (
                <div key={p.id} className="flex items-center justify-between border-b border-foreground/5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} className="size-10 object-cover border border-foreground/5 bg-secondary" alt="" />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground">{p.brand}</p>
                      <p className="text-sm font-medium">{p.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEditProduct(p)} className="text-[10px] font-bold text-muted-foreground hover:text-foreground">수정</button>
                    <button onClick={() => handleDelete("products", p.id)} className="text-muted-foreground hover:text-red-500"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">카테고리 관리</h2>
            <form onSubmit={handleCategorySubmit} className="mt-6 flex flex-col gap-4 border border-foreground/10 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">{editingId.categories ? "카테고리 수정 중" : "새 카테고리 등록"}</span>
                {editingId.categories && <button type="button" onClick={() => cancelEdit("categories")} className="text-[10px] underline">취소</button>}
              </div>
              <Input placeholder="카테고리 이름" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
              <Select value={categoryForm.parent_id} onValueChange={val => setCategoryForm({ ...categoryForm, parent_id: val === "__none__" ? "" : val })}>
                <SelectTrigger><SelectValue placeholder="상위 카테고리 (없으면 최상위)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">최상위 카테고리</SelectItem>
                  {getAvailableParents(editingId.categories).map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.parent_id ? `ㄴ ${cat.name}` : cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="number" placeholder="정렬 순서" value={categoryForm.sort_order} onChange={e => setCategoryForm({ ...categoryForm, sort_order: e.target.value })} />
              <button type="submit" className="bg-foreground py-3 text-xs font-bold text-background">{editingId.categories ? "수정 완료" : "카테고리 등록"}</button>
            </form>

            {/* Category Tree */}
            <div className="mt-8 space-y-1">
              {getChildCategories(null).map(parent => (
                <div key={parent.id}>
                  <div className="flex items-center justify-between border-b border-foreground/5 py-3 px-2 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-2">
                      {getChildCategories(parent.id).length > 0
                        ? <FolderOpen className="size-4 text-muted-foreground" />
                        : <Folder className="size-4 text-muted-foreground" />
                      }
                      <span className="text-sm font-semibold">{parent.name}</span>
                      <span className="text-[10px] text-muted-foreground">순서: {parent.sort_order}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEditCategory(parent)} className="text-[10px] font-bold text-muted-foreground hover:text-foreground">수정</button>
                      <button onClick={() => handleDelete("categories", parent.id)} className="text-muted-foreground hover:text-red-500"><Trash2 className="size-4" /></button>
                    </div>
                  </div>
                  {/* Child categories */}
                  {getChildCategories(parent.id).map(child => (
                    <div key={child.id} className="flex items-center justify-between border-b border-foreground/5 py-3 pl-8 pr-2 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="size-3 text-muted-foreground" />
                        <span className="text-sm">{child.name}</span>
                        <span className="text-[10px] text-muted-foreground">순서: {child.sort_order}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEditCategory(child)} className="text-[10px] font-bold text-muted-foreground hover:text-foreground">수정</button>
                        <button onClick={() => handleDelete("categories", child.id)} className="text-muted-foreground hover:text-red-500"><Trash2 className="size-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-xs text-muted-foreground py-8 text-center">등록된 카테고리가 없습니다.</p>
              )}
            </div>
          </div>
        </TabsContent>
        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">리뷰 관리</h2>
            <form onSubmit={handleReviewSubmit} className="mt-6 flex flex-col gap-4 border border-foreground/10 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">{editingId.reviews ? "리뷰 수정 중" : "새 리뷰 등록"}</span>
                {editingId.reviews && <button type="button" onClick={() => cancelEdit("reviews")} className="text-[10px] underline">취소</button>}
              </div>
              <Input placeholder="작성자" value={reviewForm.author} onChange={e => setReviewForm({ ...reviewForm, author: e.target.value })} required />
              <Input placeholder="상품명" value={reviewForm.product} onChange={e => setReviewForm({ ...reviewForm, product: e.target.value })} required />
              <div className="space-y-1">
                <Label className="text-xs font-medium">별점 (1-5)</Label>
                <Select value={reviewForm.rating} onValueChange={val => setReviewForm({ ...reviewForm, rating: val })}>
                  <SelectTrigger><SelectValue placeholder="별점 선택" /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={n.toString()}>{n}점</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <textarea placeholder="리뷰 내용" className="w-full min-h-32 border border-foreground/20 p-3 text-sm focus:outline-none text-foreground bg-secondary/20" value={reviewForm.content} onChange={e => setReviewForm({ ...reviewForm, content: e.target.value })} required />
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">리뷰 이미지 (선택)</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setReviewImage(e.target.files?.[0] || null)}
                  className="text-xs file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-foreground file:text-background hover:file:opacity-90 cursor-pointer"
                />
                {reviewForm.image_url && !reviewImage && (
                  <div className="flex items-center gap-2 mt-1">
                    <img src={reviewForm.image_url} className="size-10 object-cover border border-foreground/10" alt="" />
                    <span className="text-[10px] text-muted-foreground">기존 이미지 유지됨</span>
                  </div>
                )}
                {reviewImage && (
                  <div className="flex items-center gap-2 mt-1">
                    <img src={URL.createObjectURL(reviewImage)} className="size-10 object-cover border border-foreground/10" alt="" />
                    <span className="text-[10px] text-green-600 font-medium">새 이미지 선택됨</span>
                  </div>
                )}
              </div>
              <button type="submit" disabled={isUploading} className="bg-foreground py-3 text-xs font-bold text-background disabled:opacity-50">
                {isUploading ? "처리 중..." : (editingId.reviews ? "수정 완료" : "리뷰 등록")}
              </button>
            </form>
            <div className="mt-8 space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="flex items-center justify-between border-b border-foreground/5 py-4">
                  <div className="flex items-center gap-3">
                    {r.image_url && <img src={r.image_url} className="size-10 object-cover border border-foreground/5 bg-secondary" alt="" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-muted-foreground">{r.author}</p>
                        <div className="flex text-[8px]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < r.rating ? "text-foreground" : "text-foreground/20"}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm font-medium">{r.product}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEditReview(r)} className="text-[10px] font-bold text-muted-foreground hover:text-foreground">수정</button>
                    <button onClick={() => handleDelete("reviews", r.id)} className="text-muted-foreground hover:text-red-500"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Notice / Popup Tab */}
        <TabsContent value="notice">
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">팝업 공지 관리</h2>
            <form onSubmit={handleNoticeSubmit} className="mt-6 flex flex-col gap-4 border border-foreground/10 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">{editingId.notices ? "팝업 수정 중" : "새 팝업 등록"}</span>
                {editingId.notices && <button type="button" onClick={() => cancelEdit("notices")} className="text-[10px] underline">취소</button>}
              </div>
              <Input placeholder="팝업 제목" value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })} required />
              <textarea placeholder="팝업 내용" className="w-full min-h-32 border border-foreground/20 p-3 text-sm focus:outline-none text-foreground bg-secondary/20" value={noticeForm.content} onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">노출 시작일</Label>
                  <Input type="date" value={noticeForm.start_date} onChange={e => setNoticeForm({ ...noticeForm, start_date: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">노출 종료일</Label>
                  <Input type="date" value={noticeForm.end_date} onChange={e => setNoticeForm({ ...noticeForm, end_date: e.target.value })} />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">* 날짜를 비워두면 무기한 노출됩니다.</p>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">팝업 이미지 (선택)</Label>
                <div className="flex flex-col gap-1.5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setNoticeImage(e.target.files?.[0] || null)}
                    className="text-xs file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-foreground file:text-background hover:file:opacity-90 cursor-pointer"
                  />
                  {noticeForm.image_url && !noticeImage && (
                    <div className="flex items-center gap-2 mt-1">
                      <img src={noticeForm.image_url} className="size-10 object-cover border border-foreground/10" alt="" />
                      <span className="text-[10px] text-muted-foreground">기존 이미지 유지됨</span>
                    </div>
                  )}
                  {noticeImage && (
                    <div className="flex items-center gap-2 mt-1">
                      <img src={URL.createObjectURL(noticeImage)} className="size-10 object-cover border border-foreground/10" alt="" />
                      <span className="text-[10px] text-green-600 font-medium">새 이미지 선택됨</span>
                    </div>
                  )}
                </div>
              </div>
              <button type="submit" disabled={isUploading} className="bg-foreground py-3 text-xs font-bold text-background disabled:opacity-50">
                {isUploading ? "처리 중..." : (editingId.notices ? "수정 완료" : "팝업 등록")}
              </button>
            </form>
            <div className="mt-8 space-y-4">
              {notices.filter((n: any) => n.is_popup).map((n: any) => {
                const now = new Date().toISOString().split("T")[0]
                const isActive = (!n.start_date || n.start_date <= now) && (!n.end_date || n.end_date >= now)
                return (
                  <div key={n.id} className="flex items-center justify-between border-b border-foreground/5 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-muted-foreground font-medium">{n.date}</p>
                        <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${isActive ? "bg-foreground text-background" : "bg-muted-foreground/20 text-muted-foreground"}`}>
                          {isActive ? "노출중" : "만료"}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{n.title}</p>
                      {(n.start_date || n.end_date) && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {n.start_date || "시작일 없음"} ~ {n.end_date || "종료일 없음"}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEditNotice(n)} className="text-[10px] font-bold text-muted-foreground hover:text-foreground">수정</button>
                      <button onClick={() => handleDelete("notices", n.id)} className="text-muted-foreground hover:text-red-500"><Trash2 className="size-4" /></button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
