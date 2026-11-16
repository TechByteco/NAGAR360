'use client';

import React, { useState } from 'react';
import { Complaint, ComplaintCategory, Severity } from '../../lib/types';
import { updateComplaintDetails } from '../../lib/adapters/dbAdapter';
import { Edit3, X, CheckCircle } from 'lucide-react';

interface Props {
  complaint: Complaint;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditComplaintModal: React.FC<Props> = ({ complaint, onClose, onSuccess }) => {
  const [title, setTitle] = useState(complaint.title);
  const [description, setDescription] = useState(complaint.description);
  const [category, setCategory] = useState<ComplaintCategory>(complaint.category);
  const [severity, setSeverity] = useState<Severity>(complaint.severity);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      updateComplaintDetails(complaint.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        severity,
      });
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
          <div className="p-2 bg-blue-100 text-[#1261A0] rounded-xl">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Edit Submitted Complaint Details</h3>
            <p className="text-xs text-gray-500 font-mono">Ticket: {complaint.ticketId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Issue Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
              required
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Description & Field Notes</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-semibold text-gray-800"
              >
                <option value="Pothole">Pothole</option>
                <option value="Garbage Accumulation">Garbage Accumulation</option>
                <option value="Broken Streetlight">Broken Streetlight</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="Blocked Drainage">Blocked Drainage</option>
                <option value="Fallen Tree">Fallen Tree</option>
                <option value="Damaged Footpath">Damaged Footpath</option>
                <option value="Open Manhole">Open Manhole</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-semibold text-gray-800"
              >
                <option value="low">Low Severity</option>
                <option value="medium">Medium Severity</option>
                <option value="high">High Severity</option>
                <option value="critical">Critical Risk</option>
              </select>
            </div>
          </div>

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
              className="px-5 py-2 rounded-xl bg-[#1261A0] text-white font-bold hover:bg-[#0d4d80] shadow-md shadow-blue-600/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
