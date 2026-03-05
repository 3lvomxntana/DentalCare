import { NextResponse } from "next/server"
import { adminDatabases } from "@/lib/appwrite-server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const DB = process.env.APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
    const usersCollection = process.env.APPWRITE_USERS_COLLECTION_ID || process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users'
    if (!DB) {
      return NextResponse.json({ ok: false, message: "Appwrite DB not configured" }, { status: 500 })
    }

    const userId = params.id
    const doc = await adminDatabases.getDocument(DB, usersCollection, userId)
    return NextResponse.json({ ok: true, profile: doc })
  } catch (err: any) {
    console.error("GET /api/users/[id] failed:", err)
    return NextResponse.json({ ok: false, message: err?.message || String(err) }, { status: 500 })
  }
}
