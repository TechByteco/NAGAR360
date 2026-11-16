'use client';

import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../../lib/types';
import { updateComplaintStatus } from '../../lib/adapters/dbAdapter';
import { getCurrentUser } from '../../lib/adapters/authAdapter';
import { ImageUploader } from '../complaints/ImageUploader';
import { ShieldCheck, X, CheckCircle, Upload } from 'lucide-react';

interface Props {
  complaint: Complaint;
  onClose: () => void;
  onSuccess: () => void;
}

export const StatusUpdateModal: React.FC<Props> = ({ complaint, onClose, onSuccess }) => {
  const currentUser = getCurrentUser();
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [note, setNote] = useState('');
  const [resolutionImage, setResolutionImage] = useState<string>(complaint.resolutionImageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const officialName = currentUser?.fullName || 'GCC Executive Officer';
      updateComplaintStatus(
        complaint.id,
        status,
        note || `Status updated to ${status} by ${officialName}`,
        officialName,
        resolutionImage
      );
      onSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 text-[#F28C28] rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Update Official Complaint Status</h3>
            <p className="text-xs text-gray-500 font-mono">Ticket: {complaint.ticketId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Target Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
            >
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="assigned">Assigned to Department</option>
              <option value="in_progress">In Progress (Field Work)</option>
              <option value="resolved">Resolved (Fix Completed)</option>
              <option value="rejected">Rejected / Invalid</option>
              <option value="duplicate">Mark as Duplicate</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Official Action Note / Resolution Remark</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Describe work done by department crew, asphalt repair date, or field inspection notes..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
              required
            />
          </div>

          {/* Upload Resolution Evidence Photo if status is resolved */}
          {status === 'resolved' && (
            <div className="space-y-1.5 p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <label className="font-bold text-emerald-900 block flex items-center gap-1">
                <Upload className="w-4 h-4 text-emerald-600" />
                Upload After-Fix Evidence Photo (Mandatory for Hackathon Audit)
              </label>
              <ImageUploader
                initialImage={resolutionImage}
                onImageSelected={(base64) => setResolutionImage(base64)}
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#F28C28] text-white font-bold hover:bg-[#e07b18] shadow-md shadow-orange-500/20"
            >
              Save Official Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
