
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

interface LetterOverlayProps {
  onClose: () => void;
}

const LetterOverlay: React.FC<LetterOverlayProps> = ({ onClose }) => {
  const [displayText, setDisplayText] = useState('');
  const [showHappyNewYear, setShowHappyNewYear] = useState(false);
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
  const emojiIdCounter = useRef(0);

  const fullText = [
    "My Little princess,",
    "New Year, same me… still completely in love with you.",
    "Every year with you somehow gets better, and I already know 2025 is going to be amazing because we’re doing it together.",
    "You’re my favorite person, my safe place, and the reason even boring days feel special.",
    "I promise to love you more, annoy you a little extra, and choose you every single day.",
    "Forever yours (and only yours), ❤️"
  ];

  const emojiPool = ['❤️', '💖', '💝', '💕', '✨', '🌸', '🥰'];

  const spawnEmoji = () => {
    const id = emojiIdCounter.current++;
    const newEmoji: FloatingEmoji = {
      id,
      emoji: emojiPool[Math.floor(Math.random() * emojiPool.length)] || '❤️',
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
    };
    setEmojis((prev) => [...prev, newEmoji]);
    
    setTimeout(() => {
      setEmojis((prev) => prev.filter((e) => e.id !== id));
    }, 2500);
  };

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let timer: any;
    let localDisplayText = '';

    const typeText = () => {
      if (currentLine >= fullText.length) {
        setShowHappyNewYear(true);
        return;
      }

      const line = fullText[currentLine];
      
      // Defensive check for line existence
      if (typeof line !== 'string') {
        currentLine++;
        currentChar = 0;
        timer = setTimeout(typeText, 10);
        return;
      }
      
      if (currentChar >= line.length) {
        localDisplayText += '\n\n';
        setDisplayText(localDisplayText);
        currentLine++;
        currentChar = 0;
        timer = setTimeout(typeText, 700);
      } else {
        const char = line.charAt(currentChar);
        if (char !== undefined) {
          localDisplayText += char;
          setDisplayText(localDisplayText);
        }
        
        if (Math.random() > 0.92) {
          spawnEmoji();
        }

        currentChar++;
        timer = setTimeout(typeText, 45);
      }
    };

    timer = setTimeout(typeText, 1000);
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-md p-6"
    >
      <motion.div
        initial={{ scale: 0.8, y: 100, rotateX: 45 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative w-full max-w-lg aspect-[3/4] bg-[#fdfaf1] rounded-lg shadow-2xl p-8 md:p-12 overflow-hidden border-8 border-pink-100/50"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-mathematics.png')]"></div>
        
        <div className="absolute inset-0 pointer-events-none z-20">
          <AnimatePresence>
            {emojis.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, scale: 0, x: `${e.x}%`, y: `${e.y}%` }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  scale: [0.5, 1.5, 1.5, 1],
                  y: `${e.y - 20}%` 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute text-3xl select-none"
              >
                {e.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="relative h-full flex flex-col z-10">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <pre className="whitespace-pre-wrap font-['Dancing_Script'] text-xl md:text-2xl text-gray-800 leading-relaxed text-center">
              {displayText}
            </pre>
          </div>

          {showHappyNewYear && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-8 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-['Dancing_Script'] font-bold text-pink-600 drop-shadow-sm mb-4">
                ✨ Happy New Year ❤️
              </h2>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors font-bold text-sm"
              >
                Close Letter
              </button>
            </motion.div>
          )}
        </div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-pink-400 rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                scale: 0,
                opacity: 0,
              }}
              animate={{
                y: [null, '-20%'],
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LetterOverlay;
