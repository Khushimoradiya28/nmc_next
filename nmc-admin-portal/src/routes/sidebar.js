import {
  FiGrid,
  FiCompass,
  FiFileText,
  FiMessageSquare,
  FiAward,
  FiBookOpen,
  FiUsers,
  FiUserCheck,
  FiImage,
  FiSliders,
} from 'react-icons/fi';

/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking for actual Router routes, go to
 * `routes/index.js`
 */
const sidebar = [
  {
    path: '/dashboard',
    icon: FiGrid,
    name: 'Dashboard',
  },
  {
    path: '/leads',
    icon: FiCompass,
    name: 'Contact Us Leads',
  },
  {
    path: '/admissions',
    icon: FiFileText,
    name: 'Admission Leads',
  },
  {
    path: '/banner',
    icon: FiSliders,
    name: 'Home Banner',
  },
  {
    path: '/products?type=testimonial',
    icon: FiMessageSquare,
    name: 'Testimonial',
  },
  {
    path: '/products?type=awards',
    icon: FiAward,
    name: 'Awards & Certificates',
  },
  {
    path: '/products?type=courses',
    icon: FiBookOpen,
    name: 'Professional Certificate Courses',
  },
  {
    path: '/gallery',
    icon: FiImage,
    name: 'Photo & Video Gallery',
  },
  {
    path: '/master/faculty',
    icon: FiUserCheck,
    name: 'Professors & Faculty',
  },
  {
    path: '/master/academic-programs',
    icon: FiBookOpen,
    name: 'Academic Programs',
  },
  {
    path: '/master/user',
    icon: FiUsers,
    name: 'Users',
  },
];

export default sidebar;
