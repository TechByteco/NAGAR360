export type Role = 'citizen' | 'official' | 'admin';

export type Language = 'en' | 'ta' | 'hi';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected'
  | 'duplicate';

export type ComplaintCategory =
  | 'Pothole'
  | 'Broken Road'
  | 'Open Manhole'
  | 'Broken Streetlight'
  | 'Garbage Accumulation'
  | 'Overflowing Bin'
  | 'Blocked Drainage'
  | 'Water Leakage'
  | 'Flooded Road'
  | 'Damaged Footpath'
  | 'Fallen Tree'
  | 'Traffic Signal Issue'
  | 'Illegal Dumping'
  | 'Public Toilet Issue'
  | 'Stray Animal Concern'
  | 'Other';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  department?: string;
  city: string;
  preferredLanguage: Language;
  civicPoints: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface AIAnalysisResult {
  category: ComplaintCategory;
  subcategory: string;
  confidence: number; // 0 to 1
  severity: Severity;
  explanation: string;
  suggestedDepartment: string;
  isImageClear: boolean;
  isLikelyCivicIssue: boolean;
  possibleDuplicateCategory?: string;
  isDemoFallback: boolean;
}

export interface StatusHistory {
  id: string;
  status: ComplaintStatus;
  note?: string;
  updatedById?: string;
  updatedByName: string;
  createdAt: string;
  resolutionImageUrl?: string;
}

export interface Comment {
  id: string;
  complaintId: string;
  userId: string;
  userName: string;
  userRole?: Role;
  isOfficial: boolean;
  body: string;
  helpfulCount: number;
  helpfulUserIds: string[];
  createdAt: string;
}

export interface Complaint {
  id: string;
  ticketId: string; // e.g. NGR-CHN-2026-00124
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  subcategory?: string;
  severity: Severity;
  status: ComplaintStatus;
  imageUrl: string;
  latitude: number;
  longitude: number;
  address: string;
  locality: string;
  ward: string;
  city: string;
  state: string;
  assignedDepartment?: string;
  assignedOfficialId?: string;
  assignedOfficialName?: string;
  isAnonymous: boolean;
  aiAnalysis?: AIAnalysisResult;
  supportsCount: number;
  supportedUserIds: string[];
  duplicateOfId?: string;
  resolutionNote?: string;
  resolutionImageUrl?: string;
  statusHistory: StatusHistory[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CivicEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  locality: string;
  ward: string;
  organizer: string;
  latitude: number;
  longitude: number;
  attendeesCount: number;
  joinedUserIds: string[];
  imageUrl: string;
}

export interface GeocodeResult {
  address: string;
  locality: string;
  ward: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

export interface AuthorityMetrics {
  totalComplaints: number;
  openComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  criticalComplaints: number;
  avgResolutionDays: number;
  byDepartment: Record<string, number>;
  byWard: Record<string, number>;
}
