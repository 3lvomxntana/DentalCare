"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sparkles, Smile, ShieldCheck, Stethoscope, Heart, Clock } from "lucide-react"
import dynamic from "next/dynamic"
const ScrollReveal = dynamic(() => import("@/components/scroll-reveal").then((m) => m.ScrollReveal), { ssr: false })

const services = [
  {
    icon: Smile,
    title: "Cosmetic Dentistry",
    description: "Transform your smile with whitening, veneers, and aesthetic treatments.",
  },
  {
    icon: ShieldCheck,
    title: "Preventive Care",
    description: "Regular checkups and cleanings to maintain optimal oral health.",
  },
  {
    icon: Stethoscope,
    title: "Restorative",
    description: "Fillings, crowns, and implants to restore function and beauty.",
  },
  {
    icon: Sparkles,
    title: "Teeth Whitening",
    description: "Professional whitening for a brighter, more confident smile.",
  },
  {
    icon: Heart,
    title: "Pediatric Dentistry",
    description: "Gentle, friendly care designed specifically for children.",
  },
  {
    icon: Clock,
    title: "Emergency Care",
    description: "Same-day appointments for urgent dental needs.",
  },
]

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="services" className="py-24 lg:py-32 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <span className="inline-block text-primary text-sm font-medium uppercase tracking-widest mb-4">
              Our Services
            </span>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-balance">
              Comprehensive dental care for your whole family
            </h2>
          </ScrollReveal>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const slug = service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
            return (
              <ScrollReveal key={service.title} delay={(index + 2) * 100}>
                <Link href={`/services/${slug}`} className="block" aria-label={`Learn more about ${service.title}: ${service.description}`}>
                  <div
                    role="link"
                    tabIndex={0}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={cn(
                      "group relative p-8 rounded-2xl bg-card border border-border/50 transition-all duration-500 cursor-pointer h-full",
                      "hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2",
                      hoveredIndex === index && "shadow-xl shadow-primary/5 border-primary/20 -translate-y-2",
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500",
                        "bg-primary/10 text-primary",
                        "group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3",
                      )}
                    >
                      <service.icon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <h3 className="mt-6 text-xl font-semibold text-card-foreground transition-colors duration-300 group-hover:text-primary">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{service.description}</p>

                    {/* Arrow indicator */}
                    <div className="mt-6 flex items-center gap-2 text-primary opacity-0 translate-x-[-8px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      <span className="text-sm font-medium">Learn more about {service.title}</span>
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>

                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
