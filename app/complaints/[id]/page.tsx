'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Complaint } from '../../../lib/types';
import { getComplaintById, getStoredComplaints, toggleSupport } from '../../../lib/adapters/dbAdapter';
import { getCurrentUser } from '../../../lib/adapters/authAdapter';
import { ComplaintStatusBadge } from '../../../components/ui/ComplaintStatusBadge';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { StatusTimeline } from '../../../components/complaints/StatusTimeline';
import { CommentSection } from '../../../components/complaints/CommentSection';
import { EditComplaintModal } from '../../../components/complaints/EditComplaintModal';
import { formatDate } from '../../../lib/utils';
import Link from 'next/link';
import {
  MapPin,
  ThumbsUp,
  Share2,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Printer,
  Edit3,
} from 'lucide-react';

export default function ComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = getCurrentUser();

  const loadData = () => {
    if (!id) return;
    const found = getComplaintById(id);
    setComplaint(found);
    setAllComplaints(getStoredComplaints());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('nagar360_store_update', loadData);
    return () => window.removeEventListener('nagar360_store_update', loadData);
  }, [id]);

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Complaint Ticket Not Found</h2>
        <p className="text-xs text-gray-500">
          The requested complaint ticket ID does not exist or was deleted.
        </p>
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 bg-[#1261A0] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Civic Feed
        </Link>
      </div>
    );
  }

  const userId = currentUser?.id || 'guest';
  const isSupported = (complaint.supportedUserIds || []).includes(userId);
  const canEdit = currentUser?.id === complaint.userId || currentUser?.role === 'official';

  const handleSupport = () => {
    toggleSupport(complaint.id, userId);
    loadData();
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: complaint.title,
          text: `Track issue ${complaint.ticketId} on Nagar360!`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const nearbyIssues = allComplaints.filter(
    (c) => c.id !== complaint.id && c.locality === complaint.locality
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Nav Back & Ticket Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>

        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#1261A0] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs"
            title="Print Summary"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Ticket</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#F28C28] bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Link!' : 'Share'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Complaint Details & Image */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-5">
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  Ticket ID: {complaint.ticketId}
                </span>
                <ComplaintStatusBadge status={complaint.status} />
              </div>

              <h1 className="text-2xl font-black text-gray-900 leading-tight">{complaint.title}</h1>

              <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-gray-800">
                  <MapPin className="w-4 h-4 text-[#F28C28]" />
                  {complaint.ward} ({complaint.locality}, {complaint.city})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(complaint.createdAt)}
                </span>
              </div>
            </div>

            {/* Media Image */}
            {complaint.imageUrl && (
              <div className="rounded-2xl overflow-hidden aspect-video bg-gray-100 border border-gray-200 relative">
                <img
                  src={complaint.imageUrl}
                  alt={complaint.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</h3>
              <p className="text-sm text-gray-800 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                {complaint.description}
              </p>
            </div>

            {/* Category & Department Meta */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-bold block mb-0.5">Category</span>
                <span className="font-bold text-gray-900">{complaint.category}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-bold block mb-0.5">Severity</span>
                <SeverityBadge severity={complaint.severity} />
              </div>
            </div>

            {/* Support Action Button */}
            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
              <button
                onClick={handleSupport}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isSupported
                    ? 'bg-[#1261A0] text-white shadow-md shadow-blue-600/20'
                    : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${isSupported ? 'fill-white' : ''}`} />
                <span>{isSupported ? 'Supported by You' : 'Support Issue'}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                  {complaint.supportsCount}
                </span>
              </button>

              <span className="text-xs text-gray-500 font-semibold">
                Filed by: {complaint.isAnonymous ? 'Anonymous Resident' : complaint.userName}
              </span>
            </div>
          </div>

          {/* Comments Component */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <CommentSection
              complaintId={complaint.id}
              initialComments={complaint.comments || []}
              onCommentAdded={loadData}
            />
          </div>
        </div>

        {/* Right Column: Status Lifecycle Timeline & Official Updates */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1261A0]" />
              <span>Authority Lifecycle & Status Timeline</span>
            </h3>

            {complaint.assignedDepartment && (
              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs text-blue-900">
                <span className="text-[10px] uppercase font-bold text-blue-700 block mb-0.5">Assigned Department</span>
                <span className="font-bold block">{complaint.assignedDepartment}</span>
              </div>
            )}

            <StatusTimeline
              history={complaint.statusHistory || []}
              resolutionNote={complaint.resolutionNote}
              resolutionImageUrl={complaint.resolutionImageUrl}
            />
          </div>

          {/* Nearby Similar Issues */}
          {nearbyIssues.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 space-y-3 text-xs">
              <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">
                Nearby Issues in {complaint.locality}
              </h4>
              <div className="space-y-2">
                {nearbyIssues.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href={`/complaints/${item.id}`}
                    className="block p-2.5 rounded-xl border border-gray-200 hover:border-[#1261A0] transition-colors"
                  >
                    <div className="font-bold text-gray-900 truncate">{item.title}</div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-1">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.supportsCount} Upvotes</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <EditComplaintModal
          complaint={complaint}
          onClose={() => setIsEditing(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
