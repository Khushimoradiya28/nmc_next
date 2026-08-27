import React, { useState, useContext, useMemo } from 'react';
import {
  Table,
  TableContainer,
  TableFooter,
  Pagination,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
} from '@windmill/react-ui';
import { FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';

import PageTitle from '../../components/Typography/PageTitle';
import AcademicProgramTable from '../../components/academic-program/AcademicProgramTable';
import AcademicProgramDetailModal from '../../components/academic-program/AcademicProgramDetailModal';
import AcademicProgramDrawer from '../../components/drawer/AcademicProgramDrawer';
import MainDrawer from '../../components/drawer/MainDrawer';
import CustomSelect from '../../components/form/CustomSelect';
import { SidebarContext } from '../../context/SidebarContext';
import { notifySuccess } from '../../utils/toast';

const CATEGORY_OPTIONS = [
  { label: 'All Programs', value: 'all' },
  { label: 'Undergraduate (UG)', value: 'UG' },
  { label: 'Postgraduate (PG)', value: 'PG' },
  { label: 'Diploma & Vocational', value: 'Diploma' },
];

const INITIAL_PROGRAM_DATA = [
  {
    id: 1,
    shortName: 'B.B.A.',
    fullName: 'Bachelor of Business Administration',
    category: 'UG',
    description: 'Comprehensive corporate leadership training covering marketing, strategy, corporate finance, and business management.',
    highlights: [
      'Strategic Marketing & Human Resources',
      'Financial & Corporate Law',
      'Executive Presentation & Internships',
    ],
    duration: '3 Years (6 Sems)',
    fee: '₹8,000 / Sem',
    icon: 'briefcase',
    applyButtonText: 'Apply for B.B.A.',
  },
  {
    id: 2,
    shortName: 'B.C.A.',
    fullName: 'Bachelor of Computer Applications',
    category: 'UG',
    description: 'Modern computing curriculum with hands-on software development, database engineering, and full-stack web technologies.',
    highlights: [
      'C++, Java, Python & Full-Stack Web',
      'Database Systems & Cloud Infrastructure',
      'High-Speed Computer Lab Workstations',
    ],
    duration: '3 Years (6 Sems)',
    fee: '₹15,000 / Sem',
    icon: 'code',
    applyButtonText: 'Apply for B.C.A.',
  },
  {
    id: 3,
    shortName: 'B.A.',
    fullName: 'Bachelor of Arts',
    category: 'UG',
    description: 'Rich humanities program fostering critical thought, communication skills, and social-cultural awareness.',
    highlights: [
      'Gujarati, English & Hindi Literature',
      'Sociology, Psychology & History',
      'Competitive Exam Coaching Alignment',
    ],
    duration: '3 Years (6 Sems)',
    fee: 'Affordable Fee',
    icon: 'book',
    applyButtonText: 'Apply for B.A.',
  },
  {
    id: 4,
    shortName: 'B.Com',
    fullName: 'Bachelor of Commerce',
    category: 'UG',
    description: 'Strong foundation in accounting, taxation, and business principles with practical industry exposure.',
    highlights: [
      'Advanced Accounting & Auditing',
      'Taxation & Business Law',
      'Banking & Financial Services',
    ],
    duration: '3 Years (6 Sems)',
    fee: '₹6,000 / Sem',
    icon: 'clipboard',
    applyButtonText: 'Apply for B.Com',
  },
  {
    id: 5,
    shortName: 'M.Com',
    fullName: 'Master of Commerce',
    category: 'PG',
    description: 'Advanced commerce studies with specialization in accounting, finance, and business research methodology.',
    highlights: [
      'Advanced Financial Management',
      'Research Methodology & Analysis',
      'Corporate Governance & Ethics',
    ],
    duration: '2 Years (4 Sems)',
    fee: '₹10,000 / Sem',
    icon: 'clipboard',
    applyButtonText: 'Apply for M.Com',
  },
  {
    id: 6,
    shortName: 'M.A.',
    fullName: 'Master of Arts',
    category: 'PG',
    description: 'Post-graduate arts program deepening expertise in literature, social sciences, and research.',
    highlights: [
      'Specialized Literature Studies',
      'Advanced Research & Dissertation',
      'NET/SET Exam Preparation Support',
    ],
    duration: '2 Years (4 Sems)',
    fee: '₹8,000 / Sem',
    icon: 'book',
    applyButtonText: 'Apply for M.A.',
  },
  {
    id: 7,
    shortName: 'M.S.W.',
    fullName: 'Master of Social Work',
    category: 'PG',
    description: 'Professional social work education combining fieldwork, community engagement, and welfare management.',
    highlights: [
      'Community Development & Welfare',
      'Intensive Fieldwork & Internships',
      'Counseling & Rehabilitation Studies',
    ],
    duration: '2 Years (4 Sems)',
    fee: '₹12,000 / Sem',
    icon: 'award',
    applyButtonText: 'Apply for M.S.W.',
  },
  {
    id: 8,
    shortName: 'PGDCA',
    fullName: 'Post Graduate Diploma in Computer Application',
    category: 'Diploma',
    description: 'Intensive computer application diploma focusing on software tools, programming, and IT skills for career readiness.',
    highlights: [
      'Programming & Web Development',
      'Database Management Systems',
      'Industry-Ready IT Certification',
    ],
    duration: '1 Year (2 Sems)',
    fee: '₹12,000 / Sem',
    icon: 'code',
    applyButtonText: 'Apply for PGDCA',
  },
  {
    id: 9,
    shortName: 'DFD',
    fullName: 'Diploma in Fashion Design',
    category: 'Diploma',
    description: 'Creative fashion design diploma covering garment construction, textile science, and design principles.',
    highlights: [
      'Fashion Illustration & Sketching',
      'Textile Science & Fabric Study',
      'Portfolio & Exhibition Preparation',
    ],
    duration: '1 Year (2 Sems)',
    fee: '₹15,000 / Sem',
    icon: 'layers',
    applyButtonText: 'Apply for DFD',
  },
];

const AcademicPrograms = () => {
  const { toggleDrawer, isDrawerOpen, closeDrawer } = useContext(SidebarContext);

  const [programList, setProgramList] = useState(INITIAL_PROGRAM_DATA);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Selected program for Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProgramForView, setSelectedProgramForView] = useState(null);

  // Selected program for Drawer Edit
  const [selectedProgramForEdit, setSelectedProgramForEdit] = useState(null);

  // Delete modal state item ID
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Search & Filtered Data
  const filteredPrograms = useMemo(() => {
    return programList.filter((item) => {
      const matchesSearch =
        !searchText ||
        item.shortName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [programList, searchText, selectedCategory]);

  // Paginated Data
  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * resultsPerPage;
    return filteredPrograms.slice(start, start + resultsPerPage);
  }, [filteredPrograms, currentPage]);

  const handleOpenAddDrawer = () => {
    setSelectedProgramForEdit(null);
    toggleDrawer();
  };

  const handleOpenEditDrawer = (item) => {
    setSelectedProgramForEdit(item);
    toggleDrawer();
  };

  const handleOpenViewModal = (item) => {
    setSelectedProgramForView(item);
    setDetailModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    setDeleteItemId(item.id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setProgramList((prev) => prev.filter((p) => p.id !== deleteItemId));
    setIsDeleteModalOpen(false);
    setDeleteItemId(null);
    notifySuccess('Program deleted successfully!');
  };

  const handleSaveProgram = (programData) => {
    setProgramList((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === programData.id);
      if (existsIndex > -1) {
        const updated = [...prev];
        updated[existsIndex] = programData;
        return updated;
      }
      return [programData, ...prev];
    });
  };

  return (
    <>
      {/* Header Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-6">
        <div>
          <PageTitle>Academic Programs</PageTitle>
          <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
            Manage undergraduate, postgraduate, and diploma programs offered at NMC.
          </p>
        </div>

        <Button
          onClick={handleOpenAddDrawer}
          className="bg-red-800 hover:bg-red-900 text-white font-semibold flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-sm"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Program</span>
        </Button>
      </div>

      {/* Action Bar: Search Input & Category Filter */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xs mb-6 border border-gray-100 dark:border-gray-700 p-4 relative z-30">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by program name, description..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-800 dark:text-gray-200 transition-colors"
            />
            <FiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>

          {/* CustomSelect Category Dropdown */}
          <div className="w-full md:w-64">
            <CustomSelect
              options={CATEGORY_OPTIONS}
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
              placeholder="All Programs"
            />
          </div>
        </div>
      </div>

      {/* Program Data Table */}
      <TableContainer className="mb-8 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xs relative z-10">
        <Table>
          <AcademicProgramTable
            programs={paginatedPrograms}
            currentPage={currentPage}
            resultsPerPage={resultsPerPage}
            onViewDetails={handleOpenViewModal}
            onEdit={handleOpenEditDrawer}
            onDelete={handleDeleteItem}
          />
        </Table>

        <TableFooter>
          <Pagination
            totalResults={filteredPrograms.length}
            resultsPerPage={resultsPerPage}
            onChange={(p) => setCurrentPage(p)}
            label="Programs Navigation"
          />
        </TableFooter>
      </TableContainer>

      {/* Program Detail Modal */}
      <AcademicProgramDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        program={selectedProgramForView}
      />

      {/* Slide-over Form Drawer */}
      <MainDrawer isDrawerOpen={isDrawerOpen} closeDrawer={closeDrawer}>
        <AcademicProgramDrawer
          program={selectedProgramForEdit}
          onSave={handleSaveProgram}
        />
      </MainDrawer>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalBody className="text-center custom-modal px-8 pt-6 pb-4">
          <span className="flex justify-center text-3xl mb-6 text-red-500">
            <FiTrash2 />
          </span>
          <h2 className="text-xl font-medium mb-1 text-gray-700 dark:text-gray-300">
            Are You Sure?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Do you really want to delete this program? This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button
            className="w-full sm:w-auto hover:bg-white hover:border-gray-50"
            layout="outline"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
          >
            Yes, Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AcademicPrograms;
