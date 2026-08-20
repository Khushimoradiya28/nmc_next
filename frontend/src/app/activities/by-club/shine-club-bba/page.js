import React from 'react';
import ClubDetailTemplate from '@/components/activities/ClubDetailTemplate';

export const metadata = {
  title: 'Shine Club [B.B.A.] | Nandkunvarba Mahila College',
};

export default function ShineClubPage() {
  return (
    <ClubDetailTemplate 
      clubName="Shine Club"
      dept="B.B.A. (Business Administration)"
      aboutText="The Shine Club of B.B.A. department organizes business seminars, mock interviews, entrepreneurship workshops, and industry visits to prepare students for corporate life."
      founded="2016"
      memberCount="130+"
      coordinator="Dr. Nehal Shah"
      galleryImages={[
        '/assets/home/hero/1.jpg',
        '/assets/home/hero/2.jpg',
        '/assets/home/hero/3.jpg'
      ]}
      upcomingEvents={[
        {
          id: "marketing-wizard",
          categoryId: "club",
          subCategoryId: "shine-club-bba",
          clubName: "Shine Club [B.B.A.]",
          title: "Marketing Wizard: Ad-Making Competition",
          shortDescription: "Unleash your creativity! Join the Ad-Making competition where teams create compelling advertisements for everyday products.",
          date: "2026-11-20",
          thumbnail: "/assets/home/hero/4.jpg"
        }
      ]}
    />
  );
}
