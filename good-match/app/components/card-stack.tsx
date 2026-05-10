"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PolaroidCard } from "./polaroid-card";
import { OpportunityDetail } from "./opportunity-detail";
import { VolunteerOpportunity } from "../types";
import { RefreshCw } from "lucide-react";

interface CardStackProps {
  opportunities: VolunteerOpportunity[];
}

export function CardStack({ opportunities }: CardStackProps) {
  const [cards, setCards] = useState(opportunities);
  const [selectedOpportunity, setSelectedOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [dismissedCards, setDismissedCards] = useState<VolunteerOpportunity[]>([]);

  const handleSwipeLeft = (opportunity: VolunteerOpportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const handleSwipeRight = () => {
    if (cards.length > 0) {
      const [dismissed, ...remaining] = cards;
      setDismissedCards((prev) => [...prev, dismissed]);
      setCards(remaining);
    }
  };

  const handleCloseDetail = () => {
    setSelectedOpportunity(null);
  };

  const handleDismissFromDetail = () => {
    if (selectedOpportunity) {
      setDismissedCards((prev) => [...prev, selectedOpportunity]);
      setCards((prev) => prev.filter((c) => c.id !== selectedOpportunity.id));
      setSelectedOpportunity(null);
    }
  };

  const handleReset = () => {
    setCards(opportunities);
    setDismissedCards([]);
  };

  if (selectedOpportunity) {
    return (
      <OpportunityDetail
        opportunity={selectedOpportunity}
        onClose={handleCloseDetail}
        onDismiss={handleDismissFromDetail}
      />
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto h-[600px]">
      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
            <RefreshCw className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No more opportunities
          </h2>
          <p className="text-muted-foreground mb-6">
            {"You've"} seen all available volunteering opportunities.
          </p>
          <button
            onClick={handleReset}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Start Over
          </button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {cards.slice(0, 3).map((opportunity, index) => (
            <PolaroidCard
              key={opportunity.id}
              opportunity={opportunity}
              onSwipeLeft={() => handleSwipeLeft(opportunity)}
              onSwipeRight={handleSwipeRight}
              isTop={index === 0}
              index={index}
            />
          ))}
        </AnimatePresence>
      )}

      {/* Progress indicator */}
      {cards.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className={`w-2 h-2 rounded-full transition-colors ${
                cards.find((c) => c.id === opp.id)
                  ? "bg-primary"
                  : "bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
