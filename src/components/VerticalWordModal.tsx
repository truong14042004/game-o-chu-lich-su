// src/components/VerticalWordModal.tsx
'use client';

import React, { useState } from 'react';
import { validateVerticalKeyword, hasVietnameseAccents } from '@/data/puzzleData';
import { sound } from '@/utils/soundEffects';
import { KeyRound, X, Sparkles } from 'lucide-react';

interface VerticalWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showAccents: boolean;
}

export const VerticalWordModal: React.FC<VerticalWordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [guessInput, setGuessInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim()) return;

    const isValid = validateVerticalKeyword(guessInput);

    if (isValid) {
      sound.playGrandVictory();
      setErrorMessage(null);
      onSuccess();
    } else {
      sound.playWrong();
      if (hasVietnameseAccents(guessInput)) {
        setErrorMessage('Chưa chính xác! Bạn đã điền sai dấu tiếng Việt rồi (hãy kiểm tra lại đúng từng dấu thanh và mũ/móc).');
      } else {
        setErrorMessage('Chưa chính xác! Hãy kiểm tra lại 12 chữ cái của từ khóa nhé.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-amber-500 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 flex flex-col gap-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-lg shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <span>Thử Thách Đặc Biệt (12 Chữ Cái)</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </span>
            <h3 className="text-xl font-black text-stone-100">
              Đoán Từ Khóa Hàng Dọc
            </h3>
          </div>
        </div>

        {/* Form input */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Nhập dự đoán từ khóa hàng dọc (Đúng dấu hoặc không dấu):
            </label>
            <input
              type="text"
              autoFocus
              value={guessInput}
              onChange={(e) => {
                setGuessInput(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="Nhập dự đoán từ khóa hàng dọc (12 chữ cái)..."
              className="w-full bg-stone-950 border-2 border-stone-700 focus:border-amber-400 rounded-2xl px-5 py-3.5 text-base sm:text-lg font-black text-center text-amber-300 placeholder-stone-600 uppercase tracking-widest outline-none shadow-inner transition-colors"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-950/90 border border-red-700 rounded-xl text-xs font-bold text-red-200 text-center animate-shake">
              {errorMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors"
            >
              Để Sau
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
            >
              Kiểm Tra
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
