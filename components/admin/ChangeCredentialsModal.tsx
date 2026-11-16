'use client';

import React, { useState } from 'react';
import { getOfficialCredentials, updateOfficialCredentials } from '../../lib/adapters/authAdapter';
import { Key, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangeCredentialsModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const currentCreds = getOfficialCredentials();
  const [newUserId, setNewUserId] = useState(currentCreds.userId);
  const [newPassword, setNewPassword] = useState(currentCreds.password);
  const [confirmPassword, setConfirmPassword] = useState(currentCreds.password);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newUserId.trim()) {
      setError('User ID cannot be empty.');
      return;
    }
    if (!newPassword.trim() || newPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New Password and Confirm Password do not match.');
      return;
    }

    updateOfficialCredentials(newUserId.trim(), newPassword.trim());
    setSuccessMsg('Official credentials successfully updated!');
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 text-[#F28C28] rounded-xl">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Change Official Login Credentials</h3>
            <p className="text-xs text-gray-500">Update User ID and Password for Authority Portal</p>
          </div>
        </div>

        {successMsg ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 text-red-700 font-semibold text-xs border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="font-bold text-gray-700 block mb-1">New User ID / Username</label>
              <input
                type="text"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
                required
              />
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
                className="px-5 py-2 rounded-xl bg-[#F28C28] text-white font-bold hover:bg-[#e07b18] shadow-md shadow-orange-500/20"
              >
                Save New Credentials
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
