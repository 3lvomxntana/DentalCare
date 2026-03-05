import { NextResponse } from "next/server"
import { adminDatabases } from "@/lib/appwrite-server"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const dbId = process.env.APPWRITE_DATABASE_ID
    const appointmentsCollection = process.env.APPWRITE_APPOINTMENTS_COLLECTION_ID
    const staffCollection = process.env.APPWRITE_STAFF_COLLECTION_ID

    if (!dbId || !appointmentsCollection || !staffCollection) {
      return NextResponse.json({ message: "Appwrite not configured" }, { status: 500 })
    }

    const userId = req.headers.get("x-appwrite-user-id") || ""
    const userEmail = req.headers.get("x-appwrite-user-email") || ""

    if (!userId && !userEmail) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const apt = await adminDatabases.getDocument(dbId, appointmentsCollection, id)
    if (!apt) return NextResponse.json({ message: "Not found" }, { status: 404 })

    // Check staff membership
    const staffList = await adminDatabases.listDocuments(dbId, staffCollection)
    const isStaff = (staffList?.documents || []).some((d: any) => d.userId === userId)

    const isOwner = apt.patientId === userId || apt.email === userEmail

    if (!isStaff && !isOwner) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    return NextResponse.json({ ok: true, appointment: apt })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ message: err?.message || "Server error" }, { status: 500 })
  }
}
