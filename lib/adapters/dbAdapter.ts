import {
  Complaint,
  ComplaintStatus,
  Comment,
  CivicEvent,
  AuthorityMetrics,
  ComplaintCategory,
  Severity,
} from '../types';
import { INITIAL_COMPLAINTS, INITIAL_EVENTS } from '../store';
import { calculateDistance, generateTicketId } from '../utils';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const COMPLAINTS_KEY = 'nagar360_complaints_v1';
const EVENTS_KEY = 'nagar360_events_v1';

function notifyListeners() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('nagar360_store_update'));
  }
}

/**
 * 🔄 SUPABASE REALTIME SINK
 * Subscribes to live PostgreSQL database changes (INSERT, UPDATE, DELETE)
 * on the 'complaints' table. Whenever data changes on any device or authority panel,
 * all open browser tabs automatically sink/update instantly!
 */
export function subscribeToRealtimeComplaints(onUpdate: (payload: any) => void) {
  if (!isSupabaseConfigured || !supabase) {
    if (typeof window !== 'undefined') {
      const handleStorage = () => onUpdate({ eventType: 'LOCAL_SYNC' });
      window.addEventListener('nagar360_store_update', handleStorage);
      return () => window.removeEventListener('nagar360_store_update', handleStorage);
    }
    return () => {};
  }

  const channel = supabase
    .channel('public:complaints')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'complaints' },
      (payload) => {
        console.log('⚡ [Supabase Realtime Sink] Database Event:', payload);
        onUpdate(payload);
        notifyListeners();
      }
    )
    .subscribe((status) => {
      console.log('📡 [Supabase Realtime Sink] Connection Status:', status);
    });

  return () => {
    if (supabase && channel) {
      supabase.removeChannel(channel);
    }
  };
}

export function getStoredComplaints(): Complaint[] {
  if (typeof window === 'undefined') return INITIAL_COMPLAINTS;
  const stored = localStorage.getItem(COMPLAINTS_KEY);
  if (!stored) {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(INITIAL_COMPLAINTS));
    return INITIAL_COMPLAINTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_COMPLAINTS;
  }
}

export async function fetchComplaintsAsync(): Promise<Complaint[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: Complaint[] = data.map((row: any) => ({
          id: row.id,
          ticketId: row.ticket_id,
          title: row.title,
          description: row.description,
          category: row.category as ComplaintCategory,
          severity: row.severity as Severity,
          status: row.status as ComplaintStatus,
          ward: row.ward,
          locality: row.locality,
          address: row.address || `${row.locality}, ${row.city}, Tamil Nadu`,
          city: row.city || 'Chennai',
          state: row.state || 'Tamil Nadu',
          latitude: row.latitude,
          longitude: row.longitude,
          userId: row.user_id,
          userName: row.user_name,
          isAnonymous: row.is_anonymous,
          imageUrl: row.image_url,
          assignedDepartment: row.assigned_department,
          resolutionNote: row.resolution_note,
          resolutionImageUrl: row.resolution_image_url,
          supportsCount: row.supports_count || 1,
          supportedUserIds: row.supported_user_ids || [],
          statusHistory: [],
          comments: [],
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
        saveComplaints(mapped);
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase fetch fallback to local storage:', err);
    }
  }
  return getStoredComplaints();
}

export function saveComplaints(complaints: Complaint[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    notifyListeners();
  }
}

export function getStoredEvents(): CivicEvent[] {
  if (typeof window === 'undefined') return INITIAL_EVENTS;
  const stored = localStorage.getItem(EVENTS_KEY);
  if (!stored) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_EVENTS;
  }
}

export function saveEvents(events: CivicEvent[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    notifyListeners();
  }
}

export function getComplaintById(id: string): Complaint | null {
  const complaints = getStoredComplaints();
  return complaints.find((c) => c.id === id || c.ticketId === id) || null;
}

export function searchComplaintByTicketId(ticketId: string): Complaint | null {
  const complaints = getStoredComplaints();
  const cleanId = ticketId.trim().toUpperCase();
  return complaints.find((c) => c.ticketId.toUpperCase() === cleanId) || null;
}

export function toggleSupport(complaintId: string, userId: string): { supported: boolean; count: number } {
  const complaints = getStoredComplaints();
  const idx = complaints.findIndex((c) => c.id === complaintId);
  if (idx === -1) return { supported: false, count: 0 };

  const complaint = complaints[idx];
  const supportedUserIds = complaint.supportedUserIds || [];
  const exists = supportedUserIds.includes(userId);

  let updatedIds: string[];
  if (exists) {
    updatedIds = supportedUserIds.filter((id) => id !== userId);
  } else {
    updatedIds = [...supportedUserIds, userId];
  }

  const newCount = updatedIds.length;
  complaints[idx] = {
    ...complaint,
    supportsCount: newCount,
    supportedUserIds: updatedIds,
  };

  saveComplaints(complaints);

  if (isSupabaseConfigured && supabase) {
    supabase
      .from('complaints')
      .update({ supports_count: newCount, supported_user_ids: updatedIds })
      .eq('id', complaintId)
      .then(({ error }) => {
        if (error) console.error('Supabase update error:', error);
      });
  }

  return { supported: !exists, count: newCount };
}

export function addCommentToComplaint(
  complaintId: string,
  userId: string,
  userName: string,
  body: string,
  isOfficial: boolean = false
): Comment {
  const complaints = getStoredComplaints();
  const idx = complaints.findIndex((c) => c.id === complaintId);
  if (idx === -1) throw new Error('Complaint not found');

  const newComment: Comment = {
    id: `cmt-${Date.now()}`,
    complaintId,
    userId,
    userName,
    isOfficial,
    body,
    helpfulCount: 0,
    helpfulUserIds: [],
    createdAt: new Date().toISOString(),
  };

  const updatedComments = [newComment, ...(complaints[idx].comments || [])];
  complaints[idx] = {
    ...complaints[idx],
    comments: updatedComments,
    updatedAt: new Date().toISOString(),
  };

  saveComplaints(complaints);
  return newComment;
}

export function updateComplaintDetails(
  complaintId: string,
  updates: { title: string; description: string; category: ComplaintCategory; severity: Severity }
): Complaint {
  const complaints = getStoredComplaints();
  const idx = complaints.findIndex((c) => c.id === complaintId);
  if (idx === -1) throw new Error('Complaint not found');

  const complaint = complaints[idx];
  complaints[idx] = {
    ...complaint,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveComplaints(complaints);

  if (isSupabaseConfigured && supabase) {
    supabase
      .from('complaints')
      .update({
        title: updates.title,
        description: updates.description,
        category: updates.category,
        severity: updates.severity,
      })
      .eq('id', complaintId)
      .then();
  }

  return complaints[idx];
}

export function updateComplaintStatus(
  complaintId: string,
  newStatus: ComplaintStatus,
  note: string,
  officialName: string,
  resolutionImageUrl?: string
): Complaint {
  const complaints = getStoredComplaints();
  const idx = complaints.findIndex((c) => c.id === complaintId);
  if (idx === -1) throw new Error('Complaint not found');

  const complaint = complaints[idx];
  const newHistoryItem = {
    id: `hist-${Date.now()}`,
    status: newStatus,
    note,
    updatedByName: officialName,
    createdAt: new Date().toISOString(),
    resolutionImageUrl,
  };

  complaints[idx] = {
    ...complaint,
    status: newStatus,
    resolutionNote: newStatus === 'resolved' ? note : complaint.resolutionNote,
    resolutionImageUrl: resolutionImageUrl || complaint.resolutionImageUrl,
    statusHistory: [newHistoryItem, ...(complaint.statusHistory || [])],
    updatedAt: new Date().toISOString(),
  };

  saveComplaints(complaints);

  if (isSupabaseConfigured && supabase) {
    supabase
      .from('complaints')
      .update({
        status: newStatus,
        resolution_note: newStatus === 'resolved' ? note : complaint.resolutionNote,
        resolution_image_url: resolutionImageUrl || complaint.resolutionImageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', complaintId)
      .then();
  }

  return complaints[idx];
}

export function createComplaint(payload: Omit<Complaint, 'id' | 'ticketId' | 'supportsCount' | 'supportedUserIds' | 'statusHistory' | 'comments' | 'createdAt' | 'updatedAt'>): Complaint {
  const complaints = getStoredComplaints();
  const newTicketId = generateTicketId('CHN');
  const now = new Date().toISOString();

  const newComplaint: Complaint = {
    ...payload,
    id: `cmp-${Date.now()}`,
    ticketId: newTicketId,
    supportsCount: 1,
    supportedUserIds: [payload.userId],
    statusHistory: [
      {
        id: `hist-${Date.now()}`,
        status: 'submitted',
        note: 'Complaint submitted by citizen with verified location.',
        updatedByName: payload.userName,
        createdAt: now,
      },
    ],
    comments: [],
    createdAt: now,
    updatedAt: now,
  };

  saveComplaints([newComplaint, ...complaints]);

  if (isSupabaseConfigured && supabase) {
    supabase
      .from('complaints')
      .insert({
        id: newComplaint.id,
        ticket_id: newComplaint.ticketId,
        title: newComplaint.title,
        description: newComplaint.description,
        category: newComplaint.category,
        severity: newComplaint.severity,
        status: newComplaint.status,
        ward: newComplaint.ward,
        locality: newComplaint.locality,
        city: newComplaint.city,
        latitude: newComplaint.latitude,
        longitude: newComplaint.longitude,
        user_id: newComplaint.userId,
        user_name: newComplaint.userName,
        is_anonymous: newComplaint.isAnonymous,
        image_url: newComplaint.imageUrl,
        supports_count: 1,
        supported_user_ids: [payload.userId],
      })
      .then(({ error }) => {
        if (error) console.error('Supabase insert complaint error:', error);
      });
  }

  return newComplaint;
}

export function findNearbyDuplicates(latitude: number, longitude: number, category: string, maxKm: number = 0.8): Complaint[] {
  const complaints = getStoredComplaints();
  return complaints.filter((c) => {
    if (c.status === 'resolved' || c.status === 'rejected') return false;
    const dist = calculateDistance(latitude, longitude, c.latitude, c.longitude);
    return dist <= maxKm && c.category.toLowerCase() === category.toLowerCase();
  });
}

export function toggleJoinEvent(eventId: string, userId: string): { joined: boolean; count: number } {
  const events = getStoredEvents();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx === -1) return { joined: false, count: 0 };

  const event = events[idx];
  const userIds = event.joinedUserIds || [];
  const exists = userIds.includes(userId);

  const updatedUserIds = exists ? userIds.filter((id) => id !== userId) : [...userIds, userId];
  events[idx] = {
    ...event,
    joinedUserIds: updatedUserIds,
    attendeesCount: updatedUserIds.length,
  };

  saveEvents(events);
  return { joined: !exists, count: updatedUserIds.length };
}

export function getAuthorityMetrics(): AuthorityMetrics {
  const complaints = getStoredComplaints();
  const metrics: AuthorityMetrics = {
    totalComplaints: complaints.length,
    openComplaints: complaints.filter((c) => c.status === 'submitted' || c.status === 'under_review').length,
    inProgressComplaints: complaints.filter((c) => c.status === 'assigned' || c.status === 'in_progress').length,
    resolvedComplaints: complaints.filter((c) => c.status === 'resolved').length,
    criticalComplaints: complaints.filter((c) => c.severity === 'critical' && c.status !== 'resolved').length,
    avgResolutionDays: 1.8,
    byDepartment: {},
    byWard: {},
  };

  complaints.forEach((c) => {
    const dept = c.assignedDepartment || 'Unassigned';
    metrics.byDepartment[dept] = (metrics.byDepartment[dept] || 0) + 1;
    const ward = c.ward || 'General';
    metrics.byWard[ward] = (metrics.byWard[ward] || 0) + 1;
  });

  return metrics;
}
