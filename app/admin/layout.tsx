"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import type { User } from "@supabase/supabase-js"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setIsChecking(false)
    }
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsLoggingIn(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.")
    }
    setIsLoggingIn(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setEmail("")
    setPassword("")
  }

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xs text-muted-foreground">확인 중...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="border border-foreground/10 p-8">
            <h1 className="text-sm font-bold uppercase tracking-widest text-foreground text-center">
              Admin Login
            </h1>
            <p className="mt-2 text-xs text-muted-foreground text-center">
              관리자 계정으로 로그인하세요
            </p>
            <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
              <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError("") }}
                required
                autoFocus
              />
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError("") }}
                required
              />
              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="bg-foreground py-3 text-xs font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isLoggingIn ? "로그인 중..." : "로그인"}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <div className="border-b border-foreground/10 bg-background px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Admin
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}
