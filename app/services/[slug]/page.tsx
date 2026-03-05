import React from "react"
import { notFound } from "next/navigation"

const services = [
  {
    slug: "cosmetic-dentistry",
    title: "Cosmetic Dentistry",
    content:
      "Transform your smile with whitening, veneers, and aesthetic treatments. We create personalized plans that balance function and beauty.",
  },
  {
    slug: "preventive-care",
    title: "Preventive Care",
    content: "Regular checkups, cleanings, sealants, and patient education to keep your mouth healthy.",
  },
  {
    slug: "restorative",
    title: "Restorative",
    content: "Fillings, crowns, and implants to restore form and function while prioritizing long-term outcomes.",
  },
  {
    slug: "teeth-whitening",
    title: "Teeth Whitening",
    content: "Professional whitening options to safely brighten your smile under clinician supervision.",
  },
  {
    slug: "pediatric-dentistry",
    title: "Pediatric Dentistry",
    content: "Gentle, child-focused care that helps build positive early dental experiences and good oral hygiene habits.",
  },
  {
    slug: "emergency-care",
    title: "Emergency Care",
    content: "Same-day appointments for urgent dental needs, pain management, and triage for urgent conditions.",
  },
]

type Props = {
  params: {
    slug: string
  }
}

function getSlugFromParams(params: Props['params']) {
  if (!params) return undefined
  const raw = params.slug as unknown
  if (Array.isArray(raw)) return raw[0]
  if (typeof raw === 'string') return raw
  return undefined
}

export async function generateMetadata({ params }: Props) {
  try {
    const slug = getSlugFromParams(params)
    if (!slug) return { title: "Service — dentalcare" }
    const svc = services.find((s) => s.slug === slug)
    if (!svc) return { title: "Service — dentalcare" }
    return { title: `${svc.title} — dentalcare`, description: svc.content }
  } catch (e) {
    return { title: "Service — dentalcare" }
  }
}

export default function ServicePage({ params }: Props) {
  const slug = getSlugFromParams(params)
  if (!slug) return notFound()
  const svc = services.find((s) => s.slug === slug)
  if (!svc) return notFound()

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-serif font-semibold mb-4">{svc.title}</h1>
      <p className="text-lg text-muted-foreground mb-6">{svc.content}</p>

      <section className="prose prose-lg">
        <h2>What to expect</h2>
        <p>
          Our clinicians will assess your needs and discuss treatment options and costs. We prioritize oral health
          education and developing a plan that fits your goals and budget.
        </p>

        <h2>Preparing for your visit</h2>
        <p>
          Bring any relevant medical or dental history and arrive a few minutes early to complete new-patient forms.
        </p>

        <h2>Payment & Insurance</h2>
        <p>
          We accept major insurance plans and offer flexible payment options for elective procedures. Contact
          reception for details.
        </p>
      </section>
    </main>
  )
}
