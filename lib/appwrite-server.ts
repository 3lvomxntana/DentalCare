import { Client, Databases } from "appwrite"

const admin = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || "http://localhost/v1")
  // Accept both NEXT_PUBLIC_APPWRITE_PROJECT and NEXT_PUBLIC_APPWRITE_PROJECT_ID
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setDevKey(process.env.APPWRITE_API_KEY || "")

const adminDatabases = new Databases(admin)

export { admin, adminDatabases }
