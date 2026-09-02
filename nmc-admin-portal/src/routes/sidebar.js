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
  FiTrendingUp,
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
    roles: ['super_admin', 'admin', 'department', 'content'],
  },
  {
    path: '/leads',
    icon: FiCompass,
    name: 'Contact Us Leads',
    roles: ['super_admin', 'admin', 'department'],
  },
  {
    path: '/admissions',
    icon: FiFileText,
    name: 'Admission Leads',
    roles: ['super_admin', 'admin', 'department'],
  },
  {
    path: '/banner',
    icon: FiSliders,
    name: 'Home Banner',
    roles: ['super_admin', 'admin', 'department', 'content'],
  },
  {
    path: '/products?type=testimonial',
    icon: FiMessageSquare,
    name: 'Testimonial',
    roles: ['super_admin', 'admin', 'department', 'content'],
  },
  {
    path: '/products?type=awards',
    icon: FiAward,
    name: 'Awards & Certificates',
    roles: ['super_admin', 'admin', 'department', 'content'],
  },
  {
    path: '/products?type=courses',
    icon: FiBookOpen,
    name: 'Professional Certificate Courses',
    roles: ['super_admin', 'admin', 'department', 'content'],
  },
  {
    path: '/gallery',
    icon: FiImage,
    name: 'Photo & Video Gallery',
    roles: ['super_admin', 'admin', 'department', 'content'],
  },
  {
    path: '/master/faculty',
    icon: FiUserCheck,
    name: 'Professors & Faculty',
    roles: ['super_admin', 'admin', 'department', 'content'],
  },
  {
    path: '/master/academic-programs',
    icon: FiBookOpen,
    name: 'Academic Programs',
    roles: ['super_admin', 'admin', 'department', 'content'],
  },
  {
    path: '/master/gold-medalists',
    icon: FiAward,
    name: 'Gold Medalist Achievers',
    roles: ['super_admin', 'admin', 'department', 'content'],
  },
  {
    path: '/master/rankers',
    icon: FiTrendingUp,
    name: 'University Rankers',
    roles: ['super_admin', 'admin', 'department', 'content'],
  },
  {
    path: '/master',
    icon: FiSliders,
    name: 'Master',
    roles: ['super_admin', 'admin', 'department', 'content'],
  },
  {
    path: '/master/user',
    icon: FiUsers,
    name: 'Users',
    roles: ['super_admin', 'admin'],
  },
];

export default sidebar;
