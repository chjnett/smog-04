"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { X } from "lucide-react"

interface PopupNotice {
    id: string
    title: string
    content: string
    date: string
}

export function NoticePopup() {
    const [notice, setNotice] = useState<PopupNotice | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        async function fetchPopupNotice() {
            // Check localStorage for "hide until" timestamp
            const hideUntil = localStorage.getItem("notice_popup_hide_until")
            if (hideUntil && new Date().getTime() < parseInt(hideUntil)) {
                return
            }

            const { data, error } = await supabase
                .from("notices")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(10)

            if (data && data.length > 0 && !error) {
                const today = new Date().toISOString().split("T")[0]
                // Filter for popup notices with valid exposure dates
                const active = data.find((n: any) => {
                    if (n.is_popup === false) return false
                    const inRange = (!n.start_date || n.start_date <= today) && (!n.end_date || n.end_date >= today)
                    const notDismissed = localStorage.getItem("notice_popup_dismissed_id") !== n.id
                    return inRange && notDismissed
                })
                if (!active) return

                setNotice(active)
                // Small delay for smooth entrance animation
                setTimeout(() => setIsVisible(true), 100)
            }
        }
        fetchPopupNotice()
    }, [])

    function handleClose() {
        setIsVisible(false)
        setTimeout(() => setNotice(null), 300)
    }

    function handleHideFor24Hours() {
        const hideUntil = new Date().getTime() + 24 * 60 * 60 * 1000
        localStorage.setItem("notice_popup_hide_until", hideUntil.toString())
        if (notice) {
            localStorage.setItem("notice_popup_dismissed_id", notice.id)
        }
        handleClose()
    }

    if (!notice) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
                onClick={handleClose}
            />
            {/* Popup */}
            <div
                className={`fixed inset-x-4 top-1/2 z-[9999] mx-auto max-w-md -translate-y-1/2 transition-all duration-300 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
            >
                <div className="relative border border-foreground/10 bg-background shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">공지사항</span>
                        <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                            <X className="size-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-5 py-6">
                        <h3 className="text-base font-bold text-foreground">{notice.title}</h3>
                        <p className="mt-1 text-[10px] font-medium text-muted-foreground">{notice.date}</p>
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{notice.content}</p>
                    </div>

                    {/* Footer */}
                    <div className="flex border-t border-foreground/10">
                        <button
                            onClick={handleHideFor24Hours}
                            className="flex-1 py-3.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:bg-secondary/50 transition-colors"
                        >
                            오늘 하루 보지 않기
                        </button>
                        <div className="w-px bg-foreground/10" />
                        <button
                            onClick={handleClose}
                            className="flex-1 py-3.5 text-[10px] font-bold uppercase tracking-wider text-foreground hover:bg-secondary/50 transition-colors"
                        >
                            확인
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
