import { ComplaintCategory, Severity, ComplaintStatus } from './types';

/**
 * Calculates Haversine distance between two lat/lon coordinates in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

export function formatDistanceText(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm} km away`;
}

/**
 * Generates a public tracking ticket ID, e.g. NGR-CHN-2026-00124
 */
export function generateTicketId(cityCode: string = 'CHN'): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `NGR-${cityCode.toUpperCase()}-${year}-${randomNum}`;
}

/**
 * Formats ISO date to readable Indian date format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getDepartmentForCategory(category: ComplaintCategory): string {
  switch (category) {
    case 'Pothole':
    case 'Broken Road':
    case 'Damaged Footpath':
      return 'Road & Infrastructure Department';
    case 'Garbage Accumulation':
    case 'Overflowing Bin':
    case 'Illegal Dumping':
      return 'Sanitation & Solid Waste Management';
    case 'Broken Streetlight':
      return 'Electrical & Street Lighting Department';
    case 'Water Leakage':
    case 'Blocked Drainage':
    case 'Flooded Road':
    case 'Open Manhole':
      return 'Metrowater & Drainage Board (CMWSSB)';
    case 'Fallen Tree':
      return 'Parks & Horticulture Department';
    case 'Traffic Signal Issue':
      return 'Greater Chennai Traffic Police';
    case 'Public Toilet Issue':
      return 'Public Health Department';
    case 'Stray Animal Concern':
      return 'Veterinary & Animal Control';
    default:
      return 'General Civic Administration';
  }
}

export function getCategoryBadgeColor(category: ComplaintCategory): string {
  switch (category) {
    case 'Pothole':
    case 'Broken Road':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Garbage Accumulation':
    case 'Overflowing Bin':
    case 'Illegal Dumping':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Broken Streetlight':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Water Leakage':
    case 'Blocked Drainage':
    case 'Flooded Road':
      return 'bg-cyan-100 text-cyan-800 border-cyan-300';
    case 'Open Manhole':
    case 'Traffic Signal Issue':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export function getSeverityStyle(severity: Severity): {
  bg: string;
  text: string;
  label: string;
} {
  switch (severity) {
    case 'low':
      return { bg: 'bg-green-100 border-green-300', text: 'text-green-800', label: 'Low Severity' };
    case 'medium':
      return { bg: 'bg-yellow-100 border-yellow-300', text: 'text-yellow-800', label: 'Medium Severity' };
    case 'high':
      return { bg: 'bg-orange-100 border-orange-300', text: 'text-orange-800', label: 'High Severity' };
    case 'critical':
      return { bg: 'bg-red-100 border-red-400 animate-pulse', text: 'text-red-800', label: 'Critical Risk' };
  }
}

export function getStatusStyle(status: ComplaintStatus): {
  bg: string;
  text: string;
  label: string;
} {
  switch (status) {
    case 'submitted':
      return { bg: 'bg-blue-100 border-blue-300', text: 'text-blue-800', label: 'Submitted' };
    case 'under_review':
      return { bg: 'bg-purple-100 border-purple-300', text: 'text-purple-800', label: 'Under Review' };
    case 'assigned':
      return { bg: 'bg-indigo-100 border-indigo-300', text: 'text-indigo-800', label: 'Assigned' };
    case 'in_progress':
      return { bg: 'bg-amber-100 border-amber-400', text: 'text-amber-800', label: 'In Progress' };
    case 'resolved':
      return { bg: 'bg-emerald-100 border-emerald-400', text: 'text-emerald-800', label: 'Resolved' };
    case 'rejected':
      return { bg: 'bg-red-100 border-red-300', text: 'text-red-800', label: 'Rejected' };
    case 'duplicate':
      return { bg: 'bg-gray-100 border-gray-300', text: 'text-gray-700', label: 'Duplicate Issue' };
  }
}

export function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
