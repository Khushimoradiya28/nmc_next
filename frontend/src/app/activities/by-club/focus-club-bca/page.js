import React from 'react';
import ClubDetailTemplate from '@/components/activities/ClubDetailTemplate';

export const metadata = {
  title: 'Focus Club [B.C.A.] | Nandkunvarba Mahila College',
};

export default function FocusClubPage() {
  return (
    <ClubDetailTemplate 
      clubName="Focus Club"
      dept="B.C.A. (Computer Applications)"
      aboutText="Focus Club drives computational skills, logic puzzles, hackathons, and graphic workshops. It hosts regular expert panels covering modern web design trends and software development frameworks."
      founded="2015"
      memberCount="150+"
      coordinator="Dr. Hiren Jadav"
      galleryImages={[
        '/assets/home/hero/4.jpg',
        '/assets/home/hero/5.jpg',
        '/assets/home/hero/1.jpg'
      ]}
      upcomingEvents={[
        {
          id: "photoshop-bootcamp",
          categoryId: "club",
          subCategoryId: "focus-club-bca",
          clubName: "Focus Club [B.C.A.]",
          title: "Graphic Design & Photoshop Workshop",
          shortDescription: "Interactive bootcamp detailing Photoshop layer management, vector masks, and creative branding.",
          date: "2026-10-12",
          thumbnail: "/assets/home/hero/4.jpg"
        }
      ]}
    />
  );
}
