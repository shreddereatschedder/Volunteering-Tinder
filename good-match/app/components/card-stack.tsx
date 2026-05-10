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
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        <div className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-900 shadow-2xl p-6 flex items-center justify-between border-b border-teal-500/20">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">My Matches</h1>
          <button
            onClick={() => setShowMatches(false)}
            className="px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-xl hover:from-slate-600 hover:to-slate-500 transition-all shadow-lg hover:scale-105 duration-200 font-semibold"
          >
            Back
          </button>
          <button>
            
          </button>
        </div>
        
        {matchedCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent mb-2">No matches yet</h2>
              <p className="text-slate-400">Swipe right on opportunities to add them to your matches</p>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 p-8 bg-gradient-to-b from-slate-800 to-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {matchedCards.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedOpportunity(match)}
                  className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-teal-500/20 hover:scale-105 transition-all border border-teal-500/30 hover:border-teal-400/50"
                >
                  <div className="relative h-40 bg-gradient-to-br from-slate-600 to-slate-700">
                    <Image
                      src={match.image}
                      alt={match.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent mb-2">{match.title}</h3>
                    <div className="space-y-2 text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span>{match.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-600" />
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg max-h-[90vh] overflow-y-auto w-full max-w-2xl mx-4 border-2 border-emerald-200">
              <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-emerald-600 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{selectedOpportunity.title}</h2>
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="text-white hover:bg-teal-700 rounded-full p-2 transition-colors"
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
                  <div className="flex items-center gap-3 text-teal-900">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span>{selectedOpportunity.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-teal-900">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <span>{selectedOpportunity.timeCommitment}</span>
                  </div>
                  <div className="flex items-center gap-3 text-teal-900">
                    <User className="w-5 h-5 text-emerald-600" />
                    <span>{selectedOpportunity.username}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-teal-900 mb-2">About</h3>
                  <p className="text-teal-800">{selectedOpportunity.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-teal-900 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedOpportunity.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-teal-800">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-teal-900 mb-3">Benefits</h3>
                  <ul className="space-y-2">
                    {selectedOpportunity.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-teal-800">
                        <span className="text-emerald-600 mt-1">★</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`mailto:${selectedOpportunity.contactEmail}`}
                  className="block w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-lg font-semibold text-center hover:from-teal-700 hover:to-emerald-700 transition-all shadow-md"
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
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header with My Matches button */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-900 shadow-2xl p-6 flex items-center justify-between border-b border-teal-500/20">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">GoodMatch</h1>
          <p className="text-xs text-slate-400 mt-1 tracking-widest">VOLUNTEERING OPPORTUNITIES</p>
        </div>
        <button
          onClick={() => setShowMatches(true)}
          className="px-6 py-3 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-900 font-semibold rounded-xl hover:from-teal-500 hover:to-emerald-500 transition-all shadow-lg hover:shadow-teal-400/50 hover:scale-105 duration-200"
        >
          My Matches ({matchedCards.length})
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950">
        <div className="relative w-full max-w-sm h-[600px]">
          {cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/50">
                <RefreshCw className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                No more opportunities
              </h2>
              <p className="text-gray-600 mb-6">
                {"You've"} seen all available volunteering opportunities.
              </p>
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-3 rounded-full font-medium hover:from-teal-700 hover:to-emerald-700 transition-all shadow-md"
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
                  className={`w-2 h-2 rounded-full transition-colors shadow-lg ${
                    cards.find((c) => c.id === opp.id)
                      ? "bg-gradient-to-r from-teal-400 to-emerald-400"
                      : "bg-slate-700"
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
