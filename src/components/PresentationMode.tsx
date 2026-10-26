// src/components/PresentationMode.tsx
'use client';

import React, { useState } from 'react';
import { CROSSWORD_ITEMS, VERTICAL_KEY_WORD } from '@/data/puzzleData';
import { sound } from '@/utils/soundEffects';
import confetti from 'canvas-confetti';
import { X, Eye, EyeOff, Volume2, KeyRound } from 'lucide-react';

interface PresentationModeProps {
  onExit: () => void;
  showAccents: boolean;
  onToggleAccents: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  onExit,
  showAccents,
  onToggleAccents
}) => {
  const [revealedRows, setRevealedRows] = useState<string[]>([]);
  const [revealedVertical, setRevealedVertical] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState(CROSSWORD_ITEMS[0]);

  const KEY_COL = 7;
  const TOTAL_GRID_COLS = 14;

  const toggleRow = (id: string) => {
    if (revealedRows.includes(id)) {
      setRevealedRows(revealedRows.filter(rId => rId !== id));
      sound.playTileClick();
    } else {
      setRevealedRows([...revealedRows, id]);
      sound.playMatchSuccess();
    }
  };

  const handleRevealAll = () => {
    setRevealedRows(CROSSWORD_ITEMS.map(w => w.id));
    setRevealedVertical(true);
    sound.playGrandVictory();
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
  };

  const handleReset = () => {
    setRevealedRows([]);
    setRevealedVertical(false);
    sound.playTileClick();
  };

  const handleRevealVertical = () => {
    setRevealedVertical(true);
    sound.playGrandVictory();
    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#DA251D', '#F59E0B', '#10B981']
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F5EEDB] text-stone-900 flex flex-col overflow-y-auto animate-fade-in">
      
      {/* Top Presentation Bar */}
      <div className="w-full bg-white border-b border-amber-300 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-red-700 text-amber-200 px-3 py-1 rounded-lg text-xs font-black shadow border border-red-600">
            <span>🇻🇳</span>
            <span>CHẾ ĐỘ TRÌNH CHIẾU GIẢNG ĐƯỜNG</span>
          </div>
          <span className="text-sm font-bold text-red-800 hidden sm:inline">
            MINIGAME GIẢI Ô CHỮ: TỪ DIỆT GIẶC DỐT ĐẾN BÌNH DÂN HỌC VỤ SỐ
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAccents}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors"
          >
            {showAccents ? 'Chữ có dấu' : 'Chữ không dấu'}
          </button>

          <button
            onClick={() => sound.playMatchSuccess()}
            title="Phát tiếng chuông đúng"
            className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow"
          >
            <X className="w-4 h-4" />
            <span>Thoát Trình Chiếu</span>
          </button>
        </div>
      </div>

      {/* Main Board Center */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col items-center justify-between gap-5">
        
        {/* The Big Classic Board */}
        <div className="relative w-full rounded-3xl p-6 sm:p-8 shadow-xl border-8 border-[#C5A059] overflow-x-auto select-none bg-[#F5EEDB] text-stone-900 flex flex-col items-center">
          
          <div className="relative flex flex-col gap-1.5 min-w-[720px] py-1">
            {CROSSWORD_ITEMS.map((row) => {
              const isRevealed = revealedRows.includes(row.id);
              const isSelected = activeItem.id === row.id;
              const startCol = KEY_COL - row.keyCharIndex;
              const letters = showAccents ? row.displayWord.replace(/\s+/g, '') : row.word;

              return (
                <div
                  key={row.id}
                  onClick={() => {
                    setActiveItem(row);
                    sound.playTileClick();
                  }}
                  className={`flex items-center py-0.5 px-1 rounded-xl transition-all cursor-pointer ${
                    isSelected ? 'bg-amber-300/40 ring-2 ring-amber-600' : 'hover:bg-amber-100/50'
                  }`}
                >
                  {/* Star Button */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRow(row.id);
                    }}
                    className="w-9 h-9 flex items-center justify-center mr-2 shrink-0 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    title="Click để Lật / Đóng hàng này"
                  >
                    <svg viewBox="0 0 51 48" className="w-8 h-8 drop-shadow">
                      <path
                        fill={isRevealed ? '#22c55e' : '#f59e0b'}
                        stroke="#b45309"
                        strokeWidth="2"
                        d="M25.5 0l7.8 15.9 17.5 2.5-12.7 12.3 3 17.3-15.6-8.2-15.6 8.2 3-17.3-12.7-12.3 17.5-2.5z"
                      />
                    </svg>
                    <span className="absolute font-black text-xs text-stone-900 select-none">
                      {row.order}
                    </span>
                  </div>

                  {/* 14 Fixed Column Tiles */}
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {Array.from({ length: TOTAL_GRID_COLS }).map((_, cIdx) => {
                      const col = cIdx + 1;
                      const isKeyCol = col === KEY_COL;
                      const isInside = col >= startCol && col < startCol + row.word.length;

                      if (!isInside) {
                        return (
                          <div 
                            key={`empty-${cIdx}`} 
                            className="w-8 h-8 sm:w-10 sm:h-10 invisible shrink-0" 
                          />
                        );
                      }

                      const letterIdx = col - startCol;
                      // Cột hoa phượng số 7 luôn hiển thị chữ không dấu (k dâu)
                      const letterChar = isKeyCol ? row.keyChar : (letters[letterIdx] || row.word[letterIdx]);
                      const shouldShow = isRevealed || (revealedVertical && isKeyCol);

                      return (
                        <div
                          key={`l-${cIdx}`}
                          className={`
                            relative w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg shrink-0
                            flex items-center justify-center font-black text-sm sm:text-lg
                            transition-all duration-300 shadow-md border-2
                            ${
                              isKeyCol
                                ? 'border-[#facc15] bg-[#1a120b] shadow-xl ring-1 ring-amber-400 z-10'
                                : 'border-emerald-300 bg-gradient-to-b from-[#4ade80] via-[#22c55e] to-[#15803d]'
                            }
                          `}
                        >
                          {isKeyCol && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-90 overflow-hidden rounded-md">
                              <span className="text-xl sm:text-2xl filter drop-shadow select-none">🌺</span>
                            </div>
                          )}

                          {shouldShow ? (
                            <span
                              className={`relative z-10 font-black tracking-tight select-none animate-flip ${
                                isKeyCol
                                  ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-base sm:text-xl font-serif'
                                  : 'text-[#064e3b] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'
                              }`}
                            >
                              {letterChar}
                            </span>
                          ) : (
                            <div className="w-full h-full rounded-sm opacity-80" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Button Lật / Ẩn */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRow(row.id);
                    }}
                    className="ml-3 px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-md border border-stone-300 shadow-xs transition-colors"
                  >
                    {isRevealed ? 'Ẩn' : 'Lật'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Row */}
          <div className="mt-5 pt-4 border-t-2 border-[#bfa472] w-full flex items-center justify-center gap-3">
            <div className="flex items-center gap-1 sm:gap-1.5 p-2 bg-[#2d1f11] rounded-2xl border-4 border-[#eab308] shadow-xl">
              {VERTICAL_KEY_WORD.word.split('').map((char, cIdx) => {
                const correspondingRow = CROSSWORD_ITEMS[cIdx];
                const isRevealed = revealedVertical || revealedRows.includes(correspondingRow.id);
                // Hiển thị chữ cái không dấu (k dâu): LAMCHUTHOISO
                const displayChar = char;

                return (
                  <div
                    key={`b-vert-${cIdx}`}
                    className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-black border-2 border-[#facc15] shadow-lg flex items-center justify-center overflow-hidden"
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl select-none opacity-90">
                      🌺
                    </span>
                    {isRevealed ? (
                      <span className="relative z-10 text-white font-serif font-black text-sm sm:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-flip">
                        {displayChar}
                      </span>
                    ) : (
                      <span className="relative z-10 text-amber-200/50 font-bold text-xs select-none">?</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              onClick={handleRevealVertical}
              className="relative w-12 h-12 flex items-center justify-center cursor-pointer transform hover:scale-110 active:scale-95 transition-transform"
              title="Lật mở từ hàng dọc"
            >
              <svg viewBox="0 0 51 48" className="w-full h-full drop-shadow-lg">
                <path
                  fill="#f59e0b"
                  stroke="#b45309"
                  strokeWidth="2"
                  d="M25.5 0l7.8 15.9 17.5 2.5-12.7 12.3 3 17.3-15.6-8.2-15.6 8.2 3-17.3-12.7-12.3 17.5-2.5z"
                />
              </svg>
              <span className="absolute font-black text-xs text-stone-900 select-none">
                Dọc
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Question Prompt & Controls */}
        <div className="w-full bg-white border-2 border-amber-300 rounded-3xl p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-md bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center">
                {activeItem.order}
              </span>
              <span className="text-xs font-bold text-red-700 uppercase">
                Câu Hỏi Số {activeItem.order} ({activeItem.word.length} chữ cái)
              </span>
            </div>
            <div className="text-sm sm:text-base font-semibold text-stone-900">
              {activeItem.clozeSentence}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleRow(activeItem.id)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>{revealedRows.includes(activeItem.id) ? 'Ẩn Hàng Này' : 'Mở Hàng Này'}</span>
            </button>
            <button
              onClick={handleRevealAll}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Mở Hết
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl border border-stone-300"
            >
              Đóng Hết
            </button>
            <button
              onClick={handleRevealVertical}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <KeyRound className="w-4 h-4" />
              <span>Mở Từ Dọc</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
