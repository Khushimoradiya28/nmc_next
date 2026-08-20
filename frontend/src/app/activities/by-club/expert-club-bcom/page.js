import React from 'react';
import ClubDetailTemplate from '@/components/activities/ClubDetailTemplate';

export const metadata = {
  title: 'Expert Club [B.Com] | Nandkunvarba Mahila College',
};

export default function ExpertClubPage() {
  return (
    <ClubDetailTemplate 
      clubName="Expert Club"
      dept="B.Com (Commerce &amp; Banking)"
      aboutText="Expert Club aims at enhancing banking skills, tax returns understanding, general insurance workflows, and digital accounting methodologies among commercial stream terms."
      founded="2014"
      memberCount="140+"
      coordinator="Prof. Rajesh Patel"
      galleryImages={[
        '/assets/home/hero/2.jpg',
        '/assets/home/hero/3.jpg'
      ]}
      upcomingEvents={[
        {
          id: "insurance-role-play",
          categoryId: "club",
          subCategoryId: "expert-club-bcom",
          clubName: "Expert Club [B.Com]",
          title: "B.Com General Insurance Role Play",
          shortDescription: "Role play simulation covering claims adjusting, client counseling, and agent communications.",
          date: "2026-09-10",
          thumbnail: "/assets/home/hero/3.jpg"
        }
      ]}
    />
  );
}
