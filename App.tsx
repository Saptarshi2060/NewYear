
import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import Scene from './components/Scene';
import LetterOverlay from './components/LetterOverlay';
import { SoundManager } from './services/SoundManager';

const App: React.FC = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [appStarted, setAppStarted] = useState(false);

  const handleOpenEnvelope = () => {
    if (!isOpened) {
      setIsOpened(true);
      SoundManager.play('open');
      setTimeout(() => {
        setShowLetter(true);
        SoundManager.play('chime');
      }, 1500);
    }
  };

  const handleCloseLetter = () => {
    setShowLetter(false);
    setIsOpened(false);
  };

  const startExperience = () => {
    setAppStarted(true);
    SoundManager.init();
    SoundManager.playMusic();
  };

  return (
    <div className="relative w-screen h-screen bg-gradient-to-b from-[#fdf2f8] via-[#fce7f3] to-[#fae8ff]">
      {!appStarted ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startExperience}
            className="px-8 py-4 bg-pink-500 text-white rounded-full text-xl font-bold shadow-lg hover:bg-pink-600 transition-colors"
          >
            Enter Your Love Surprise ✨
          </motion.button>
        </div>
      ) : (
        <>
          <Canvas
            shadows
            camera={{ position: [0, 1.5, 4], fov: 45 }}
            gl={{ antialias: true }}
            className="touch-none"
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
              
              <Scene 
                isOpened={isOpened} 
                onOpen={handleOpenEnvelope} 
              />
              
              <Environment preset="sunset" />
              <ContactShadows 
                position={[0, -1.2, 0]} 
                opacity={0.4} 
                scale={10} 
                blur={2.5} 
                far={4.5} 
              />
              <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                maxPolarAngle={Math.PI / 2.1} 
                minPolarAngle={Math.PI / 3}
              />
            </Suspense>
          </Canvas>

          <div className="absolute top-8 left-0 right-0 pointer-events-none flex justify-center px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-pink-600 text-2xl md:text-3xl font-['Dancing_Script'] font-bold drop-shadow-md"
            >
              {isOpened ? "A special message for you..." : "Tap the envelope to open your surprise"}
            </motion.h1>
          </div>

          <AnimatePresence>
            {showLetter && (
              <LetterOverlay onClose={handleCloseLetter} />
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 left-4 text-pink-400 text-sm opacity-50 hidden md:block">
            Click & drag to look around ✨
          </div>
        </>
      )}
    </div>
  );
};

export default App;
