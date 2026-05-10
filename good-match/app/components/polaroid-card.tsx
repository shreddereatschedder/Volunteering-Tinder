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

  const stackOffset = index * 4;
  const stackScale = 1 - index * 0.03;

  return (
    <motion.div
      className="absolute w-full cursor-grab active:cursor-grabbing"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : index * 2 - 2,
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
      <div className="relative bg-white rounded-sm p-3 pb-16 shadow-xl mx-auto max-w-sm">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-200 pointer-events-none">
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
                className="absolute top-4 left-4 text-red-500 text-sm font-bold rotate-[-15deg]"
                style={{ opacity: leftIndicatorOpacity }}
              >
                ✕ PASS
              </motion.div>
              <motion.div
                className="absolute top-4 right-4 text-green-500 text-sm font-bold rotate-[15deg]"
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
              <div className="flex flex-col items-center justify-center w-32 h-32 border-4 border-red-500 rounded-full bg-red-50/80">
                <div className="text-5xl font-bold text-red-500">✕</div>
              </div>
            </motion.div>
            
            <motion.div
              className="absolute flex items-center justify-center w-32 h-32 rounded-full"
              style={{
                opacity: useTransform(x, [80, 150], [0, 1]),
              }}
            >
              <div className="flex flex-col items-center justify-center w-32 h-32 border-4 border-green-500 rounded-full bg-green-50/80">
                <div className="text-4xl font-bold text-green-500">✓</div>
                <div className="text-xs text-green-600 font-bold mt-1">MATCH!</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Polaroid caption area */}
        <div className="pt-4 space-y-3 pointer-events-none">
          <h3 className="text-lg font-semibold text-black leading-tight text-balance">
            {opportunity.title}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{opportunity.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{opportunity.timeCommitment}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
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
