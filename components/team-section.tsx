"use client"

import { Linkedin, Mail } from "lucide-react"
import dynamic from "next/dynamic"
const ScrollReveal = dynamic(() => import("@/components/scroll-reveal").then((m) => m.ScrollReveal), { ssr: false })

const team = [
  {
    name: "Dentist",
    role: "Lead Dentist",
    image: "/professional-female-dentist-portrait-friendly-smil.jpg",
    specialization: "Cosmetic Dentistry",
  },
  {
    name: "Dr. James Ochieng",
    role: "Oral Surgeon",
    image: "/professional-male-dentist-portrait-confident-medic.jpg",
    specialization: "Implant Surgery",
  },
  {
    name: "Dr. Amina Hassan",
    role: "Pediatric Dentist",
    image: "/professional-female-pediatric-dentist-portrait-war.jpg",
    specialization: "Children's Care",
  },
  {
    name: "Dr. David Mwangi",
    role: "Orthodontist",
    image: "/professional-male-orthodontist-portrait-friendly-m.jpg",
    specialization: "Braces & Aligners",
  },
]

export function TeamSection() {
  return (
    <section id="team" className="py-24 lg:py-32 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <span className="inline-block text-primary text-sm font-medium uppercase tracking-widest mb-4">
              Meet the Team
            </span>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-balance">
              Expert care from passionate professionals
            </h2>
          </ScrollReveal>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <ScrollReveal key={member.name} delay={(index + 2) * 100} direction="scale">
              <div className="group">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Social links */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <button className="p-2 rounded-full bg-card/90 backdrop-blur-sm text-card-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground active:scale-90">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-card/90 backdrop-blur-sm text-card-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground active:scale-90">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-medium mt-1">{member.role}</p>
                  <p className="text-muted-foreground text-sm mt-2">{member.specialization}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
