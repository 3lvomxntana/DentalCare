"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import dynamic from "next/dynamic"
const ScrollReveal = dynamic(() => import("@/components/scroll-reveal").then((m) => m.ScrollReveal), { ssr: false })

const footerLinks = {
  services: [
    { label: "Cosmetic Dentistry", href: "#" },
    { label: "Preventive Care", href: "#" },
    { label: "Restorative", href: "#" },
    { label: "Emergency Care", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Our Team", href: "#team" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#contact" },
  ],
  quickLinks: [
    { label: "Book Appointment", href: "/book-appointment" },
    { label: "Sign In", href: "/patient/login" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <ScrollReveal>
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">D</span>
                </div>
                <span className="font-serif text-xl font-semibold">
                  Dental<span className="text-primary">Care</span>
                </span>
              </Link>
              <p className="text-background/70 text-sm leading-relaxed max-w-xs">
                Your trusted partner for comprehensive dental care. Beautiful smiles start here.
              </p>

              {/* Social Links */}
              <div className="flex gap-3 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center transition-all duration-300 hover:bg-primary hover:scale-110 active:scale-95"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors duration-300 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors duration-300 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors duration-300 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors duration-300 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">© 2025 dentalcare. All rights reserved.</p>
          <p className="text-sm text-background/50">Dedicated to Creativity, Culture & Growth.</p>
        </div>
      </div>
    </footer>
  )
}
