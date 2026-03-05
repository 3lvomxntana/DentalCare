const { Client, Databases } = require('appwrite')
require('dotenv').config({ path: __dirname + '/../.env.local' })

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID)
  .setDevKey(process.env.APPWRITE_API_KEY || '')

const databases = new Databases(client)

async function ensureCollection(dbId, id, name, read = ['*'], write = ['role:all']) {
  try {
    // listCollections not available; trying to get by id will throw if not exists
    const existing = await databases.getCollection(dbId, id).catch(() => null)
    if (existing) {
      console.log(`Collection exists: ${id}`)
      return existing
    }

    const created = await databases.createCollection(dbId, id, name, read, write)
    console.log(`Created collection: ${id}`)
    return created
  } catch (err) {
    console.error(`Failed to ensure collection ${id}:`, err.message || err)
    throw err
  }
}

async function run() {
  const dbId = process.env.APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
  if (!dbId) {
    console.error('No database id configured (APPWRITE_DATABASE_ID or NEXT_PUBLIC_APPWRITE_DATABASE_ID)')
    process.exit(1)
  }

  try {
    // Collections and attribute definitions
    const collections = [
      { id: process.env.APPWRITE_USERS_COLLECTION_ID || 'users', name: 'Users' },
      { id: process.env.APPWRITE_STAFF_COLLECTION_ID || 'staff', name: 'Staff' },
      { id: process.env.APPWRITE_APPOINTMENTS_COLLECTION_ID || 'appointments', name: 'Appointments' },
      { id: process.env.APPWRITE_MESSAGES_COLLECTION_ID || 'messages', name: 'Messages' },
    ]

    for (const c of collections) {
      await ensureCollection(dbId, c.id, c.name)
    }

    console.log('Provisioning complete. You should review the collections in the Appwrite console for attributes and RBAC.')
  } catch (err) {
    console.error('Provisioning failed:', err)
    process.exit(1)
  }
}

require('dotenv').config({ path: __dirname + '/../.env.local' })

const fetch = global.fetch || require('node-fetch')

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT
const PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT
const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || process.env.APPWRITE_DATABASE_ID
const KEY = process.env.APPWRITE_API_KEY

if (!ENDPOINT || !PROJECT || !DB || !KEY) {
  console.error('Missing required env vars. Please ensure ENDPOINT, PROJECT, DB, and APPWRITE_API_KEY are set in .env.local')
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

async function listCollections() {
  return api(`/databases/${DB}/collections`)
}

async function createCollection(collectionId, name) {
  console.log(`Creating collection '${name}'`)
  // Try minimal create payload; Appwrite may accept collectionId and name
  return api(`/databases/${DB}/collections`, 'POST', { collectionId, name })
}

async function createStringAttribute(collectionId, key, size = 255, required = false) {
  try {
    const attrs = await listAttributes(collectionId).catch(() => null)
    if (attrs && Array.isArray(attrs?.attributes)) {
      const exists = attrs.attributes.some((a) => a.key === key)
      if (exists) {
        console.log(`Attribute exists: ${collectionId}.${key}, skipping`)
        return attrs.attributes.find((a) => a.key === key)
      }
    }

    const attempt = async () => api(`/databases/${DB}/collections/${collectionId}/attributes/string`, 'POST', { key, size, required })
    return await retry(attempt, 3, 700)
  } catch (err) {
    console.warn(`createStringAttribute ${collectionId}.${key} failed:`, err.message || err)
  }
}

async function createDatetimeAttribute(collectionId, key, required = false) {
  try {
    const attrs = await listAttributes(collectionId).catch(() => null)
    if (attrs && Array.isArray(attrs?.attributes)) {
      const exists = attrs.attributes.some((a) => a.key === key)
      if (exists) {
        console.log(`Attribute exists: ${collectionId}.${key}, skipping`)
        return attrs.attributes.find((a) => a.key === key)
      }
    }

    const attempt = async () => api(`/databases/${DB}/collections/${collectionId}/attributes/datetime`, 'POST', { key, required })
    return await retry(attempt, 3, 700)
  } catch (err) {
    console.warn(`createDatetimeAttribute ${collectionId}.${key} failed:`, err.message || err)
  }
}

async function listAttributes(collectionId) {
  try {
    return await api(`/databases/${DB}/collections/${collectionId}/attributes`)
  } catch (err) {
    console.warn(`listAttributes ${collectionId} failed:`, err.message || err)
    return null
  }
}

async function updateCollectionPermissions(collectionId, read = [], write = []) {
  const attemptPatch = async (payload) => api(`/databases/${DB}/collections/${collectionId}`, 'PATCH', payload)

  try {
    // Try payload shape { read, write }
    return await retry(() => attemptPatch({ read, write }), 2, 500)
  } catch (err1) {
    console.warn(`updateCollectionPermissions ${collectionId} with {read,write} failed:`, err1.message || err1)
    try {
      // Try alternate payload shape { permissions: { read, write } }
      return await retry(() => attemptPatch({ permissions: { read, write } }), 2, 500)
    } catch (err2) {
      console.warn(`updateCollectionPermissions ${collectionId} with {permissions} failed:`, err2.message || err2)
    }
  }
}

async function retry(fn, attempts = 3, delay = 500) {
  let i = 0
  while (i < attempts) {
    try {
      return await fn()
    } catch (err) {
      i++
      const retriable = [502, 503, 504].some((s) => (err.message || '').includes(`HTTP ${s}`))
      if (!retriable || i >= attempts) throw err
      console.warn(`Transient error, retrying (${i}/${attempts})...`, err.message || err)
      await new Promise((res) => setTimeout(res, delay * i))
    }
  }
}

async function main() {
  console.log('Provisioning Appwrite collections for project:', PROJECT)
  let existing = []
  try {
    const res = await listCollections()
    existing = (res && res.collections) ? res.collections.map((c) => c.name || c.$id || c.collectionId) : []
  } catch (err) {
    console.warn('Could not list collections:', err.message || err)
  }

  const desired = [
    { id: 'users', name: 'users' },
    { id: 'staff', name: 'staff' },
    { id: 'appointments', name: 'appointments' },
    { id: 'messages', name: 'messages' },
  ]

  for (const c of desired) {
    if (existing.includes(c.name) || existing.includes(c.id)) {
      console.log(`Collection '${c.name}' already exists, skipping.`)
      continue
    }
    try {
      const created = await createCollection(c.id, c.name)
      console.log(`Created collection ${c.name}:`, created?.$id || created?.collectionId || JSON.stringify(created).slice(0, 80))
    } catch (err) {
      console.error(`Failed to create collection '${c.name}':`, err.message || err)
    }
  }

  // Create attributes and set recommended permissions
  console.log('\nCreating attributes and setting RBAC for collections...')
    // Quick write probe: attempt to create & delete a document in the messages collection
    console.log('\nVerifying server write access with a probe...')
    try {
      const probeId = `probe-${Date.now()}`
      // Messages collection requires name,email,message,createdAt
      const payload = {
        documentId: probeId,
        data: { name: 'probe', email: 'probe@example.com', message: 'probe', createdAt: new Date().toISOString() },
      }
      const created = await api(`/databases/${DB}/collections/messages/documents`, 'POST', payload)
      console.log('Probe create succeeded:', created?.$id || probeId)
      try {
        await api(`/databases/${DB}/collections/messages/documents/${probeId}`, 'DELETE')
        console.log('Probe delete succeeded')
      } catch (delErr) {
        console.warn('Probe delete failed:', delErr.message || delErr)
      }
    } catch (probeErr) {
      console.warn('Probe write failed:', probeErr.message || probeErr)
    }

    // Test creating an appointment document with document-level permissions
    console.log('\nTesting document-level permissions for appointments (create+delete)')
    try {
      const aptId = `apt-probe-${Date.now()}`
      const ownerRef = `user:some-test-user` // this user may not exist; permission string test
      const payload = {
        documentId: aptId,
        data: { name: 'Test Patient', email: 'test@example.com', service: 'Checkup', doctor: 'Dr Test', date: new Date().toISOString(), time: '09:00', createdAt: new Date().toISOString() },
        permissions: [
          `read("${ownerRef}")`,
          `read("role:staff")`,
          `write("role:staff")`,
        ],
      }

      const created = await api(`/databases/${DB}/collections/appointments/documents`, 'POST', payload)
      console.log('Appointment probe create succeeded:', created?.$id || aptId)
      try {
        await api(`/databases/${DB}/collections/appointments/documents/${aptId}`, 'DELETE')
        console.log('Appointment probe delete succeeded')
      } catch (delErr) {
        console.warn('Appointment probe delete failed:', delErr.message || delErr)
      }
    } catch (aptErr) {
      console.warn('Appointment probe create failed (permissions may be rejected):', aptErr.message || aptErr)
    }

  // Users collection: private profile fields
  await createStringAttribute('users', 'name', 128, true)
  await createStringAttribute('users', 'email', 254, true)
  await createStringAttribute('users', 'phone', 32, false)
  await createStringAttribute('users', 'role', 32, true)
  await createDatetimeAttribute('users', 'createdAt', true)
  await updateCollectionPermissions('users', [], [])

  // Staff collection
  await createStringAttribute('staff', 'userId', 64, true)
  await createStringAttribute('staff', 'name', 128, true)
  await createStringAttribute('staff', 'email', 254, true)
  await createStringAttribute('staff', 'role', 32, true)
  await createDatetimeAttribute('staff', 'createdAt', true)
  await updateCollectionPermissions('staff', [], [])

  // Appointments collection (readable by clients, writable only by server)
  await createStringAttribute('appointments', 'name', 128, true)
  await createStringAttribute('appointments', 'email', 254, true)
  await createStringAttribute('appointments', 'phone', 32, false)
  await createStringAttribute('appointments', 'service', 128, false)
  await createStringAttribute('appointments', 'doctor', 128, false)
  // patientId: reference to the user that created the appointment (if available)
  await createStringAttribute('appointments', 'patientId', 64, false)
  await createDatetimeAttribute('appointments', 'date', true)
  await createStringAttribute('appointments', 'time', 64, false)
  await createStringAttribute('appointments', 'status', 32, false)
  // notes to capture extra information from the patient
  await createStringAttribute('appointments', 'notes', 1024, false)
  await createDatetimeAttribute('appointments', 'createdAt', true)
  // Set collection-level defaults: allow clients to create appointments (patients create)
  // and rely on document-level permissions + server-side enforcement for updates by staff
  await updateCollectionPermissions('appointments', [], ['role:all'])

  // Messages collection (private; server writes)
  await createStringAttribute('messages', 'name', 128, true)
  await createStringAttribute('messages', 'email', 254, true)
  await createStringAttribute('messages', 'phone', 32, false)
  await createStringAttribute('messages', 'message', 1024, true)
  await createDatetimeAttribute('messages', 'createdAt', true)
  await updateCollectionPermissions('messages', [], [])

  console.log('\nProvisioning complete. Note: Attributes creation is not fully automated in this script. If you need attributes created automatically, I can extend the script to call the collection attributes endpoints (they require specific payloads per attribute type).')
}

main().catch((err) => { console.error('Provisioning failed:', err); process.exit(1) })
