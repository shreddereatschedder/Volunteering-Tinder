"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PolaroidCard } from "./polaroid-card";
import { VolunteerOpportunity } from "../types";
import { RefreshCw, MapPin, Clock, User } from "lucide-react";

interface CardStackProps {
  opportunities: VolunteerOpportunity[];
}

export function CardStack({ opportunities }: CardStackProps) {
  const [cards, setCards] = useState(opportunities);
  const [selectedOpportunity, setSelectedOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [matchedCards, setMatchedCards] = useState<VolunteerOpportunity[]>([]);
  const [showMatches, setShowMatches] = useState(false);

  const handleSwipeLeft = () => {
    if (cards.length > 0) {
      setCards((prev) => prev.slice(1));
    }
  };

  const handleSwipeRight = () => {
    if (cards.length > 0) {
      const [matched, ...remaining] = cards;
      setMatchedCards((prev) => [...prev, matched]);
      setCards(remaining);
    }
  };

  const handleCloseDetail = () => {
    setSelectedOpportunity(null);
  };

  const handleReset = () => {
    setCards(opportunities);
    setMatchedCards([]);
  };

  if (showMatches) {
    return (
      <div className="w-full h-screen bg-gray-50 flex flex-col">
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">My Matches</h1>
          <button
            onClick={() => setShowMatches(false)}
            className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
          >
            Back
          </button>
        </div>
        
        {matchedCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-black mb-2">No matches yet</h2>
              <p className="text-gray-600">Swipe right on opportunities to add them to your matches</p>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {matchedCards.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedOpportunity(match)}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40 bg-gray-200">
                    <Image
                      src={match.image}
                      alt={match.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-black mb-2">{match.title}</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{match.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{match.timeCommitment}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedOpportunity && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg max-h-[90vh] overflow-y-auto w-full max-w-2xl mx-4">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">{selectedOpportunity.title}</h2>
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="text-gray-500 hover:text-black text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={selectedOpportunity.image}
                    alt={selectedOpportunity.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <span>{selectedOpportunity.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span>{selectedOpportunity.timeCommitment}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <User className="w-5 h-5 text-gray-600" />
                    <span>{selectedOpportunity.username}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">About</h3>
                  <p className="text-gray-700">{selectedOpportunity.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-black mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedOpportunity.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-black mb-3">Benefits</h3>
                  <ul className="space-y-2">
                    {selectedOpportunity.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-600 mt-1">★</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`mailto:${selectedOpportunity.contactEmail}`}
                  className="block w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-center hover:bg-green-600 transition-colors"
                >
                  Contact: {selectedOpportunity.contactEmail}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header with My Matches button */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Good Match</h1>
        <button
          onClick={() => setShowMatches(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          My Matches ({matchedCards.length})
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-sm h-[600px]">
          {cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                <RefreshCw className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-black mb-2">
                No more opportunities
              </h2>
              <p className="text-gray-600 mb-6">
                {"You've"} seen all available volunteering opportunities.
              </p>
              <button
                onClick={handleReset}
                className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-colors"
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
                  onSwipeLeft={handleSwipeLeft}
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
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
