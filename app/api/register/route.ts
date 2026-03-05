import { NextResponse } from "next/server"
import { getSessionUser, getProfileRole } from "@/lib/server-auth"

type RegisterBody = {
  name: string
  email: string
  phone?: string
  dob?: string
  password?: string
}

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
    const body: RegisterBody = await req.json()

    if (!body.name || !body.email) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Require authenticated session and that caller is receptionist or admin
    const sessionUser = await getSessionUser(req)
    if (!sessionUser || !sessionUser.$id) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
    }
    const callerRole = await getProfileRole(sessionUser.$id)
    if (!callerRole || (callerRole !== "receptionist" && callerRole !== "admin")) {
      return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 })
    }

    // If Appwrite not configured, return demo success
    if (!ENDPOINT || !DB || !PROJECT || !KEY || !process.env.APPWRITE_USERS_COLLECTION_ID) {
      console.log("Register (demo):", body)
      return NextResponse.json({ ok: true })
    }

    // Create Appwrite user via admin REST API
    const tempUserId = `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
    let userRes: any
    try {
      userRes = await api(`/users`, 'POST', { userId: tempUserId, email: body.email, password: body.password || Math.random().toString(36).slice(-8), name: body.name })
    } catch (e: any) {
      if (String(e?.message || "").includes('user_already_exists') || String(e?.message || "").includes('409')) {
        return NextResponse.json({ ok: false, message: 'User already exists' }, { status: 409 })
      }
      throw e
    }

    const appUserId = userRes.$id || tempUserId

    // Create profile document in users collection using Appwrite Databases REST
    const usersCollection = process.env.APPWRITE_USERS_COLLECTION_ID || 'users'
    const docBody = { documentId: appUserId, data: { name: body.name, email: body.email, phone: body.phone || null, dob: body.dob || null, role: 'patient', createdAt: new Date().toISOString() } }
    const profileRes = await api(`/databases/${DB}/collections/${usersCollection}/documents`, 'POST', docBody)

    return NextResponse.json({ ok: true, user: userRes, profile: profileRes })
  } catch (err: any) {
    console.error('Register failed:', err)
    return NextResponse.json({ message: err?.message || "Server error" }, { status: 500 })
  }
}
