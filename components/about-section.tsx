"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
const ScrollReveal = dynamic(() => import("@/components/scroll-reveal").then((m) => m.ScrollReveal), { ssr: false })
import { AnimatedCounter } from "@/components/animated-counter"

const features = [
  "State-of-the-art equipment",
  "Experienced dental professionals",
  "Comfortable, relaxing environment",
  "Flexible payment options",
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Grid */}
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden group">
                    <img
                      src="/dentist-examining-patient-in-modern-clinic-profess.jpg"
                      alt="Dentist examining patient"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden group">
                    <img
                      src="/dental-equipment-and-tools-clean-modern-medical.jpg"
                      alt="Dental equipment"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="pt-8 space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden group">
                    <img
                      src="/happy-patient-smiling-after-dental-treatment-satis.jpg"
                      alt="Happy patient"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden group">
                    <img
                      src="/modern-dental-clinic-waiting-room-comfortable-inte.jpg"
                      alt="Clinic interior"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>
              </div>

              {/* Experience badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-6 rounded-2xl shadow-2xl">
                <AnimatedCounter end={15} suffix="+" label="Years of Excellence" className="text-center" />
              </div>
            </div>
          </ScrollReveal>

          {/* Content */}
          <div>
            <ScrollReveal delay={100}>
              <span className="inline-block text-primary text-sm font-medium uppercase tracking-widest mb-4">
                About Us
              </span>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-balance">
                Dedicated to your dental health and comfort
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                At dentalcare, we believe everyone deserves access to quality dental care. Our mission is to
                provide exceptional treatment in a warm, welcoming environment where patients feel comfortable and
                confident.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                From routine checkups to complex procedures, our team of experienced professionals uses the latest
                technology to ensure the best possible outcomes for every patient.
              </p>
            </ScrollReveal>

            {/* Features */}
            <ScrollReveal delay={500}>
              <ul className="mt-8 space-y-4">
                {features.map((feature, index) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 group cursor-default"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                      <Check className="w-3.5 h-3.5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                    </div>
                    <span className="text-foreground transition-colors duration-300 group-hover:text-primary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal delay={600}>
              <div className="mt-10">
                <Link href="/about" aria-label="Learn Our Story — read about our founding and values">
                  <Button
                    size="lg"
                    asChild
                    className="group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 active:scale-95"
                  >
                    <span className="flex items-center gap-2">
                      Learn Our Story
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Button>
                </Link>

                <p className="mt-3 text-sm text-muted-foreground max-w-xl">
                  Learn about our journey and values — how dentalcare started, our commitment to modern,
                  evidence-based dentistry, patient safety practices, community outreach, and the services we
                  prioritize to deliver compassionate care.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
