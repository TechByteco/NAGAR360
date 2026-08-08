# Nagar360 — Engineering Architecture & Adapter Pattern

## Framework & Directory Structure
Next.js (App Router) structure inside `nagar360/`:

```
nagar360/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Landing)
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── feed/page.tsx
│   ├── raise-problem/page.tsx
│   ├── complaints/[id]/page.tsx
│   ├── track/page.tsx
│   ├── near-me/page.tsx
│   ├── map/page.tsx
│   ├── profile/page.tsx
│   ├── about/page.tsx
│   ├── how-it-works/page.tsx
│   ├── events/page.tsx
│   ├── departments/page.tsx
│   ├── help/page.tsx
│   ├── admin/page.tsx
│   └── api/ (API routes for AI analysis, Geocoding, Complaints)
├── components/
│   ├── ui/ (Buttons, Badges, Modals, Cards)
│   ├── layout/ (TopNavbar, MobileBottomNav, Footer)
│   ├── map/ (Dynamic Leaflet Map component & Markers)
│   ├── complaints/ (Stepper, AIAnalysisCard, Timeline, Comments, Feed)
│   └── admin/ (AuthorityTable, StatusUpdateModal)
├── lib/
│   ├── adapters/
│   │   ├── authAdapter.ts (Supabase Auth / Local Demo Auth)
│   │   ├── dbAdapter.ts (Supabase DB / Local Seed Store)
│   │   ├── storageAdapter.ts (Supabase Storage / Local Base64 Store)
│   │   ├── aiAdapter.ts (Server-side Gemini Vision / Deterministic Fallback)
│   │   └── geocodeAdapter.ts (OSM Nominatim / Local Fallback)
│   ├── store.ts (In-memory reactive state manager with localStorage persistence)
│   ├── types.ts (Full TypeScript data models)
│   ├── translations.ts (English, Tamil, Hindi strings)
│   └── utils.ts (Distance calculation, date formatters, ticket ID generator)
```

## Demo Mode Architecture
The application runs in **Demo Mode** by default when external credentials (Supabase URL, Gemini API Key) are omitted.
- **State Management**: Reactive state store with persistent `localStorage` cache. Any submitted complaint, upvote, comment, or authority status update updates local state live across pages!
- **AI Analysis**: Mock AI vision service that detects categories based on image patterns or description keywords, returning JSON schemas matching real Gemini Vision outputs.
- **Geocoding**: OpenStreetMap Nominatim API with instant fallback for reverse geocoding coordinates around Chennai.
- **Auth**: One-click "Demo Citizen Login" and "Demo Official Login" allowing instant testing of both citizen and authority workflows without signup hurdles.

## Key Services & Utilities
- `calculateDistance(lat1, lon1, lat2, lon2)`: Haversine distance calculation in km/meters.
- `generateTicketId(cityCode)`: Formats standard ticket ID `NGR-CHN-2026-XXXXX`.
- `validateComplaintImage(file)`: Validates file type (JPEG/PNG/WebP), size (< 10MB), and returns compression canvas base64.
