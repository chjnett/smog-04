"use client"

import { MessageCircle } from "lucide-react"

export function KakaoButton() {
    return (
        <a
            href="https://open.kakao.com/o/seH2Jkhi"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-4 z-50 flex items-center gap-2 rounded-full bg-[#FEE500] px-5 py-3 shadow-lg transition-transform hover:scale-105 active:scale-95"
            aria-label="카카오톡 문의하기"
        >
            <MessageCircle className="size-5 text-[#3C1E1E]" strokeWidth={2} />
            <span className="text-xs font-bold text-[#3C1E1E]">문의하기</span>
        </a>
    )
}
