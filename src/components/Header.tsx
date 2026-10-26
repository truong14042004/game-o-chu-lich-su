// src/components/Header.tsx
'use client';

import React from 'react';
import { Volume2, VolumeX, RotateCcw, Monitor, Sparkles, HelpCircle } from 'lucide-react';
import { sound } from '@/utils/soundEffects';

interface HeaderProps {
  score: number;
  timeSeconds: number;
  solvedCount: number;
  totalCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
  onOpenHowToPlay: () => void;
  presentationMode: boolean;
  onTogglePresentationMode: () => void;
  showAccents: boolean;
  onToggleAccents: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  timeSeconds,
  solvedCount,
  totalCount,
  isMuted,
  onToggleMute,
  onReset,
  onOpenHowToPlay,
  presentationMode,
  onTogglePresentationMode,
  showAccents,
  onToggleAccents
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <header className="relative w-full border-b border-amber-200 bg-white shadow-sm z-20">
      {/* Top Heritage Red & Gold decorative band */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-400 to-red-600" />

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Main Title with Vietnamese Flag Badge */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-8 bg-red-600 rounded-md shadow border border-red-500 flex items-center justify-center transform -rotate-2">
              <span className="text-amber-300 text-lg font-bold leading-none select-none">★</span>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-amber-600 shadow-sm" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-red-700">
                  MINIGAME GIẢI Ô CHỮ
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                  LỊCH SỬ ĐẢNG
                </span>
              </div>
              <p className="text-[11px] text-stone-600 font-medium flex items-center gap-1.5 mt-0.5">
                <span>Từ &quot;Diệt giặc dốt&quot; 1945</span>
                <span className="text-red-500 font-bold">→</span>
                <span className="text-red-700 font-bold">&quot;Bình dân học vụ số&quot;</span>
              </p>
            </div>
          </div>

          {/* Right: Clean Stats & Toolbar in Light Theme */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center">
            
            {/* Progress Badge */}
            <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-xs">
              <span className="text-emerald-700">Đã mở:</span>
              <strong className="text-emerald-800 text-sm">{solvedCount}/{totalCount}</strong>
            </div>

            {/* Score & Time */}
            <div className="flex items-center gap-2 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-semibold text-amber-950 shadow-xs">
              <span className="text-amber-800">Điểm:</span>
              <strong className="text-amber-900 text-sm">{score}</strong>
              <span className="text-amber-300">|</span>
              <span className="font-mono text-amber-900">{formatTime(timeSeconds)}</span>
            </div>

            {/* Accent Mode Toggle */}
            <button
              onClick={() => {
                onToggleAccents();
                sound.playTileClick();
              }}
              title={showAccents ? "Đang bật chữ có dấu" : "Đang bật chữ không dấu"}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 shadow-xs ${
                showAccents
                  ? 'bg-amber-500 text-stone-950 border-amber-400'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{showAccents ? 'Có dấu' : 'Không dấu'}</span>
            </button>

            {/* Presentation Mode */}
            <button
              onClick={() => {
                onTogglePresentationMode();
                sound.playTileClick();
              }}
              title="Chế độ Trình chiếu Lớp học"
              className="p-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors shadow-xs"
            >
              <Monitor className="w-4 h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={onToggleMute}
              title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
              className="p-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 transition-colors shadow-xs"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>

            {/* How to play */}
            <button
              onClick={() => {
                onOpenHowToPlay();
                sound.playTileClick();
              }}
              title="Hướng dẫn luật chơi"
              className="p-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-amber-600 transition-colors shadow-xs"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Reset */}
            <button
              onClick={onReset}
              title="Làm mới trò chơi"
              className="p-2 rounded-xl bg-white hover:bg-red-50 border border-stone-200 text-stone-400 hover:text-red-600 transition-colors shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
