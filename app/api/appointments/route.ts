import { NextResponse } from "next/server"
import { adminDatabases } from "@/lib/appwrite-server"
import { ID } from "appwrite"
import { Query } from "appwrite"

type AppointmentBody = {
  name: string
  email: string
  phone?: string
  service: string
  doctor: string
  date: string
  time: string
  notes?: string
}

export async function POST(req: Request) {
  try {
    const body: AppointmentBody = await req.json()

    // Basic validation
    if (!body.name || !body.email || !body.service || !body.doctor || !body.date || !body.time) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const dbId = process.env.APPWRITE_DATABASE_ID
    const appointmentsCollection = process.env.APPWRITE_APPOINTMENTS_COLLECTION_ID

    if (!dbId || !appointmentsCollection) {
      // Fallback: log and return success for demo
      console.log("Appointment created (demo):", body)
      return NextResponse.json({ ok: true })
    }

    // Attempt to read owner id (set by client when logged-in)
    const ownerId = (req.headers.get("x-appwrite-user-id") || "") as string

    const docData = {
      ...body,
      patientId: ownerId || null,
      status: "pending",
      createdAt: new Date().toISOString(),
    }


    let permissions: string[] | undefined = undefined
    if (ownerId) {
      permissions = [
        `read("user:${ownerId}")`,
        `read("role:staff")`,
        `write("role:staff")`,
      ]
    }

    let res
    try {
      if (permissions) {
        try {
          res = await adminDatabases.createDocument(dbId, appointmentsCollection, ID.unique(), docData, permissions)
        } catch (err) {
          console.warn("Create document with permissions failed, retrying without permissions:", err)
          // Fallback: try without permissions (server-side enforcement will be used for updates)
          res = await adminDatabases.createDocument(dbId, appointmentsCollection, ID.unique(), docData)
        }
      } else {
        res = await adminDatabases.createDocument(dbId, appointmentsCollection, ID.unique(), docData)
      }
    } catch (err) {
      console.error("Failed to create appointment document:", err)
      return NextResponse.json({ message: "Failed to create appointment" }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: res.$id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const dbId = process.env.APPWRITE_DATABASE_ID
    const appointmentsCollection = process.env.APPWRITE_APPOINTMENTS_COLLECTION_ID
    const staffCollection = process.env.APPWRITE_STAFF_COLLECTION_ID

    if (!dbId || !appointmentsCollection || !staffCollection) {
      // Appwrite not configured: return a safe demo response for local/dev.
      console.warn("Appwrite not configured - returning demo empty appointments")
      return NextResponse.json({ ok: true, appointments: [] })
    }

    const userId = req.headers.get("x-appwrite-user-id") || ""
    const userEmail = req.headers.get("x-appwrite-user-email") || ""

    if (!userId && !userEmail) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check staff membership
    const staffList = await adminDatabases.listDocuments(dbId, staffCollection)
    const isStaff = (staffList?.documents || []).some((d: any) => d.userId === userId)

    let res
    if (isStaff) {
      res = await adminDatabases.listDocuments(dbId, appointmentsCollection)
    } else {
      // Prefer querying by patientId; fall back to email match
      try {
        res = await adminDatabases.listDocuments(dbId, appointmentsCollection, [Query.equal("patientId", userId)])
        // If no documents and we have an email, try email filter
        if ((!res.documents || res.documents.length === 0) && userEmail) {
          res = await adminDatabases.listDocuments(dbId, appointmentsCollection, [Query.equal("email", userEmail)])
        }
      } catch (err) {
        // Last resort: list all and filter
        const all = await adminDatabases.listDocuments(dbId, appointmentsCollection)
        const docs = (all?.documents || []).filter((d: any) => d.patientId === userId || d.email === userEmail)
        res = { documents: docs }
      }
    }

    return NextResponse.json({ ok: true, appointments: res.documents || [] })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
