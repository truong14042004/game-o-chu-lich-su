// src/components/OriginalImageModal.tsx
'use client';

import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface OriginalImageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalImageModal: React.FC<OriginalImageModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-stone-900 border-2 border-amber-600/60 rounded-3xl p-6 shadow-2xl text-stone-100 flex flex-col gap-4 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div>
            <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
              <span>Đề Bài Gốc: MINIGAME GIẢI Ô CHỮ</span>
            </h3>
            <p className="text-xs text-stone-400">
              Hình ảnh ma trận chữ cái 12x10 trong slide thuyết trình Lịch sử Đảng
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Display */}
        <div className="relative w-full overflow-auto rounded-xl bg-stone-950 flex items-center justify-center border border-stone-800 p-2">
          <Image
            src="/original-puzzle.png"
            alt="Đề bài minigame giải ô chữ gốc"
            width={700}
            height={550}
            className="rounded-lg shadow-lg object-contain max-h-[60vh] w-auto"
          />
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2 pt-2">
          <span>
            💡 <strong>Mẹo:</strong> Cột 0 từ hàng 3 đến hàng 8 chính là từ hàng dọc <strong>Đ - Ộ - C - L - Ậ - P</strong>!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-bold transition-colors"
          >
            Đóng & Tiếp tục chơi
          </button>
        </div>

      </div>
    </div>
  );
};
