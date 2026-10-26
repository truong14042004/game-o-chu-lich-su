// src/components/VictoryModal.tsx
'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Award, RotateCcw, Eye, Sparkles, Star } from 'lucide-react';
import { sound } from '@/utils/soundEffects';

interface VictoryModalProps {
  isOpen: boolean;
  score: number;
  timeSeconds: number;
  onReset: () => void;
  onReviewBoard: () => void;
  showAccents: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  score,
  timeSeconds,
  onReset,
  onReviewBoard,
  showAccents
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playGrandVictory();
      
      const duration = 3.5 * 1000;
      const animationEnd = Date.now() + duration;

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 60 * (timeLeft / duration);
        confetti({
          particleCount,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#DA251D', '#F59E0B', '#FCD34D', '#10B981', '#ffffff']
        });
      }, 350);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins} phút ${remaining} giây`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-stone-900 via-stone-900 to-red-950 border-4 border-amber-500 rounded-3xl p-6 sm:p-9 shadow-2xl text-stone-100 flex flex-col items-center text-center gap-5">
        
        {/* Golden Trophy with Star Glow */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 flex items-center justify-center text-stone-950 shadow-2xl border-4 border-amber-300 transform scale-110">
            <Trophy className="w-10 h-10" />
          </div>
          <div className="absolute -top-1 -right-1 text-amber-300 animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Victory Headline */}
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
            CHIẾN THẮNG TOÀN DIỆN
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2 text-white">
            Bạn Đã Giải Mã Thành Công!
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-md">
            Từ khóa hàng dọc của thời đại:
          </p>
        </div>

        {/* Vertical Keyword Highlight Box */}
        <div className="px-6 py-3 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-black text-xl sm:text-2xl tracking-widest uppercase shadow-xl flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
          <span>{showAccents ? 'LÀM CHỦ THỜI SỐ' : 'LAM CHU THOI SO'}</span>
          <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-md">
          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 flex flex-col items-center">
            <Award className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[10px] text-stone-400 uppercase">Tổng Điểm</span>
            <span className="text-base font-black text-amber-300">{score}</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 flex flex-col items-center">
            <Clock className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[10px] text-stone-400 uppercase">Thời Gian</span>
            <span className="text-xs font-bold text-stone-200 mt-0.5">{formatTime(timeSeconds)}</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 flex flex-col items-center">
            <Star className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[10px] text-stone-400 uppercase">Danh Hiệu</span>
            <span className="text-[11px] font-bold text-amber-300 mt-0.5 truncate max-w-full">Chiến Sĩ Số Xuất Sắc</span>
          </div>
        </div>

        {/* Takeaway */}
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/50 text-xs text-stone-300 leading-relaxed text-left">
          <p className="italic text-amber-200 mb-1">
            &quot;Tri thức là chìa khóa, công nghệ là cánh cửa để mở ra một tương lai tươi sáng hơn.&quot; — <strong>Tổng Bí thư Tô Lâm (26/3/2025)</strong>
          </p>
          <p className="text-stone-300">
            Từ lá phiếu 1946 giúp nhân dân làm chủ độc lập, đến tài khoản VNeID 2026 giúp toàn dân làm chủ công nghệ, tinh thần học tập suốt đời của dân tộc ta chưa bao giờ ngừng rực sáng!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full max-w-md">
          <button
            onClick={onReviewBoard}
            className="flex-1 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>Xem Bảng Ô Chữ</span>
          </button>

          <button
            onClick={onReset}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-stone-950" />
            <span>Chơi Lượt Mới</span>
          </button>
        </div>

      </div>
    </div>
  );
};
