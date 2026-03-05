"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import dynamic from "next/dynamic"
const ScrollReveal = dynamic(() => import("@/components/scroll-reveal").then((m) => m.ScrollReveal), { ssr: false })
import { AnimatedCounter } from "@/components/animated-counter"
import { MagneticButton } from "@/components/magnetic-button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <ScrollReveal delay={0}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 hover:bg-primary/20 transition-colors duration-300 cursor-default">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Premium Dental Care
              </span>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight text-balance">
                Your smile deserves{" "}
                <span className="text-primary relative inline-block">
                  exceptional
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path
                      d="M2 10C50 2 150 2 198 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-primary/30"
                    />
                  </svg>
                </span>{" "}
                care
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 text-pretty">
                Experience modern dentistry with a gentle touch. Our team combines expertise with compassion to deliver
                the beautiful, healthy smile you deserve.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <MagneticButton className="w-full sm:w-auto">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 active:scale-95"
                  >
                    <Link href="/book-appointment" className="relative z-10 flex items-center gap-2">
                      Book Your Visit
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </MagneticButton>
                <Link href="#services">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto group transition-all duration-300 hover:bg-muted active:scale-95 bg-transparent"
                  >
                    <span className="flex items-center gap-2">
                      View Services
                      <span className="w-1.5 h-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-150" />
                    </span>
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Animated Stats */}
            <ScrollReveal delay={400}>
              <div className="mt-16 grid grid-cols-3 gap-8">
                <AnimatedCounter end={15} suffix="+" label="Years Experience" delay={0} />
                <AnimatedCounter end={10000} suffix="+" label="Happy Patients" delay={200} />
                <AnimatedCounter end={98} suffix="%" label="Satisfaction" delay={400} />
              </div>
            </ScrollReveal>
          </div>

          {/* Image */}
          <ScrollReveal delay={200} direction="right">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden group">
              <img
                src="/modern-dental-clinic-interior-with-dentist-smiling.jpg"
                alt="Modern dental clinic"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />

              {/* Floating card */}
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-card/90 backdrop-blur-md rounded-2xl shadow-xl transition-all duration-500 group-hover:translate-y-[-4px] group-hover:shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-card-foreground">Next Available</div>
                    <div className="text-sm text-muted-foreground">Today, 2:30 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-widest animate-pulse">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent animate-bounce" />
      </div>
    </section>
  )
}
