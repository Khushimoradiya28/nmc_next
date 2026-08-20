import React from 'react';
import ClubDetailTemplate from '@/components/activities/ClubDetailTemplate';

export const metadata = {
  title: 'Nucleus Club (B.A. English) | Nandkunvarba Mahila College',
};

export default function NucleusClubPage() {
  return (
    <ClubDetailTemplate 
      clubName="Nucleus Club"
      dept="B.A. English (Arts &amp; Literature)"
      aboutText="Nucleus Club celebrates classical literature, English communication bootcamps, theatrical adaptions of William Shakespeare plays, and creative vocabulary workshops."
      founded="2017"
      memberCount="100+"
      coordinator="Prof. Anjali Sharma"
      galleryImages={[
        '/assets/home/hero/1.jpg',
        '/assets/home/hero/4.jpg'
      ]}
      upcomingEvents={[]}
    />
  );
}
