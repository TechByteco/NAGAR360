# Nagar360 — Product Specification

## Target Audience
1. **Citizens**: Urban residents of Indian cities (starting with Chennai) looking for a transparent, simple way to report civic issues and see action taken.
2. **Civic Authorities & Ward Officers**: Municipal department staff who require structured queues, map heatmaps, duplicate detection, and direct communication channels.

## Key Features & User Stories

### Citizen Experience
- **Landing Page (`/`)**: Hero section, statistics banner, 4-step workflow, category showcase, civic cleanliness initiative.
- **Civic Social Feed (`/feed`)**: Scrollable cards with like/upvote, comments, status badges, ward tags, AI classification tags, and filter by latest/nearest/most supported/urgent/resolved.
- **Multi-Step Complaint Creator (`/raise-problem`)**:
  - Step 1: Upload photo evidence with auto-validation and compression.
  - Step 2: AI analysis engine (analyzes image, predicts category/severity, checks duplicate risks).
  - Step 3: Location picker (Geolocation GPS, pick on interactive map, address search).
  - Step 4: Title, detailed description, anonymous submission option.
  - Step 5: Review & Submit (generates Ticket ID e.g., `NGR-CHN-2026-00124`).
- **Complaint Detail View (`/complaints/[id]`)**: Full history, official resolution photos, community comments, support counter, share button, and nearby similar complaints.
- **Complaint Tracking (`/track`)**: Instant search by Ticket ID or view "My Complaints". Download/print printable status summary.
- **Near Me (`/near-me`)**: Geolocation radius filter (1km, 3km, 5km, 10km) displaying nearest issues with distance tags.
- **Interactive City Map (`/map`)**: Leaflet map displaying categorized markers with custom status colors, split-view list, ward filter, and mobile sheet.
- **Civic Profile (`/profile`)**: Impact stats (reports filed, resolved, upvotes received), badges ("Civic Hero", "Cleanliness Champion"), activity timeline, and language settings.
- **Cleanliness Events (`/events`)**: Community beach cleanups, tree plantations, and ward meetings with join/RSVP capability.
- **Departments Guide (`/departments`)**: Information & helpline contacts for Sanitation, Roads, Water, Electricity, Traffic, Parks.
- **About & How It Works (`/about`, `/how-it-works`)**: Transparent methodology, AI usage ethics, civic guidelines.
- **Help & Emergency Disclaimer (`/help`)**: FAQs, privacy policy, and clear disclaimer that Nagar360 is not for emergency services.

### Authority Experience
- **Authority Dashboard (`/admin`)**: Role-restricted dashboard.
  - High-level KPIs: Total, Open, In Progress, Resolved, Critical issues, Avg resolution time.
  - Interactive Ward & Department filters.
  - Queue management: Assign complaint to department, change status (Submitted -> Under Review -> Assigned -> In Progress -> Resolved / Rejected / Duplicate).
  - Upload resolution evidence (before/after photos) and post official response.
  - Duplicate complaint linker.

## Demo Data Strategy (Chennai Focus)
8 pre-seeded realistic complaints across localities:
1. Anna Nagar - Severe Pothole outside School Gate (High Severity, In Progress)
2. T. Nagar - Overflowing Garbage Dump near Bus Stand (Critical, Assigned)
3. Adyar - Non-functional Streetlight near Canal Bank Road (Medium, Under Review)
4. Velachery - Blocked Stormwater Drain causing waterlogging (Critical, In Progress)
5. Royapettah - Underground Water Pipe Leakage (High, Submitted)
6. OMR - Damaged Footpath Tiles near IT Park (Low, Submitted)
7. Besant Nagar - Fallen Tree Branch blocking Avenue Road (High, Resolved with Evidence)
8. Tambaram - Overflowing Dustbin near Railway Station (Medium, Duplicate of #2)
