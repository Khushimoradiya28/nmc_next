import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import EventDetail from '@/components/activities/EventDetail';
import { getEventById } from '@/data/activitiesData';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const eventId = slug.length > 0 ? slug[slug.length - 1] : '';
  const event = getEventById(eventId);

  const title = event ? event.title : (slug.length > 0 ? slug[slug.length - 1].replace(/-/g, ' ') : 'Activities');
  return {
    title: `${title} | Nandkunvarba Mahila College`,
  };
}

export default async function ActivitiesCatchAllPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];

  // Helper to format breadcrumb strings
  const formatText = (text) => {
    if (!text) return '';
    return text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Determine parent route and event ID
  let parentCategory = 'by-club';
  let parentName = 'By Club';
  let eventId = '';

  if (slug.length === 1) {
    eventId = slug[0];
  } else if (slug.length === 2) {
    parentCategory = slug[0];
    eventId = slug[1];
    if (parentCategory === 'by-department') parentName = 'By Department';
    else if (parentCategory === 'orientation') parentName = 'Orientation Programs';
    else if (parentCategory === 'by-club') parentName = 'By Club';
    else parentName = formatText(parentCategory);
  } else if (slug.length >= 3) {
    parentCategory = slug[0];
    eventId = slug[slug.length - 1];
    parentName = formatText(slug[1]);
  }

  const event = getEventById(eventId);

  const breadcrumbs = [
    { label: 'Activities', link: '/activities' },
    { label: parentName, link: `/activities/${parentCategory}` }
  ];
  if (event) {
    breadcrumbs.push({ label: event.title });
  }

  return (
    <>
      <Header />
      <main>
        <ActivityHero 
          title={event ? event.title : 'Activity Details'}
          bgImage="/assets/activities/activities_banner.jpg"
          breadcrumbs={breadcrumbs}
        />

        <EventDetail 
          event={event} 
          parentPath={`/activities/${parentCategory}`} 
          parentName={parentName}
        />
      </main>
      <Footer />
    </>
  );
}
