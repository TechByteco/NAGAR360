# Nagar360 — Testing Plan & Verification Matrix

## Automated & Manual Test Scenarios

### 1. Citizen End-to-End Workflow Test
- Step 1: Open landing page `/`, click "Report an Issue".
- Step 2: On `/raise-problem`, upload image evidence or select sample photo.
- Step 3: Run AI analysis -> verifies category detection, severity level, suggested department, and disclaimer.
- Step 4: Click location tab -> test GPS permission trigger or pick location on interactive Leaflet map.
- Step 5: Fill title, description, accept terms, click submit.
- Step 6: Verify generation of public ticket ID (`NGR-CHN-2026-XXXXX`).
- Step 7: Navigate to `/complaints/[id]`, verify upvoting and commenting features.
- Step 8: Open `/track`, enter ticket ID, verify status timeline display.

### 2. Authority End-to-End Workflow Test
- Step 1: Click "Demo Official Login" in navbar or login page.
- Step 2: Access `/admin` route (verify role guard permits official access).
- Step 3: Filter by Ward (e.g. Anna Nagar) or Department (e.g. Road Maintenance).
- Step 4: Click "Update Status" on newly submitted complaint -> change status to `In Progress` with official note.
- Step 5: Verify status update reflects immediately on the timeline and feed cards!

### 3. Maps & Near Me Verification
- Step 1: Open `/near-me`, allow or simulate GPS -> verify radius filter (1km, 3km, 5km) orders complaints by distance.
- Step 2: Open `/map`, verify Leaflet map tiles render, markers load with proper category colors, split view opens card on marker click.

### 4. Demo Mode & Fallback Assurance
- Verify all features run without requiring external environment keys.
- Ensure "Demo Mode" badge is visible in header.
