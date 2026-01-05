"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
  text = "",
  words = ["Landing Pages", "Component Blocks", "Page Sections"],
  duration = 3000,
  className,
  textClassName,
  wordClassName,
  textStyle = {},
  wordStyle = {},
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {text && (
        <motion.span
          layoutId="subtext"
          className={cn("font-bold tracking-tight drop-shadow-lg", textClassName)}
          style={textStyle}
        >
          {text}
        </motion.span>
      )}
      <motion.span
        layout
        className={cn(
          "relative w-fit overflow-hidden rounded-xl border border-transparent bg-white px-5 py-2 font-bold tracking-tight text-black shadow-lg ring-1 ring-black/10 dark:bg-neutral-900 dark:text-white dark:ring-white/10",
          wordClassName
        )}
        style={wordStyle}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -40, filter: "blur(10px)", opacity: 0 }}
            animate={{
              y: 0,
              filter: "blur(0px)",
              opacity: 1,
            }}
            exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="inline-block whitespace-nowrap"
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </div>
  );
};
