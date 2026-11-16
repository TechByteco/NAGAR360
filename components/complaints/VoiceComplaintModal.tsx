'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, Check, Globe } from 'lucide-react';

interface VoiceComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (data: { title: string; description: string; category: string }) => void;
}

export default function VoiceComplaintModal({
  isOpen,
  onClose,
  onTranscriptComplete,
}: VoiceComplaintModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [language, setLanguage] = useState<'ta' | 'en'>('ta');
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!isOpen) return null;

  const startRecording = () => {
    setIsRecording(true);
    setTranscript('');
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);

    // Simulate AI voice transcription & intent extraction
    setTimeout(() => {
      if (language === 'ta') {
        setTranscript(
          'எங்கள் தெருவில் பிரதான கழிவுநீர் குழாய் உடைந்து சாலை முழுவதும் துர்நாற்றத்துடன் கழிவுநீர் தேங்கியுள்ளது. பள்ளி குழந்தைகள் செல்ல முடியவில்லை.'
        );
      } else {
        setTranscript(
          'Deep open pothole on the turn near Apollo pharmacy on 2nd Avenue. Rainwater has filled it and multiple two-wheelers have skidded.'
        );
      }
      setIsProcessing(false);
    }, 1500);
  };

  const handleApply = () => {
    if (language === 'ta') {
      onTranscriptComplete({
        title: 'பிரதான கழிவுநீர் குழாய் உடைப்பு - சாலை முழுவதும் கழிவுநீர் தேக்கம்',
        description: transcript,
        category: 'Blocked Drainage',
      });
    } else {
      onTranscriptComplete({
        title: 'Dangerous water-filled pothole near Apollo pharmacy on 2nd Avenue',
        description: transcript,
        category: 'Pothole',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-saffron-orange/10 flex items-center justify-center text-saffron-orange">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">AI Voice Complaint Assistant</h3>
            <p className="text-xs text-slate-500">குரல் மூலம் புகார் பதிவு செய்யுங்கள்</p>
          </div>
        </div>

        {/* LANGUAGE SELECTOR */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setLanguage('ta')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              language === 'ta' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-saffron-orange" /> தமிழ் (Tamil)
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-nagar-blue" /> English
          </button>
        </div>

        {/* MIC ANIMATION AREA */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative">
            {isRecording && (
              <span className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
            )}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-xl ${
                isRecording
                  ? 'bg-rose-600 text-white shadow-rose-200 scale-105'
                  : 'bg-nagar-blue text-white shadow-blue-200 hover:scale-105'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              <span className="text-[10px] font-bold mt-1">
                {isRecording ? `00:${seconds < 10 ? '0' : ''}${seconds}` : 'Tap to Speak'}
              </span>
            </button>
          </div>

          <p className="text-xs font-medium text-slate-500 mt-4 text-center">
            {isRecording
              ? language === 'ta'
                ? 'உங்கள் பகுதியில் உள்ள குறையை பேசவும்...'
                : 'Listening... Describe the civic issue clearly.'
              : 'Tap microphone and explain your grievance'}
          </p>
        </div>

        {/* TRANSCRIPT PREVIEW */}
        {isProcessing && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-800 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
            AI is analyzing speech and identifying department...
          </div>
        )}

        {transcript && !isProcessing && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> Transcribed Audio
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                Tamil NLP Ready
              </span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed italic">"{transcript}"</p>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          {transcript && (
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 py-2.5 px-4 rounded-xl bg-nagar-blue text-white text-xs font-bold hover:bg-nagar-blue/90 transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-100"
            >
              <Check className="w-4 h-4" /> Autofill Report Form
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
