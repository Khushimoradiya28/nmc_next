import React from 'react';
import ClubDetailTemplate from '@/components/activities/ClubDetailTemplate';

export const metadata = {
  title: 'Creative Club [M.Com] | Nandkunvarba Mahila College',
};

export default function CreativeClubPage() {
  return (
    <ClubDetailTemplate 
      clubName="Creative Club"
      dept="M.Com (Master of Commerce)"
      aboutText="The M.Com Creative Club organizes workshops focused on research publication, advanced statistical methods, research design, and creative academic blogging."
      founded="2018"
      memberCount="90+"
      coordinator="Dr. Kirti Mehta"
      galleryImages={[
        '/assets/home/hero/1.jpg',
        '/assets/home/hero/5.jpg'
      ]}
      upcomingEvents={[]}
    />
  );
}
