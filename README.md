This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

This project is a Next.js app that uses Appwrite for authentication and data storage and includes server-authoritative endpoints for role-based access (Admin, Receptionist, Dentist, Patient).

- **Next.js docs**: https://nextjs.org/docs — app-router, server components, and API routes used here.
- **Appwrite**: https://appwrite.io — auth, databases, and how to configure collections and API keys.
- **Developer notes (this repo)**: see the `app/api` routes for authoritative endpoints: `/api/auth/role`, `/api/users/by-email`, `/api/staff`, `/api/register`, and `/api/admin/create-user`.
- **E2E testing**: Playwright or Playwright Test can be added to exercise staff creation and role-based redirects; test scaffolding is included in the `scripts/` folder.

Quick tips for contributors:

- Add your Appwrite settings to `.env.local` (see the Appwrite section below).
- Use the `/api/appwrite/probe` route to verify the server API key and collection access.
- Server-only admin operations use `APPWRITE_API_KEY`; never commit that key to source control.

If you'd like, I can add scripted collection provisioning or Playwright tests for the most common flows (staff creation, patient booking, role redirects).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Appwrite (optional)

To persist data and use Appwrite auth, add the following env vars to your `.env.local`:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=http://localhost/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
APPWRITE_API_KEY=your_server_api_key
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_MESSAGES_COLLECTION_ID=your_messages_collection_id
APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
APPWRITE_STAFF_COLLECTION_ID=your_staff_collection_id
APPWRITE_APPOINTMENTS_COLLECTION_ID=your_appointments_collection_id
---

## Appwrite collection setup & RBAC (quick guide)

If you don't yet have the `staff` (or other) collections, create them in the Appwrite Console or via the REST API. Below are the recommended attributes and permission guidance.

1) Create `staff` collection (example using REST API):

```bash
curl -X POST "${NEXT_PUBLIC_APPWRITE_ENDPOINT:-https://YOUR_APPWRITE}/v1/databases/${APPWRITE_DATABASE_ID}/collections" \
	-H "X-Appwrite-Project: ${NEXT_PUBLIC_APPWRITE_PROJECT}" \
	-H "X-Appwrite-Key: YOUR_SERVER_API_KEY" \
	-H "Content-Type: application/json" \
	-d '{"collectionId":"staff","name":"Staff"}'
```

2) Add attributes (examples):

```bash
# Name (string)
curl -X POST "${NEXT_PUBLIC_APPWRITE_ENDPOINT:-https://YOUR_APPWRITE}/v1/databases/${APPWRITE_DATABASE_ID}/collections/staff/attributes/string" \
	-H "X-Appwrite-Project: ${NEXT_PUBLIC_APPWRITE_PROJECT}" \
	-H "X-Appwrite-Key: YOUR_SERVER_API_KEY" \
	-H "Content-Type: application/json" \
	-d '{"key":"name","size":255,"required":true}'

# email (string)
curl -X POST "${NEXT_PUBLIC_APPWRITE_ENDPOINT:-https://YOUR_APPWRITE}/v1/databases/${APPWRITE_DATABASE_ID}/collections/staff/attributes/string" \
	-H "X-Appwrite-Project: ${NEXT_PUBLIC_APPWRITE_PROJECT}" \
	-H "X-Appwrite-Key: YOUR_SERVER_API_KEY" \
	-H "Content-Type: application/json" \
	-d '{"key":"email","size":255,"required":true}'

# role (string)
curl -X POST "${NEXT_PUBLIC_APPWRITE_ENDPOINT:-https://YOUR_APPWRITE}/v1/databases/${APPWRITE_DATABASE_ID}/collections/staff/attributes/string" \
	-H "X-Appwrite-Project: ${NEXT_PUBLIC_APPWRITE_PROJECT}" \
	-H "X-Appwrite-Key: YOUR_SERVER_API_KEY" \
	-H "Content-Type: application/json" \
	-d '{"key":"role","size":80,"required":true}'
```

3) Recommended permissions / RBAC

- For `staff` collection documents: set read to project staff/admin roles as appropriate. If you want only server-side endpoints to create staff, keep write restricted to the API key (server).
- For `appointments`: allow patients to create their own documents (or create via server) and staff to read documents that belong to them.

4) Test RBAC

- Use the `/api/appwrite/probe` route in this app to test server access:
	- GET `/api/appwrite/probe` should return `{ ok: true, count: X }` when APPWRITE_API_KEY and collection IDs are set.
- Use the `/api/staff` GET/POST endpoints from the admin UI to confirm staff listing and creation works.

If you'd like, I can add an automated seed/provision script to create the collections and attributes programmatically — I'll need an `APPWRITE_API_KEY` with appropriate scopes to run it.
```

- `NEXT_PUBLIC_APPWRITE_ENDPOINT` and `NEXT_PUBLIC_APPWRITE_PROJECT` are used by the client SDK.
- `APPWRITE_API_KEY`, `APPWRITE_DATABASE_ID`, and `APPWRITE_MESSAGES_COLLECTION_ID` are used server-side and must be kept secret.

The contact form will store messages into the configured messages collection when the server API key and collection info are present.
