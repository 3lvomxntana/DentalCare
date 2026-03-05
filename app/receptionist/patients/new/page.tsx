"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function NewPatientPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [dob, setDob] = useState("")
  const [medicalHistory, setMedicalHistory] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const validate = () => {
    if (!name.trim() || !email.trim()) {
      setMessage("Name and email are required")
      return false
    }
    // basic email check
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setMessage("Enter a valid email address")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, dob, medicalHistory, password }),
      })
      const json = await res.json()
      if (res.ok) {
        setMessage('Patient created successfully')
        // optionally redirect to patient list or clear form
        setName('')
        setEmail('')
        setPhone('')
        setDob('')
        setMedicalHistory('')
        setPassword('')
        // small delay then go back
        setTimeout(() => router.push('/staff/dashboard'), 1000)
      } else {
        setMessage(json?.message || 'Failed to create patient')
      }
    } catch (err) {
      console.error(err)
      setMessage('Server error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Register New Patient</h1>
        <Link href="/staff/dashboard" className="text-sm text-muted-foreground">Back to dashboard</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Full name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <Label>Date of birth</Label>
          <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div>
          <Label>Medical history</Label>
          <textarea value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} className="w-full rounded-md border p-2" />
        </div>
        <div>
          <Label>Password (optional)</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {message && <p className="text-sm text-muted-foreground">{message}</p>}

        <div className="flex gap-2">
          <Button type="submit">{submitting ? 'Creating…' : 'Create Patient'}</Button>
          <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
