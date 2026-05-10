"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import Image from "next/image";
import { MapPin, Clock, User } from "lucide-react";
import { VolunteerOpportunity } from "../types";

interface PolaroidCardProps {
  opportunity: VolunteerOpportunity;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
  index: number;
}

export function PolaroidCard({
  opportunity,
  onSwipeLeft,
  onSwipeRight,
  isTop,
  index,
}: PolaroidCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const leftIndicatorOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const rightIndicatorOpacity = useTransform(x, [0, 50, 150], [0, 0.5, 1]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;

    if (info.offset.x < -threshold) {
      onSwipeLeft();
    } else if (info.offset.x > threshold) {
      onSwipeRight();
    }
  };

  const stackOffset = index * 16;
  const stackScale = 1 - index * 0.04;
  const stackRotation = [0, -6, 8, -4];
  const stackOffsetX = [0, -8, 6, 4];

  return (
    <motion.div
      className="absolute w-full cursor-grab active:cursor-grabbing"
      style={{
        x: isTop ? x : stackOffsetX[Math.min(index, 3)],
        rotate: isTop ? rotate : stackRotation[Math.min(index, 3)],
        opacity,
        zIndex: 10 - index,
        top: stackOffset,
        scale: stackScale,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.2}
      onDragEnd={isTop ? handleDragEnd : undefined}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: stackScale, opacity: 1 }}
      exit={{ 
        x: x.get() < 0 ? -300 : 300,
        opacity: 0,
        transition: { duration: 0.3 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="relative bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg p-2 pb-8 shadow-2xl mx-auto max-w-sm border border-slate-200/50">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-300 to-slate-400 pointer-events-none rounded-md shadow-inner">
          <Image
            src={opportunity.image}
            alt={opportunity.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          
          {/* Swipe indicators */}
          {isTop && (
            <>
              <motion.div
                className="absolute top-4 left-4 text-red-600 text-xs font-bold rotate-[-15deg] bg-red-100 px-2 py-1 rounded-lg shadow-lg"
                style={{ opacity: leftIndicatorOpacity }}
              >
                ✕ PASS
              </motion.div>
              <motion.div
                className="absolute top-4 right-4 text-emerald-600 text-xs font-bold rotate-[15deg] bg-emerald-100 px-2 py-1 rounded-lg shadow-lg"
                style={{ opacity: rightIndicatorOpacity }}
              >
                ★ MATCH
              </motion.div>
            </>
          )}
          
          {/* Match/Reject overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-lg"
            style={{
              opacity: useTransform(
                x,
                [-150, -80, 80, 150],
                [1, 0, 0, 1]
              ),
            }}
          >
            <motion.div
              className="absolute flex items-center justify-center w-32 h-32 rounded-full"
              style={{
                opacity: useTransform(x, [-150, -80], [1, 0]),
              }}
            >
              <div className="flex flex-col items-center justify-center w-32 h-32 border-4 border-red-500 rounded-full bg-gradient-to-br from-red-100 to-red-50/80 shadow-xl">
                <div className="text-5xl font-bold text-red-600">✕</div>
              </div>
            </motion.div>
            
            <motion.div
              className="absolute flex items-center justify-center w-32 h-32 rounded-full"
              style={{
                opacity: useTransform(x, [80, 150], [0, 1]),
              }}
            >
              <div className="flex flex-col items-center justify-center w-32 h-32 border-4 border-emerald-500 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50/80 shadow-xl">
                <div className="text-4xl font-bold text-emerald-600">✓</div>
                <div className="text-xs text-emerald-700 font-bold mt-1">MATCH!</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Polaroid caption area */}
        <div className="pt-3 space-y-2 pointer-events-none">
          <h3 className="text-sm font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight text-balance">
            {opportunity.title}
          </h3>
          
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-teal-500" />
              <span>{opportunity.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-emerald-500" />
              <span>{opportunity.timeCommitment}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-amber-500" />
              <span>{opportunity.username}</span>
            </div>
          </div>
        </div>

        {/* Drag overlay - captures drag events across entire card */}
        {isTop && <div className="absolute inset-0 rounded-sm" style={{ touchAction: "none" }} />}
      </div>
    </motion.div>
  );
}
