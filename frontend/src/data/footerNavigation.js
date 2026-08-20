import { ROUTES } from '@/constants/routes';

/**
 * Reusable Footer Navigation Groups Configuration
 * Group schemas are prepared for future CMS overrides.
 */
export const FOOTER_NAVIGATION = {
  // Footer Links Grouped by Column/Section
  groups: [
    {
      id: 'footer-quick-links',
      title: 'Quick Links',
      order: 1,
      visible: true,
      items: [
        {
          id: 'fql-home',
          label: 'Home',
          path: ROUTES.HOME,
          visible: true,
          target: '_self'
        },
        {
          id: 'fql-about',
          label: 'About',
          path: ROUTES.ABOUT,
          visible: true,
          target: '_self'
        },
        {
          id: 'fql-contact',
          label: 'Contact',
          path: ROUTES.CONTACT,
          visible: true,
          target: '_self'
        }
      ]
    },
    {
      id: 'footer-admissions',
      title: 'Admissions',
      order: 2,
      visible: true,
      items: [
        {
          id: 'fadm-overview',
          label: 'Overview',
          path: `${ROUTES.ADMISSIONS}/overview`,
          visible: true,
          target: '_self'
        },
        {
          id: 'fadm-process',
          label: 'Process',
          path: `${ROUTES.ADMISSIONS}/process`,
          visible: true,
          target: '_self'
        }
      ]
    },
    {
      id: 'footer-academics',
      title: 'Academics',
      order: 3,
      visible: true,
      items: [
        {
          id: 'fac-courses',
          label: 'Courses',
          path: ROUTES.COURSES,
          visible: true,
          target: '_self'
        },
        {
          id: 'fac-departments',
          label: 'Departments',
          path: ROUTES.DEPARTMENTS,
          visible: true,
          target: '_self'
        }
      ]
    },
    {
      id: 'footer-student-corner',
      title: 'Student Corner',
      order: 4,
      visible: true,
      items: [
        {
          id: 'fsc-activities',
          label: 'Activities',
          path: '/students/activities',
          visible: true,
          target: '_self'
        },
        {
          id: 'fsc-facilities',
          label: 'Facilities',
          path: '/students/facilities',
          visible: true,
          target: '_self'
        }
      ]
    },
    {
      id: 'footer-downloads',
      title: 'Downloads',
      order: 5,
      visible: true,
      items: [
        {
          id: 'fdl-brochure',
          label: 'Brochure',
          path: `${ROUTES.DOWNLOADS}/brochure`,
          visible: true,
          target: '_blank'
        },
        {
          id: 'fdl-syllabus',
          label: 'Syllabus',
          path: `${ROUTES.DOWNLOADS}/syllabus`,
          visible: true,
          target: '_blank'
        }
      ]
    },
    {
      id: 'footer-legal',
      title: 'Legal',
      order: 6,
      visible: true,
      items: [
        {
          id: 'fleg-privacy',
          label: 'Privacy Policy',
          path: '/legal/privacy',
          visible: true,
          target: '_self'
        },
        {
          id: 'fleg-terms',
          label: 'Terms & Conditions',
          path: '/legal/terms',
          visible: true,
          target: '_self'
        }
      ]
    }
  ]
};

export default FOOTER_NAVIGATION;
