import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { AboutSection } from "@/components/about-section"
import { TeamSection } from "@/components/team-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import ContactSectionClient from "@/components/contact-section.client"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TeamSection />
      <TestimonialsSection />
      <ContactSectionClient />
      <Footer />
    </main>
  )
}
