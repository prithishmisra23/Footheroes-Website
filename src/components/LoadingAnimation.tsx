"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const INTRO_TTL_MS = 24 * 60 * 60 * 1000;

export default function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const [showIntro, setShowIntro] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  const totalDuration = useMemo(() => (prefersReducedMotion ? 450 : 2800), [prefersReducedMotion]);

  const completeIntro = useCallback(() => {
    setShowIntro(false);
    try {
      localStorage.setItem("ft_intro_shown", Date.now().toString());
    } catch {
      // Ignore storage issues and finish normally.
    }

    window.setTimeout(onComplete, 280);
  }, [onComplete]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("ft_intro_shown");
      if (cached && Date.now() - Number.parseInt(cached, 10) < INTRO_TTL_MS) {
        onComplete();
        return;
      }
    } catch {
      // Ignore storage issues and continue with a best-effort intro.
    }

    setShowIntro(true);

    const skipTimer = window.setTimeout(() => {
      setCanSkip(true);
    }, prefersReducedMotion ? 0 : 500);

    const exitTimer = window.setTimeout(() => {
      completeIntro();
    }, totalDuration);

    return () => {
      window.clearTimeout(skipTimer);
      window.clearTimeout(exitTimer);
    };
  }, [completeIntro, onComplete, prefersReducedMotion, totalDuration]);

  if (!showIntro) {
    return null;
  }

  const letters = "FOOT HEROES".split("");

  return (
    <AnimatePresence>
      <motion.button
        key="foot-heroes-intro"
        type="button"
        aria-label="Skip intro animation"
        disabled={!canSkip}
        onClick={() => {
          if (canSkip) {
            completeIntro();
          }
        }}
        className="fixed inset-0 z-[100] flex cursor-default items-center justify-center overflow-hidden border-0 bg-transparent p-0 text-left disabled:pointer-events-none"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.24),_transparent_38%),linear-gradient(180deg,_#10223F_0%,_#0A1628_58%,_#08111F_100%)]" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_bottom,_rgba(34,197,94,0.2),_transparent_65%)]" />

        <div className="relative flex h-full w-full max-w-6xl items-center justify-center px-6">
          {!prefersReducedMotion && (
            <>
              <motion.div
                className="absolute left-[10%] top-1/2 hidden h-28 w-24 -translate-y-1/2 md:block"
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: [-80, -32, -20], opacity: [0, 1, 1] }}
                transition={{ duration: 0.75, ease: "easeOut" }}
              >
                <div className="absolute left-7 top-0 h-12 w-8 rounded-t-full bg-white/90" />
                <div className="absolute left-4 top-10 h-10 w-14 rounded-[40%] bg-white/90" />
                <motion.div
                  className="absolute left-2 top-16 h-12 w-3 origin-top rounded-full bg-emerald-200"
                  animate={{ rotate: [28, -18, 22] }}
                  transition={{ duration: 0.55, repeat: 2, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute right-3 top-16 h-12 w-3 origin-top rounded-full bg-emerald-200"
                  animate={{ rotate: [-28, 18, -20] }}
                  transition={{ duration: 0.55, repeat: 2, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute left-8 top-[4.3rem] h-14 w-3 origin-top rounded-full bg-white"
                  animate={{ rotate: [16, -40, 18] }}
                  transition={{ duration: 0.4, repeat: 2, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute right-5 top-[4.3rem] h-14 w-3 origin-top rounded-full bg-white"
                  animate={{ rotate: [-20, 42, -18] }}
                  transition={{ duration: 0.4, repeat: 2, ease: "easeInOut" }}
                />
              </motion.div>

              {[0.45, 0.3, 0.18].map((opacity, index) => (
                <motion.div
                  key={opacity}
                  className="absolute left-[28%] top-1/2 h-5 w-5 rounded-full border border-white/40 bg-emerald-300/20"
                  initial={{ x: -16, y: 22, scale: 0.75, opacity: 0 }}
                  animate={{
                    x: [0, 220 + index * 36, 440 + index * 42, 700 + index * 48],
                    y: [22, -42, -10, 26],
                    opacity: [0, opacity, opacity / 2, 0],
                  }}
                  transition={{ duration: 0.9, delay: 0.46 + index * 0.06, ease: [0.19, 1, 0.22, 1] }}
                />
              ))}

              <motion.div
                className="absolute left-[28%] top-1/2 h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-white to-emerald-300 shadow-[0_0_30px_rgba(34,197,94,0.45)]"
                initial={{ x: -10, y: 12, rotate: 0, opacity: 0 }}
                animate={{
                  x: [-10, 280, 540, 900],
                  y: [12, -62, -18, 32],
                  rotate: [0, 280, 520, 720],
                  opacity: [0, 1, 1, 0.1],
                }}
                transition={{ duration: 0.95, delay: 0.48, ease: [0.2, 0.8, 0.2, 1] }}
              />
            </>
          )}

          <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 sm:mb-6">
              {letters.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28, scale: prefersReducedMotion ? 1 : 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.15 : 0.28,
                    delay: prefersReducedMotion ? 0.05 : 0.95 + index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`font-bebas text-5xl tracking-[0.22em] text-white drop-shadow-[0_12px_28px_rgba(0,0,0,0.42)] sm:text-7xl ${
                    letter === " " ? "mx-2 w-3 sm:w-5" : ""
                  }`}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: prefersReducedMotion ? 0.18 : 1.6 }}
              className="max-w-md text-sm uppercase tracking-[0.35em] text-slate-300 sm:text-base"
            >
              Your game. Your record. Forever.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: canSkip ? 0.7 : 0 }}
              transition={{ duration: 0.2 }}
              className="mt-8 text-[10px] uppercase tracking-[0.32em] text-slate-400 sm:text-xs"
            >
              Tap anywhere to skip
            </motion.p>
          </div>
        </div>
      </motion.button>
    </AnimatePresence>
  );
}
