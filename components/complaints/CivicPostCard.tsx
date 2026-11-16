'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Complaint } from '../../lib/types';
import { ComplaintStatusBadge } from '../ui/ComplaintStatusBadge';
import { SeverityBadge } from '../ui/SeverityBadge';
import { formatDate, getCategoryBadgeColor } from '../../lib/utils';
import { toggleSupport } from '../../lib/adapters/dbAdapter';
import { getCurrentUser } from '../../lib/adapters/authAdapter';
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface Props {
  complaint: Complaint;
  onUpdate?: () => void;
}

export const CivicPostCard: React.FC<Props> = ({ complaint, onUpdate = () => {} }) => {
  const currentUser = getCurrentUser();
  const userId = currentUser?.id || 'guest';
  const isSupported = (complaint.supportedUserIds || []).includes(userId);
  const [supportsCount, setSupportsCount] = useState(complaint.supportsCount);
  const [supported, setSupported] = useState(isSupported);
  const [copied, setCopied] = useState(false);

  const handleSupport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = toggleSupport(complaint.id, userId);
    setSupported(res.supported);
    setSupportsCount(res.count);
    onUpdate();
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/complaints/${complaint.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Nagar360 Issue: ${complaint.title}`,
          text: `Help resolve this civic issue in ${complaint.locality}, ${complaint.city}! Ticket: ${complaint.ticketId}`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const categoryBadgeStyle = getCategoryBadgeColor(complaint.category);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Header Info */}
      <div className="p-4 pb-3 flex items-start justify-between gap-3 border-b border-gray-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1261A0] to-[#2E9B5B] flex items-center justify-center text-white font-bold text-xs shadow-xs">
            {complaint.userName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900">
                {complaint.isAnonymous ? 'Anonymous Citizen' : complaint.userName}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                • {formatDate(complaint.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#1261A0] font-medium mt-0.5">
              <MapPin className="w-3 h-3 text-[#F28C28]" />
              <span>{complaint.ward} ({complaint.locality}, {complaint.city})</span>
            </div>
          </div>
        </div>

        <ComplaintStatusBadge status={complaint.status} size="sm" />
      </div>

      {/* Main Content Area */}
      <Link href={`/complaints/${complaint.id}`} className="p-4 flex-1 block group">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${categoryBadgeStyle}`}>
            {complaint.category}
          </span>
          <SeverityBadge severity={complaint.severity} />
          {complaint.aiAnalysis && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span>AI Verified</span>
            </span>
          )}
          <span className="text-[10px] font-mono text-gray-500 ml-auto">
            {complaint.ticketId}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#1261A0] transition-colors leading-snug mb-1.5">
          {complaint.title}
        </h3>

        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
          {complaint.description}
        </p>

        {/* Media Thumbnail */}
        {complaint.imageUrl && (
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-3 border border-gray-200">
            <img
              src={complaint.imageUrl}
              alt={complaint.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {complaint.status === 'resolved' && complaint.resolutionImageUrl && (
              <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Fixed Evidence Photo</span>
              </div>
            )}
          </div>
        )}

        {/* Official Note snippet if assigned */}
        {complaint.assignedDepartment && (
          <div className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center justify-between text-slate-700">
            <span className="font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1261A0]" />
              {complaint.assignedDepartment}
            </span>
            <span className="text-[10px] text-[#1261A0] font-bold group-hover:underline flex items-center gap-0.5">
              View Timeline <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        )}
      </Link>

      {/* Footer Action Bar */}
      <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
        <button
          onClick={handleSupport}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            supported
              ? 'bg-[#1261A0] text-white shadow-xs'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${supported ? 'fill-white' : ''}`} />
          <span>{supported ? 'Supported' : 'Support Issue'}</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
            {supportsCount}
          </span>
        </button>

        <Link
          href={`/complaints/${complaint.id}`}
          className="flex items-center gap-1.5 text-gray-600 hover:text-[#1261A0] font-medium px-2 py-1 rounded-lg hover:bg-gray-100"
        >
          <MessageSquare className="w-4 h-4 text-gray-500" />
          <span>{complaint.comments?.length || 0} Comments</span>
        </Link>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-900 font-medium px-2 py-1 rounded-lg hover:bg-gray-100"
          title="Share Issue"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">{copied ? 'Copied Link!' : 'Share'}</span>
        </button>
      </div>
    </div>
  );
};
