# BakeHouse – Full-Stack Digital Transformation Prototype

Responsive bakery website using Next.js, React, TypeScript and server-side JSON-file storage. No database is used.

## Features
- Responsive website, business story and contact details
- Filterable product catalogue and product-specific enquiry links
- Customer enquiry form posting to a backend API
- Server-side validation and JSON-file persistence
- Admin preview that loads, refreshes and deletes enquiries through API routes
- WhatsApp contact link (configure the real number)
- Five-minute pitch script in `PRESENTATION.md`

## Requirements
Node.js 20 LTS recommended (18.18+ minimum) and npm.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Production build
```bash
npm run build
npm start
```

## Backend API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/enquiries` | Return all enquiries |
| POST | `/api/enquiries` | Validate and save an enquiry |
| DELETE | `/api/enquiries?id=<id>` | Delete an enquiry |

Enquiries are stored in `data/enquiries.json` on the server. The file is created automatically when the first enquiry is submitted.

## Important limitations
- This is full-stack: the frontend calls Next.js API route handlers; the server validates and persists enquiry data.
- It uses a JSON file, not a database. Run on one persistent Node.js server with write access to the project directory.
- Do not deploy this JSON-file version to Vercel/serverless or multi-instance hosting and expect durable shared storage. Filesystems may be ephemeral, read-only or isolated per instance.
- The demo admin page and GET/DELETE API are not authenticated. Do not expose them publicly with real customer data. Add authentication, authorisation, rate limiting, privacy controls and secure hosting before production.
- Use fictional test enquiries for your class demonstration.
- Product details, address, email, opening hours and WhatsApp number are sample data. Update them before presenting as a real business.
- Replace `BUSINESS_WHATSAPP` in `app/page.tsx` with the business number (digits only, including country code).

## Demo flow
1. Open the homepage.
2. Filter products and click an enquiry link.
3. Submit a fictional customer enquiry.
4. Open Admin preview; it loads the enquiry through the backend API.
5. Refresh and delete a test enquiry to demonstrate GET and DELETE.
6. Resize the browser to show mobile responsiveness.


## Deploy to Render (persistent JSON storage)
This repository includes `render.yaml` for Render Blueprint deployment. It creates a paid Starter Node web service in Frankfurt and attaches a 1 GB persistent disk mounted at `/var/data`. The API writes `data/enquiries.json` locally for development, and writes `/var/data/enquiries.json` on Render through `DATA_DIR`.

1. Push the extracted project folder to a GitHub repository.
2. Sign in to Render and choose **New → Blueprint**.
3. Connect the GitHub repository containing `render.yaml`.
4. Review the Blueprint resources and estimated charges, then approve creation.
5. Wait for the build and deploy to finish; open the `onrender.com` URL shown by Render.
6. Submit a fictional test enquiry, open Admin preview, refresh, and delete it to verify the API.

The persistent disk requires a paid Render web service; Render's free service filesystem is ephemeral and will not preserve JSON enquiries across restarts or deploys. Review current pricing before approving. The admin API is not authenticated, so keep the demo private or add authentication before public use.
