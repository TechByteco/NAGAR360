# Nagar360 — API Specification & Endpoints

## Core Client API Service Functions (`lib/api.ts`)

### Auth API
- `signUpUser(data: SignUpData): Promise<User>`
- `signInUser(email: string, password: string): Promise<User>`
- `signOutUser(): Promise<void>`
- `getCurrentUser(): User | null`
- `signInDemoCitizen(): User`
- `signInDemoOfficial(): User`

### Complaint API
- `createComplaint(payload: CreateComplaintPayload): Promise<Complaint>`
- `getComplaints(filters: ComplaintFilters): Promise<Complaint[]>`
- `getComplaintById(id: string): Promise<ComplaintDetail | null>`
- `searchComplaintByTicketId(ticketId: string): Promise<Complaint | null>`
- `updateComplaintStatus(complaintId: string, status: Status, note: string, officialId: string): Promise<Complaint>`
- `assignComplaint(complaintId: string, department: string): Promise<Complaint>`
- `markComplaintResolved(complaintId: string, note: string, resolutionImage?: string): Promise<Complaint>`
- `findNearbyDuplicates(latitude: number, longitude: number, category: string): Promise<Complaint[]>`

### Social API
- `supportComplaint(complaintId: string, userId: string): Promise<{ supported: boolean, count: number }>`
- `addComment(complaintId: string, userId: string, body: string): Promise<Comment>`
- `getComments(complaintId: string): Promise<Comment[]>`
- `shareComplaint(complaintId: string): Promise<{ shared: boolean, url: string }>`

### Geolocation & AI Services
- `requestCurrentLocation(): Promise<{ latitude: number, longitude: number, accuracy: number }>`
- `reverseGeocodeLocation(lat: number, lon: number): Promise<GeocodeResult>`
- `analyseCivicImage(imageFile: File | string, description: string): Promise<AIAnalysisResult>`

### Authority & Metrics API
- `getAuthorityDashboardMetrics(city?: string): Promise<AuthorityMetrics>`
- `getWardStatistics(city?: string): Promise<WardStats[]>`

## Next.js API Routes (`/app/api/...`)
- `POST /api/ai/analyze`: Server-side endpoint calling Gemini 1.5/2.0 Flash Vision or returning demo AI JSON schema.
- `GET /api/geocode/reverse`: Server-side reverse geocoding via OpenStreetMap Nominatim with rate-limit safety.
