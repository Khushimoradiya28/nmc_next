import { ROUTES } from '@/constants/routes';

/**
 * Reusable Quick Links Data Architecture
 * Often used in sidebars, floating widgets, search overlays, or header utility bars.
 */
export const QUICK_LINKS = [
  {
    id: 'ql-admissions',
    label: 'Apply Online',
    path: ROUTES.ADMISSIONS,
    icon: 'apply',
    order: 1,
    visible: true,
    highlight: true // e.g. for design emphasis (buttons / primary actions)
  },
  {
    id: 'ql-courses',
    label: 'Explore Courses',
    path: ROUTES.COURSES,
    icon: 'courses',
    order: 2,
    visible: true,
    highlight: false
  },
  {
    id: 'ql-syllabus',
    label: 'Syllabus Corner',
    path: ROUTES.DOWNLOADS,
    icon: 'syllabus',
    order: 3,
    visible: true,
    highlight: false
  },
  {
    id: 'ql-contact',
    label: 'Get in Touch',
    path: ROUTES.CONTACT,
    icon: 'contact',
    order: 4,
    visible: true,
    highlight: false
  }
];

export default QUICK_LINKS;
