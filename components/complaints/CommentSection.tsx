'use client';

import React, { useState } from 'react';
import { Comment } from '../../lib/types';
import { addCommentToComplaint } from '../../lib/adapters/dbAdapter';
import { getCurrentUser } from '../../lib/adapters/authAdapter';
import { formatDate } from '../../lib/utils';
import { MessageSquare, ShieldCheck, Send, ThumbsUp } from 'lucide-react';

interface Props {
  complaintId: string;
  initialComments: Comment[];
  onCommentAdded?: () => void;
}

export const CommentSection: React.FC<Props> = ({
  complaintId,
  initialComments = [],
  onCommentAdded = () => {},
}) => {
  const currentUser = getCurrentUser();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setIsSubmitting(true);
    try {
      const user = currentUser || { id: 'usr-cit-guest', fullName: 'Concerned Citizen', role: 'citizen' };
      const isOfficial = user.role === 'official';
      const newCmt = addCommentToComplaint(
        complaintId,
        user.id,
        user.fullName,
        body.trim(),
        isOfficial
      );
      setComments([newCmt, ...comments]);
      setBody('');
      onCommentAdded();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
        <MessageSquare className="w-4 h-4 text-[#1261A0]" />
        <h4 className="text-sm font-bold text-gray-900">
          Community & Authority Discussion ({comments.length})
        </h4>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={
            currentUser?.role === 'official'
              ? 'Post an official authority update or response...'
              : 'Add useful local details or updates about this issue...'
          }
          className="flex-1 px-3.5 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
        />
        <button
          type="submit"
          disabled={!body.trim() || isSubmitting}
          className="bg-[#1261A0] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#0e4d80] disabled:opacity-50 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Post</span>
        </button>
      </form>

      {/* Comment List */}
      <div className="space-y-3 pt-1">
        {comments.length === 0 ? (
          <p className="text-xs text-gray-500 italic py-2">
            No local comments yet. Be the first to share details!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                comment.isOfficial
                  ? 'bg-blue-50/80 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{comment.userName}</span>
                  {comment.isOfficial && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                      <ShieldCheck className="w-3 h-3" />
                      Official Response
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 font-medium">
                  {formatDate(comment.createdAt)}
                </span>
              </div>

              <p className="text-gray-800">{comment.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
