"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#team", label: "Team" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#contact", label: "Contact" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        isScrolled ? "bg-card/80 backdrop-blur-lg shadow-sm border-b border-border/50" : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2 transition-transform duration-300 hover:scale-105">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight">
              Dental<span className="text-primary">Care</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-4/5" />
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+254700000000"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-primary"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden lg:inline">+254 700 000 000</span>
            </a>
            <Button asChild variant="outline" size="sm" className="gap-2 transition-all duration-300 hover:border-primary hover:text-primary active:scale-95 bg-transparent">
              <Link href="/patient/login" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Patient Login
              </Link>
            </Button>
            <Button asChild className="relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-95">
              <Link href="/book-appointment" className="relative">
                <span className="relative z-10">Book Appointment</span>
                <span className="absolute inset-0 bg-foreground/10 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
              </Link>
            </Button>
          </div>

          {/* Mobile: Login icon + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/patient/login">
              <button className="p-2 rounded-lg transition-colors duration-300 hover:bg-muted active:scale-95">
                <User className="w-5 h-5" />
              </button>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg transition-colors duration-300 hover:bg-muted active:scale-95"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={cn(
                    "absolute inset-0 w-6 h-6 transition-all duration-300",
                    isMobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0",
                  )}
                />
                <X
                  className={cn(
                    "absolute inset-0 w-6 h-6 transition-all duration-300",
                    isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90",
                  )}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-500 ease-out",
            isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <ul className="py-4 space-y-1">
            {navLinks.map((link, index) => (
              <li
                key={link.href}
                style={{ transitionDelay: `${index * 50}ms` }}
                className={cn(
                  "transition-all duration-300",
                  isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
                )}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-foreground rounded-lg transition-colors duration-300 hover:bg-muted"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-4 space-y-2">
              <Button asChild className="w-full active:scale-95 transition-transform duration-150">
                <Link href="/book-appointment" onClick={() => setIsMobileMenuOpen(false)}>
                  Book Appointment
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
