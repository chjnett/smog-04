"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function NoticePage() {
  const [notices, setNotices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNotices() {
      try {
        const { data, error } = await supabase.from("notices").select("*").order("created_at", { ascending: false })
        if (data && !error) {
          setNotices(data)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotices()
  }, [])

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center text-xs italic text-muted-foreground">불러오는 중...</div>
  }

  return (
    <div className="px-4 py-12">
      <h1 className="text-lg font-bold tracking-tight text-foreground">
        공지사항
      </h1>
      <div className="mt-8 flex flex-col">
        {notices.map((notice, idx) => (
          <div
            key={idx}
            className="border-b border-foreground/10 py-6 first:pt-0"
          >
            <time className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {notice.date}
            </time>
            <h2 className="mt-2 text-base font-bold text-foreground">
              {notice.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {notice.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
