"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false })
        if (data && !error) {
          setReviews(data)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchReviews()
  }, [])

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center text-xs italic text-muted-foreground">불러오는 중...</div>
  }

  return (
    <div className="px-4 py-12">
      <h1 className="text-lg font-bold tracking-tight text-foreground">리뷰</h1>
      <div className="mt-8 flex flex-col">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="border-b border-foreground/10 py-6 first:pt-0"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">
                {review.author}
              </span>
              <time className="text-[10px] font-medium tracking-wider text-muted-foreground">
                {review.date}
              </time>
            </div>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {review.product}
            </p>
            <div className="mt-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${i < review.rating
                    ? "text-foreground"
                    : "text-foreground/20"
                    }`}
                >
                  &#9733;
                </span>
              ))}
            </div>
            {review.image_url && (
              <div className="mt-4 relative aspect-square w-full sm:w-1/2 overflow-hidden border border-foreground/10 bg-secondary">
                <Image
                  src={review.image_url}
                  alt={`${review.author}의 리뷰 이미지`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {review.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
