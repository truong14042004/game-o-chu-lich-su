// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { CROSSWORD_ITEMS } from '@/data/puzzleData';
import { sound } from '@/utils/soundEffects';
import { Header } from '@/components/Header';
import { UnifiedGameFlow } from '@/components/UnifiedGameFlow';
import { VerticalWordModal } from '@/components/VerticalWordModal';
import { HowToPlayModal } from '@/components/HowToPlayModal';
import { VictoryModal } from '@/components/VictoryModal';
import { PresentationMode } from '@/components/PresentationMode';

export default function Home() {
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [isVerticalSolved, setIsVerticalSolved] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showAccents, setShowAccents] = useState<boolean>(true);

  // Modals
  const [isVerticalModalOpen, setIsVerticalModalOpen] = useState<boolean>(false);
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState<boolean>(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Handler khi một hàng ô chữ được giải
  const handleSolveRow = (id: string) => {
    if (!solvedIds.includes(id)) {
      setSolvedIds(prev => [...prev, id]);
      setScore(prev => prev + 100);

      // Nếu đã mở hết 12 hàng
      if (solvedIds.length + 1 === CROSSWORD_ITEMS.length) {
        setScore(prev => prev + 500);
        if (!isVerticalSolved) {
          setTimeout(() => setIsVerticalModalOpen(true), 1200);
        }
      }
    }
  };

  // Handler khi giải đúng TỪ KHÓA HÀNG DỌC (LAMCHUTHOISO / LÀM CHỦ THỜI SỐ)
  const handleVerticalSolveSuccess = () => {
    setIsVerticalSolved(true);
    setIsVerticalModalOpen(false);
    setScore(prev => prev + 1000);
    setIsTimerRunning(false);

    // Mở tất cả các hàng
    setSolvedIds(CROSSWORD_ITEMS.map(item => item.id));

    setTimeout(() => {
      setIsVictoryModalOpen(true);
    }, 600);
  };

  // Reset ván chơi
  const handleResetGame = () => {
    setSolvedIds([]);
    setIsVerticalSolved(false);
    setScore(0);
    setTimeSeconds(0);
    setIsTimerRunning(true);
    sound.playTileClick();
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-stone-900 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      
      {/* Header */}
      <Header
        score={score}
        timeSeconds={timeSeconds}
        solvedCount={solvedIds.length}
        totalCount={CROSSWORD_ITEMS.length}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onReset={handleResetGame}
        onOpenHowToPlay={() => setIsHowToPlayModalOpen(true)}
        presentationMode={isPresentationMode}
        onTogglePresentationMode={() => setIsPresentationMode(true)}
        showAccents={showAccents}
        onToggleAccents={() => setShowAccents(!showAccents)}
      />

      {/* Main Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col items-center">
        
        {/* Sub-header topic banner */}
        <div className="w-full flex items-center justify-between gap-3 mb-6 bg-white/95 px-4 py-3 rounded-2xl border border-amber-200/80 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-stone-700 font-bold">
              Chủ đề: <strong className="text-red-700">Từ &quot;Diệt Giặc Dốt&quot; 1945 đến &quot;Bình Dân Học Vụ Số&quot;</strong>
            </span>
          </div>
        </div>

        {/* Unified Flow: Ma trận bên trái, Câu hỏi bên phải, Khung ô chữ thẳng tắp bên dưới */}
        <UnifiedGameFlow
          solvedIds={solvedIds}
          onSolveRow={handleSolveRow}
          onOpenVerticalGuess={() => setIsVerticalModalOpen(true)}
          onVerticalSolveSuccess={handleVerticalSolveSuccess}
          isVerticalSolved={isVerticalSolved}
          showAccents={showAccents}
        />

      </main>

      {/* Footer - Light Theme */}
      <footer className="w-full border-t border-amber-200 bg-white text-stone-600 text-xs py-4 px-6 text-center shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-stone-700">
            🇻🇳 Minigame Lịch Sử Đảng: Từ &quot;Diệt giặc dốt&quot; 1945 đến &quot;Bình dân học vụ số&quot; 2026
          </span>
        </div>
      </footer>

      {/* Modals */}
      <VerticalWordModal
        isOpen={isVerticalModalOpen}
        onClose={() => setIsVerticalModalOpen(false)}
        onSuccess={handleVerticalSolveSuccess}
        showAccents={showAccents}
      />

      <HowToPlayModal
        isOpen={isHowToPlayModalOpen}
        onClose={() => setIsHowToPlayModalOpen(false)}
      />

      <VictoryModal
        isOpen={isVictoryModalOpen}
        score={score}
        timeSeconds={timeSeconds}
        onReset={handleResetGame}
        onReviewBoard={() => setIsVictoryModalOpen(false)}
        showAccents={showAccents}
      />

      {/* Presentation Mode */}
      {isPresentationMode && (
        <PresentationMode
          onExit={() => setIsPresentationMode(false)}
          showAccents={showAccents}
          onToggleAccents={() => setShowAccents(!showAccents)}
        />
      )}

    </div>
  );
}
