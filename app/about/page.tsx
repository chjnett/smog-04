"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function AboutPage() {
  const [content, setContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAbout() {
      try {
        const { data, error } = await supabase.from("about").select("*").single()
        if (data && !error) {
          setContent(data)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchAbout()
  }, [])

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center text-xs italic text-muted-foreground">불러오는 중...</div>
  }

  if (!content) return null

  return (
    <div className="px-4 py-12">
      <h1 className="text-lg font-bold tracking-tight text-foreground">소개</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {content.description}
      </p>
      <div className="mt-8 flex flex-col gap-6">
        <div className="border border-foreground/10 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
            {content.mission_title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {content.mission_content}
          </p>
        </div>
        <div className="border border-foreground/10 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
            {content.contact_title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {content.contact_content}
          </p>
        </div>
      </div>
    </div>
  )
}
