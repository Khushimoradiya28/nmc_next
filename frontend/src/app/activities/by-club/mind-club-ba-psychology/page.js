import React from 'react';
import ClubDetailTemplate from '@/components/activities/ClubDetailTemplate';

export const metadata = {
  title: 'Mind Club (B.A. Psychology) | Nandkunvarba Mahila College',
};

export default function MindClubPage() {
  return (
    <ClubDetailTemplate 
      clubName="Mind Club"
      dept="B.A. Psychology (Arts &amp; Human Behavior)"
      aboutText="Mind Club drives mental wellness campaigns, stress resolution workshops, counseling role plays, and basic emotional intelligence seminars."
      founded="2018"
      memberCount="95+"
      coordinator="Dr. Sneha Trivedi"
      galleryImages={[
        '/assets/home/hero/3.jpg',
        '/assets/home/hero/1.jpg'
      ]}
      upcomingEvents={[]}
    />
  );
}
