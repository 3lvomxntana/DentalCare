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
  try { json = JSON.parse(text) } catch (e) { /* ignore */ }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`)
  return json
}

export async function POST(req: Request) {
  try {
    if (!ENDPOINT || !PROJECT || !KEY || !DB) {
      return NextResponse.json({ ok: false, message: "Server Appwrite not configured (missing APPWRITE_API_KEY/DB)" }, { status: 400 })
    }

    const body = await req.json()
    const { name, email, password, role } = body
    if (!name || !email) return NextResponse.json({ ok: false, message: "Missing name or email" }, { status: 400 })

    const tempUserId = `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`

    // Creating Appwrite user via admin REST API
    let userRes: any
    try {
      userRes = await api(`/users`, 'POST', { userId: tempUserId, email, password: password || Math.random().toString(36).slice(-8), name })
    } catch (e: any) {
      // If user already exists, return a 409 with a friendly message
      if (String(e?.message || "").includes('user_already_exists') || String(e?.message || "").includes('409')) {
        return NextResponse.json({ ok: false, message: 'User already exists' }, { status: 409 })
      }
      throw e
    }

    // Use Appwrite's returned user id for the profile document id to keep them in sync
    const appUserId = userRes.$id || tempUserId

    // Create profile document in users collection
    const usersCollection = process.env.APPWRITE_USERS_COLLECTION_ID || 'users'
    // Avoid sending unknown attributes to the collection schema (some collections may not have a userId field)
    const docBody = { documentId: appUserId, data: { name, email, role: role || 'patient', createdAt: new Date().toISOString() } }
    const profileRes = await api(`/databases/${DB}/collections/${usersCollection}/documents`, 'POST', docBody)

    return NextResponse.json({ ok: true, user: userRes, profile: profileRes })
  } catch (err: any) {
    console.error('Create user failed:', err)
    return NextResponse.json({ ok: false, message: err?.message || 'Failed to create user' }, { status: 500 })
  }
}
