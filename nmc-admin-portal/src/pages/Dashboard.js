import React, { useEffect, useState, useContext } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';

// Icons
import {
  FiCompass,
  FiFileText,
  FiSliders,
  FiMessageSquare,
  FiAward,
  FiBookOpen,
  FiUsers,
  FiUserCheck,
  FiImage,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiPhone,
  FiMail,
} from 'react-icons/fi';

import { AdminContext } from '../context/AdminContext';
import DashboardHero from '../components/dashboard/DashboardHero';
import DashboardKpiCard from '../components/dashboard/DashboardKpiCard';
import DashboardPreviewTable from '../components/dashboard/DashboardPreviewTable';
import ChartCard from '../components/chart/ChartCard';
import Loading from '../components/preloader/Loading';

// Real API Services
import LeadServices from '../services/LeadServices';
import AdmissionLeadServices from '../services/AdmissionLeadServices';
import FacultyServices from '../services/FacultyServices';
import AcademicProgramServices from '../services/AcademicProgramServices';
import CourseServices from '../services/CourseServices';
import BannerServices from '../services/BannerServices';
import GalleryService from '../services/GalleryService';
import TestimonialServices from '../services/TestimonialServices';
import AwardServices from '../services/AwardServices';
import UserServices from '../services/UserServices';

const Dashboard = () => {
  const { state } = useContext(AdminContext);
  const adminInfo =
    state?.adminInfo ||
    (Cookies.get('adminInfo') ? JSON.parse(Cookies.get('adminInfo')) : null);

  const rawRole = (
    adminInfo?.role_name ||
    (typeof adminInfo?.role === 'object' ? adminInfo?.role?.role_name : '') ||
    (typeof adminInfo?.role === 'string' ? adminInfo?.role : '') ||
    ''
  )
    .toLowerCase()
    .trim();

  const userRole =
    rawRole === 'admin' || rawRole === 'super_admin' || rawRole === 'superadmin'
      ? 'super_admin'
      : rawRole;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Real Counts State
  const [stats, setStats] = useState({
    contactLeadsCount: 0,
    admissionLeadsCount: 0,
    facultyCount: 0,
    programsCount: 0,
    coursesCount: 0,
    bannersCount: 0,
    galleryCount: 0,
    testimonialsCount: 0,
    awardsCount: 0,
    usersCount: 0,
    pendingAdmissionsCount: 0,
    pendingContactLeadsCount: 0,
  });

  // Recent Tables Data
  const [recentAdmissions, setRecentAdmissions] = useState([]);
  const [recentContactLeads, setRecentContactLeads] = useState([]);
  const [recentBanners, setRecentBanners] = useState([]);
  const [recentGallery, setRecentGallery] = useState([]);
  const [recentTestimonials, setRecentTestimonials] = useState([]);

  // Fetch all real data
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);

      const promises = [];

      // Contact Leads (Super Admin & Department)
      if (userRole === 'super_admin' || userRole === 'department') {
        promises.push(
          LeadServices.getAllLeads({ page: 1, limit: 10 }).catch(() => ({
            data: [],
            totalDoc: 0,
          }))
        );
        promises.push(
          AdmissionLeadServices.getAllAdmissions({
            page: 1,
            limit: 10,
          }).catch(() => ({ data: [], totalDoc: 0 }))
        );
      } else {
        promises.push(Promise.resolve(null));
        promises.push(Promise.resolve(null));
      }

      // Faculty (All roles)
      promises.push(
        FacultyServices.getAllFaculty({ page: 1, limit: 10 }).catch(() => ({
          data: [],
          totalDoc: 0,
        }))
      );

      // Academic Programs (All roles)
      promises.push(
        AcademicProgramServices.getAllPrograms({ page: 1, limit: 10 }).catch(
          () => ({ data: [], total: 0 })
        )
      );

      // Certificate Courses (All roles)
      promises.push(
        CourseServices.getAllCourses({ page: 1, limit: 10 }).catch(() => ({
          data: [],
          total: 0,
        }))
      );

      // Banners (All roles)
      promises.push(
        BannerServices.getAllBanners({ page: 1, limit: 10 }).catch(() => ({
          data: [],
          total: 0,
        }))
      );

      // Gallery (All roles)
      promises.push(
        GalleryService.getAllGallery({ page: 1, limit: 10 }).catch(() => ({
          data: [],
          total: 0,
        }))
      );

      // Testimonials (All roles)
      promises.push(
        TestimonialServices.getTestimonials({}).catch(() => ({
          data: [],
          total: 0,
        }))
      );

      // Awards (All roles)
      promises.push(
        AwardServices.getAllAwards({ page: 1, limit: 10 }).catch(() => ({
          data: [],
          total: 0,
        }))
      );

      // Users (Super Admin only)
      if (userRole === 'super_admin') {
        promises.push(
          UserServices.getAllUsers().catch(() => ({ data: [], total: 0 }))
        );
      } else {
        promises.push(Promise.resolve(null));
      }

      const [
        contactRes,
        admissionRes,
        facultyRes,
        programsRes,
        coursesRes,
        bannersRes,
        galleryRes,
        testimonialsRes,
        awardsRes,
        usersRes,
      ] = await Promise.all(promises);

      // Extract leads
      const contactList = contactRes?.data || contactRes?.leads || [];
      const contactTotal =
        contactRes?.totalDoc || contactRes?.total || contactList.length || 0;

      const admissionList = admissionRes?.data || admissionRes?.leads || [];
      const admissionTotal =
        admissionRes?.totalDoc ||
        admissionRes?.total ||
        admissionList.length ||
        0;

      const pendingAdmissions = admissionList.filter(
        (a) => !a.status || a.status === 'New' || a.status === 'Pending'
      ).length;
      const pendingContacts = contactList.filter(
        (c) => !c.status || c.status === 'New' || c.status === 'Pending'
      ).length;

      // Extract faculty & academic
      const facultyList = facultyRes?.data || [];
      const facultyTotal = facultyRes?.totalDoc || facultyList.length || 0;

      const programList = programsRes?.data || [];
      const programsTotal = programsRes?.total || programList.length || 0;

      const coursesList = coursesRes?.data || [];
      const coursesTotal = coursesRes?.total || coursesList.length || 0;

      // Extract media
      const bannerList = bannersRes?.data || [];
      const bannersTotal = bannersRes?.total || bannerList.length || 0;

      const galleryList = galleryRes?.data || [];
      const galleryTotal = galleryRes?.total || galleryList.length || 0;

      const testimonialsList = testimonialsRes?.data || [];
      const testimonialsTotal =
        testimonialsRes?.total || testimonialsList.length || 0;

      const awardsList = awardsRes?.data || [];
      const awardsTotal = awardsRes?.total || awardsList.length || 0;

      // Extract users
      const usersList = usersRes?.data || [];
      const usersTotal = usersRes?.total || usersList.length || 0;

      setStats({
        contactLeadsCount: contactTotal,
        admissionLeadsCount: admissionTotal,
        facultyCount: facultyTotal,
        programsCount: programsTotal,
        coursesCount: coursesTotal,
        bannersCount: bannersTotal,
        galleryCount: galleryTotal,
        testimonialsCount: testimonialsTotal,
        awardsCount: awardsTotal,
        usersCount: usersTotal,
        pendingAdmissionsCount: pendingAdmissions,
        pendingContactLeadsCount: pendingContacts,
      });

      setRecentAdmissions(admissionList.slice(0, 5));
      setRecentContactLeads(contactList.slice(0, 5));
      setRecentBanners(bannerList.slice(0, 5));
      setRecentGallery(galleryList.slice(0, 5));
      setRecentTestimonials(testimonialsList.slice(0, 5));
    } catch (err) {
      console.error('Error loading dashboard metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [userRole]);

  // Chart data: Distribution of Portal Assets
  const portalAssetsChartData = {
    labels: [
      'Academic Programs',
      'Professional Courses',
      'Faculty',
      'Home Banners',
      'Gallery Media',
      'Testimonials',
      'Awards',
    ],
    datasets: [
      {
        data: [
          stats.programsCount,
          stats.coursesCount,
          stats.facultyCount,
          stats.bannersCount,
          stats.galleryCount,
          stats.testimonialsCount,
          stats.awardsCount,
        ],
        backgroundColor: [
          '#1D4ED8', // blue
          '#15803D', // green
          '#6D28D9', // purple
          '#8A0000', // NMC Primary Deep Red
          '#F4B000', // NMC Gold
          '#BE185D', // rose
          '#0E7490', // cyan
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Chart data: Inquiries & Leads comparison (Admin & Department)
  const leadsComparisonChartData = {
    labels: ['Total Contact Inquiries', 'Total Admission Applications', 'Pending Follow-up'],
    datasets: [
      {
        label: 'Inquiries Count',
        data: [
          stats.contactLeadsCount,
          stats.admissionLeadsCount,
          stats.pendingAdmissionsCount + stats.pendingContactLeadsCount,
        ],
        backgroundColor: ['#8A0000', '#F4B000', '#DC2626'],
        borderRadius: 8,
      },
    ],
  };

  // Chart data: Media breakdown (Content role)
  const contentMediaChartData = {
    labels: ['Home Banners', 'Gallery Items', 'Academic Programs', 'Professional Courses', 'Testimonials', 'Awards'],
    datasets: [
      {
        label: 'Published Count',
        data: [
          stats.bannersCount,
          stats.galleryCount,
          stats.programsCount,
          stats.coursesCount,
          stats.testimonialsCount,
          stats.awardsCount,
        ],
        backgroundColor: ['#8A0000', '#6D28D9', '#1D4ED8', '#15803D', '#F4B000', '#0E7490'],
        borderRadius: 8,
      },
    ],
  };

  // Chart data: Department Assets Distribution
  const departmentAssetsChartData = {
    labels: [
      'Academic Programs',
      'Professional Courses',
      'Faculty',
      'Testimonials',
    ],
    datasets: [
      {
        data: [
          stats.programsCount,
          stats.coursesCount,
          stats.facultyCount,
          stats.testimonialsCount,
        ],
        backgroundColor: [
          '#1D4ED8', // blue
          '#15803D', // green
          '#6D28D9', // purple
          '#BE185D', // rose
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Reusable sleek chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        titleFont: { size: 11, weight: 'bold' },
        bodyFont: { size: 11 },
        padding: 8,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10, weight: '600' } },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { font: { size: 10 }, precision: 0 },
      },
    },
    maxBarThickness: 36,
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 10, font: { size: 11, weight: '600' }, padding: 10 },
      },
    },
    cutout: '68%',
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <div className="pb-12">
      {/* Header bar with Refresh */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time live metrics and operational management
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-800 dark:text-amber-400 bg-red-50 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-gray-700 transition-colors border border-red-200/50 dark:border-gray-700"
          title="Refresh real-time data"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
        </button>
      </div>

      {/* Hero Welcome Banner */}
      <DashboardHero adminInfo={adminInfo} userRole={userRole} />

      {/* ========================================================= */}
      {/* 1. SUPER ADMIN VIEW */}
      {/* ========================================================= */}
      {userRole === 'super_admin' && (
        <>
          {/* Executive KPI Metric Cards */}
          <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            <DashboardKpiCard
              title="Admission Leads"
              count={stats.admissionLeadsCount}
              icon={FiFileText}
              linkTo="/admissions"
              gradient="from-red-900 to-red-700"
              iconBg="bg-red-100 text-red-900 dark:bg-red-950/80 dark:text-red-300"
              subtext="Total Applications"
              badgeText={stats.pendingAdmissionsCount > 0 ? `${stats.pendingAdmissionsCount} New` : null}
            />

            <DashboardKpiCard
              title="Contact Leads"
              count={stats.contactLeadsCount}
              icon={FiCompass}
              linkTo="/leads"
              gradient="from-amber-600 to-amber-500"
              iconBg="bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300"
              subtext="General Inquiries"
              badgeText={stats.pendingContactLeadsCount > 0 ? `${stats.pendingContactLeadsCount} New` : null}
            />

            <DashboardKpiCard
              title="Academic Programs"
              count={stats.programsCount}
              icon={FiBookOpen}
              linkTo="/master/academic-programs"
              gradient="from-blue-700 to-indigo-600"
              iconBg="bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300"
              subtext="Degree Programs"
            />

            <DashboardKpiCard
              title="Professional Courses"
              count={stats.coursesCount}
              icon={FiAward}
              linkTo="/products?type=courses"
              gradient="from-emerald-700 to-teal-600"
              iconBg="bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300"
              subtext="Certificate Courses"
            />

            <DashboardKpiCard
              title="Professors & Faculty"
              count={stats.facultyCount}
              icon={FiUserCheck}
              linkTo="/master/faculty"
              gradient="from-purple-700 to-indigo-700"
              iconBg="bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300"
              subtext="Active Faculty"
            />

            <DashboardKpiCard
              title="Media & Gallery"
              count={stats.bannersCount + stats.galleryCount}
              icon={FiImage}
              linkTo="/gallery"
              gradient="from-pink-700 to-rose-600"
              iconBg="bg-pink-100 text-pink-900 dark:bg-pink-950/80 dark:text-pink-300"
              subtext={`${stats.bannersCount} Ban + ${stats.galleryCount} Gal`}
            />

            <DashboardKpiCard
              title="System Users"
              count={stats.usersCount}
              icon={FiUsers}
              linkTo="/master/user"
              gradient="from-slate-800 to-gray-700"
              iconBg="bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
              subtext="Staff & Admins"
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <ChartCard title="Inquiries & Applications Overview">
              <div className="h-56 p-1 flex items-center justify-center">
                <Bar
                  data={leadsComparisonChartData}
                  options={barChartOptions}
                />
              </div>
            </ChartCard>

            <ChartCard title="College Portal Content Distribution">
              <div className="h-56 p-1 flex items-center justify-center">
                <Doughnut
                  data={portalAssetsChartData}
                  options={doughnutChartOptions}
                />
              </div>
            </ChartCard>
          </div>

          {/* Real Data Preview Tables */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Admissions */}
            <DashboardPreviewTable
              title="Recent Admission Applications"
              subtitle="Latest student applications submitted online"
              viewAllLink="/admissions"
              headers={['Applicant', 'Course / Batch', 'Contact', 'Status']}
              rows={recentAdmissions}
              renderRow={(item, idx) => (
                <tr key={item._id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">
                    <p className="font-bold text-gray-900 dark:text-gray-100">{item.full_name || `${item.first_name || ''} ${item.last_name || ''}` || 'Applicant'}</p>
                    <p className="text-[11px] text-gray-500 font-medium">{item.email || '-'}</p>
                  </td>
                  <td className="py-3 px-2 font-semibold text-gray-700 dark:text-gray-200">
                    {item.course_name || item.program || item.department || 'Degree Program'}
                  </td>
                  <td className="py-3 px-2 text-gray-700 dark:text-gray-300">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold">
                      <FiPhone className="w-3 h-3 text-red-800 dark:text-amber-400" /> {item.mobile || item.phone || '-'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        item.status === 'Approved' || item.status === 'Admitted'
                          ? 'bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-200'
                          : item.status === 'Rejected'
                          ? 'bg-red-100 text-red-900 dark:bg-red-900/50 dark:text-red-200'
                          : 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200'
                      }`}
                    >
                      {item.status || 'New'}
                    </span>
                  </td>
                </tr>
              )}
            />

            {/* Recent Contact Leads */}
            <DashboardPreviewTable
              title="Recent Contact Us Leads"
              subtitle="Latest inquiries received from website visitors"
              viewAllLink="/leads"
              headers={['Inquirer', 'Subject / Dept', 'Contact', 'Date']}
              rows={recentContactLeads}
              renderRow={(item, idx) => (
                <tr key={item._id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">
                    <p className="font-bold text-gray-900 dark:text-gray-100">{item.name || `${item.first_name || ''} ${item.last_name || ''}` || 'Visitor'}</p>
                    <p className="text-[11px] text-gray-500 font-medium">{item.email || '-'}</p>
                  </td>
                  <td className="py-3 px-2 font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[120px]" title={item.subject || item.message}>
                    {item.subject || item.teacher || item.department || 'General Inquiry'}
                  </td>
                  <td className="py-3 px-2 text-gray-700 dark:text-gray-300">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold">
                      <FiPhone className="w-3 h-3 text-red-800 dark:text-amber-400" /> {item.mobile || item.phone || '-'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-400 text-[11px] font-bold">
                    {item.created_at ? dayjs(item.created_at).format('DD MMM') : '-'}
                  </td>
                </tr>
              )}
            />
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 2. DEPARTMENT VIEW */}
      {/* ========================================================= */}
      {userRole === 'department' && (
        <>
          {/* Department KPI Metric Cards */}
          <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
            <DashboardKpiCard
              title="Admission Leads"
              count={stats.admissionLeadsCount}
              icon={FiFileText}
              linkTo="/admissions"
              gradient="from-red-900 to-red-700"
              iconBg="bg-red-100 text-red-900 dark:bg-red-950/80 dark:text-red-300"
              subtext="Applications"
              badgeText={stats.pendingAdmissionsCount > 0 ? `${stats.pendingAdmissionsCount} Pending` : null}
            />

            <DashboardKpiCard
              title="Contact Leads"
              count={stats.contactLeadsCount}
              icon={FiCompass}
              linkTo="/leads"
              gradient="from-amber-600 to-amber-500"
              iconBg="bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300"
              subtext="Student Inquiries"
              badgeText={stats.pendingContactLeadsCount > 0 ? `${stats.pendingContactLeadsCount} New` : null}
            />

            <DashboardKpiCard
              title="Academic Programs"
              count={stats.programsCount}
              icon={FiBookOpen}
              linkTo="/master/academic-programs"
              gradient="from-blue-700 to-indigo-600"
              iconBg="bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300"
              subtext="Degree Programs"
            />

            <DashboardKpiCard
              title="Professional Courses"
              count={stats.coursesCount}
              icon={FiAward}
              linkTo="/products?type=courses"
              gradient="from-emerald-700 to-teal-600"
              iconBg="bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300"
              subtext="Skill Courses"
            />

            <DashboardKpiCard
              title="Professors & Faculty"
              count={stats.facultyCount}
              icon={FiUserCheck}
              linkTo="/master/faculty"
              gradient="from-purple-700 to-indigo-700"
              iconBg="bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300"
              subtext="Faculty Directory"
            />

            <DashboardKpiCard
              title="Testimonials"
              count={stats.testimonialsCount}
              icon={FiMessageSquare}
              linkTo="/products?type=testimonial"
              gradient="from-rose-700 to-pink-600"
              iconBg="bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300"
              subtext="Student Reviews"
            />
          </div>

          {/* Department Charts Row (2 Column Layout) */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <ChartCard title="Inquiries & Applications Trend">
              <div className="h-56 p-1 flex items-center justify-center">
                <Bar
                  data={leadsComparisonChartData}
                  options={barChartOptions}
                />
              </div>
            </ChartCard>

            <ChartCard title="Department Programs & Faculty Ratio">
              <div className="h-56 p-1 flex items-center justify-center">
                <Doughnut
                  data={departmentAssetsChartData}
                  options={doughnutChartOptions}
                />
              </div>
            </ChartCard>
          </div>

          {/* Department Data Tables */}
          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardPreviewTable
              title="Latest Admission Inquiries"
              subtitle="Requires department review and verification"
              viewAllLink="/admissions"
              headers={['Applicant', 'Course', 'Contact', 'Status']}
              rows={recentAdmissions}
              renderRow={(item, idx) => (
                <tr key={item._id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">
                    <p className="font-bold text-gray-900 dark:text-gray-100">{item.full_name || `${item.first_name || ''} ${item.last_name || ''}` || 'Applicant'}</p>
                    <p className="text-[11px] text-gray-500 font-medium">{item.email || '-'}</p>
                  </td>
                  <td className="py-3 px-2 font-semibold text-gray-700 dark:text-gray-200">
                    {item.course_name || item.program || item.department || 'Degree Program'}
                  </td>
                  <td className="py-3 px-2 text-gray-700 dark:text-gray-300">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold">
                      <FiPhone className="w-3 h-3 text-red-800 dark:text-amber-400" /> {item.mobile || item.phone || '-'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        item.status === 'Approved' || item.status === 'Admitted'
                          ? 'bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-200'
                          : 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200'
                      }`}
                    >
                      {item.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              )}
            />

            <DashboardPreviewTable
              title="Latest Contact Inquiries"
              subtitle="Incoming questions regarding curriculum & admissions"
              viewAllLink="/leads"
              headers={['Inquirer', 'Department / Subject', 'Phone', 'Date']}
              rows={recentContactLeads}
              renderRow={(item, idx) => (
                <tr key={item._id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">
                    <p className="font-bold text-gray-900 dark:text-gray-100">{item.name || 'Student'}</p>
                    <p className="text-[11px] text-gray-500 font-medium">{item.email || '-'}</p>
                  </td>
                  <td className="py-3 px-2 font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[120px]">
                    {item.teacher || item.subject || item.department || 'Inquiry'}
                  </td>
                  <td className="py-3 px-2 font-mono text-[11px] font-bold text-gray-700 dark:text-gray-300">
                    {item.mobile || item.phone || '-'}
                  </td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-400 text-[11px] font-bold">
                    {item.created_at ? dayjs(item.created_at).format('DD MMM') : '-'}
                  </td>
                </tr>
              )}
            />
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 3. CONTENT SPECIALIST VIEW */}
      {/* ========================================================= */}
      {userRole === 'content' && (
        <>
          {/* Content KPI Metric Cards */}
          <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            <DashboardKpiCard
              title="Home Banners"
              count={stats.bannersCount}
              icon={FiSliders}
              linkTo="/banner"
              gradient="from-red-900 to-red-700"
              iconBg="bg-red-100 text-red-900 dark:bg-red-950/80 dark:text-red-300"
              subtext="Sliders Live"
            />

            <DashboardKpiCard
              title="Gallery Media"
              count={stats.galleryCount}
              icon={FiImage}
              linkTo="/gallery"
              gradient="from-purple-700 to-indigo-600"
              iconBg="bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300"
              subtext="Photos & Videos"
            />

            <DashboardKpiCard
              title="Academic Programs"
              count={stats.programsCount}
              icon={FiBookOpen}
              linkTo="/master/academic-programs"
              gradient="from-blue-700 to-indigo-600"
              iconBg="bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300"
              subtext="Degrees (B.Com, B.A)"
            />

            <DashboardKpiCard
              title="Professional Courses"
              count={stats.coursesCount}
              icon={FiAward}
              linkTo="/products?type=courses"
              gradient="from-emerald-700 to-teal-600"
              iconBg="bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300"
              subtext="Skill Courses"
            />

            <DashboardKpiCard
              title="Testimonials"
              count={stats.testimonialsCount}
              icon={FiMessageSquare}
              linkTo="/products?type=testimonial"
              gradient="from-amber-600 to-yellow-500"
              iconBg="bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300"
              subtext="Reviews & Feedback"
            />

            <DashboardKpiCard
              title="Awards & Honors"
              count={stats.awardsCount}
              icon={FiAward}
              linkTo="/products?type=awards"
              gradient="from-cyan-700 to-blue-600"
              iconBg="bg-cyan-100 text-cyan-900 dark:bg-cyan-950/80 dark:text-cyan-300"
              subtext="Achievements"
            />

            <DashboardKpiCard
              title="Faculty Profiles"
              count={stats.facultyCount}
              icon={FiUserCheck}
              linkTo="/master/faculty"
              gradient="from-slate-800 to-gray-700"
              iconBg="bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
              subtext="Published Faculty"
            />
          </div>

          {/* Content Media Chart */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <ChartCard title="Media & Content Assets Breakdown">
              <div className="h-56 p-1 flex items-center justify-center">
                <Bar
                  data={contentMediaChartData}
                  options={barChartOptions}
                />
              </div>
            </ChartCard>

            <ChartCard title="Content Distribution Ratio">
              <div className="h-56 p-1 flex items-center justify-center">
                <Doughnut
                  data={portalAssetsChartData}
                  options={doughnutChartOptions}
                />
              </div>
            </ChartCard>
          </div>

          {/* Content Data Preview Tables */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Banners */}
            <DashboardPreviewTable
              title="Live Home Banners"
              subtitle="Active homepage promotional sliders"
              viewAllLink="/banner"
              headers={['Banner', 'Title', 'Date Added']}
              rows={recentBanners}
              renderRow={(item, idx) => (
                <tr key={item._id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-2.5 px-2">
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                      {item.image ? (
                        <img
                          src={item.image_url || item.image}
                          alt={item.title || 'Banner'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Banner
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 font-medium text-gray-900 dark:text-white">
                    <p className="font-bold text-gray-900 dark:text-gray-100 truncate max-w-[200px]">{item.title || 'Hero Banner'}</p>
                    <p className="text-[11px] text-gray-500 font-medium truncate max-w-[200px]">{item.subtitle || '-'}</p>
                  </td>
                  <td className="py-2.5 px-2 text-gray-600 dark:text-gray-400 text-[11px] font-bold">
                    {item.created_at ? dayjs(item.created_at).format('DD MMM YYYY') : '-'}
                  </td>
                </tr>
              )}
            />

            {/* Recent Testimonials */}
            <DashboardPreviewTable
              title="Recent Testimonials & Feedback"
              subtitle="Student and dignitary quotes displayed on website"
              viewAllLink="/products?type=testimonial"
              headers={['Author', 'Designation / Batch', 'Type']}
              rows={recentTestimonials}
              renderRow={(item, idx) => (
                <tr key={item._id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">
                    <p className="font-bold text-gray-900 dark:text-gray-100">{item.name || item.student_name || 'Alumnus'}</p>
                  </td>
                  <td className="py-3 px-2 text-gray-700 dark:text-gray-300 font-semibold text-xs">
                    {item.designation || item.course || item.batch || 'Student'}
                  </td>
                  <td className="py-3 px-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200">
                      {item.type || 'Student'}
                    </span>
                  </td>
                </tr>
              )}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
