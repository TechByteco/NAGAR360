'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from '../../components/complaints/ImageUploader';
import { AIAnalysisCard } from '../../components/complaints/AIAnalysisCard';
import { LocationPicker } from '../../components/complaints/LocationPicker';
import { analyseCivicImage } from '../../lib/adapters/aiAdapter';
import { createComplaint, findNearbyDuplicates } from '../../lib/adapters/dbAdapter';
import { getCurrentUser } from '../../lib/adapters/authAdapter';
import { reverseGeocodeLocation } from '../../lib/adapters/geocodeAdapter';
import VoiceComplaintModal from '../../components/complaints/VoiceComplaintModal';
import { AIAnalysisResult, Complaint, ComplaintCategory, Severity } from '../../lib/types';
import { getDepartmentForCategory } from '../../lib/utils';
import {
  Sparkles,
  MapPin,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  EyeOff,
  Loader2,
  Mic,
} from 'lucide-react';

export default function RaiseProblemPage() {
  const router = useRouter();
  const currentUser = getCurrentUser();

  const [step, setStep] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Form details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Pothole');
  const [severity, setSeverity] = useState<Severity>('high');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Location details
  const [locationData, setLocationData] = useState({
    latitude: 13.085,
    longitude: 80.2101,
    address: '2nd Avenue, Anna Nagar, Chennai, Tamil Nadu',
    locality: 'Anna Nagar',
    ward: 'Ward 102',
    city: 'Chennai',
  });

  // Read URL params if user arrived from map click (e.g. ?lat=13.08&lon=80.27)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const paramLat = params.get('lat');
    const paramLon = params.get('lon');

    if (paramLat && paramLon) {
      const latNum = parseFloat(paramLat);
      const lonNum = parseFloat(paramLon);
      if (!isNaN(latNum) && !isNaN(lonNum)) {
        reverseGeocodeLocation(latNum, lonNum).then((geo) => {
          setLocationData({
            latitude: latNum,
            longitude: lonNum,
            address: geo.address,
            locality: geo.locality,
            ward: geo.ward,
            city: geo.city || 'Chennai',
          });
        });
      }
    }
  }, []);

  const [duplicates, setDuplicates] = useState<Complaint[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 -> Step 2: Trigger AI Vision Inspection
  const handleImageUploaded = async (base64: string) => {
    setImageUrl(base64);
  };

  const handleRunAIInspection = async () => {
    if (!imageUrl) return;
    setIsAnalyzingAI(true);
    try {
      const result = await analyseCivicImage(imageUrl, description);
      setAiAnalysis(result);
      setCategory(result.category);
      setSeverity(result.severity);
      if (!title) {
        setTitle(`${result.category} reported near ${locationData.locality}`);
      }
      setStep(2);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // Step 2 -> Step 3: Location & Duplicate Check
  const handleProceedToLocation = () => {
    const foundDups = findNearbyDuplicates(
      locationData.latitude,
      locationData.longitude,
      category
    );
    setDuplicates(foundDups);
    setStep(3);
  };

  // Step 4 -> Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imageUrl) return;

    setIsSubmitting(true);
    try {
      const user = currentUser || {
        id: 'usr-cit-guest',
        fullName: 'Concerned Resident',
        role: 'citizen',
      };

      const newComplaint = createComplaint({
        userId: user.id,
        userName: user.fullName,
        title,
        description,
        category,
        severity,
        status: 'submitted',
        imageUrl,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.address,
        locality: locationData.locality,
        ward: locationData.ward,
        city: locationData.city,
        state: 'Tamil Nadu',
        assignedDepartment: getDepartmentForCategory(category),
        isAnonymous,
        aiAnalysis: aiAnalysis || undefined,
      });

      router.push(`/complaints/${newComplaint.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Stepper Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-gray-900">Report a Civic Problem</h1>
          <span className="text-xs font-bold text-[#1261A0] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Step {step} of 4
          </span>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { num: 1, label: 'Evidence' },
            { num: 2, label: 'AI Review' },
            { num: 3, label: 'Location' },
            { num: 4, label: 'Submit' },
          ].map((s) => (
            <div key={s.num} className="space-y-1">
              <div
                className={`h-2 rounded-full transition-all ${
                  step >= s.num ? 'bg-[#1261A0]' : 'bg-gray-200'
                }`}
              />
              <span
                className={`text-[10px] font-bold block text-center ${
                  step >= s.num ? 'text-[#1261A0]' : 'text-gray-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Upload Evidence */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-gray-900">Step 1: Upload Photo Evidence</h2>
              <p className="text-xs text-gray-500">
                Clear photos enable instant AI vision detection and faster municipal dispatch.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-2xs transition"
            >
              <Mic className="w-4 h-4 text-saffron-orange animate-pulse" />
              <span>Voice Report (குரல் பதிவு)</span>
            </button>
          </div>

          <ImageUploader
            initialImage={imageUrl}
            onImageSelected={(base64) => handleImageUploaded(base64)}
          />

          {imageUrl && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleRunAIInspection}
                disabled={isAnalyzingAI}
                className="bg-[#1261A0] hover:bg-[#0e4d80] text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                {isAnalyzingAI ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Running AI Vision Analysis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Analyze Photo with AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: AI Analysis Breakdown */}
      {step === 2 && aiAnalysis && (
        <div className="space-y-6">
          <AIAnalysisCard analysis={aiAnalysis} />

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-gray-900">Confirm Category & Urgency</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Confirmed Category</label>
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
                  <option value="Traffic Signal Issue">Traffic Signal Issue</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Confirmed Severity</label>
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

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-gray-500 font-semibold flex items-center gap-1 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" /> Change Photo
              </button>
              <button
                onClick={handleProceedToLocation}
                className="bg-[#1261A0] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-[#0d4d80]"
              >
                <span>Proceed to Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Location & Duplicate Risk Check */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-gray-900">Step 3: Incident Location</h2>
            <p className="text-xs text-gray-500">
              Pick location on map or use GPS auto-detection for accurate ward routing.
            </p>
          </div>

          <LocationPicker
            initialLat={locationData.latitude}
            initialLon={locationData.longitude}
            initialAddress={locationData.address}
            onLocationSelected={(data) => setLocationData(data)}
          />

          {/* Nearby Duplicate Warning */}
          {duplicates.length > 0 && (
            <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Similar Issue Reported Nearby ({duplicates.length})</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                A similar {category} issue was reported nearby ({duplicates[0].locality}). Upvoting existing tickets accelerates action!
              </p>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="text-gray-500 font-semibold flex items-center gap-1 hover:text-gray-900 text-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Back to AI
            </button>
            <button
              onClick={() => setStep(4)}
              className="bg-[#1261A0] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-[#0d4d80]"
            >
              <span>Add Description & Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Details & Submit */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5 text-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-gray-900">Step 4: Complaint Summary & Title</h2>
            <p className="text-xs text-gray-500">Provide clear details for municipal department inspectors.</p>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Headline / Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep Pothole outside School Entrance on 2nd Avenue"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1261A0] font-semibold text-gray-900"
              required
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Detailed Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe exact landmarks, danger to commuters, or duration of the issue..."
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1261A0] leading-relaxed"
              required
            />
          </div>

          <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded text-[#1261A0]"
            />
            <div className="flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-gray-500" />
              <span className="font-bold text-gray-800">Submit anonymously (Hide my name on public feed)</span>
            </div>
          </label>

          <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-2">
            <span className="font-bold text-blue-900 block">Dispatch Summary</span>
            <div className="grid grid-cols-2 gap-2 text-blue-900">
              <div>Category: <strong>{category}</strong></div>
              <div>Severity: <strong>{severity.toUpperCase()}</strong></div>
              <div>Ward: <strong>{locationData.ward}</strong></div>
              <div>Department: <strong>{getDepartmentForCategory(category)}</strong></div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-gray-500 font-semibold flex items-center gap-1 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Location
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#F28C28] hover:bg-[#e07b18] text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Submit Complaint</span>
            </button>
          </div>
        </form>
      )}

      {isVoiceModalOpen && (
        <VoiceComplaintModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          onTranscriptComplete={({ title: vTitle, description: vDesc, category: vCat }) => {
            setTitle(vTitle);
            setDescription(vDesc);
            setCategory(vCat as ComplaintCategory);
            setStep(3); // Jump to location step
          }}
        />
      )}
    </div>
  );
}
