"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const LINES = [
    { text: "Dint", className: "text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground" },
    { text: "명품 고퀄리티 전문", className: "text-sm sm:text-base font-medium text-muted-foreground mt-2" },
    { text: "아직도 국내배송 저퀄리티 비싸게 주고 사시나요?", className: "text-xs sm:text-sm text-muted-foreground mt-6" },
    { text: "퀄리티로 확실하게 보여드립니다.", className: "text-sm sm:text-lg font-bold text-foreground mt-2" },
    { text: "WWW.딘트.COM", className: "text-base sm:text-lg font-bold tracking-widest text-foreground mt-6" },
]

const TYPING_SPEED = 60
const LINE_DELAY = 400

export function HeroSection() {
    const [displayedLines, setDisplayedLines] = useState<string[]>([])
    const [currentLine, setCurrentLine] = useState(0)
    const [currentChar, setCurrentChar] = useState(0)
    const [showCursor, setShowCursor] = useState(true)

    // Typing effect
    useEffect(() => {
        if (currentLine >= LINES.length) return

        const line = LINES[currentLine].text

        if (currentChar < line.length) {
            const timer = setTimeout(() => {
                setDisplayedLines(prev => {
                    const updated = [...prev]
                    updated[currentLine] = line.slice(0, currentChar + 1)
                    return updated
                })
                setCurrentChar(prev => prev + 1)
            }, TYPING_SPEED)
            return () => clearTimeout(timer)
        } else {
            // Line complete, move to next after delay
            const timer = setTimeout(() => {
                setCurrentLine(prev => prev + 1)
                setCurrentChar(0)
                setDisplayedLines(prev => [...prev, ""])
            }, LINE_DELAY)
            return () => clearTimeout(timer)
        }
    }, [currentLine, currentChar])

    // Blinking cursor
    useEffect(() => {
        const timer = setInterval(() => setShowCursor(prev => !prev), 530)
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[16/9] md:aspect-[2/1]">
            <Image
                src="/hero-image.png"
                alt="Luxury Showroom"
                fill
                priority
                className="object-cover"
                sizes="100vw"
            />
            <div className="absolute inset-0 bg-background/60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                {LINES.map((line, idx) => (
                    <p key={idx} className={line.className}>
                        {displayedLines[idx] || ""}
                        {idx === currentLine && currentLine < LINES.length && (
                            <span
                                className={`inline-block w-[2px] h-[1em] bg-foreground ml-0.5 align-middle transition-opacity ${showCursor ? "opacity-100" : "opacity-0"}`}
                            />
                        )}
                    </p>
                ))}
            </div>
        </section>
    )
}
