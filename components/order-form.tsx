"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Product } from "@/lib/constants"

interface OrderFormProps {
    product: Product
    isOpen: boolean
    onClose: () => void
}

export function OrderForm({ product, isOpen, onClose }: OrderFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        address: "",
        customs_id: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { error } = await supabase.from("orders").insert([
                {
                    name: formData.name,
                    contact: formData.contact,
                    address: formData.address,
                    customs_id: formData.customs_id || null,
                    product_name: product.name,
                    product_id: product.id,
                    price: product.price,
                },
            ])

            if (error) throw error

            toast.success("주문이 접수되었습니다! 결제 안내를 위해 카카오로 연락해 주세요.")
            onClose()
            // Reset form
            setFormData({ name: "", contact: "", address: "", customs_id: "" })

            // Redirect to Kakao after a short delay or just let the user click
            setTimeout(() => {
                window.open("https://open.kakao.com/o/seH2Jkhi", "_blank")
            }, 1500)

        } catch (error: any) {
            console.error("Order error:", error)
            toast.error("주문 접수 중 오류가 발생했습니다.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">주문하기</DialogTitle>
                    <DialogDescription>
                        주문 정보를 입력해 주세요. 결제는 주문 접수 후 카카오톡 상담을 통해 진행됩니다.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="product_name">주문제품명</Label>
                        <Input id="product_name" value={product.name} disabled className="bg-secondary/50" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">성함</Label>
                        <Input
                            id="name"
                            required
                            placeholder="본 함을 입력해 주세요"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact">연락처</Label>
                        <Input
                            id="contact"
                            required
                            placeholder="010-0000-0000"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">주소</Label>
                        <Input
                            id="address"
                            required
                            placeholder="배송지 주소를 입력해 주세요"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="customs_id">개인통관번호 (없을시 비움)</Label>
                        <Input
                            id="customs_id"
                            placeholder="P로 시작하는 13자리 번호"
                            value={formData.customs_id}
                            onChange={(e) => setFormData({ ...formData, customs_id: e.target.value })}
                        />
                    </div>
                    <Button type="submit" className="w-full bg-foreground font-bold" disabled={isLoading}>
                        {isLoading ? "처리 중..." : "주문 완료"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
