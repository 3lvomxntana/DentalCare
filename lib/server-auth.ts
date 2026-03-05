import { adminDatabases } from "@/lib/appwrite-server"

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT
const PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT

export async function getSessionUser(req: Request) {
  try {
    const cookie = req.headers.get("cookie")
    if (!cookie || !ENDPOINT || !PROJECT) return null

    const res = await fetch(`${ENDPOINT.replace(/\/$/, "")}/account`, {
      headers: { Cookie: cookie, "X-Appwrite-Project": PROJECT },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json
  } catch (err) {
    return null
  }
}

export async function getProfileRole(userId: string) {
  try {
    const DB = process.env.APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
    const usersCollection = process.env.APPWRITE_USERS_COLLECTION_ID
    if (!DB || !usersCollection) return null
    const doc = await adminDatabases.getDocument(DB, usersCollection, userId)
    return doc?.data?.role || null
  } catch (err) {
    return null
  }

}

export async function getProfile(userId: string) {
  try {
    const DB = process.env.APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
    const usersCollection = process.env.APPWRITE_USERS_COLLECTION_ID
    if (!DB || !usersCollection) return null
    const doc = await adminDatabases.getDocument(DB, usersCollection, userId)
    return doc
  } catch (err) {
    return null
  }
}
