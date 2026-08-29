import {
  FiGrid,
  FiCompass,
  FiList,
  FiMessageSquare,
  FiAward,
  FiBookOpen,
  FiUsers,
  FiUserCheck,
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
    name: 'Leads',
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
  // {
  //   path: '/master',
  //   icon: FiList,
  //   name: 'Master',
  // },
];

export default sidebar;
