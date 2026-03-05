import { NextResponse } from "next/server"
import { adminDatabases } from "@/lib/appwrite-server"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const { status } = body || {}

  if (!status) return NextResponse.json({ message: "Missing status" }, { status: 400 })

  const userId = req.headers.get("x-appwrite-user-id")
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const dbId = process.env.APPWRITE_DATABASE_ID
  const staffCollection = process.env.APPWRITE_STAFF_COLLECTION_ID
  const appointmentsCollection = process.env.APPWRITE_APPOINTMENTS_COLLECTION_ID

  if (!dbId || !staffCollection || !appointmentsCollection) {
    return NextResponse.json({ message: "Appwrite not configured" }, { status: 500 })
  }

  try {
    // Check if user is staff
    const staffList = await adminDatabases.listDocuments(dbId, staffCollection)
    const isStaff = (staffList?.documents || []).some((d: any) => d.userId === userId)
    if (!isStaff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    // Update appointment status
    await adminDatabases.updateDocument(dbId, appointmentsCollection, id, { status })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
