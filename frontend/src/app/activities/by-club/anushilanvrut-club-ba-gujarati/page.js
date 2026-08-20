import React from 'react';
import ClubDetailTemplate from '@/components/activities/ClubDetailTemplate';

export const metadata = {
  title: 'Anushilanvrut Club (B.A. Gujarati) | Nandkunvarba Mahila College',
};

export default function AnushilanvrutClubPage() {
  return (
    <ClubDetailTemplate 
      clubName="Anushilanvrut Club"
      dept="B.A. Gujarati (Arts &amp; regional literature)"
      aboutText="Anushilanvrut Club organizes folk music recitals, Gujarati language orientation bootcamps, and creative regional poetry assemblies."
      founded="2016"
      memberCount="85+"
      coordinator="Prof. Bharat Dave"
      galleryImages={[
        '/assets/home/hero/2.jpg',
        '/assets/home/hero/4.jpg'
      ]}
      upcomingEvents={[]}
    />
  );
}
