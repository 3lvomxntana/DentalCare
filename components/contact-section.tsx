"use client"

import type React from "react"
import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ScrollReveal } from "@/components/scroll-reveal"

const contactInfo = [
  {
    icon: MapPin,
    label: "Visit Us",
    value: "123 Dental Street, Nairobi, Kenya",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+254 700 000 000",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@dentalcare.co.ke",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Sat: 8AM - 6PM",
  },
]

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>(
    { type: "idle" },
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const validate = (values: typeof formState) => {
    const errs: Record<string, string> = {}
    if (!values.name.trim()) errs.name = "Please enter your name"
    if (!values.email.trim()) errs.email = "Please enter your email"
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) errs.email = "Please enter a valid email"
    if (!values.message.trim()) errs.message = "Please enter a message"
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ type: "idle" })
    const validation = validate(formState)
    setErrors(validation)
    const firstError = Object.keys(validation)[0]
    if (firstError) {
      setFocusedField(firstError)
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "Failed to send message")
      }

      setStatus({ type: "success", message: "Message sent — we will get back to you shortly." })
      setFormState({ name: "", email: "", phone: "", message: "" })
      setErrors({})
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setStatus({ type: "error", message: message || "Something went wrong" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 lg:py-32 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <span className="inline-block text-primary text-sm font-medium uppercase tracking-widest mb-4">
              Contact
            </span>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-balance">
              Ready to experience our services?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-4 text-lg text-muted-foreground">
              {"Let's start planning your journey to a healthier smile."}
            </p>
          </ScrollReveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <div>
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((item, index) => (
                <ScrollReveal key={item.label} delay={(index + 3) * 100}>
                  <div className="group p-6 rounded-2xl bg-card border border-border/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                      <item.icon className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground">{item.label}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{item.value}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Map removed per request */}
          </div>

          {/* Contact Form */}
          <ScrollReveal delay={300} direction="right">
            <form
              onSubmit={handleSubmit}
              className="p-8 md:p-10 rounded-3xl bg-card border border-border/50 shadow-xl shadow-primary/5"
            >
              {status.type !== "idle" && (
                <div
                  role="status"
                  className={cn(
                    "mb-6 p-3 rounded-md text-sm",
                    status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800",
                  )}
                >
                  {status.message}
                </div>
              )}
              <h3 className="text-2xl font-serif font-semibold text-foreground mb-2">Send us a message</h3>
              <p className="text-muted-foreground mb-8">{"We'll get back to you within 24 hours."}</p>

              <div className="space-y-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      "h-14 px-4 bg-secondary/50 border-border/50 transition-all duration-300",
                      "focus:border-primary focus:ring-2 focus:ring-primary/20",
                      focusedField === "name" && "border-primary ring-2 ring-primary/20",
                      errors.name && "border-destructive text-destructive",
                    )}
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="mt-2 text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      "h-14 px-4 bg-secondary/50 border-border/50 transition-all duration-300",
                      "focus:border-primary focus:ring-2 focus:ring-primary/20",
                      focusedField === "email" && "border-primary ring-2 ring-primary/20",
                      errors.email && "border-destructive text-destructive",
                    )}
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="mt-2 text-sm text-destructive">{errors.email}</p>}
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      "h-14 px-4 bg-secondary/50 border-border/50 transition-all duration-300",
                      "focus:border-primary focus:ring-2 focus:ring-primary/20",
                      focusedField === "phone" && "border-primary ring-2 ring-primary/20",
                    )}
                    disabled={isSubmitting}
                  />
                </div>

                <Textarea
                  placeholder="Tell us about your dental needs..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  rows={5}
                  className={cn(
                    "px-4 py-4 bg-secondary/50 border-border/50 transition-all duration-300 resize-none",
                    "focus:border-primary focus:ring-2 focus:ring-primary/20",
                    focusedField === "message" && "border-primary ring-2 ring-primary/20",
                    errors.message && "border-destructive text-destructive",
                  )}
                  disabled={isSubmitting}
                />
                {errors.message && <p className="mt-2 text-sm text-destructive">{errors.message}</p>}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="w-full h-14 group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Button>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
