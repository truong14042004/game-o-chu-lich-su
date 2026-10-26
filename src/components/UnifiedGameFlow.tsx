// src/components/UnifiedGameFlow.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { 
  CROSSWORD_ITEMS, 
  WORD_SEARCH_GRID, 
  VERTICAL_KEY_WORD, 
  validateAnswer,
  validateVerticalKeyword,
  hasVietnameseAccents,
  CrosswordItem
} from '@/data/puzzleData';
import { sound } from '@/utils/soundEffects';
import { 
  CheckCircle2, 
  Send, 
  HelpCircle, 
  Trophy, 
  Grid, 
  Sparkles, 
  Search, 
  BookOpen, 
  Filter,
  Crown,
  RotateCcw,
  Zap,
  CheckCheck,
  Flame,
  Check
} from 'lucide-react';

interface UnifiedGameFlowProps {
  solvedIds: string[];
  onSolveRow: (id: string) => void;
  onOpenVerticalGuess: () => void;
  onVerticalSolveSuccess?: () => void;
  isVerticalSolved: boolean;
  showAccents: boolean;
}

interface CellCoord {
  row: number;
  col: number;
}

export const UnifiedGameFlow: React.FC<UnifiedGameFlowProps> = ({
  solvedIds,
  onSolveRow,
  onVerticalSolveSuccess,
  isVerticalSolved,
  showAccents
}) => {
  // 12 câu hỏi được xáo trộn ngẫu nhiên (không theo thứ tự 1 -> 12)
  const [shuffledQuestions, setShuffledQuestions] = useState<CrosswordItem[]>(CROSSWORD_ITEMS);
  const [solvedQuestionIds, setSolvedQuestionIds] = useState<string[]>([]);

  // Quản lý input và feedback riêng cho từng câu hỏi
  const [questionInputs, setQuestionInputs] = useState<Record<string, string>>({});
  const [questionFeedbacks, setQuestionFeedbacks] = useState<Record<string, { isCorrect: boolean; text: string }>>({});
  const [focusedQuestionId, setFocusedQuestionId] = useState<string>(CROSSWORD_ITEMS[0].id);
  const [filterMode, setFilterMode] = useState<'all' | 'unsolved' | 'solved'>('all');

  // Danh sách ID các từ đã tìm thấy từ ma trận
  const [foundWordsInMatrix, setFoundWordsInMatrix] = useState<string[]>([]);
  const [matrixNotification, setMatrixNotification] = useState<string | null>(null);

  // ==============================================================
  // USER TỰ NHẬP TRỰC TIẾP VÀO TỪNG Ô KHÔNG DẤU TRÊN KHUNG Ô CHỮ
  // ==============================================================
  const [rowTileGuesses, setRowTileGuesses] = useState<Record<string, string[]>>({});
  const tileInputRefs = useRef<Record<string, (HTMLInputElement | null)[]>>({});
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Trạng thái kéo chọn ma trận
  const [startCell, setStartCell] = useState<CellCoord | null>(null);
  const [currentCell, setCurrentCell] = useState<CellCoord | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Ref cho scroll container danh sách câu hỏi
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Bàn đoán từ khóa hàng dọc (12 ô cho user tự nhập không dấu)
  const [cellGuesses, setCellGuesses] = useState<string[]>(Array(12).fill(''));
  const [rawInputGuess, setRawInputGuess] = useState<string>('');
  const [verticalFeedback, setVerticalFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Refs cho animation GSAP và điều hướng input từ khóa dọc
  const cellInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verticalDeckRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  // CỘT TỪ KHÓA HÀNG DỌC CỐ ĐỊNH Ở CỘT 7 (1-based: từ 1 đến 14)
  const KEY_COL = 7;
  const TOTAL_GRID_COLS = 14;

  // Xáo trộn thứ tự 12 câu hỏi khi tải trang để không theo thứ tự 1 -> 12
  useEffect(() => {
    const timer = setTimeout(() => {
      setShuffledQuestions([...CROSSWORD_ITEMS].sort(() => Math.random() - 0.5));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Tính các ô trên đường thẳng
  const getSelectedPath = (start: CellCoord, end: CellCoord): CellCoord[] => {
    const path: CellCoord[] = [];
    const dRow = end.row - start.row;
    const dCol = end.col - start.col;

    if (dRow === 0 && dCol === 0) return [start];

    if (dRow === 0) {
      const step = dCol > 0 ? 1 : -1;
      const count = Math.abs(dCol);
      for (let i = 0; i <= count; i++) path.push({ row: start.row, col: start.col + i * step });
    } else if (dCol === 0) {
      const step = dRow > 0 ? 1 : -1;
      const count = Math.abs(dRow);
      for (let i = 0; i <= count; i++) path.push({ row: start.row + i * step, col: start.col });
    } else if (Math.abs(dRow) === Math.abs(dCol)) {
      const stepR = dRow > 0 ? 1 : -1;
      const stepC = dCol > 0 ? 1 : -1;
      const count = Math.abs(dRow);
      for (let i = 0; i <= count; i++) path.push({ row: start.row + i * stepR, col: start.col + i * stepC });
    } else {
      path.push(start);
    }
    return path;
  };

  const activeSelection = startCell && currentCell ? getSelectedPath(startCell, currentCell) : [];

  const isCellInSelection = (r: number, c: number) => {
    return activeSelection.some(cell => cell.row === r && cell.col === c);
  };

  const isCellInFoundWord = (r: number, c: number) => {
    return CROSSWORD_ITEMS.some(item => {
      if (!foundWordsInMatrix.includes(item.id)) return false;
      const path = getSelectedPath(
        { row: item.startRow, col: item.startCol },
        { row: item.endRow, col: item.endCol }
      );
      return path.some(p => p.row === r && p.col === c);
    });
  };

  // Quét từ trên ma trận: chỉ lưu vào túi từ đã tìm thấy
  const checkSelection = useCallback((start: CellCoord, end: CellCoord) => {
    const path = getSelectedPath(start, end);
    const selectedLetters = path.map(p => WORD_SEARCH_GRID[p.row][p.col]).join('');
    const reversedLetters = [...selectedLetters].reverse().join('');

    const matchedItem = CROSSWORD_ITEMS.find(item => {
      const matchForward = (
        item.startRow === start.row && item.startCol === start.col &&
        item.endRow === end.row && item.endCol === end.col
      );
      const matchBackward = (
        item.startRow === end.row && item.startCol === end.col &&
        item.endRow === start.row && item.endCol === start.col
      );
      const matchLetters = (item.word === selectedLetters || item.word === reversedLetters);
      return matchForward || matchBackward || matchLetters;
    });

    if (matchedItem) {
      sound.playWordFound();
      if (!foundWordsInMatrix.includes(matchedItem.id)) {
        setFoundWordsInMatrix(prev => [...prev, matchedItem.id]);
        setMatrixNotification(`Đã tìm thấy từ: "${matchedItem.displayWord}"!`);
      } else {
        setMatrixNotification(`Từ "${matchedItem.displayWord}" đã có trong túi từ của bạn!`);
      }
      setTimeout(() => setMatrixNotification(null), 4000);
    } else {
      sound.playTileClick();
    }
  }, [foundWordsInMatrix]);

  const handleCellClick = (r: number, c: number) => {
    sound.playTileClick();
    if (!startCell) {
      setStartCell({ row: r, col: c });
      setCurrentCell({ row: r, col: c });
    } else {
      checkSelection(startCell, { row: r, col: c });
      setStartCell(null);
      setCurrentCell(null);
    }
  };

  const handleMouseDown = (r: number, c: number) => {
    setIsDragging(true);
    setStartCell({ row: r, col: c });
    setCurrentCell({ row: r, col: c });
    sound.playTileClick();
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isDragging && startCell) {
      setCurrentCell({ row: r, col: c });
    }
  };

  const handleMouseUp = () => {
    if (isDragging && startCell && currentCell) {
      checkSelection(startCell, currentCell);
    }
    setIsDragging(false);
    setStartCell(null);
    setCurrentCell(null);
  };

  useEffect(() => {
    const onGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setStartCell(null);
        setCurrentCell(null);
      }
    };
    window.addEventListener('mouseup', onGlobalMouseUp);
    return () => window.removeEventListener('mouseup', onGlobalMouseUp);
  }, [isDragging]);

  // Cuộn mượt đến câu hỏi được chỉ định
  const scrollToQuestion = (id: string) => {
    setFocusedQuestionId(id);
    const el = questionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    sound.playTileClick();
  };

  // KIỂM TRA ĐÁP ÁN CHO TỪNG CÂU HỎI
  const handleCheckQuestion = (e: React.FormEvent, item: CrosswordItem) => {
    e.preventDefault();
    const currentInput = (questionInputs[item.id] || '').trim();
    if (!currentInput) return;

    const isValid = validateAnswer(currentInput, item);

    if (isValid) {
      sound.playMatchSuccess();
      if (!solvedQuestionIds.includes(item.id)) {
        setSolvedQuestionIds(prev => [...prev, item.id]);
      }
      setQuestionFeedbacks(prev => ({
        ...prev,
        [item.id]: {
          isCorrect: true,
          text: `Chính xác! Đáp án câu này là "${item.displayWord}". Hãy tìm hàng ngang phù hợp ở bảng ô chữ bên dưới để điền từ này vào!`
        }
      }));
      setQuestionInputs(prev => ({ ...prev, [item.id]: '' }));
    } else {
      sound.playWrong();
      setQuestionFeedbacks(prev => ({
        ...prev,
        [item.id]: {
          isCorrect: false,
          text: `Chưa chính xác cho câu này! Hãy kiểm tra lại số chữ cái (${item.word.length} chữ) và đúng dấu nhé.`
        }
      }));
    }
  };

  // Dán từ vào câu hỏi đang chọn
  const handleInsertWordToQuestion = (word: string, targetQuestionId: string) => {
    setQuestionInputs(prev => ({ ...prev, [targetQuestionId]: word }));
    setFocusedQuestionId(targetQuestionId);
    sound.playTileClick();
  };

  // ==============================================================
  // USER TỰ GÕ TRỰC TIẾP VÀO TỪNG Ô TRÊN KHUNG Ô CHỮ (KHÔNG DẤU)
  // ==============================================================
  const checkRowGuess = (row: CrosswordItem, guesses: string[]) => {
    const typedWord = guesses.join('').trim().toUpperCase();
    const expected = row.word.toUpperCase();

    if (typedWord === expected) {
      sound.playMatchSuccess();
      onSolveRow(row.id);
      if (!solvedQuestionIds.includes(row.id)) {
        setSolvedQuestionIds(prev => [...prev, row.id]);
      }

      // GSAP Flip animation trên hàng ô chữ
      const rowEl = rowRefs.current[row.id];
      if (rowEl) {
        const tiles = rowEl.querySelectorAll('.crossword-tile');
        if (tiles.length > 0) {
          gsap.fromTo(
            tiles,
            { rotateY: 180, scale: 0.8 },
            { rotateY: 0, scale: 1, duration: 0.6, stagger: 0.05, ease: 'back.out(2)' }
          );
        }
      }
    } else {
      sound.playWrong();
      // GSAP Shake trên hàng ô chữ
      const rowEl = rowRefs.current[row.id];
      if (rowEl) {
        gsap.fromTo(
          rowEl,
          { x: -12 },
          { x: 12, duration: 0.07, repeat: 4, yoyo: true, ease: 'sine.inOut', onComplete: () => {
            gsap.set(rowEl, { x: 0 });
          }}
        );
      }
    }
  };

  const handleRowTileChange = (row: CrosswordItem, letterIdx: number, rawVal: string) => {
    const char = rawVal
      .slice(-1)
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/Đ/g, 'D');

    if (char && !/[A-Z0-9]/.test(char)) return;

    const currentGuesses = rowTileGuesses[row.id] 
      ? [...rowTileGuesses[row.id]] 
      : Array(row.word.length).fill('');
    currentGuesses[letterIdx] = char;

    setRowTileGuesses(prev => ({
      ...prev,
      [row.id]: currentGuesses
    }));

    if (char) {
      sound.playTileClick();
      // Micro-punch animation on this tile
      const el = tileInputRefs.current[row.id]?.[letterIdx];
      if (el) {
        gsap.fromTo(el, { scale: 1.25 }, { scale: 1, duration: 0.18, ease: 'back.out(2)' });
      }
      // Tự động focus sang ô kế tiếp trong hàng
      if (letterIdx + 1 < row.word.length) {
        tileInputRefs.current[row.id]?.[letterIdx + 1]?.focus();
      } else {
        // Nếu đã điền đủ toàn bộ các ô trong hàng thì tự động kiểm tra
        const isAllFilled = currentGuesses.every(c => c && c.trim().length > 0);
        if (isAllFilled) {
          checkRowGuess(row, currentGuesses);
        }
      }
    }
  };

  const handleRowTileKeyDown = (row: CrosswordItem, letterIdx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentGuesses = rowTileGuesses[row.id] 
      ? [...rowTileGuesses[row.id]] 
      : Array(row.word.length).fill('');

    if (e.key === 'Backspace') {
      if (!currentGuesses[letterIdx]) {
        if (letterIdx > 0) {
          e.preventDefault();
          currentGuesses[letterIdx - 1] = '';
          setRowTileGuesses(prev => ({ ...prev, [row.id]: currentGuesses }));
          tileInputRefs.current[row.id]?.[letterIdx - 1]?.focus();
        }
      } else {
        currentGuesses[letterIdx] = '';
        setRowTileGuesses(prev => ({ ...prev, [row.id]: currentGuesses }));
      }
    } else if (e.key === 'ArrowLeft') {
      if (letterIdx > 0) {
        tileInputRefs.current[row.id]?.[letterIdx - 1]?.focus();
      }
    } else if (e.key === 'ArrowRight') {
      if (letterIdx + 1 < row.word.length) {
        tileInputRefs.current[row.id]?.[letterIdx + 1]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      const curIndex = CROSSWORD_ITEMS.findIndex(it => it.id === row.id);
      if (curIndex > 0) {
        const prevRow = CROSSWORD_ITEMS[curIndex - 1];
        const targetIdx = Math.min(letterIdx, prevRow.word.length - 1);
        tileInputRefs.current[prevRow.id]?.[targetIdx]?.focus();
      }
    } else if (e.key === 'ArrowDown') {
      const curIndex = CROSSWORD_ITEMS.findIndex(it => it.id === row.id);
      if (curIndex + 1 < CROSSWORD_ITEMS.length) {
        const nextRow = CROSSWORD_ITEMS[curIndex + 1];
        const targetIdx = Math.min(letterIdx, nextRow.word.length - 1);
        tileInputRefs.current[nextRow.id]?.[targetIdx]?.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      checkRowGuess(row, currentGuesses);
    }
  };

  // ==============================================================
  // XỬ LÝ NHẬP LIỆU & KIỂM TRA TỪ KHÓA HÀNG DỌC (KHÔNG DẤU)
  // ==============================================================
  const syncRawInputFromCells = (guesses: string[]) => {
    const combined: string[] = [];
    for (let i = 0; i < 12; i++) {
      if (solvedIds.includes(CROSSWORD_ITEMS[i].id) || isVerticalSolved) {
        combined.push(VERTICAL_KEY_WORD.word[i]);
      } else {
        combined.push(guesses[i] || '');
      }
    }
    setRawInputGuess(combined.join(''));
  };

  const handleCellChange = (idx: number, rawVal: string) => {
    if (isVerticalSolved || solvedIds.includes(CROSSWORD_ITEMS[idx].id)) return;

    const char = rawVal
      .slice(-1)
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/Đ/g, 'D');

    if (char && !/[A-Z0-9]/.test(char)) return;

    const nextGuesses = [...cellGuesses];
    nextGuesses[idx] = char;
    setCellGuesses(nextGuesses);
    syncRawInputFromCells(nextGuesses);
    setVerticalFeedback(null);

    if (char) {
      sound.playTileClick();
      const el = cellInputRefs.current[idx];
      if (el) {
        gsap.fromTo(el, { scale: 1.25 }, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
      }
      for (let nextIdx = idx + 1; nextIdx < 12; nextIdx++) {
        if (!solvedIds.includes(CROSSWORD_ITEMS[nextIdx].id) && !isVerticalSolved) {
          cellInputRefs.current[nextIdx]?.focus();
          break;
        }
      }
    }
  };

  const handleCellKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!cellGuesses[idx]) {
        for (let prevIdx = idx - 1; prevIdx >= 0; prevIdx--) {
          if (!solvedIds.includes(CROSSWORD_ITEMS[prevIdx].id) && !isVerticalSolved) {
            e.preventDefault();
            const next = [...cellGuesses];
            next[prevIdx] = '';
            setCellGuesses(next);
            syncRawInputFromCells(next);
            cellInputRefs.current[prevIdx]?.focus();
            break;
          }
        }
      } else {
        const next = [...cellGuesses];
        next[idx] = '';
        setCellGuesses(next);
        syncRawInputFromCells(next);
      }
    } else if (e.key === 'ArrowLeft') {
      for (let prevIdx = idx - 1; prevIdx >= 0; prevIdx--) {
        if (!solvedIds.includes(CROSSWORD_ITEMS[prevIdx].id) && !isVerticalSolved) {
          cellInputRefs.current[prevIdx]?.focus();
          break;
        }
      }
    } else if (e.key === 'ArrowRight') {
      for (let nextIdx = idx + 1; nextIdx < 12; nextIdx++) {
        if (!solvedIds.includes(CROSSWORD_ITEMS[nextIdx].id) && !isVerticalSolved) {
          cellInputRefs.current[nextIdx]?.focus();
          break;
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleCheckVerticalWord();
    }
  };

  const handleRawInputChange = (text: string) => {
    setRawInputGuess(text);
    setVerticalFeedback(null);

    const clean = text
      .toUpperCase()
      .replace(/\s+/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/Đ/g, 'D');

    const next = [...cellGuesses];
    let ptr = 0;
    for (let i = 0; i < 12; i++) {
      if (!solvedIds.includes(CROSSWORD_ITEMS[i].id) && !isVerticalSolved) {
        next[i] = clean[ptr] || '';
        ptr++;
      }
    }
    setCellGuesses(next);
  };

  const handleResetCellGuesses = () => {
    setCellGuesses(Array(12).fill(''));
    setRawInputGuess('');
    setVerticalFeedback(null);
    sound.playTileClick();
  };

  // KIỂM TRA TỪ KHÓA HÀNG DỌC (BẮT BUỘC ĐÚNG DẤU KHI GÕ CÓ DẤU)
  const handleCheckVerticalWord = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isVerticalSolved) return;

    const trimmedInput = rawInputGuess.trim();

    // 1. Nếu người dùng nhập vào thanh ô gõ nhanh:
    if (trimmedInput) {
      const isValid = validateVerticalKeyword(trimmedInput);

      if (isValid) {
        sound.playGrandVictory();
        confetti({
          particleCount: 170,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#EF4444', '#10B981', '#FACC15', '#FFFFFF']
        });

        if (tileRefs.current.length > 0) {
          gsap.fromTo(
            tileRefs.current.filter(Boolean),
            { scale: 0.85, rotateY: 180 },
            {
              scale: 1,
              rotateY: 0,
              duration: 0.65,
              stagger: 0.06,
              ease: 'back.out(2.5)'
            }
          );
        }

        setVerticalFeedback({
          isCorrect: true,
          text: 'CHÍNH XÁC! TỪ KHÓA HÀNG DỌC LÀ: "LAMCHUTHOISO" (LÀM CHỦ THỜI SỐ)!'
        });

        if (onVerticalSolveSuccess) {
          onVerticalSolveSuccess();
        }
      } else {
        sound.playWrong();
        if (verticalDeckRef.current) {
          gsap.fromTo(
            verticalDeckRef.current,
            { x: -14 },
            { x: 14, duration: 0.08, repeat: 5, yoyo: true, ease: 'sine.inOut', onComplete: () => {
              gsap.set(verticalDeckRef.current, { x: 0 });
            }}
          );
        }

        const isWrongAccent = hasVietnameseAccents(trimmedInput);
        setVerticalFeedback({
          isCorrect: false,
          text: isWrongAccent
            ? 'Chưa chính xác! Bạn đã điền sai dấu tiếng Việt rồi (hãy kiểm tra lại đúng từng dấu thanh và mũ/móc).'
            : 'Chưa chính xác! Hãy kiểm tra lại 12 chữ cái của từ khóa nhé.'
        });
      }
      return;
    }

    // 2. Nếu người dùng gõ vào từng ô trong 12 ô chữ:
    const combinedGuessChars: string[] = [];
    for (let i = 0; i < 12; i++) {
      if (solvedIds.includes(CROSSWORD_ITEMS[i].id)) {
        combinedGuessChars.push(VERTICAL_KEY_WORD.word[i]);
      } else {
        combinedGuessChars.push(cellGuesses[i] || '');
      }
    }
    const guessFromCells = combinedGuessChars.join('').trim().toUpperCase();

    if (guessFromCells === VERTICAL_KEY_WORD.word.toUpperCase()) {
      sound.playGrandVictory();
      confetti({
        particleCount: 170,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#EF4444', '#10B981', '#FACC15', '#FFFFFF']
      });

      if (tileRefs.current.length > 0) {
        gsap.fromTo(
          tileRefs.current.filter(Boolean),
          { scale: 0.85, rotateY: 180 },
          {
            scale: 1,
            rotateY: 0,
            duration: 0.65,
            stagger: 0.06,
            ease: 'back.out(2.5)'
          }
        );
      }

      setVerticalFeedback({
        isCorrect: true,
        text: 'CHÍNH XÁC! TỪ KHÓA HÀNG DỌC LÀ: "LAMCHUTHOISO" (LÀM CHỦ THỜI SỐ)!'
      });

      if (onVerticalSolveSuccess) {
        onVerticalSolveSuccess();
      }
    } else {
      sound.playWrong();
      if (verticalDeckRef.current) {
        gsap.fromTo(
          verticalDeckRef.current,
          { x: -14 },
          { x: 14, duration: 0.08, repeat: 5, yoyo: true, ease: 'sine.inOut', onComplete: () => {
            gsap.set(verticalDeckRef.current, { x: 0 });
          }}
        );
      }

      setVerticalFeedback({
        isCorrect: false,
        text: 'Chưa chính xác! Hãy kiểm tra lại các chữ cái trong 12 ô nhé.'
      });
    }
  };

  // Lọc 12 câu hỏi theo tab
  const filteredQuestions = shuffledQuestions.filter(it => {
    const isSolved = solvedQuestionIds.includes(it.id);
    if (filterMode === 'solved') return isSolved;
    if (filterMode === 'unsolved') return !isSolved;
    return true;
  });

  const revealedVerticalCount = CROSSWORD_ITEMS.filter(it => solvedIds.includes(it.id) || isVerticalSolved).length;

  return (
    <div className="w-full flex flex-col gap-6 text-stone-900">
      
      {/* ==============================================================
          KHỐI 1: MA TRẬN TÌM CHỮ (5 COLS) • DANH SÁCH 12 CÂU HỎI (7 COLS)
         ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CỘT TRÁI (5 COLS): MA TRẬN TÌM TỪ & TÚI TỪ */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          
          <div className="bg-white border-2 border-amber-200/90 rounded-3xl p-4 sm:p-5 shadow-sm text-stone-900 flex flex-col gap-3 select-none">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-amber-600" />
                <h2 className="text-xs sm:text-sm font-black uppercase text-amber-900 tracking-wider">
                  Bảng Tìm Chữ Ma Trận (12 x 12)
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-stone-500">
                Ngang • Dọc • Chéo
              </span>
            </div>

            {/* Thông báo khi tìm thấy từ */}
            {matrixNotification && (
              <div className="p-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-amber-100 shrink-0" />
                <span>{matrixNotification}</span>
              </div>
            )}

            {/* Bảng 12x12 Grid */}
            <div 
              onMouseUp={handleMouseUp}
              className="grid grid-cols-12 gap-1 p-2 bg-[#F7F4EC] rounded-2xl border border-stone-200 shadow-inner"
            >
              {WORD_SEARCH_GRID.map((row, rIdx) =>
                row.map((letter, cIdx) => {
                  const isSelected = isCellInSelection(rIdx, cIdx);
                  const isFound = isCellInFoundWord(rIdx, cIdx);

                  return (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      onMouseDown={() => handleMouseDown(rIdx, cIdx)}
                      onMouseEnter={() => handleMouseEnter(rIdx, cIdx)}
                      onClick={() => handleCellClick(rIdx, cIdx)}
                      className={`
                        w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-md font-bold text-[11px] sm:text-xs md:text-sm
                        flex items-center justify-center transition-all duration-100 transform select-none shadow-2xs
                        ${
                          isSelected
                            ? 'bg-amber-400 text-stone-950 scale-105 shadow-md ring-2 ring-amber-500 z-10 font-black'
                            : isFound
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-400 font-black'
                            : 'bg-white text-stone-800 hover:bg-amber-50 hover:border-amber-300 border border-stone-200/90 active:scale-95'
                        }
                      `}
                    >
                      {letter}
                    </button>
                  );
                })
              )}
            </div>

            {/* Túi từ đã tìm thấy */}
            <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-700">
                <span className="uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-amber-600" />
                  <span>Túi từ đã tìm thấy ({foundWordsInMatrix.length}/12):</span>
                </span>
                <span className="text-amber-800 font-medium">Bấm từ để điền</span>
              </div>

              {foundWordsInMatrix.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {foundWordsInMatrix.map(id => {
                    const item = CROSSWORD_ITEMS.find(it => it.id === id);
                    if (!item) return null;
                    const isUsedOnBoard = solvedIds.includes(item.id);

                    return (
                      <button
                        key={id}
                        onClick={() => handleInsertWordToQuestion(item.displayWord, focusedQuestionId)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                          isUsedOnBoard
                            ? 'bg-stone-100 text-stone-500 border border-stone-200 line-through'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 hover:scale-105 active:scale-95'
                        }`}
                        title={isUsedOnBoard ? `Đã ghép vào Bảng Ô Chữ` : `Bấm để điền vào câu hỏi đang chọn`}
                      >
                        <span>{item.displayWord}</span>
                        {isUsedOnBoard ? (
                          <span className="text-[10px] text-emerald-600 font-black">✓</span>
                        ) : (
                          <span className="text-[10px] text-amber-600 font-black">→</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-stone-200/80 text-[11px] text-stone-600 italic leading-relaxed">
                  Quét (nhấn chuột và kéo) các chữ cái trên bảng để tìm ra các từ ẩn (ngang, dọc, chéo). Các từ tìm được sẽ lưu vào đây để bạn điền vào câu hỏi hoặc tự gõ vào bảng ô chữ!
                </div>
              )}
            </div>

          </div>

        </div>

        {/* CỘT PHẢI (7 COLS): BỘ 12 CÂU HỎI ĐIỀN TỪ (ĐÃ XÁO TRỘN, KHÔNG HIỆN THUẬT NGỮ THỪA) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          
          <div className="bg-white border-2 border-red-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col gap-3.5">
            
            {/* Header danh sách 12 câu hỏi & Bộ lọc */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-700" />
                <div>
                  <h2 className="text-sm sm:text-base font-black uppercase text-red-800 tracking-wider">
                    Bộ 12 Câu Hỏi Điền Từ
                  </h2>
                  <div className="text-[11px] text-stone-500 font-medium">
                    Đã giải: <strong className="text-emerald-700 font-bold">{solvedQuestionIds.length}/12</strong> câu • Giải câu đố để tìm đáp án, sau đó tự điền vào các ô hàng ngang
                  </div>
                </div>
              </div>

              {/* Bộ lọc tab */}
              <div className="flex items-center gap-1 bg-[#F5EEDB] p-1 rounded-xl text-xs font-bold border border-amber-200/90 self-stretch sm:self-auto justify-center">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterMode === 'all' ? 'bg-white text-stone-900 shadow-2xs font-black' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Tất cả (12)
                </button>
                <button
                  onClick={() => setFilterMode('unsolved')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterMode === 'unsolved' ? 'bg-white text-red-700 shadow-2xs font-black' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Chưa giải ({12 - solvedQuestionIds.length})
                </button>
                <button
                  onClick={() => setFilterMode('solved')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterMode === 'solved' ? 'bg-white text-emerald-700 shadow-2xs font-black' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Đã giải ({solvedQuestionIds.length})
                </button>
              </div>
            </div>

            {/* Thanh nút nhảy nhanh tới 12 câu */}
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              <span className="text-[11px] font-bold text-stone-500 mr-1 shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3 text-amber-600" />
                <span>Câu:</span>
              </span>
              {shuffledQuestions.map((it, idx) => {
                const isSolved = solvedQuestionIds.includes(it.id);
                const isFocused = focusedQuestionId === it.id;
                return (
                  <button
                    key={it.id}
                    onClick={() => scrollToQuestion(it.id)}
                    className={`w-7 h-7 shrink-0 rounded-lg font-black text-xs transition-all flex items-center justify-center ${
                      isFocused
                        ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-500 scale-105 shadow-xs'
                        : isSolved
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                    title={`Câu hỏi ${idx + 1}: ${isSolved ? 'Đã giải' : 'Chưa giải'}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* DANH SÁCH 12 CARD CÂU HỎI */}
            <div className="flex flex-col gap-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredQuestions.map((item, qIdx) => {
                const isSolved = solvedQuestionIds.includes(item.id);
                const isFocused = focusedQuestionId === item.id;
                const fb = questionFeedbacks[item.id];
                const parts = item.clozeSentence.split('[.......]');

                return (
                  <div
                    key={item.id}
                    ref={(el) => { questionRefs.current[item.id] = el; }}
                    onClick={() => setFocusedQuestionId(item.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-2.5 ${
                      isFocused
                        ? 'border-amber-400 bg-amber-50/30 shadow-sm'
                        : isSolved
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-stone-200 bg-white hover:border-amber-200'
                    }`}
                  >
                    {/* Header Card */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-black ${
                          isSolved 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-red-700 text-white'
                        }`}>
                          Câu đố #{qIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-stone-500">
                          ({item.word.length} chữ cái)
                        </span>
                      </div>

                      {isSolved && (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã tìm được từ</span>
                        </span>
                      )}
                    </div>

                    {/* Câu hỏi điền vào chỗ trống */}
                    <div className="text-sm text-stone-900 leading-relaxed font-medium">
                      {parts.map((part, pIdx) => (
                        <React.Fragment key={pIdx}>
                          <span>{part}</span>
                          {pIdx < parts.length - 1 && (
                            <span className={`inline-flex items-center mx-1 px-2.5 py-0.5 rounded-md text-xs font-black border transition-all ${
                              isSolved
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                : 'bg-amber-100 text-amber-900 border-amber-300 border-dashed'
                            }`}>
                              {isSolved ? item.displayWord : `[ ??????? (${item.word.length} chữ) ]`}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Nếu đã giải: hiển thị đáp án */}
                    {isSolved ? (
                      <div className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Đáp án chính xác: <strong>{item.displayWord}</strong> ({item.word.length} chữ). Hãy xuống các ô hàng ngang bên dưới để tự nhập vào hàng phù hợp!</span>
                      </div>
                    ) : (
                      /* Nếu chưa giải: hiển thị ô nhập đáp án kiểm tra */
                      <div className="flex flex-col gap-2 pt-1 border-t border-stone-100">
                        <form
                          onSubmit={(e) => handleCheckQuestion(e, item)}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="text"
                            value={questionInputs[item.id] || ''}
                            onFocus={() => setFocusedQuestionId(item.id)}
                            onChange={(e) => {
                              const val = e.target.value;
                              setQuestionInputs(prev => ({ ...prev, [item.id]: val }));
                              if (questionFeedbacks[item.id]) {
                                setQuestionFeedbacks(prev => {
                                  const copy = { ...prev };
                                  delete copy[item.id];
                                  return copy;
                                });
                              }
                            }}
                            placeholder={`Gõ đáp án câu này (hoặc chọn từ đã tìm)...`}
                            className="flex-1 bg-[#FBF9F4] border-2 border-stone-300 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-stone-900 placeholder-stone-400 outline-none transition-colors"
                          />
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1 shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Kiểm Tra</span>
                          </button>
                        </form>

                        {/* Gợi ý từ túi ma trận */}
                        {foundWordsInMatrix.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-tight">
                              Gợi ý từ đã tìm:
                            </span>
                            {foundWordsInMatrix.map(fId => {
                              const fItem = CROSSWORD_ITEMS.find(it => it.id === fId);
                              if (!fItem) return null;
                              return (
                                <button
                                  type="button"
                                  key={fId}
                                  onClick={() => handleInsertWordToQuestion(fItem.displayWord, item.id)}
                                  className="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold transition-all shadow-2xs hover:scale-105 active:scale-95 flex items-center gap-1"
                                  title={`Bấm để điền "${fItem.displayWord}" vào câu này`}
                                >
                                  <span>{fItem.displayWord}</span>
                                  <span className="text-[10px] text-amber-700 font-black">+</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Feedback thông báo đúng / sai */}
                        {fb && (
                          <div className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                            fb.isCorrect
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                              : 'bg-red-50 text-red-800 border border-red-300 animate-shake'
                          }`}>
                            {fb.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <HelpCircle className="w-4 h-4 text-red-600 shrink-0" />
                            )}
                            <span>{fb.text}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

      {/* ==============================================================
          KHỐI 2: KHUNG Ô CHỮ HÀNG NGANG (USER TỰ NHẬP VÀO TỪNG Ô KHÔNG DẤU)
         ============================================================== */}
      <div className="w-full flex flex-col items-center gap-3">
        
        <div className="w-full flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs sm:text-sm font-black uppercase text-amber-900 tracking-wider">
              Khung Ô Chữ Hàng Ngang (Tự Nhập Vào Từng Ô Không Dấu)
            </h3>
          </div>
        </div>

        {/* Khung ô chữ xanh lá & Cột dọc hoa phượng thẳng tắp - Nền ấm sáng */}
        <div className="relative w-full rounded-3xl p-5 sm:p-7 shadow-lg border-8 border-[#C5A059] overflow-x-auto select-none bg-[#F5EEDB] text-stone-900 flex flex-col items-center gap-3">
          
          {/* ==============================================================
              12 HÀNG NGANG: USER TỰ CLICK VÀO TỪNG Ô VÀ GÕ CHỮ KHÔNG DẤU
             ============================================================== */}
          <div className="relative flex flex-col gap-1.5 min-w-[720px] py-1">
            
            {CROSSWORD_ITEMS.map((row) => {
              const isSolved = solvedIds.includes(row.id);
              const startCol = KEY_COL - row.keyCharIndex;
              const letters = showAccents ? row.displayWord.replace(/\s+/g, '') : row.word;

              return (
                <div
                  key={row.id}
                  ref={(el) => { rowRefs.current[row.id] = el; }}
                  className="flex items-center py-1 px-1.5 rounded-xl transition-all hover:bg-amber-100/50"
                >
                  {/* Ngôi sao số bên trái (⭐ 1 .. ⭐ 12) cố định chiều rộng w-9 */}
                  <div className="w-9 h-9 flex items-center justify-center mr-2 shrink-0 select-none">
                    <svg viewBox="0 0 51 48" className="w-8 h-8 drop-shadow">
                      <path
                        fill={isSolved ? '#22c55e' : '#f59e0b'}
                        stroke="#b45309"
                        strokeWidth="2"
                        d="M25.5 0l7.8 15.9 17.5 2.5-12.7 12.3 3 17.3-15.6-8.2-15.6 8.2 3-17.3-12.7-12.3 17.5-2.5z"
                      />
                    </svg>
                    <span className="absolute font-black text-xs text-stone-900 select-none">
                      {row.order}
                    </span>
                  </div>

                  {/* 14 Ô CỐ ĐỊNH CHIỀU RỘNG: TỰ NHẬP TRỰC TIẾP VÀO TỪNG Ô KHÔNG DẤU */}
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {Array.from({ length: TOTAL_GRID_COLS }).map((_, cIdx) => {
                      const col = cIdx + 1; // 1 to 14
                      const isKeyCol = col === KEY_COL;
                      const isInside = col >= startCol && col < startCol + row.word.length;

                      if (!isInside) {
                        return (
                          <div 
                            key={`empty-${cIdx}`} 
                            className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 invisible shrink-0" 
                          />
                        );
                      }

                      const letterIdx = col - startCol;
                      const solvedLetterChar = isKeyCol ? row.keyChar : (letters[letterIdx] || row.word[letterIdx]);
                      const shouldShowLetter = isSolved || (isVerticalSolved && isKeyCol);
                      const tileGuess = rowTileGuesses[row.id]?.[letterIdx] || '';

                      return (
                        <div
                          key={`tile-${cIdx}`}
                          className={`
                            crossword-tile relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-md sm:rounded-lg shrink-0
                            flex items-center justify-center font-black text-xs sm:text-base md:text-lg
                            transition-all duration-200 shadow-md border-2
                            ${
                              isKeyCol
                                ? 'border-[#facc15] bg-[#1a120b] shadow-xl ring-2 ring-amber-400 z-10'
                                : 'border-emerald-300 bg-gradient-to-b from-[#4ade80] via-[#22c55e] to-[#15803d] hover:brightness-110 focus-within:ring-2 focus-within:ring-amber-400 focus-within:scale-105 focus-within:z-20'
                            }
                          `}
                        >
                          {/* Bông hoa phượng đỏ ở cột dọc số 7 */}
                          {isKeyCol && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-85 overflow-hidden rounded-md pointer-events-none select-none">
                              <span className="text-lg sm:text-xl md:text-2xl filter drop-shadow">🌺</span>
                            </div>
                          )}

                          {shouldShowLetter ? (
                            /* Ô ĐÃ MỞ (HIỂN THỊ CHỮ) */
                            <span
                              className={`relative z-10 font-black tracking-tight select-none animate-flip ${
                                isKeyCol
                                  ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-base sm:text-xl font-serif'
                                  : 'text-[#064e3b] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'
                              }`}
                            >
                              {solvedLetterChar}
                            </span>
                          ) : (
                            /* Ô CHƯA MỞ (INPUT CHO USER TỰ NHẬP TỪNG CHỮ KHÔNG DẤU VÀO ĐÂY) */
                            <input
                              type="text"
                              maxLength={1}
                              value={tileGuess}
                              ref={(el) => {
                                if (!tileInputRefs.current[row.id]) tileInputRefs.current[row.id] = [];
                                tileInputRefs.current[row.id][letterIdx] = el;
                              }}
                              onChange={(e) => handleRowTileChange(row, letterIdx, e.target.value)}
                              onKeyDown={(e) => handleRowTileKeyDown(row, letterIdx, e)}
                              className={`
                                relative z-10 w-full h-full text-center bg-transparent uppercase outline-none font-black text-xs sm:text-base md:text-lg select-none
                                ${isKeyCol ? 'text-amber-300 font-serif font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]' : 'text-[#064e3b] font-sans'}
                              `}
                              title={`Gõ chữ cái không dấu vào ô ${letterIdx + 1} của hàng ${row.order}`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Trạng thái mở & Nút kiểm tra nhanh hàng */}
                  <div className="ml-3 text-xs w-28 shrink-0 font-bold flex items-center gap-1.5">
                    {isSolved ? (
                      <span className="text-emerald-700">✓ Đã mở</span>
                    ) : (
                      <div className="flex items-center gap-1 text-stone-600">
                        <span>({row.word.length} ô)</span>
                        <button
                          type="button"
                          onClick={() => checkRowGuess(row, rowTileGuesses[row.id] || [])}
                          className="w-5 h-5 rounded-md bg-amber-400 hover:bg-amber-500 text-stone-950 flex items-center justify-center font-black transition-transform active:scale-95 shadow-2xs"
                          title={`Kiểm tra Hàng ${row.order} (hoặc nhấn Enter)`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          </div>

          {/* ==============================================================
              BÀN NHẬP TỪ KHÓA HÀNG DỌC (12 Ô CHO USER TỰ NHẬP KHÔNG DẤU)
             ============================================================== */}
          <div 
            ref={verticalDeckRef}
            className="mt-4 pt-5 border-t-4 border-[#C5A059] w-full flex flex-col items-center gap-4 bg-gradient-to-b from-[#1C1209] to-[#0D0804] p-5 sm:p-6 rounded-3xl border-2 border-[#EAB308] shadow-[0_10px_35px_rgba(234,179,8,0.3)] text-stone-100"
          >
            
            {/* Header của Bàn Đoán Từ Dọc */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-amber-900/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-md shrink-0">
                  <Crown className="w-5 h-5 text-stone-950 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                      <span>Bàn Đoán Từ Khóa Hàng Dọc (12 Chữ Cái Không Dấu)</span>
                      <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                    </h4>
                  </div>
                  <p className="text-[11px] text-amber-200/70 font-medium">
                    Đã lật mở: <strong className="text-amber-400 font-bold">{revealedVerticalCount}/12</strong> ô • Gõ trực tiếp vào các ô bên dưới hoặc nhập nhanh
                  </p>
                </div>
              </div>

              {/* Nút xóa thử các chữ đã gõ */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetCellGuesses}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  title="Xóa trắng các chữ bạn đã gõ thử"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Xóa Thử</span>
                </button>
              </div>
            </div>

            {/* 12 Ô CHỮ CHO USER TỰ NHẬP (KHÔNG DẤU) */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap py-2">
              {VERTICAL_KEY_WORD.word.split('').map((targetChar, cIdx) => {
                const correspondingRow = CROSSWORD_ITEMS[cIdx];
                const isRevealed = isVerticalSolved || solvedIds.includes(correspondingRow.id);
                const userChar = cellGuesses[cIdx] || '';

                return (
                  <div
                    key={`vertical-slot-${cIdx}`}
                    ref={(el) => { tileRefs.current[cIdx] = el; }}
                    className="flex flex-col items-center gap-1"
                  >
                    {/* Số thứ tự hàng */}
                    <span className="text-[10px] font-black text-amber-400/60 select-none">
                      #{cIdx + 1}
                    </span>

                    {/* Ô Chữ */}
                    {isRevealed ? (
                      /* Ô ĐÃ MỞ (KHÓA, HIỂN THỊ CHỮ CÁI KHÔNG DẤU VÀ HOA PHƯỢNG) */
                      <div
                        className="relative w-8 h-11 sm:w-10 sm:h-13 md:w-12 md:h-15 rounded-xl bg-gradient-to-b from-[#140C07] via-[#0A0503] to-[#000000] border-2 border-[#FACC15] shadow-[0_0_15px_rgba(250,204,21,0.4)] flex items-center justify-center overflow-hidden transition-all transform hover:scale-105 select-none"
                        title={`Hàng ${cIdx + 1} đã giải: Chữ cái là "${targetChar}"`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl md:text-2xl opacity-80 select-none">
                          🌺
                        </span>
                        <span className="relative z-10 text-white font-serif font-black text-sm sm:text-xl md:text-2xl drop-shadow-[0_2px_8px_rgba(250,204,21,0.9)] animate-flip">
                          {targetChar}
                        </span>
                        <span className="absolute top-0.5 right-0.5 text-[9px] text-emerald-400 font-bold select-none">
                          ✓
                        </span>
                      </div>
                    ) : (
                      /* Ô CHƯA MỞ (INPUT CHO USER TỰ NHẬP VÀO) */
                      <div className="relative w-8 h-11 sm:w-10 sm:h-13 md:w-12 md:h-15 rounded-xl bg-[#281A0E] border-2 border-amber-500/70 hover:border-amber-400 focus-within:border-amber-300 focus-within:ring-2 focus-within:ring-amber-400 shadow-md flex items-center justify-center overflow-hidden transition-all transform hover:scale-105">
                        <input
                          type="text"
                          maxLength={1}
                          value={userChar}
                          disabled={isVerticalSolved}
                          ref={(el) => { cellInputRefs.current[cIdx] = el; }}
                          onChange={(e) => handleCellChange(cIdx, e.target.value)}
                          onKeyDown={(e) => handleCellKeyDown(cIdx, e)}
                          placeholder="?"
                          className="w-full h-full bg-transparent text-center font-mono font-black text-amber-300 placeholder-amber-500/30 text-sm sm:text-xl md:text-2xl uppercase outline-none"
                          title={`Gõ chữ cái dự đoán cho hàng ${cIdx + 1}`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Thông báo feedback đúng / sai */}
            {verticalFeedback && (
              <div className={`w-full max-w-xl p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                verticalFeedback.isCorrect
                  ? 'bg-emerald-600 text-white border-2 border-emerald-300 animate-bounce'
                  : 'bg-red-900/90 text-red-100 border-2 border-red-500 animate-shake'
              }`}>
                {verticalFeedback.isCorrect ? (
                  <CheckCheck className="w-5 h-5 text-emerald-200 shrink-0" />
                ) : (
                  <Flame className="w-5 h-5 text-red-300 shrink-0" />
                )}
                <span className="text-center">{verticalFeedback.text}</span>
              </div>
            )}

            {/* Thanh nhập nhanh & Nút bấm Kiểm Tra Từ Khóa Dọc */}
            {!isVerticalSolved && (
              <form 
                onSubmit={handleCheckVerticalWord}
                className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-2.5 pt-1"
              >
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={rawInputGuess}
                    onChange={(e) => handleRawInputChange(e.target.value)}
                    placeholder="Nhập dự đoán từ khóa hàng dọc (12 chữ cái)..."
                    className="w-full bg-[#24170D] border-2 border-amber-600/80 focus:border-amber-400 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold text-amber-200 placeholder-amber-400/40 uppercase tracking-widest outline-none shadow-inner text-center sm:text-left transition-colors"
                  />
                  {rawInputGuess && (
                    <button
                      type="button"
                      onClick={() => handleRawInputChange('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-300 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-amber-500/30 transform active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-stone-950" />
                  <span>Kiểm Tra Từ Dọc</span>
                  <Zap className="w-4 h-4 text-amber-950 fill-amber-950 animate-pulse" />
                </button>
              </form>
            )}

            {isVerticalSolved && (
              <div className="w-full max-w-xl p-3.5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl border-2 border-emerald-400 flex items-center justify-center gap-2 text-emerald-200 text-sm font-black shadow-lg">
                <CheckCheck className="w-5 h-5 text-emerald-300" />
                <span>ĐÃ GIẢI THÀNH CÔNG TỪ KHÓA DỌC: &quot;LAMCHUTHOISO&quot; (LÀM CHỦ THỜI SỐ)!</span>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
