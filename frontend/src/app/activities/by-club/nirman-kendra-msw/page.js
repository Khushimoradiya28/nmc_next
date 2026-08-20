import React from 'react';
import ClubDetailTemplate from '@/components/activities/ClubDetailTemplate';

export const metadata = {
  title: 'Nirman Kendra [M.S.W.] | Nandkunvarba Mahila College',
};

export default function NirmanKendraPage() {
  return (
    <ClubDetailTemplate 
      clubName="Nirman Kendra"
      dept="M.S.W. (Master of Social Work)"
      aboutText="Nirman Kendra focuses on community counseling, field training panels, rural camps, child welfare research campaigns, and social justice outreach services."
      founded="2016"
      memberCount="80+"
      coordinator="Dr. Bhavesh Gohil"
      galleryImages={[
        '/assets/home/hero/2.jpg',
        '/assets/home/hero/3.jpg'
      ]}
      upcomingEvents={[]}
    />
  );
}
