import { NextResponse } from "next/server"
import { adminDatabases } from "@/lib/appwrite-server"
import { ID } from "appwrite"

type ContactBody = {
  name: string
  email: string
  phone?: string
  message: string
}

export async function POST(req: Request) {
  try {
    const body: ContactBody = await req.json()

    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Basic server-side email validation
    if (!/\S+@\S+\.\S+/.test(body.email)) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 })
    }

    // Persist the contact message in Appwrite (if configured)
    const dbId = process.env.APPWRITE_DATABASE_ID
    const messagesCollectionId = process.env.APPWRITE_MESSAGES_COLLECTION_ID

    let docId: string | null = null

    if (process.env.APPWRITE_API_KEY && dbId && messagesCollectionId) {
      try {
        const res = await adminDatabases.createDocument(dbId, messagesCollectionId, ID.unique(), {
          name: body.name,
          email: body.email,
          phone: body.phone || "",
          message: body.message,
          createdAt: new Date().toISOString(),
        })

        // Appwrite returns the document with $id
        // @ts-ignore - SDK may not have precise types here
        docId = res.$id || null
      } catch (err) {
        console.error("Failed to persist contact message to Appwrite:", err)
      }
    } else {
      // Fallback: log the message when Appwrite is not configured
      console.log("Contact form received:", {
        name: body.name,
        email: body.email,
        phone: body.phone,
        message: body.message,
      })
    }

    // Simulate delay (optional)
    // await new Promise((r) => setTimeout(r, 500))

    return NextResponse.json({ ok: true, docId })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
