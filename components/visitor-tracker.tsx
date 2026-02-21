"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function VisitorTracker() {
    useEffect(() => {
        async function trackVisit() {
            try {
                const tracked = sessionStorage.getItem("visitor_tracked")
                if (tracked) return

                const today = new Date().toISOString().split("T")[0]

                const { data: existing } = await supabase
                    .from("visitor_stats")
                    .select("*")
                    .eq("date", today)
                    .single()

                if (existing) {
                    await supabase
                        .from("visitor_stats")
                        .update({ count: existing.count + 1 })
                        .eq("date", today)
                } else {
                    await supabase
                        .from("visitor_stats")
                        .insert([{ date: today, count: 1 }])
                }

                sessionStorage.setItem("visitor_tracked", "true")
            } catch {
                // visitor_stats table may not exist yet
            }
        }

        trackVisit()
    }, [])

    return null
}
