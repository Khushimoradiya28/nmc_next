import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiSliders,
  FiUserCheck,
  FiFileText,
  FiCompass,
  FiImage,
  FiAward,
  FiBookOpen,
} from 'react-icons/fi';
import dayjs from 'dayjs';

const DashboardHero = ({ adminInfo, userRole }) => {
  const userName =
    adminInfo?.first_name || adminInfo?.name || 'Administrator';
  const roleDisplay = (userRole || 'admin').toUpperCase();
  const currentDate = dayjs().format('dddd, DD MMMM YYYY');

  // Quick Action Buttons based on Role with High Contrast
  const getQuickActions = () => {
    if (userRole === 'super_admin') {
      return [
        {
          label: 'Admission Leads',
          to: '/admissions',
          icon: FiFileText,
          bg: 'bg-white text-red-950 hover:bg-amber-400 hover:text-gray-950 font-bold shadow-md',
        },
        {
          label: 'Contact Leads',
          to: '/leads',
          icon: FiCompass,
          bg: 'bg-white text-red-950 hover:bg-amber-400 hover:text-gray-950 font-bold shadow-md',
        },
        {
          label: 'Academic Programs',
          to: '/master/academic-programs',
          icon: FiBookOpen,
          bg: 'bg-white text-red-950 hover:bg-amber-400 hover:text-gray-950 font-bold shadow-md',
        },
        {
          label: 'Professional Courses',
          to: '/products?type=courses',
          icon: FiAward,
          bg: 'bg-white text-red-950 hover:bg-amber-400 hover:text-gray-950 font-bold shadow-md',
        },
      ];
    }

    if (userRole === 'department') {
      return [
        {
          label: 'Admission Leads',
          to: '/admissions',
          icon: FiFileText,
          bg: 'bg-white text-red-950 hover:bg-amber-400 hover:text-gray-950 font-bold shadow-md',
        },
        {
          label: 'Contact Leads',
          to: '/leads',
          icon: FiCompass,
          bg: 'bg-white text-red-950 hover:bg-amber-400 hover:text-gray-950 font-bold shadow-md',
        },
        {
          label: 'Academic Programs',
          to: '/master/academic-programs',
          icon: FiBookOpen,
          bg: 'bg-white text-red-950 hover:bg-amber-400 hover:text-gray-950 font-bold shadow-md',
        },
        {
          label: 'Professional Courses',
          to: '/products?type=courses',
          icon: FiAward,
          bg: 'bg-white text-red-950 hover:bg-amber-400 hover:text-gray-950 font-bold shadow-md',
        },
      ];
    }

    // Content role
    return [
      {
        label: 'Home Banners',
        to: '/banner',
        icon: FiSliders,
        bg: 'bg-white text-red-950 hover:bg-amber-400 hover:text-gray-950 font-bold shadow-md',
      },
      {
        label: 'Gallery Media',
        to: '/gallery',
        icon: FiImage,
        bg: 'bg-white text-red-950 hover:bg-amber-400 hover:text-gray-950 font-bold shadow-md',
      },
      {
        label: 'Testimonials',
        to: '/products?type=testimonial',
        icon: FiAward,
        bg: 'bg-white text-red-950 hover:bg-amber-400 hover:text-gray-950 font-bold shadow-md',
      },
      {
        label: 'Professional Courses',
        to: '/products?type=courses',
        icon: FiBookOpen,
        bg: 'bg-white text-red-950 hover:bg-amber-400 hover:text-gray-950 font-bold shadow-md',
      },
    ];
  };

  const quickActions = getQuickActions();

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #6B0000 0%, #8A0000 50%, #550000 100%)',
      }}
      className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8 border border-red-950/40"
    >
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="px-3.5 py-1 text-xs font-black tracking-wider uppercase rounded-full bg-[#F4B000] text-gray-950 shadow-sm">
              {roleDisplay === 'SUPER_ADMIN' ? 'SUPER ADMIN' : roleDisplay} PORTAL
            </span>
            <span className="text-xs text-amber-200 font-semibold bg-black/40 px-3 py-1 rounded-full border border-white/10">
              📅 {currentDate}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-sm md:text-base text-red-100 font-medium mt-1.5 max-w-xl leading-relaxed">
            {userRole === 'super_admin' &&
              'Real-time overview of admissions, inquiries, faculty, academic programs, professional courses, media, and users.'}
            {userRole === 'department' &&
              'Manage student inquiries, admission applications, faculty, academic programs, and professional courses.'}
            {userRole === 'content' &&
              'Manage banners, photo & video gallery, student testimonials, awards, and professional certificate courses.'}
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.to}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-white text-[#8A0000] hover:bg-[#F4B000] hover:text-gray-950 shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Icon className="w-4 h-4" />
                <span>{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
