import React from 'react';
import ClubDetailTemplate from '@/components/activities/ClubDetailTemplate';

export const metadata = {
  title: 'Spandan Club (B.A. Sociology) | Nandkunvarba Mahila College',
};

export default function SpandanClubPage() {
  return (
    <ClubDetailTemplate 
      clubName="Spandan Club"
      dept="B.A. Sociology (Arts &amp; Social Sciences)"
      aboutText="Spandan Club maps social research campaigns, adopted village workshops, gender sensitization assemblies, and traditional heritage research projects."
      founded="2017"
      memberCount="110+"
      coordinator="Prof. Dilip Savaliya"
      galleryImages={[
        '/assets/home/hero/5.jpg',
        '/assets/home/hero/2.jpg'
      ]}
      upcomingEvents={[]}
    />
  );
}
