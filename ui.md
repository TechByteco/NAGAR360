# Nagar360 — UI & Design System Specification

## Design System & Styling
- **Typography**: Inter / Sans-serif clean legible typeface.
- **Micro-Animations**: Framer Motion smooth transitions for cards, modals, steppers, and tab switches.
- **Indian Civic Touches**: Subtle Rangoli decorative border accents in banners and hero card accents, clean locality tags (e.g. `📍 Ward 172 - Anna Nagar, Chennai`).
- **Responsive Layout**: Mobile-first design with a fixed bottom navigation bar on mobile screens and top header navigation on desktop.

## UI Components Architecture
1. `NagarLogo`: Brand logo featuring 360-degree civic circle pin with Tamil/Hindi/English tagline.
2. `TopNavbar`: Brand header, city selector (`Chennai`), language toggle (`EN` | `தமிழ்` | `हिंदी`), role switcher (`Citizen` / `Official`), notification bell, user avatar.
3. `MobileBottomNav`: Sticky mobile bar with `Home`, `Near Me`, `Report (+ button)`, `Map`, `Profile`.
4. `CivicPostCard`: Feed item with photo thumbnail, title, category pill, severity badge, location badge, upvote counter button, comment count, share button, and AI classification badge.
5. `ComplaintStatusBadge`: Status tag with specific icon and semantic styling:
   - `Submitted`: Slate/Blue badge
   - `Under Review`: Yellow badge
   - `Assigned`: Purple badge
   - `In Progress`: Orange badge
   - `Resolved`: Green badge with checkmark
   - `Rejected`: Red badge
   - `Duplicate`: Muted badge with link icon
6. `SeverityBadge`: Low (Green), Medium (Yellow), High (Orange), Critical (Red pulse).
7. `MapView`: Dynamic Client-Side Leaflet Component with custom HTML markers per category & status.
8. `LocationPicker`: Combined GPS auto-detect, address search input, and map click picker.
9. `AIAnalysisCard`: Card rendering image preview, confidence score, detected category, severity rating, suggested department, and disclaimer banner ("AI-generated suggestion — verify before submitting.").
10. `ComplaintStepper`: 5-step progress indicator for complaint creation.
11. `StatusTimeline`: Vertical event step timeline showing full lifecycle from Submission -> Department Assignment -> Worker Action -> Citizen Resolution Confirmation.
12. `LanguageSelector`: Floating / Header dropdown toggling English, Tamil, Hindi strings.
13. `ToastProvider`: Clean notifications for actions like upvoting, submitting, copy ticket ID, error handling.

## Page Layout Specifications
- Landing (`/`): Dynamic hero section, 4-step interactive guide, active metrics counter, category grid, cleanliness pledge banner.
- Feed (`/feed`): Multi-select filters, search bar, sort options, responsive grid/list.
- Raise Problem (`/raise-problem`): Card container wrapping the multi-step form with live validation feedback.
- Map (`/map`): Split screen view (Map on left/top, interactive issue list on right/bottom) with real-time marker synchronization.
- Track (`/track`): Ticket ID search bar with instant result preview card, downloadable summary button.
- Profile (`/profile`): Impact stats dashboard, badges grid, activity log, privacy settings toggle.
- Admin (`/admin`): Department filter tabs, status bulk actions, complaint triage table, resolution uploader modal.
