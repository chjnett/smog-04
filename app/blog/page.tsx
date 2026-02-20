"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })
        if (data && !error) {
          setPosts(data)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center text-xs italic text-muted-foreground">불러오는 중...</div>
  }

  return (
    <div className="px-4 py-12">
      <h1 className="text-lg font-bold tracking-tight text-foreground">
        블로그
      </h1>
      <div className="mt-8 flex flex-col">
        {posts.map((post, idx) => (
          <article
            key={idx}
            className="border-b border-foreground/10 py-6 first:pt-0"
          >
            <time className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {post.date}
            </time>
            <h2 className="mt-2 text-base font-bold text-foreground">
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
