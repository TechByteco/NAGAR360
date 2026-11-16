'use client';

import React, { useState } from 'react';
import { compressImageFile } from '../../lib/utils';
import { Upload, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';

interface Props {
  onImageSelected: (base64Image: string, fileName?: string) => void;
  initialImage?: string;
}

const SAMPLE_CIVIC_PHOTOS = [
  {
    name: 'Pothole Sample',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Garbage Dump Sample',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Streetlight Sample',
    url: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Water Leak Sample',
    url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=800',
  },
];

export const ImageUploader: React.FC<Props> = ({ onImageSelected, initialImage = '' }) => {
  const [imagePreview, setImagePreview] = useState<string>(initialImage);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const base64 = await compressImageFile(file);
      setImagePreview(base64);
      onImageSelected(base64, file.name);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSelectSample = (url: string, name: string) => {
    setImagePreview(url);
    onImageSelected(url, name);
  };

  return (
    <div className="space-y-3">
      {/* Main Upload Box */}
      <div className="border-2 border-dashed border-gray-300 hover:border-[#1261A0] transition-colors rounded-2xl p-6 text-center bg-gray-50/60 relative overflow-hidden">
        {imagePreview ? (
          <div className="relative group max-w-md mx-auto aspect-video rounded-xl overflow-hidden shadow-md">
            <img src={imagePreview} alt="Evidence preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Change Photo
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> Evidence Compressed & Ready
            </div>
          </div>
        ) : (
          <label className="cursor-pointer block py-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1261A0] mx-auto flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-gray-900 block mb-1">
              Upload Civic Issue Evidence Photo
            </span>
            <span className="text-xs text-gray-500 block mb-2">
              PNG, JPG, WebP up to 10MB (Auto-compressed)
            </span>
            <span className="inline-block bg-[#1261A0] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs">
              Browse Device Camera / Gallery
            </span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>

      {/* Demo Sample Photos Selector */}
      {!imagePreview && (
        <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl">
          <span className="text-[11px] font-bold text-amber-900 block mb-2">
            Or select a sample photo for quick demo testing:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SAMPLE_CIVIC_PHOTOS.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => handleSelectSample(sample.url, sample.name)}
                className="group border border-amber-200 rounded-lg overflow-hidden bg-white text-left hover:shadow-xs transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-1.5 text-[10px] font-bold text-gray-800 truncate">
                  {sample.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
