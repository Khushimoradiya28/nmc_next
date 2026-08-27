import React, { useState, useContext, useMemo } from 'react';
import {
  Table,
  TableContainer,
  TableFooter,
  Card,
  CardBody,
  Pagination,
  Button,
} from '@windmill/react-ui';
import { FiPlus, FiSearch } from 'react-icons/fi';

import PageTitle from '../../components/Typography/PageTitle';
import FacultyTable from '../../components/faculty/FacultyTable';
import FacultyDetailModal from '../../components/faculty/FacultyDetailModal';
import FacultyDrawer from '../../components/drawer/FacultyDrawer';
import MainDrawer from '../../components/drawer/MainDrawer';
import MainModal from '../../components/modal/MainModal';
import CustomSelect from '../../components/form/CustomSelect';
import { SidebarContext } from '../../context/SidebarContext';

const DEPARTMENT_OPTIONS = [
  { label: 'All Departments', value: 'all' },
  { label: 'B.B.A.', value: 'B.B.A.' },
  { label: 'B.Com / Commerce', value: 'B.Com' },
  { label: 'Economics', value: 'Economics' },
  { label: 'B.C.A. & IT', value: 'B.C.A. & IT' },
];

const INITIAL_FACULTY_DATA = [
  {
    id: 1,
    name: 'Dr. Samkit Shah',
    badge: 'I/C PRINCIPAL',
    designation: 'I/C Principal & Professor',
    qualification: 'M.A., Ph.D. (Economics), M.Phil',
    experience: '15+ Years of Academic Experience',
    stream: 'Economics & Commerce',
    biography: 'Distinguished academic scholar and administrator specializing in research methodology and economic policies.',
    expertise: ['Economics', 'Commerce & Finance', 'Research Methodology'],
    highlight: 'Published 25+ Research Papers in Peer-Reviewed International Journals',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'Mehulkumar Bhatt',
    badge: 'SENIOR LEADERSHIP',
    designation: 'I/C Principal & Administrator',
    qualification: 'M.Com, M.Phil',
    experience: '14+ Years Experience',
    stream: 'Economics & Commerce',
    biography: 'Leading corporate finance and administrative planning to enhance institutional excellence and student outcome.',
    expertise: ['Corporate Finance', 'Administration', 'Managerial Economics'],
    highlight: 'Pioneered Campus Digital Administrative Workflow Integration',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    name: 'Shah Keyurbhai',
    badge: 'MANAGEMENT HEAD',
    designation: 'I/C Principal & HOD',
    qualification: 'M.B.A. (Finance), B.Com (H), D.B.M.',
    experience: '12+ Years Experience',
    stream: 'B.B.A.',
    biography: 'Senior administrative leader guiding business administration streams, spearheading student entrepreneurship initiatives and quality assurance cells.',
    expertise: ['Financial Analysis', 'Strategic Management', 'Business Analytics', 'Strategic Management', 'Security Analysis', 'Financial Modeling'],
    highlight: 'Organized 10+ Entrepreneurship & Startup Incubation Workshops',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    name: 'Ankita R. Patel',
    badge: 'CHIEF COORDINATOR',
    designation: 'Principal & Chief Co-ordinator',
    qualification: 'M.C.A. (RDBMS, C-Language)',
    experience: '14+ Years Experience',
    stream: 'Computer Science & IT',
    biography: 'Expert software engineer and educator leading RDBMS curriculum and technology mentorship programs.',
    expertise: ['RDBMS', 'Software Engineering', 'IT Curriculum & Mentorship'],
    highlight: 'Coordinated National Level Hackathons & IT Mentorship Drives',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
];

const Faculty = () => {
  const { toggleDrawer, isDrawerOpen, closeDrawer, openModal } = useContext(SidebarContext);

  const [facultyList, setFacultyList] = useState(INITIAL_FACULTY_DATA);
  const [searchText, setSearchText] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Selected faculty for Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedFacultyForView, setSelectedFacultyForView] = useState(null);

  // Selected faculty for Drawer Edit
  const [selectedFacultyForEdit, setSelectedFacultyForEdit] = useState(null);

  // Delete modal state item ID
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Search & Filtered Data
  const filteredFaculties = useMemo(() => {
    return facultyList.filter((item) => {
      const matchesSearch =
        !searchText ||
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.designation.toLowerCase().includes(searchText.toLowerCase()) ||
        item.qualification.toLowerCase().includes(searchText.toLowerCase()) ||
        item.badge.toLowerCase().includes(searchText.toLowerCase());

      const matchesDept =
        selectedDept === 'all' ||
        item.stream?.toLowerCase() === selectedDept.toLowerCase() ||
        (selectedDept === 'B.B.A.' && item.stream === 'B.B.A.');

      return matchesSearch && matchesDept;
    });
  }, [facultyList, searchText, selectedDept]);

  // Paginated Data
  const paginatedFaculties = useMemo(() => {
    const start = (currentPage - 1) * resultsPerPage;
    return filteredFaculties.slice(start, start + resultsPerPage);
  }, [filteredFaculties, currentPage]);

  const handleOpenAddDrawer = () => {
    setSelectedFacultyForEdit(null);
    toggleDrawer();
  };

  const handleOpenEditDrawer = (item) => {
    setSelectedFacultyForEdit(item);
    toggleDrawer();
  };

  const handleOpenViewModal = (item) => {
    setSelectedFacultyForView(item);
    setDetailModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    setDeleteItemId(item.id);
    openModal();
  };

  const handleSaveFaculty = (facultyData) => {
    setFacultyList((prev) => {
      const existsIndex = prev.findIndex((f) => f.id === facultyData.id);
      if (existsIndex > -1) {
        const updated = [...prev];
        updated[existsIndex] = facultyData;
        return updated;
      }
      return [facultyData, ...prev];
    });
  };

  return (
    <>
      {/* Header Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-6">
        <div>
          <PageTitle>Professors & Faculty</PageTitle>
          <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
            Manage esteemed professors, department heads, and academic leaders.
          </p>
        </div>

        <Button
          onClick={handleOpenAddDrawer}
          className="bg-red-800 hover:bg-red-900 text-white font-semibold flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-sm"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Faculty</span>
        </Button>
      </div>

      {/* Action Bar: Search Input & CustomSelect Department Filter */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xs mb-6 border border-gray-100 dark:border-gray-700 p-4 relative z-30">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by faculty name, qualification, subject..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-800 dark:text-gray-200 transition-colors"
            />
            <FiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>

          {/* CustomSelect Department Dropdown */}
          <div className="w-full md:w-64">
            <CustomSelect
              options={DEPARTMENT_OPTIONS}
              value={selectedDept}
              onChange={(val) => setSelectedDept(val)}
              placeholder="All Departments"
            />
          </div>
        </div>
      </div>

      {/* Faculty Data Table */}
      <TableContainer className="mb-8 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xs relative z-10">
        <Table>
          <FacultyTable
            faculties={paginatedFaculties}
            currentPage={currentPage}
            resultsPerPage={resultsPerPage}
            onViewDetails={handleOpenViewModal}
            onEdit={handleOpenEditDrawer}
            onDelete={handleDeleteItem}
          />
        </Table>

        <TableFooter>
          <Pagination
            totalResults={filteredFaculties.length}
            resultsPerPage={resultsPerPage}
            onChange={(p) => setCurrentPage(p)}
            label="Faculty Navigation"
          />
        </TableFooter>
      </TableContainer>

      {/* Faculty Detail Modal matching screenshot #2 */}
      <FacultyDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        faculty={selectedFacultyForView}
      />

      {/* Slide-over Form Drawer */}
      <MainDrawer isDrawerOpen={isDrawerOpen} closeDrawer={closeDrawer}>
        <FacultyDrawer
          faculty={selectedFacultyForEdit}
          onSave={handleSaveFaculty}
        />
      </MainDrawer>

      {/* Confirmation Modal */}
      <MainModal id={deleteItemId} />
    </>
  );
};

export default Faculty;
