import React, { useState } from "react";
import { 
  Coins, FileCode, Sliders, Eye, BookOpen, Info, Sparkles, Cpu, Layers, Terminal,
  Lock, Unlock, Shield, X, Check, ShieldAlert
} from "lucide-react";
import { initialQuestions } from "./data";
import { QuizQuestion } from "./types";
import KioskSimulator from "./components/KioskSimulator";
import CodeExporter from "./components/CodeExporter";
import EducatorWorkbench from "./components/EducatorWorkbench";

export default function App() {
  // Master state carrying standard quiz questions
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [activeTab, setActiveTab] = useState<"exporter" | "educator">("exporter");
  const [isPresentation, setIsPresentation] = useState<boolean>(false);
  const [isBorderless, setIsBorderless] = useState<boolean>(false);

  // Kiosk Administrator variables
  const [isConsoleUnlocked, setIsConsoleUnlocked] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);

  // Monitor Escape key and key combinations to toggle Kiosk Admin Lock screen
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPresentation) return;

      // Escape key prompts the PIN overlay instead of exiting instantly
      if (e.key === "Escape") {
        e.preventDefault();
        setShowPinModal(true);
        setPinInput("");
        setPinError(null);
      }

      // Ctrl+Shift+A triggers the PIN popup
      if ((e.ctrlKey || e.metaKey || e.altKey) && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        setShowPinModal(true);
        setPinInput("");
        setPinError(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPresentation]);

  // Handle PIN numeric entry pad interactions
  const handlePinKeyPress = (digit: string) => {
    setPinError(null);
    if (pinInput.length < 4) {
      const newVal = pinInput + digit;
      setPinInput(newVal);

      // Auto check when 4 digits are completed
      if (newVal === "1234") {
        setIsConsoleUnlocked(true);
        setShowPinModal(false);
        setPinInput("");
      } else if (newVal.length === 4) {
        setTimeout(() => {
          setPinError("Invalid Security PIN");
          setPinInput("");
        }, 220);
      }
    }
  };

  // Handler to update a question in state
  const handleUpdateQuestion = (updatedQuestion: QuizQuestion) => {
    setQuestions((prevQuestions) => 
      prevQuestions.map((q) => q.id === updatedQuestion.id ? updatedQuestion : q)
    );
  };

  // Handler to restore curated questions to their default standards
  const handleResetQuestions = () => {
    setQuestions(initialQuestions);
  };

  // Prevent body/html scrolling and rubber-band touch gestures when presentation/kiosk mode is active
  React.useEffect(() => {
    if (isPresentation) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalBodyHeight = document.body.style.height;
      const originalBodyWidth = document.body.style.width;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalHtmlHeight = document.documentElement.style.height;
      const originalHtmlWidth = document.documentElement.style.width;

      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.body.style.width = "100vw";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100vh";
      document.documentElement.style.width = "100vw";

      const preventScroll = (e: TouchEvent) => {
        // Stop default browser elastic scroll, unless the touch is inside our custom scrollable area
        if (!(e.target as HTMLElement).closest('.overflow-y-auto')) {
          e.preventDefault();
        }
      };

      document.addEventListener("touchmove", preventScroll, { passive: false });

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.height = originalBodyHeight;
        document.body.style.width = originalBodyWidth;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.style.height = originalHtmlHeight;
        document.documentElement.style.width = originalHtmlWidth;
        document.removeEventListener("touchmove", preventScroll);
      };
    }
  }, [isPresentation]);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-650 selection:text-white ${isPresentation ? "h-screen w-screen overflow-hidden" : ""}`}>
      
      {/* FULLSCREEN KIOSK PRESENTATION OVERLAY */}
      {isPresentation && (
        <div className="fixed inset-0 z-50 w-screen h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden p-0 select-none">
          
          {/* Subtle / Invisible Admin Unlock Trigger Button (No visual noise, pristine kiosk layout) */}
          {!isConsoleUnlocked && (
            <button
              id="kiosk_secret_admin_trigger"
              onClick={() => {
                setShowPinModal(true);
                setPinInput("");
                setPinError(null);
              }}
              className="absolute top-2 right-2 z-40 w-16 h-16 flex items-center justify-center opacity-0 hover:opacity-10 active:opacity-30 transition-all rounded-full bg-slate-800/10 text-slate-400 cursor-pointer"
              title="Touch top-right corner to access Admin controls"
            >
              <Lock className="w-5 h-5 font-light" />
            </button>
          )}

          {/* Floating HUD Controller - Only visible when unlocked by Admin */}
          {isConsoleUnlocked && (
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-slate-900/95 backdrop-blur-md border border-amber-500/40 p-2 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all animate-fade-in group">
              <span className="text-[10px] font-mono tracking-wider text-amber-400 font-bold px-2 flex items-center gap-1.5">
                <Unlock className="h-3.5 w-3.5 animate-pulse text-amber-500" />
                ADMIN ACTIVE:
              </span>
              <button
                id="presentation_lock_hud"
                onClick={() => setIsConsoleUnlocked(false)}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-[11px] px-3 py-1.5 rounded-lg cursor-pointer transition-all active:scale-95"
                title="Lock admin panel"
              >
                🔒 Lock HUD
              </button>
              <button
                id="presentation_exit_btn"
                onClick={() => {
                  setIsPresentation(false);
                  setIsBorderless(false);
                  setIsConsoleUnlocked(false);
                }}
                className="flex items-center gap-1 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-lg shadow-md cursor-pointer active:scale-95 transition-all"
                title="Exit Fullscreen Kiosk Mode"
              >
                ✕ Exit Kiosk
              </button>
            </div>
          )}

          {/* SECURE ADMIN PIN LOCK DIALOG */}
          {showPinModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-lg animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-[0_30px_70px_rgba(0,0,0,0.85)] text-center space-y-6 relative border-indigo-900/35">
                
                {/* Close Button */}
                <button
                  onClick={() => setShowPinModal(false)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-slate-350 cursor-pointer p-1 rounded-full hover:bg-slate-800 transition-all"
                  title="Close login"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Header message */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="bg-amber-500/10 p-3.5 rounded-full border border-amber-500/20 text-amber-400">
                    <Shield className="h-7 w-7" />
                  </div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-100">
                    Kiosk Security Lock
                  </h3>
                  <p className="text-[11px] text-slate-400 max-w-[240px] mx-auto">
                    Type the 4-digit administrator passcode to unlock presenter controls.
                  </p>
                </div>

                {/* Entry Display Dots/Circles */}
                <div className="flex justify-center gap-4 py-1">
                  {[0, 1, 2, 3].map((index) => (
                    <div 
                      key={index}
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center text-sm font-bold transition-all duration-150 ${
                        pinError 
                          ? "border-red-500/50 bg-red-950/20 text-red-400"
                          : pinInput.length > index
                            ? "border-amber-400 bg-slate-800 text-amber-400 shadow-lg shadow-amber-500/10"
                            : "border-slate-800 bg-slate-950/80 text-slate-600"
                      }`}
                    >
                      {pinInput.length > index ? "●" : ""}
                    </div>
                  ))}
                </div>

                {/* Notification Area */}
                {pinError ? (
                  <p className="text-xs text-rose-500 font-bold flex items-center justify-center gap-1.5 bg-rose-950/20 py-1.5 rounded-lg border border-rose-900/30">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {pinError}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-500 font-mono tracking-wider">Default Admin PIN: 1234</p>
                )}

                {/* Touch Screen Keypad Grid */}
                <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                    <button
                      key={num}
                      onClick={() => handlePinKeyPress(num)}
                      className="w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-base font-bold flex items-center justify-center cursor-pointer active:scale-90 transition-all border border-slate-850 shadow-sm"
                    >
                      {num}
                    </button>
                  ))}
                  
                  {/* Clear Key */}
                  <button
                    onClick={() => {
                      setPinInput("");
                      setPinError(null);
                    }}
                    className="w-14 h-14 rounded-full bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center cursor-pointer transition-all border border-slate-900"
                  >
                    Clear
                  </button>

                  {/* Zero Key */}
                  <button
                    onClick={() => handlePinKeyPress("0")}
                    className="w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-base font-bold flex items-center justify-center cursor-pointer active:scale-90 transition-all border border-slate-850"
                  >
                    0
                  </button>

                  {/* Cancel Key */}
                  <button
                    onClick={() => setShowPinModal(false)}
                    className="w-14 h-14 rounded-full bg-slate-850 hover:bg-slate-800/60 text-slate-400 hover:text-rose-450 text-xs font-semibold flex items-center justify-center cursor-pointer transition-all border border-slate-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mounted Active Kiosk (stretched to fill if borderless) */}
          <div className={`${isBorderless ? "w-screen h-screen text-slate-100" : "w-full max-w-[1200px] aspect-[16/9] p-4"} flex flex-col justify-center items-center transition-all duration-300`}>
            <KioskSimulator 
              questions={questions} 
              onResetQuestions={handleResetQuestions} 
              isPresentation={true}
              isBorderless={isBorderless}
              onExitPresentation={() => {
                setIsPresentation(false);
                setIsBorderless(false);
                setIsConsoleUnlocked(false);
              }}
            />
          </div>
        </div>
      )}

      {/* GLOBAL BANNER HEADER */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {/* Gallery Branding Icon */}
            <div className="bg-gradient-to-tr from-amber-500 to-indigo-600 p-2.5 rounded-xl text-slate-950 shadow-lg shadow-indigo-950/20 flex items-center justify-center">
              <Coins className="h-5 w-5 text-slate-100 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  Museum Kiosk Suite v1.4
                </span>
                <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[9px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded">
                  Unity 2022+ Ready
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
                Numismatics & Economics Terminal Simulator
              </h1>
            </div>
          </div>

          {/* Quick status bar */}
          <div className="flex items-center gap-3.5 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-2 rounded-lg border border-slate-850">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>C# Exporter Active</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-2 rounded-lg border border-slate-850">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span>Local State Synchronized</span>
            </div>
          </div>

        </div>
      </header>

      {/* DUAL WORKSPACE LAYOUT */}
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow w-full space-y-8">
        
        {/* WIDESCREEN 1920x1080 TERMINAL SIMULATOR SECTION */}
        <section className="bg-slate-905/40 p-5 sm:p-6 rounded-3xl border border-slate-800/80 backdrop-blur-sm shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-emerald-400" />
              <span className="text-[11px] font-bold text-slate-350 uppercase tracking-widest font-mono">
                Simulated 1920x1080 Landscape Kiosk Touchscreen (Visitor View)
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span>Aspect Ratio: 16:9 Landscape Video Profile</span>
            </div>
          </div>

          {/* Mounted Physical Kiosk Simulator */}
          <KioskSimulator 
            questions={questions} 
            onResetQuestions={handleResetQuestions} 
            onToggleFullscreen={() => {
              setIsPresentation(true);
              setIsBorderless(true);
            }}
          />
          
          {/* Hardware Specs Footnote */}
          <div className="mt-5 p-4 bg-slate-950/80 border border-slate-800/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex gap-3 items-center">
              <Info className="h-5 w-5 text-indigo-400 flex-shrink-0" />
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-3xl">
                <strong>Simulating Landscape Bezel Controls:</strong> Optimised for 1920x1080 landscape tables or capacitive pedestal screens installed directly beside glass gallery casework. The wide grid allows multi-column accessibility, larger gesture bounds, and simultaneous adult/child focus panels.
              </p>
            </div>
          </div>
        </section>

        {/* WORKBENCH AND SCHEMATIC CONTROLS SECTION */}
        <section className="space-y-6">
          
          {/* Primary navigation bar to toggle between Developer and Educator workspaces */}
          <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex justify-between gap-2.5">
            
            <div className="flex gap-2">
              <button
                id="tab_trigger_exporter"
                onClick={() => setActiveTab("exporter")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === "exporter"
                    ? "bg-indigo-600 text-slate-105 shadow-lg shadow-indigo-950"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                }`}
              >
                <Cpu className="h-4 w-4" />
                Unity C# Scripts Exporter
              </button>

              <button
                id="tab_trigger_educator"
                onClick={() => setActiveTab("educator")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === "educator"
                    ? "bg-indigo-650 text-slate-105 shadow-lg shadow-indigo-950"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Educator Customization Hub
              </button>
            </div>

            {/* Simple active indicators */}
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-500 font-mono pr-2 select-none uppercase">
              <Terminal className="h-3.5 w-3.5" />
              <span>Ready to compile</span>
            </div>
          </div>

          {/* TAB CONTENT PANEL */}
          <div className="transition-all duration-300">
            {activeTab === "exporter" ? (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
                  <h3 className="font-sans font-semibold text-slate-250 text-xs uppercase tracking-wider mb-1">
                    Unity Developer Guide
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Copy the custom ScriptableObject container and the complete MonoBehaviour manager below. The scripts automate screen loading, scoring, reeding validation triggers, and audio feedbacks, using native TMPro formatting!
                  </p>
                </div>
                
                {/* Code Block Tab Component */}
                <CodeExporter questions={questions} />
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {/* Educator panel customizer */}
                <EducatorWorkbench 
                  questions={questions} 
                  onUpdateQuestion={handleUpdateQuestion}
                  onResetQuestions={handleResetQuestions}
                />
              </div>
            )}
          </div>

        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950/50 border-t border-slate-900 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="text-xs text-slate-500 font-mono">
            Designed for the Numismatics & Economics Gallery Touchscreen Project. Curated with museum educational methodologies and strict Unity C# styling guidelines.
          </p>
          <p className="text-[10px] text-slate-600">
            Powered by React, Tailwind CSS, & Multi-Layer Web Audio Synthesizer.
          </p>
        </div>
      </footer>

    </div>
  );
}
