"use client"

import { Client, Databases, Account, Query } from "appwrite"

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || "http://localhost/v1")
  // Accept both NEXT_PUBLIC_APPWRITE_PROJECT and NEXT_PUBLIC_APPWRITE_PROJECT_ID
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")

const databases = new Databases(client)
const account = new Account(client)

async function ping() {
  try {
    const res = await client.ping()
    // Keep a console trace so developers can see the response on load
    console.info("Appwrite ping response:", res)
    return { ok: true, res }
  } catch (err) {
    console.warn("Appwrite ping failed:", err)
    return { ok: false, error: err }
  }
}

export { client, databases, account, Query, ping }
