"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
const ScrollReveal = dynamic(() => import("@/components/scroll-reveal").then((m) => m.ScrollReveal), { ssr: false })

const testimonials = [
  {
    name: "Grace Wanjiku",
    role: "Business Owner",
    content:
      "The team at dentalcare made me feel so comfortable. My smile has never looked better! The whole experience was seamless from booking to treatment.",
    rating: 5,
    image: "/african-woman-professional-headshot-smiling.png",
  },
  {
    name: "Peter Njoroge",
    role: "Teacher",
    content:
      "I was nervous about my procedure, but Dr. Kimani explained everything clearly and made the process painless. Highly recommend to anyone looking for quality dental care.",
    rating: 5,
    image: "/african-man-professional-headshot-smiling.jpg",
  },
  {
    name: "Fatima Ali",
    role: "Software Developer",
    content:
      "Best dental experience I've ever had. The clinic is modern, clean, and the staff is incredibly professional. My family now comes here exclusively.",
    rating: 5,
    image: "/african-woman-hijab-professional-headshot-smiling.jpg",
  },
  {
    name: "John Kamau",
    role: "Entrepreneur",
    content:
      "From emergency care to routine checkups, they've always delivered exceptional service. The online booking system is super convenient too!",
    rating: 5,
    image: "/african-man-business-casual-headshot-smiling.jpg",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const navigate = (direction: "prev" | "next") => {
    if (isAnimating) return
    setIsAnimating(true)

    if (direction === "prev") {
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
    } else {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
    }

    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <section id="testimonials" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <span className="inline-block text-primary text-sm font-medium uppercase tracking-widest mb-4">
              Testimonials
            </span>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-balance">
              What our patients say about us
            </h2>
          </ScrollReveal>
        </div>

        {/* Testimonial Carousel */}
        <ScrollReveal delay={200}>
          <div className="relative max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 md:p-12 shadow-xl">
              {/* Quote icon */}
              <Quote className="absolute top-8 right-8 w-16 h-16 text-primary/10" />

              {/* Content */}
              <div
                key={currentIndex}
                className={cn(
                  "transition-all duration-500",
                  isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0",
                )}
              >
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed font-medium">
                  &quot;{testimonials[currentIndex].content}&quot;
                </blockquote>

                <div className="mt-8 flex items-center gap-4">
                  <img
                    src={testimonials[currentIndex].image || "/placeholder.svg"}
                    alt={testimonials[currentIndex].name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonials[currentIndex].name}</div>
                    <div className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => navigate("prev")}
                className="p-3 rounded-full border border-border bg-card text-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-90"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isAnimating) {
                        setIsAnimating(true)
                        setCurrentIndex(index)
                        setTimeout(() => setIsAnimating(false), 500)
                      }
                    }}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => navigate("next")}
                className="p-3 rounded-full border border-border bg-card text-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-90"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
