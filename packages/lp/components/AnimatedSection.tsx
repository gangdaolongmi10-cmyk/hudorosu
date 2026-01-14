'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface AnimatedSectionProps {
    children: ReactNode
    className?: string
    delay?: number
    direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
}

export default function AnimatedSection({
    children,
    className = '',
    delay = 0,
    direction = 'fade',
}: AnimatedSectionProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true)
                    }, delay)
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [delay])

    return (
        <div
            ref={ref}
            className={`animated-section ${className} ${isVisible ? `animate-${direction}` : ''}`}
        >
            {children}
        </div>
    )
}
