// src/components/HowToPlayModal.tsx
'use client';

import React from 'react';
import { X, HelpCircle, Sparkles, BookOpen, KeyRound, AlertTriangle } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-600/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-amber-300">
                Luật Chơi & Hướng Dẫn Đồng Bộ
              </h3>
              <p className="text-xs text-stone-400">
                Từ &quot;Diệt giặc dốt&quot; 1945 đến &quot;Bình dân học vụ số&quot; 2025
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Steps */}
        <div className="space-y-4 text-xs sm:text-sm text-stone-300">
          
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 flex items-start gap-3">
            <span className="w-7 h-7 rounded-lg bg-red-800 text-amber-200 font-black text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <h4 className="font-bold text-amber-300 text-sm mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Tìm từ Đa Hướng trên Ma Trận 12x12</span>
              </h4>
              <p className="leading-relaxed text-stone-300">
                Kéo chuột hoặc bấm ô đầu và ô cuối để nối chữ theo 3 hướng: <strong className="text-amber-200">Hàng Ngang (H), Hàng Dọc (V) và Đường Chéo (D)</strong>. Các từ đều viết hoa không dấu để thử thách tư duy!
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 flex items-start gap-3">
            <span className="w-7 h-7 rounded-lg bg-amber-600 text-stone-950 font-black text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <h4 className="font-bold text-amber-300 text-sm mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Vượt Bẫy Đa Nghĩa & Điền Vào Chỗ Trống</span>
              </h4>
              <p className="leading-relaxed text-stone-200 mb-2">
                Mỗi câu hỏi có chứa bẫy đa nghĩa hài hước đánh lạc hướng:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-amber-100/90 pl-1">
                <li><code>LAPHIEU</code>: Bị bẫy thành <em>Lá phiêu</em> (chiếc lá trôi sông)!</li>
                <li><code>CANHCUA</code>: Bị bẫy thành <em>Canh cua</em> (bát canh cua mồng tơi)!</li>
                <li><code>CONGNGHE</code>: Bị bẫy thành <em>Cõng nghé</em> (cõng con trâu con nghé)!</li>
                <li><code>GIACDOT</code>: Bị bẫy thành <em>Giặt đốt</em> (quần áo đem giặt rồi đem đốt)!</li>
                <li><code>BINHDAN</code>: Bị bẫy thành <em>Bình đan</em> hoặc <em>Binh đao</em>!</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 flex items-start gap-3">
            <span className="w-7 h-7 rounded-lg bg-red-800 text-amber-200 font-black text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <h4 className="font-bold text-amber-300 text-sm mb-1 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Tương Tác Hai Chiều Liền Mạch</span>
              </h4>
              <p className="leading-relaxed text-stone-300">
                Bạn có thể <strong>quét từ trên ma trận</strong> để tự động điền câu hỏi, HOẶC <strong>gõ đáp án trực tiếp</strong> vào chỗ trống để hệ thống tự động thắp sáng chữ cái trên ô chữ hàng ngang!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/70 to-stone-800 border border-red-700/60 flex items-start gap-3">
            <span className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center shrink-0">
              4
            </span>
            <div>
              <h4 className="font-bold text-amber-300 text-sm mb-1 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Truy Tìm Từ Khóa Hàng Dọc (12 Chữ Cái)</span>
              </h4>
              <p className="leading-relaxed text-stone-300">
                12 chữ cái dọc tạo thành một từ khóa cốt lõi gồm 12 chữ cái kết nối từ năm 1946 đến năm 2026. Bấm nút &quot;ĐOÁN TỪ HÀNG DỌC&quot; bất cứ lúc nào để ghi điểm tuyệt đối!
              </p>
            </div>
          </div>

        </div>

        {/* Close Button */}
        <div className="pt-2 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            Đã Hiểu, Bắt Đầu!
          </button>
        </div>

      </div>
    </div>
  );
};
