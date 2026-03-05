import { NextResponse } from "next/server"

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT
const PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT
const DB = process.env.APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const KEY = process.env.APPWRITE_API_KEY

async function api(path: string, method = "GET", body?: any) {
  const url = `${ENDPOINT?.replace(/\/$/, "")}${path}`
  const opts: any = { method, headers: { "X-Appwrite-Project": PROJECT || "", "X-Appwrite-Key": KEY || "", "Content-Type": "application/json" } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(url, opts)
  const text = await res.text()
  let json = null
  try { json = JSON.parse(text) } catch (e) { }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`)
  return json
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const email = url.searchParams.get("email")
    if (!email) return NextResponse.json({ ok: false, message: "Missing email" }, { status: 400 })

    if (!ENDPOINT || !DB || !PROJECT || !KEY) return NextResponse.json({ ok: false, message: "Appwrite admin REST not configured" }, { status: 500 })

    const usersCollection = process.env.APPWRITE_USERS_COLLECTION_ID || process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users'

    try {
      const filter = encodeURIComponent(`email=${email}`)
      const path = `/databases/${DB}/collections/${usersCollection}/documents?queries[]=${filter}`
      const res = await api(path)
      const doc = (res?.documents || [])[0] || null
      return NextResponse.json({ ok: true, profile: doc })
    } catch (err: any) {
      return NextResponse.json({ ok: false, message: err?.message || String(err) }, { status: 500 })
    }
  } catch (err: any) {
    console.error('/api/users/by-email GET failed', err)
    return NextResponse.json({ ok: false, message: err?.message || String(err) }, { status: 500 })
  }
}
