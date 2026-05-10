import { VolunteerOpportunity } from "./types";

export const volunteerOpportunities: VolunteerOpportunity[] = [
  {
    id: "1",
    title: "Community Garden Helper",
    location: "Riverside Park, Brooklyn",
    timeCommitment: "4 hrs/week",
    username: "@greenthumb_sarah",
    image: "/images/volunteer-1.jpg",
    description:
      "Join our vibrant community garden team! Help us plant, water, and harvest fresh vegetables that we donate to local food banks. Perfect for nature lovers who want to make a tangible difference in their neighborhood.",
    requirements: [
      "No experience necessary",
      "Comfortable working outdoors",
      "Able to lift up to 20 lbs",
    ],
    benefits: [
      "Fresh produce to take home",
      "Learn sustainable gardening",
      "Meet wonderful neighbors",
    ],
    contactEmail: "sarah@communitygardens.org",
  },
  {
    id: "2",
    title: "Soup Kitchen Volunteer",
    location: "Hope Center, Manhattan",
    timeCommitment: "3 hrs/week",
    username: "@helping_hands_mike",
    image: "/images/volunteer-2.jpg",
    description:
      "Serve warm meals and warm hearts at our downtown soup kitchen. We provide meals to over 200 people daily and need compassionate volunteers to help with food prep, serving, and cleanup.",
    requirements: [
      "Food handling certificate (we provide training)",
      "Punctuality and reliability",
      "Positive attitude",
    ],
    benefits: [
      "Free meals during shifts",
      "Community service hours",
      "Build lasting connections",
    ],
    contactEmail: "mike@hopecenter.org",
  },
  {
    id: "3",
    title: "Beach Cleanup Crew",
    location: "Rockaway Beach, Queens",
    timeCommitment: "2 hrs/week",
    username: "@ocean_warrior_jen",
    image: "/images/volunteer-3.jpg",
    description:
      "Help us keep our beaches clean and protect marine life! Join our weekly cleanup efforts to remove plastic, trash, and debris from the shoreline. Every piece of trash collected is one less threat to our ocean friends.",
    requirements: [
      "Ability to walk on sand",
      "Sun protection recommended",
      "All ages welcome",
    ],
    benefits: [
      "Beach access perks",
      "Eco-friendly swag",
      "Great workout outdoors",
    ],
    contactEmail: "jen@cleanoceans.org",
  },
  {
    id: "4",
    title: "Youth Tutoring Program",
    location: "Lincoln Community Center, Bronx",
    timeCommitment: "5 hrs/week",
    username: "@teach_together_ali",
    image: "/images/volunteer-4.jpg",
    description:
      "Make a lasting impact on young minds! Tutor elementary and middle school students in reading, math, and science. Watch their confidence grow as they master new skills with your guidance.",
    requirements: [
      "High school diploma or equivalent",
      "Background check required",
      "Patience and enthusiasm",
    ],
    benefits: [
      "Professional development",
      "Letter of recommendation",
      "Heartwarming connections",
    ],
    contactEmail: "ali@youthprograms.org",
  },
  {
    id: "5",
    title: "Animal Shelter Helper",
    location: "Paws & Love Shelter, Staten Island",
    timeCommitment: "4 hrs/week",
    username: "@pawsome_pete",
    image: "/images/volunteer-5.jpg",
    description:
      "Love animals? Help us care for rescued dogs and cats waiting for their forever homes. Tasks include feeding, walking, socialization, and helping potential adopters find their perfect match.",
    requirements: [
      "Love for animals",
      "Comfortable around dogs and cats",
      "Reliable schedule",
    ],
    benefits: [
      "Cuddle time with pets",
      "Adoption discounts",
      "Training workshops",
    ],
    contactEmail: "pete@pawsandlove.org",
  },
];
