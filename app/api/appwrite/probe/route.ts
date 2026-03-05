import { NextResponse } from "next/server"
import { adminDatabases } from "@/lib/appwrite-server"

export async function GET() {
  try {
    const dbId = process.env.APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
    const staffCollection = process.env.APPWRITE_STAFF_COLLECTION_ID || process.env.NEXT_PUBLIC_APPWRITE_STAFF_COLLECTION_ID

    if (!dbId || !staffCollection) {
      return NextResponse.json({ 
        ok: false, 
        message: "Appwrite database or staff collection ID not configured" 
      }, { status: 400 })
    }

    // Try to list a small number of documents to test access
    const res = await adminDatabases.listDocuments(dbId, staffCollection)
    
    // @ts-ignore
    const count = (res.documents || []).length

    return NextResponse.json({ ok: true, count, message: "Connection successful" })
  } catch (err: any) {
    console.error("Appwrite probe failed:", err)
    return NextResponse.json({ 
      ok: false, 
      message: err?.message || "Probe failed to connect to Appwrite" 
    }, { status: 500 })
  }
}