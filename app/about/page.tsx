import React from "react"

export const metadata = {
  title: "About — dentalcare",
  description: "Learn about dentalcare: our history, mission, team, and community work.",
}

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-serif font-semibold mb-6">Our Story</h1>

      <section className="prose prose-lg">
        <p>
          dentalcare was founded with a single, clear mission: to make modern, evidence-based dental care
          accessible and welcoming. Over the years we've grown into a multidisciplinary clinic where patient
          comfort, safety, and education come first.
        </p>

        <h2>Our Mission</h2>
        <p>
          We provide compassionate care using up-to-date techniques and technology. We focus on prevention,
          restorative treatments, and cosmetic options so patients can make informed choices about their
          oral health.
        </p>

        <h2>Our Team</h2>
        <p>
          Our dentists, hygienists, and support staff bring decades of combined experience in general and
          specialty dentistry. We prioritize continuous education and maintain a friendly, patient-first
          environment.
        </p>

        <h2>Community & Outreach</h2>
        <p>
          We partner with local schools and organizations to provide preventive screenings and oral-health
          education. We also offer flexible payment options and work to reduce barriers to care.
        </p>

        <h2>Patient Safety</h2>
        <p>
          Infection control and patient comfort are top priorities. We follow industry-standard sterilization
          protocols and use modern equipment to ensure safe and effective treatments.
        </p>

        <h2>Contact & Visits</h2>
        <p>
          To book an appointment, use the booking interface on the site or call our reception desk. New
          patients are welcome — bring your previous dental records if available.
        </p>
      </section>
    </main>
  )
}
