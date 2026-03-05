import { NextResponse } from "next/server"
import { adminDatabases } from "@/lib/appwrite-server"
import { getSessionUser, getProfileRole } from "@/lib/server-auth"
import { ID } from "appwrite"

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

export async function GET() {
  try {
    // Support multiple env var names (some users set NEXT_PUBLIC_ variants)
    const dbId = process.env.APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
    const staffCollection = process.env.APPWRITE_STAFF_COLLECTION_ID || process.env.NEXT_PUBLIC_APPWRITE_STAFF_COLLECTION_ID

    if (!dbId || !staffCollection) {
      return NextResponse.json({ ok: false, message: "Appwrite staff collection not configured (set APPWRITE_STAFF_COLLECTION_ID)" }, { status: 400 })
    }

    const res = await adminDatabases.listDocuments(dbId, staffCollection)
    return NextResponse.json({ ok: true, staff: res.documents })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

type StaffBody = {
  name: string
  email: string
  password?: string
  role?: string
}

export async function POST(req: Request) {
  try {
    let body: StaffBody | null = null
    try {
      // parse body safely to provide clearer errors on malformed JSON
      const text = await req.text()
      body = text ? JSON.parse(text) : null
    } catch (err) {
      console.error('Invalid JSON in /api/staff POST:', err)
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
    }
    if (!body.name || !body.email) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }
    const dbId = process.env.APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
    const staffCollection = process.env.APPWRITE_STAFF_COLLECTION_ID || process.env.NEXT_PUBLIC_APPWRITE_STAFF_COLLECTION_ID

    // Authorization: only admin can create receptionists; receptionist or admin can create doctors
    const sessionUser = await getSessionUser(req)
    if (!sessionUser || !sessionUser.$id) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
    }
    const callerRole = await getProfileRole(sessionUser.$id)

    // If creating receptionist: only admin allowed
    if (body.role === 'receptionist' && callerRole !== 'admin') {
      return NextResponse.json({ ok: false, message: 'Forbidden: only admin can create receptionists' }, { status: 403 })
    }
    // If creating doctor: allow admin or receptionist
    if (body.role === 'doctor' && callerRole !== 'admin' && callerRole !== 'receptionist') {
      return NextResponse.json({ ok: false, message: 'Forbidden: only admin or receptionist can create doctors' }, { status: 403 })
    }

    if (!dbId || !staffCollection) {
      console.log("Create staff (demo):", body)
      return NextResponse.json({ ok: false, message: "Appwrite staff collection not configured" }, { status: 400 })
    }

    // If Appwrite admin REST is configured, create a real Appwrite user and then a staff profile
    if (ENDPOINT && DB && PROJECT && KEY) {
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

      // create staff profile document using adminDatabases but set document id to appUserId for consistency
      const staffDoc = await adminDatabases.createDocument(dbId, staffCollection, appUserId, {
        userId: appUserId,
        name: body.name,
        email: body.email,
        role: body.role || "staff",
        createdAt: new Date().toISOString(),
      })

      return NextResponse.json({ ok: true, userId: appUserId, staffId: staffDoc.$id, user: userRes })
    }

    // Fallback: create a staff profile doc and generate an id for the staff user
    const generatedUserId = ID.unique()
    const staffDoc = await adminDatabases.createDocument(dbId, staffCollection, ID.unique(), {
      userId: generatedUserId,
      name: body.name,
      email: body.email,
      role: body.role || "staff",
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true, userId: generatedUserId, staffId: staffDoc.$id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
