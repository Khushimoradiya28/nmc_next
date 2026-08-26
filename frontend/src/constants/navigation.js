// navigation.js

export const isActiveRoute = (currentPath, routePath, exact = false) => {
  if (!currentPath || !routePath) return false;
  if (exact) return currentPath === routePath;
  return currentPath.startsWith(routePath) && (currentPath.length === routePath.length || currentPath[routePath.length] === '?' || currentPath[routePath.length] === '/');
};

const MAIN_NAV = [
  { id: 'nav-home', label: 'Home', path: '/', visible: true },
  { id: 'nav-about', label: 'About Us', path: '/about', visible: true },
  { id: 'nav-gallery', label: 'Gallery', path: '/gallery', visible: true },
  { 
    id: 'nav-courses', 
    label: 'Courses', 
    path: '/courses', 
    visible: true,
    hasDropdown: true,
    dropdownType: 'standard',
    items: [
      { id: 'sub-courses', label: 'Courses', path: '/courses', visible: true }
    ]
  },
  {
    id: 'nav-faculty',
    label: 'OUR STAFF',
    path: '/faculty',
    visible: true,
    hasDropdown: true,
    dropdownType: 'standard',
    items: [
      { id: 'sub-staff-ba', label: 'B.A.', path: '/faculty?group=ba', visible: true },
      { id: 'sub-staff-bba', label: 'B.B.A.', path: '/faculty?group=bba', visible: true },
      { id: 'sub-staff-bca', label: 'B.C.A.', path: '/faculty?group=bca', visible: true },
      { id: 'sub-staff-bcom', label: 'B.Com.', path: '/faculty?group=bcom', visible: true },
      { id: 'sub-staff-fd', label: 'F.D.', path: '/faculty?group=fd', visible: true },
      { id: 'sub-staff-mcom', label: 'M.Com.', path: '/faculty?group=mcom', visible: true },
      { id: 'sub-staff-msw', label: 'M.S.W.', path: '/faculty?group=msw', visible: true },
      { id: 'sub-staff-pgdpa', label: 'PGDPA', path: '/faculty?group=pgdpa', visible: true },
      { id: 'sub-staff-dmphw', label: 'DMPHW', path: '/faculty?group=dmphw', visible: true },
      { id: 'sub-staff-ma', label: 'M.A.', path: '/faculty?group=ma', visible: true }
    ]
  },
  {
    id: 'nav-activities',
    label: 'Activities',
    path: '/events',
    visible: true,
    hasDropdown: true,
    dropdownType: 'megamenu',
    items: [
      {
        id: 'mega-club',
        label: 'By Club',
        visible: true,
        items: [
          { id: 'club-shine', label: 'Shine Club[B.B.A.]', path: '/events?club=shine', visible: true },
          { id: 'club-focus', label: 'Focus Club [B.C.A.]', path: '/events?club=focus', visible: true },
          { id: 'club-expert', label: 'Expert Club[B.Com]', path: '/events?club=expert', visible: true },
          { id: 'club-creative', label: 'Creative Club[M.Com]', path: '/events?club=creative', visible: true },
          { id: 'club-nirman', label: 'Nirman Kendra[M.S.W.]', path: '/events?club=nirman', visible: true },
          { id: 'club-nucleus', label: 'Nucleus Club (B.A. English)', path: '/events?club=nucleus', visible: true },
          { id: 'club-spandan', label: 'Spandan Club (B.A. Sociology)', path: '/events?club=spandan', visible: true },
          { id: 'club-mind', label: 'Mind Club (B.A. Psychology)', path: '/events?club=mind', visible: true },
          { id: 'club-anushilanvrut', label: 'Anushilanvrut Club (B.A. Gujarati)', path: '/events?club=anushilanvrut', visible: true }
        ]
      },
      {
        id: 'mega-dept',
        label: 'By Department',
        visible: true,
        items: [
          { id: 'dept-ba', label: 'Activities of B.A.', path: '/events?dept=ba', visible: true },
          { id: 'dept-bba', label: 'Activities of B.B.A.', path: '/events?dept=bba', visible: true },
          { id: 'dept-bca', label: 'Activities of B.C.A.', path: '/events?dept=bca', visible: true },
          { id: 'dept-fd', label: 'Activities of F.D.', path: '/events?dept=fd', visible: true },
          { id: 'dept-bcom', label: 'Activities of B.Com.', path: '/events?dept=bcom', visible: true },
          { id: 'dept-college', label: 'College Events', path: '/events?dept=college', visible: true },
          { id: 'dept-mcom', label: 'Activities of M.Com.', path: '/events?dept=mcom', visible: true },
          { id: 'dept-msw', label: 'Activities of M.S.W.', path: '/events?dept=msw', visible: true }
        ]
      },
      {
        id: 'mega-orient',
        label: 'Orientation & More',
        visible: true,
        items: [
          { id: 'orient-ba', label: 'B.A. Orientation', path: '/events?orientation=ba', visible: true },
          { id: 'orient-bba', label: 'B.B.A. Orientation', path: '/events?orientation=bba', visible: true },
          { id: 'orient-bca', label: 'B.C.A. Orientation', path: '/events?orientation=bca', visible: true },
          { id: 'orient-fd', label: 'F.D. Orientation', path: '/events?orientation=fd', visible: true },
          { id: 'orient-bcom', label: 'B.Com. Orientation', path: '/events?orientation=bcom', visible: true },
          { id: 'orient-mcom', label: 'M.Com. Orientation', path: '/events?orientation=mcom', visible: true },
          { id: 'orient-msw', label: 'M.S.W. Orientation', path: '/events?orientation=msw', visible: true },
          { id: 'misc-sports', label: 'Sports', path: '/events?category=sports', visible: true },
          { id: 'misc-college', label: 'Collage Events', path: '/events?category=college', visible: true },
          { id: 'misc-calendar', label: 'Year-Calendar', path: '/events?category=calendar', visible: true },
          { id: 'misc-nss', label: 'NSS', path: '/events?category=nss', visible: true }
        ]
      }
    ]
  },
  { id: 'nav-contact', label: 'CONTACT', path: '/contact', visible: true },
  {
    id: 'nav-toppers',
    label: 'Toppers',
    path: '/toppers',
    visible: true,
    hasDropdown: true,
    dropdownType: 'standard',
    items: [
      { id: 'topper-bca', label: 'B.C.A. Toppers', path: '/toppers?group=bca', visible: true },
      { id: 'topper-bcom', label: 'B.Com Toppers', path: '/toppers?group=bcom', visible: true },
      { id: 'topper-bba', label: 'B.B.A. Toppers', path: '/toppers?group=bba', visible: true },
      { id: 'topper-mcom', label: 'M.Com Toppers', path: '/toppers?group=mcom', visible: true },
      { id: 'topper-msw', label: 'MSW Toppers', path: '/toppers?group=msw', visible: true },
      { id: 'topper-fd', label: 'F.D.Toppers', path: '/toppers?group=fd', visible: true },
      { id: 'topper-ba', label: 'B.A. Toppers', path: '/toppers?group=ba', visible: true },
      { id: 'topper-ma', label: 'M.A. Toppers', path: '/toppers?group=ma', visible: true },
      { id: 'topper-pgdpa', label: 'P.G.D.P.A. Toppers', path: '/toppers?group=pgdpa', visible: true }
    ]
  },
  {
    id: 'nav-student',
    label: 'Student Corner',
    path: '/student-corner',
    visible: true,
    hasDropdown: true,
    dropdownType: 'megamenu',
    items: [
      {
        id: 'mega-student-info',
        label: 'Information',
        visible: true,
        items: [
          { id: 'student-result', label: 'University Result', path: '/student-corner?page=result', visible: true },
          { id: 'student-event', label: 'Coming Event', path: '/student-corner?page=events', visible: true },
          { id: 'student-scholarship', label: 'Scholarship', path: '/student-corner?page=scholarship', visible: true },
          { id: 'student-tablet', label: 'Tablet Assistance Scheme', path: '/student-corner?page=tablet', visible: true }
        ]
      },
      {
        id: 'mega-student-lectures',
        label: 'Schedules for online lectures',
        visible: true,
        items: [
          { id: 'lecture-bca', label: 'B.C.A.', path: '/student-corner?lecture=bca', visible: true },
          { id: 'lecture-bcom', label: 'B.com.', path: '/student-corner?lecture=bcom', visible: true },
          { id: 'lecture-ba', label: 'B.A.', path: '/student-corner?lecture=ba', visible: true },
          { id: 'lecture-bba', label: 'B.B.A.', path: '/student-corner?lecture=bba', visible: true },
          { id: 'lecture-msw', label: 'M.S.W.', path: '/student-corner?lecture=msw', visible: true }
        ]
      },
      {
        id: 'mega-student-admission',
        label: 'Online Admission Schedule',
        visible: true,
        items: [
          { id: 'admission-bca', label: 'BCA SEM-1 FIRST MERIT LIST', path: '/student-corner?admission=bca', visible: true },
          { id: 'admission-bcom-guj', label: 'B.Com. 1st Merit – Gujarati', path: '/student-corner?admission=bcom-guj', visible: true },
          { id: 'admission-ba', label: 'B.A. Merit', path: '/student-corner?admission=ba', visible: true },
          { id: 'admission-bba', label: 'B.B.A. 1st Merit', path: '/student-corner?admission=bba', visible: true },
          { id: 'admission-bcom-eng', label: 'B.Com. 1st Merit – English', path: '/student-corner?admission=bcom-eng', visible: true }
        ]
      }
    ]
  },
  { id: 'nav-alumni', label: 'Alumni Legacy', path: '/alumni-legacy', visible: false }
];

export const NAVIGATION_CONFIG = {
  desktop: MAIN_NAV,
  mobile: MAIN_NAV
};
