import { lazy } from 'react';

// use lazy for better code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Products = lazy(() => import('../pages/Products'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const Category = lazy(() => import('../pages/Category'));
const Customers = lazy(() => import('../pages/Customers'));
const StockManagement = lazy(() => import('../pages/StockManagement'));
const CustomerOrder = lazy(() => import('../pages/CustomerOrder'));
const Orders = lazy(() => import('../pages/Orders'));
const Masters = lazy(() => import('../pages/Master'));
const OrderInvoice = lazy(() => import('../pages/OrderInvoice'));
const Coupons = lazy(() => import('../pages/Coupons'));
const Leads = lazy(() => import('../pages/Leads'));
// const OrderDetails = lazy(() => import('../pages/OrderDetails'));
// const Setting = lazy(() => import("../pages/Setting"));
const Page404 = lazy(() => import('../pages/404'));
const EditProfile = lazy(() => import('../pages/EditProfile'));
const Brand = lazy(() => import('../pages/Masters/Brand'));
const MasterUser = lazy(() => import('../pages/Masters/MasterUser'));
const UserRole = lazy(() => import('../pages/Masters/UserRole'));
const Tag = lazy(() => import('../pages/Masters/Tag'));
const Color = lazy(() => import('../pages/Masters/Color'));
const Commodity = lazy(() => import('../pages/Masters/Commodity'));
const MasterCategory = lazy(() => import('../pages/Masters/Category'));
const Material = lazy(() => import('../pages/Masters/Material'));
const Character = lazy(() => import('../pages/Masters/Character'));
const Age = lazy(() => import('../pages/Masters/Age'));

const Skill = lazy(() => import('../pages/Masters/Skill'))
const ProductDetail = lazy(() => import('../components/drawer/ProductDetailDrawer'))
const OrderDetails = lazy(() => import('../components/drawer/OrderDetailDrawer'))
const PriceManagement = lazy(() => import('../pages/PriceManagement'))
/*
//  * ⚠ These are internal routes!
//  * They will be rendered inside the app, using the default `containers/Layout`.
//  * If you want to add a route to, let's say, a landing page, you should add
//  * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
//  * are routed.
//  *
//  * If you're looking for the links rendered in the SidebarContent, go to
//  * `routes/sidebar.js`
 */

const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/products',
    component: Products,
  },
  {
    path: '/product/:id',
    component: ProductDetails,
  },
  {
    path: '/product-details/:id',
    component: ProductDetail,
  },
  // {
  //   path: '/category',
  //   component: Category,
  // },
  {
    path: '/customers',
    component: Customers,
  },
  {
    path: '/stock-management',
    component: StockManagement,
  },
  {
    path: '/price-management',
    component: PriceManagement,
  },
  {
    path: '/customer-order/:id',
    component: CustomerOrder,
  },
 
  {
    path: '/orders',
    component: Orders,
  },
  {
    path: '/master',
    component: Masters,
  },
  {
    path: '/orders/:id',
    component: Orders,
  },
  {
    path: '/coupons',
    component: Coupons,
  },
  {
    path: '/leads',
    component: Leads,
  },

  { path: '/setting', component: EditProfile },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/edit-profile',
    component: EditProfile,
  },
  {
    path: '/order-details/:id', // MUST include the :id parameter
    component: OrderDetails,
  },

  // MASTERS ROUTE 

  {
    path: '/master/brand',
    component: Brand,
  },
  {
    path: '/master/character',
    component: Character,
  },
  {
    path: '/master/user',
    component: MasterUser,
  },
  {
    path: '/master/userrole',
    component: UserRole,
  },
  {
    path: '/master/tag',
    component: Tag,
  },
  {
    path: '/master/color',
    component: Color,
  },
  {
    path: '/master/material',
    component: Material,
  },
  {
    path: '/master/age',
    component: Age,
  },
  {
    path: '/master/skill',
    component: Skill,
  },
  {
    path: '/master/commodity',
    component: Commodity,
  },
  {
    path: '/master/category',
    component: MasterCategory,
  },

];

export default routes;
