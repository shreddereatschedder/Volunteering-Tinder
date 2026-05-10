"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, MapPin, Clock, User, Mail, CheckCircle2, Heart } from "lucide-react";
import { VolunteerOpportunity } from "../types";

interface OpportunityDetailProps {
  opportunity: VolunteerOpportunity;
  onClose: () => void;
  onDismiss: () => void;
}

export function OpportunityDetail({
  opportunity,
  onClose,
  onDismiss,
}: OpportunityDetailProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-background z-50 overflow-y-auto"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      {/* Header image */}
      <div className="relative h-72 sm:h-96">
        <Image
          src={opportunity.image}
          alt={opportunity.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Back button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm text-card-foreground p-2 rounded-full shadow-lg hover:bg-card transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 pb-24 -mt-16 relative">
        <div className="bg-card rounded-2xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-card-foreground mb-4 text-balance">
            {opportunity.title}
          </h1>

          {/* Meta info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{opportunity.location}</span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span>{opportunity.timeCommitment}</span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <User className="w-5 h-5 text-primary" />
              <span>{opportunity.username}</span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="w-5 h-5 text-primary" />
              <a
                href={`mailto:${opportunity.contactEmail}`}
                className="text-primary hover:underline"
              >
                {opportunity.contactEmail}
              </a>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-2">
              About this opportunity
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {opportunity.description}
            </p>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-3">
              Requirements
            </h2>
            <ul className="space-y-2">
              {opportunity.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h2 className="text-lg font-semibold text-card-foreground mb-3">
              What you get
            </h2>
            <ul className="space-y-2">
              {opportunity.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button
            onClick={onDismiss}
            className="flex-1 py-3 px-6 border border-border rounded-full text-muted-foreground font-medium hover:bg-secondary transition-colors"
          >
            Not for me
          </button>
          <a
            href={`mailto:${opportunity.contactEmail}?subject=Interested in volunteering: ${opportunity.title}`}
            className="flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-full font-medium text-center hover:opacity-90 transition-opacity"
          >
            Contact
          </a>
        </div>
      </div>
    </motion.div>
  );
}
