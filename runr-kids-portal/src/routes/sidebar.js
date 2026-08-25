import {
  FiGrid,
  FiShoppingBag,
  FiUsers,
  FiUser,
  FiCompass,
  FiGift,
  FiList,
  FiSettings,
  FiPackage,
  FiShoppingCart,
  FiTag
} from 'react-icons/fi';
/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const sidebar = [
  {
    path: '/dashboard', // the url
    icon: FiGrid, // icon
    name: 'Dashboard', // name that appear in Sidebar
  },
  {
    path: '/leads',
    icon: FiCompass,
    name: 'Leads',
  },
  {
    path: '/products',
    icon: FiShoppingBag,
    name: 'Products',
  },
  {
    path: '/stock-management',
    icon: FiPackage,
    name: 'Stock Management',
  },
  {
    path: '/price-management',
    icon: FiTag,
    name: 'Price Management',
  },
  // {
  //   path: '/category',
  //   icon: FiList,
  //   name: 'Category',
  // },
  {
    path: '/orders',
    icon: FiShoppingCart,
    name: 'Orders',
  },
  {
    path: '/customers',
    icon: FiUsers,
    name: 'Customers',
  },
  // {
  //   path: '/coupons',
  //   icon: FiGift,
  //   name: 'Coupons',
  // },
  // {
  //   path: '/our-staff',
  //   icon: FiUser,
  //   name: 'Our Staff',
  // },
  {
    path: '/master',
    icon: FiList,
    name: 'Master',
  },
];

export default sidebar;
