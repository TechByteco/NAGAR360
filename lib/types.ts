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
  | 'Air Quality'
  | 'Hazardous Wire'
  | 'Other';

export interface CivicBadge {
  id: string;
  name: string;
  nameTa: string;
  description: string;
  icon: string;
  earnedAt?: string;
  category: 'reporting' | 'resolution' | 'community' | 'eco';
}

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
  badges?: CivicBadge[];
  karmaLevel?: string;
  verifiedReportsCount?: number;
  resolutionsConfirmedCount?: number;
  createdAt: string;
}

export interface AIAnalysisResult {
  category: ComplaintCategory;
  subcategory?: string;
  confidence: number; // 0 to 1
  severity: Severity;
  explanation?: string;
  summary?: string;
  suggestedDepartment: string;
  isImageClear: boolean;
  isLikelyCivicIssue: boolean;
  estimatedCostInr?: number;
  materialsNeeded?: string[];
  hazardScore?: number; // 1 to 10
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
  estimatedResolutionDate?: string;
}

export interface Comment {
  id: string;
  complaintId?: string;
  userId: string;
  userName: string;
  userRole?: Role;
  isOfficial?: boolean;
  officialDesignation?: string;
  body?: string;
  text?: string;
  helpfulCount?: number;
  helpfulUserIds?: string[];
  createdAt: string;
}

export interface ResolutionVerification {
  confirmedFixedCount: number;
  stillBrokenCount: number;
  confirmedUserIds: string[];
  disputedUserIds: string[];
  isCitizenVerified: boolean;
}

export interface DepartmentSLA {
  category: ComplaintCategory;
  department: string;
  slaHours: number;
  emergencyContact: string;
  helpline: string;
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
  contractorName?: string;
  isAnonymous: boolean;
  aiAnalysis?: AIAnalysisResult;
  supportsCount: number;
  supportedUserIds: string[];
  duplicateOfId?: string;
  resolutionNote?: string;
  resolutionImageUrl?: string;
  resolutionVerification?: ResolutionVerification;
  slaDeadlineHours?: number;
  isSlaOverdue?: boolean;
  voiceNoteUrl?: string;
  petitionCount?: number;
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
  category?: 'cleanup' | 'tree_planting' | 'drainage_inspection' | 'pothole_patrol';
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
  overdueSlaCount: number;
  citizenSatisfactionPercent: number;
  byDepartment: Record<string, number>;
  byWard: Record<string, number>;
}

export interface FloodRiskZone {
  id: string;
  name: string;
  city: string;
  riskLevel: 'critical' | 'high' | 'moderate';
  latitude: number;
  longitude: number;
  radiusMeters: number;
  monsoonVulnerabilityNotes: string;
  inundationHistory: string;
}

export interface WardCouncillor {
  id: string;
  wardNumber: string;
  wardName: string;
  city: string;
  councillorName: string;
  party: string;
  phone: string;
  email: string;
  officeAddress: string;
}
