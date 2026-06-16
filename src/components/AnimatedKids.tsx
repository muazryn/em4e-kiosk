import React, { useEffect } from "react";
import { motion } from "motion/react";

export type FaceMood = "welcome" | "thinking" | "correct" | "incorrect" | "victory";

interface AnimatedKidsProps {
  mood: FaceMood;
  interactiveSpeech?: string;
  language?: "en" | "ms";
}

export default function AnimatedKids({ mood, interactiveSpeech, language }: AnimatedKidsProps) {
  // Variations based on active mood
  const getFacialExpressions = (character: "leo" | "mia") => {
    switch (mood) {
      case "correct":
        return {
          eyebrows: { y: -3, rotate: 0 },
          eyes: { scaleY: 1, scaleX: 1, rotate: 0, isStars: true },
          mouth: { scaleY: 1, d: "M 25 35 Q 40 48 55 35" }, // Happy wide curve
          blush: { d: "M 15 32 A 4 4 0 1 0 15.01 32", opacity: 0.8 },
          animation: {
            y: [0, -10, 0],
            scale: [1, 1.08, 1],
            transition: { repeat: Infinity, duration: 0.6 }
          }
        };
      case "incorrect":
        return {
          eyebrows: { y: 2, rotate: character === "leo" ? -5 : 5 },
          eyes: { scaleY: 1, scaleX: 1, rotate: 0, isStars: false },
          mouth: { scaleY: 0.8, d: "M 28 40 Q 40 33 52 40" }, // Skeptical/thoughtful line
          blush: { d: "M 15 32 A 4 4 0 1 0 15.01 32", opacity: 0.2 },
          animation: {
            rotate: [0, -2, 2, 0],
            transition: { duration: 0.5 }
          }
        };
      case "victory":
        return {
          eyebrows: { y: -4, rotate: character === "leo" ? 6 : -6 },
          eyes: { scaleY: 1, scaleX: 1, rotate: 15, isStars: true },
          mouth: { scaleY: 1.2, d: "M 22 33 Q 40 50 58 33" }, // Joyous shouting mouth
          blush: { d: "M 15 32 A 4 4 0 1 0 15.01 32", opacity: 0.9 },
          animation: {
            y: [0, -12, 0],
            rotate: [-3, 3, -3],
            transition: { repeat: Infinity, duration: 0.5 }
          }
        };
      case "thinking":
        return {
          eyebrows: { y: -1, rotate: character === "leo" ? -8 : 8 },
          eyes: { scaleY: 1, scaleX: 1, rotate: 0, isStars: false },
          mouth: { scaleY: 1, d: "M 32 38 Q 40 38 48 38" }, // Concentrated straight line
          blush: { d: "M 15 32 A 4 4 0 1 0 15.01 32", opacity: 0.3 },
          animation: {
            y: [0, -1, 0],
            transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
          }
        };
      case "welcome":
      default:
        return {
          eyebrows: { y: 0, rotate: 0 },
          eyes: { scaleY: 1, scaleX: 1, rotate: 0, isStars: false },
          mouth: { scaleY: 1, d: "M 28 35 Q 40 44 52 35" }, // Gentle sweet curve
          blush: { d: "M 15 32 A 4 4 0 1 0 15.01 32", opacity: 0.5 },
          animation: {
            y: [0, -3, 0],
            transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
          }
        };
    }
  };

  const leo = getFacialExpressions("leo");
  const mia = getFacialExpressions("mia");

  const showLeo = !language || language === "en";
  const showMia = !language || language === "ms";

  // Choose dialog speech text depending on mood if not explicitly supplied
  const getSpeechBubbleText = () => {
    if (interactiveSpeech) return interactiveSpeech;
    switch (mood) {
      case "correct":
        return language === "ms"
          ? "Horey! Anda menjawab dengan betul! Sangat masuk akal!"
          : "Hooray! You answered correctly! That makes perfect sense!";
      case "incorrect":
        return language === "ms"
          ? "Itu tekaan yang bagus, tetapi mari kita semak petunjuk sejarah bersama-sama!"
          : "That was a good guess, but let's check out the historical clue together!";
      case "thinking":
        return language === "ms"
          ? "Hmm... Perhatikan petunjuk dan bahan pameran galeri fizikal berhampiran!"
          : "Hmm... Look closely at the clues and physical gallery exhibits nearby!";
      case "victory":
        return language === "ms"
          ? "Kerja yang menakjubkan! Saya Mia, sangat bangga dengan anda. Kita adalah Penjelajah Ekonomi rasmi sekarang!"
          : "Amazing work! This is Leo. I'm super proud of you. We're official Economics Explorers now!";
      case "welcome":
      default:
        return language === "ms"
          ? "Hai di sana! Saya Mia. Selamat datang ke kiosk syiling! Mari kita bermain!"
          : "Hi there! I'm Leo! Welcome to the coin kiosk! Let's play!";
    }
  };

  return (
    <div className="bg-slate-900/95 border-2 border-indigo-500/30 rounded-2xl p-3 lg:p-4 flex flex-col items-center gap-2 lg:gap-3 w-full self-center relative max-w-md mx-auto shadow-xl shadow-indigo-950/40">
      
      {/* Small Characters Grid */}
      <div className="flex justify-center gap-4 lg:gap-6 items-center">
        
        {/* CHARACTER 1: LEO (Boy with green currency cap) */}
        {showLeo && (
          <motion.div 
            animate={leo.animation}
            className="flex flex-col items-center gap-1"
          >
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-full border-2 border-slate-700/60 flex items-center justify-center overflow-visible shadow-md">
            
            <svg viewBox="0 0 80 80" className="w-full h-full">
              {/* Hair Back */}
              <path d="M 12 40 Q 10 18 40 12 Q 70 18 68 40 Z" fill="#78350f" />

              {/* Head / Skin */}
              <circle cx="40" cy="40" r="28" fill="#fbcfe8" /> {/* warm tone */}
              <circle cx="40" cy="40" r="28" fill="#ffedd5" /> {/* overlay cream */}

              {/* Leo's Explorer Cap */}
              <path d="M 12 35 C 10 10, 70 10, 68 35 Z" fill="#047857" /> {/* emerald cap */}
              <path d="M 8 36 Q 40 28 72 36" stroke="#065f46" strokeWidth="4" fill="none" /> {/* Cap Visor */}
              
              {/* Magnifying Glass badge on cap */}
              <circle cx="40" cy="20" r="6" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
              <line x1="44" y1="24" x2="48" y2="28" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />

              {/* Brows */}
              <motion.path 
                animate={{ y: leo.eyebrows.y, rotate: leo.eyebrows.rotate }}
                d="M 22 24 Q 28 22 34 24" 
                stroke="#78350f" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                fill="none" 
              />
              <motion.path 
                animate={{ y: leo.eyebrows.y, rotate: -leo.eyebrows.rotate }}
                d="M 46 24 Q 52 22 58 24" 
                stroke="#78350f" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                fill="none" 
              />

              {/* Left Eye */}
              {leo.eyes.isStars ? (
                <path d="M 23 27 L 27 27 L 25 24 Z M 23 29 L 27 29 L 25 32 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
              ) : (
                <g>
                  <circle cx="28" cy="28" r="4.5" fill="#1e293b" />
                  <circle cx="29.5" cy="26.5" r="1.5" fill="#ffffff" />
                  {/* Blinking layer */}
                  <motion.ellipse 
                    animate={{ scaleY: [1, 1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 4, repeatDelay: 1 }}
                    cx="28" 
                    cy="28" 
                    rx="5" 
                    ry="5" 
                    className="fill-[#ffedd5] origin-center"
                  />
                </g>
              )}

              {/* Right Eye */}
              {leo.eyes.isStars ? (
                <path d="M 45 27 L 49 27 L 47 24 Z M 45 29 L 49 29 L 47 32 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
              ) : (
                <g>
                  <circle cx="52" cy="28" r="4.5" fill="#1e293b" />
                  <circle cx="53.5" cy="26.5" r="1.5" fill="#ffffff" />
                  {/* Blinking layer */}
                  <motion.ellipse 
                    animate={{ scaleY: [1, 1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 4, repeatDelay: 1 }}
                    cx="52" 
                    cy="28" 
                    rx="5" 
                    ry="5" 
                    className="fill-[#ffedd5] origin-center"
                  />
                </g>
              )}

              {/* Cute Blushing Cheeks */}
              <circle cx="20" cy="34" r="3.5" fill="#f43f5e" opacity={leo.blush.opacity} />
              <circle cx="60" cy="34" r="3.5" fill="#f43f5e" opacity={leo.blush.opacity} />

              {/* Mouth */}
              <motion.path 
                animate={{ d: leo.mouth.d, scaleY: leo.mouth.scaleY }}
                stroke="#9a3412" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                fill={mood === "correct" || mood === "victory" ? "#9a3412" : "none"} 
              />
            </svg>

            {/* Magnifying Glass Overlay Icon for active interaction */}
            {mood === "thinking" && (
              <span className="absolute -bottom-1 -right-1 text-xs bg-amber-500 rounded-full h-5 w-5 flex items-center justify-center border border-slate-900 shadow font-mono text-slate-950 font-bold">
                🔍
              </span>
            )}
          </div>
          <span className="text-xs font-black text-emerald-400 font-mono tracking-widest leading-none mt-1">LEO</span>
          </motion.div>
        )}

        {/* CHARACTER 2: MIA (Girl with high-contrast coin collector hat) */}
        {showMia && (
          <motion.div 
            animate={mia.animation}
            className="flex flex-col items-center gap-1"
          >
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-full border-2 border-slate-700/60 flex items-center justify-center overflow-visible shadow-md">
            
            <svg viewBox="0 0 80 80" className="w-full h-full">
              {/* Mia's cute dark double-pigtails */}
              <circle cx="10" cy="45" r="10" fill="#111827" />
              <circle cx="70" cy="45" r="10" fill="#111827" />
              
              {/* Head / Skin */}
              <circle cx="40" cy="40" r="28" fill="#ffe4e6" /> {/* rosy pink cream */}

              {/* Cute hair bangs overlay */}
              <path d="M 12 30 Q 40 18 68 30 Q 64 12 40 12 Q 16 12 12 30 Z" fill="#111827" />

              {/* Mia's lavender coin-saver headband banner */}
              <path d="M 14 20 Q 40 14 66 20 L 64 26 Q 40 20 16 26 Z" fill="#7c3aed" /> {/* violet */}
              
              {/* Shiny coin medallion on headband */}
              <circle cx="40" cy="18" r="5" fill="#f59e0b" />
              <circle cx="40" cy="18" r="3" fill="#fbbf24" />

              {/* Brows */}
              <motion.path 
                animate={{ y: mia.eyebrows.y, rotate: mia.eyebrows.rotate }}
                d="M 22 24 Q 28 22 34 24" 
                stroke="#111827" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                fill="none" 
              />
              <motion.path 
                animate={{ y: mia.eyebrows.y, rotate: -mia.eyebrows.rotate }}
                d="M 46 24 Q 52 22 58 24" 
                stroke="#111827" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                fill="none" 
              />

              {/* Eyes */}
              {mia.eyes.isStars ? (
                <path d="M 23 27 L 27 27 L 25 24 Z M 23 29 L 27 29 L 25 32 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
              ) : (
                <g>
                  <circle cx="28" cy="28" r="4.5" fill="#7c3aed" /> {/* purple eyes */}
                  <circle cx="29.5" cy="26.3" r="1.3" fill="#ffffff" />
                  <motion.ellipse 
                    animate={{ scaleY: [1, 1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 4.3, repeatDelay: 1.2 }}
                    cx="28" 
                    cy="28" 
                    rx="5" 
                    ry="5" 
                    className="fill-[#ffe4e6] origin-center"
                  />
                </g>
              )}

              {mia.eyes.isStars ? (
                <path d="M 45 27 L 49 27 L 47 24 Z M 45 29 L 49 29 L 47 32 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
              ) : (
                <g>
                  <circle cx="52" cy="28" r="4.5" fill="#7c3aed" />
                  <circle cx="53.5" cy="26.3" r="1.3" fill="#ffffff" />
                  <motion.ellipse 
                    animate={{ scaleY: [1, 1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 4.3, repeatDelay: 1.2 }}
                    cx="52" 
                    cy="28" 
                    rx="5" 
                    ry="5" 
                    className="fill-[#ffe4e6] origin-center"
                  />
                </g>
              )}

              {/* Rosy blush */}
              <circle cx="20" cy="34" r="4" fill="#f43f5e" opacity={mia.blush.opacity} />
              <circle cx="60" cy="34" r="4" fill="#f43f5e" opacity={mia.blush.opacity} />

              {/* Cute mouth */}
              <motion.path 
                animate={{ d: mia.mouth.d, scaleY: mia.mouth.scaleY }}
                stroke="#4c1d95" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                fill={mood === "correct" || mood === "victory" ? "#4c1d95" : "none"} 
              />
            </svg>

            {/* Crown reward on victory */}
            {mood === "victory" && (
              <span className="absolute -top-3 left-4 text-sm animate-bounce">
                👑
              </span>
            )}
          </div>
          <span className="text-xs font-black text-violet-400 font-mono tracking-widest leading-none mt-1">MIA</span>
          </motion.div>
        )}

      </div>

      {/* Bubble Guidance dialogue aligned precisely with current lesson */}
      <div className="w-full bg-slate-950/85 p-3 sm:p-4 rounded-xl border border-slate-800 text-center relative mt-1">
        {/* Triangle tip pointer pointing up to avatars */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-slate-950/85" />
        
        <p className="text-[11px] sm:text-xs text-slate-100 leading-normal font-bold">
          {getSpeechBubbleText()}
        </p>
      </div>

    </div>
  );
}
