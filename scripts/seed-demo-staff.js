const fetch = global.fetch || require('node-fetch')
require('dotenv').config({ path: __dirname + '/../.env.local' })

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT
const PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT
const DB = process.env.APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const KEY = process.env.APPWRITE_API_KEY
const STAFF_COLLECTION = process.env.APPWRITE_STAFF_COLLECTION_ID || 'staff'

if (!ENDPOINT || !PROJECT || !DB || !KEY) {
  console.error('Missing required env vars. Please set ENDPOINT, PROJECT, DB, and APPWRITE_API_KEY in .env.local')
  process.exit(1)
}

async function api(path, method = 'GET', body) {
  const url = `${ENDPOINT.replace(/\/$/, '')}${path}`
  const opts = { method, headers: { 'X-Appwrite-Project': PROJECT, 'X-Appwrite-Key': KEY, 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(url, opts)
  const text = await res.text()
  let json = null
  try { json = JSON.parse(text) } catch (e) { /* ignore */ }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`)
  return json
}

async function main() {
  const demo = { name: 'Dentist', email: 'dentist@dentalcare.com', password: 'dentist123', role: 'dentist' }

  try {
    // Check if staff with this email already exists
    const list = await api(`/databases/${DB}/collections/${STAFF_COLLECTION}/documents`)
    const found = (list?.documents || []).find((d) => d.email === demo.email)
    if (found) {
      console.log('Staff entry already exists:', found.$id || found.documentId)
      process.exit(0)
    }

    // Create Appwrite user via admin API
    const userId = `staff_${Date.now().toString(36)}`
    console.log('Creating Appwrite user', demo.email)
    const userRes = await api(`/users`, 'POST', { userId, email: demo.email, password: demo.password, name: demo.name })
    console.log('Created user:', userRes.$id)

    // Create staff document
    const docId = `staff_${Date.now().toString(36)}`
    const staffDoc = { documentId: docId, data: { userId: userRes.$id, name: demo.name, email: demo.email, role: demo.role, createdAt: new Date().toISOString() } }
    const created = await api(`/databases/${DB}/collections/${STAFF_COLLECTION}/documents`, 'POST', staffDoc)
    console.log('Created staff document:', created.$id || created.documentId)
  } catch (err) {
    console.error('Seeding demo staff failed:', err.message || err)
    process.exit(1)
  }
}

main()
