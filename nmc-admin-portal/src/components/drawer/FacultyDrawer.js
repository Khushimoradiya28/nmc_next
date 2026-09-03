import React, { useContext, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Textarea, Input, Button } from '@windmill/react-ui';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

import Title from '../form/Title';
import Error from '../form/Error';
import Uploader from '../image-uploader/Uploader';
import { SidebarContext } from '../../context/SidebarContext';
import { ThemeContext } from '../../context/ThemeContext';
import FacultyServices from '../../services/FacultyServices';
import AcademicProgramServices from '../../services/AcademicProgramServices';
import CourseServices from '../../services/CourseServices';
import { notifySuccess, notifyError } from '../../utils/toast';

const FacultyDrawer = ({ id }) => {
  const { closeDrawer, isDrawerOpen, setIsUpdate } = useContext(SidebarContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark' || theme === true;

  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [programStreamOptions, setProgramStreamOptions] = useState([]);
  const [selectedCoursesStreams, setSelectedCoursesStreams] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch Academic Programs & Certificate/Professional Courses in strict sequence (UG -> PG -> Diploma -> Certificate)
  useEffect(() => {
    Promise.allSettled([
      AcademicProgramServices.getAllPrograms({ page: 1, limit: 100 }),
      CourseServices.getAllCourses({ page: 1, limit: 100 }),
    ])
      .then(([progRes, courseRes]) => {
        const progData =
          progRes.status === 'fulfilled'
            ? progRes.value?.data || progRes.value?.programs || (Array.isArray(progRes.value) ? progRes.value : [])
            : [];
        const courseData =
          courseRes.status === 'fulfilled'
            ? courseRes.value?.data || courseRes.value?.courses || (Array.isArray(courseRes.value) ? courseRes.value : [])
            : [];

        const getRank = (item) => {
          const type = (item.programType || item.category || '').toLowerCase().trim();
          if (type === 'ug') return 1;
          if (type === 'pg') return 2;
          if (type === 'diploma') return 3;
          const title = (item.shortTitle || item.fullName || item.title || '').toUpperCase();
          if (title.startsWith('B.') || title.startsWith('BCA') || title.startsWith('BBA') || title.startsWith('BSC') || title.startsWith('BA')) return 1;
          if (title.startsWith('M.') || title.startsWith('MSW') || title.startsWith('MCA') || title.startsWith('MSC') || title.startsWith('MA')) return 2;
          if (title.includes('DIPLOMA') || title.includes('DFD') || title.includes('CFD')) return 3;
          return 4;
        };

        const sortedPrograms = (Array.isArray(progData) ? [...progData] : []).sort((a, b) => {
          const rankA = getRank(a);
          const rankB = getRank(b);
          if (rankA !== rankB) return rankA - rankB;
          return (a.sort_order || 0) - (b.sort_order || 0);
        });

        const sortedCourses = (Array.isArray(courseData) ? [...courseData] : []).sort((a, b) => {
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        });

        const uniqueStreams = [];
        const seen = new Set();

        // 1. Add Academic Programs (UG -> PG -> Diploma)
        sortedPrograms.forEach((item) => {
          const short = (item.shortTitle || item.shortName || item.fullName || '').trim();
          if (short && !seen.has(short.toLowerCase())) {
            seen.add(short.toLowerCase());
            uniqueStreams.push({
              value: short,
              label: short,
            });
          }
        });

        // 2. Add Professional / Certificate Courses
        sortedCourses.forEach((item) => {
          const title = (item.title || item.name || '').trim();
          if (title && !seen.has(title.toLowerCase())) {
            seen.add(title.toLowerCase());
            uniqueStreams.push({
              value: title,
              label: title,
            });
          }
        });

        setProgramStreamOptions(uniqueStreams);
      })
      .catch((err) => {
        console.error('Error fetching academic program streams:', err);
      });
  }, []);

  // Reset form when adding new or when drawer opens/closes
  useEffect(() => {
    if (!id && isDrawerOpen) {
      reset({
        fullName: '',
        designation: '',
        qualifications: '',
        experience: '',
        overview: '',
        expertise: '',
        keyHighlight: '',
        status: 'active',
      });
      setSelectedCoursesStreams([]);
      setImageUrl('');
      setUploadedFile(null);
      clearErrors();
    }
  }, [id, isDrawerOpen, reset, clearErrors]);

  // Fetch existing faculty data for Edit mode
  useEffect(() => {
    if (!id || !isDrawerOpen) return;

    FacultyServices.getFacultyByIdOrSlug(id)
      .then((res) => {
        const data = res?.data || res;
        if (data) {
          setValue('fullName', data.fullName || data.name || '');
          setValue('designation', data.designation || '');
          setValue('qualifications', data.qualifications || data.qualification || '');
          setValue('experience', String(data.experience || '').replace(/[^0-9]/g, ''));
          setValue('overview', data.overview || data.biography || '');
          setValue(
            'expertise',
            Array.isArray(data.expertise)
              ? data.expertise.join(', ')
              : data.expertise || ''
          );
          setValue('keyHighlight', data.keyHighlight || data.highlight || '');
          setValue('status', data.status === 'inactive' || data.status === 0 || data.status === false ? 'inactive' : 'active');

          // Populate Courses / Streams multiple selection
          const rawCoursesStreams =
            data.coursesStreams ||
            data.courses_streams ||
            data.streams ||
            data.courseStreams ||
            data.department ||
            [];

          let formattedSelectedStreams = [];

          if (typeof rawCoursesStreams === 'string') {
            try {
              const parsed = JSON.parse(rawCoursesStreams);
              if (Array.isArray(parsed)) {
                formattedSelectedStreams = parsed.map((s) =>
                  typeof s === 'string' ? s.trim() : s?.value || s?.label || s?.shortTitle || ''
                );
              } else {
                formattedSelectedStreams = rawCoursesStreams
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean);
              }
            } catch {
              formattedSelectedStreams = rawCoursesStreams
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            }
          } else if (Array.isArray(rawCoursesStreams)) {
            formattedSelectedStreams = rawCoursesStreams.map((s) =>
              typeof s === 'string' ? s.trim() : s?.value || s?.label || s?.shortTitle || ''
            );
          }

          setSelectedCoursesStreams(formattedSelectedStreams.filter(Boolean));
          setImageUrl(data.photo_url || data.image_url || data.photo || '');
          setUploadedFile(null);
        }
      })
      .catch((err) => {
        notifyError(err?.response?.data?.message || err.message || 'Failed to fetch faculty details');
      });
  }, [id, isDrawerOpen, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      clearErrors();

      const fullName = (data.fullName || '').trim();
      const designation = (data.designation || '').trim();
      const qualifications = (data.qualifications || '').trim();
      // Strictly extract only digits for years of experience (prevent +, years, symbols)
      const rawExpDigits = String(data.experience || '').replace(/[^0-9]/g, '');
      const experience = rawExpDigits || '1';
      const overview = (data.overview || '').trim();
      const expertise = (data.expertise || '').trim();
      const keyHighlight = (data.keyHighlight || '').trim();

      const primaryDepartment = selectedCoursesStreams.length > 0 ? selectedCoursesStreams.join(', ') : 'General';
      const statusValue = data.status || 'active';
      const isActiveValue = statusValue === 'active';

      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('badgeTag', designation);
      formData.append('designation', designation);
      formData.append('qualifications', qualifications);
      formData.append('department', primaryDepartment);
      formData.append('coursesStreams', JSON.stringify(selectedCoursesStreams));
      formData.append('streams', JSON.stringify(selectedCoursesStreams));
      formData.append('experience', experience);
      formData.append('overview', overview);
      formData.append('expertise', expertise);
      formData.append('keyHighlight', keyHighlight);
      formData.append('status', statusValue);
      formData.append('isActive', isActiveValue);
      formData.append('is_active', isActiveValue ? 1 : 0);

      if (uploadedFile && typeof uploadedFile === 'object') {
        formData.append('photo', uploadedFile);
      } else if (imageUrl) {
        formData.append('photo', imageUrl);
      }

      let res;
      if (id) {
        res = await FacultyServices.updateFaculty(id, formData);
        notifySuccess(res?.message || 'Faculty member updated successfully!');
      } else {
        res = await FacultyServices.addFaculty(formData);
        notifySuccess(res?.message || 'Faculty member added successfully!');
      }

      setIsUpdate(true);
      closeDrawer();
    } catch (err) {
      const responseData = err?.response?.data;
      if (err?.response?.status === 422 && responseData?.error) {
        const errorObj = responseData.error;
        Object.keys(errorObj).forEach((field) => {
          const message = Array.isArray(errorObj[field])
            ? errorObj[field][0]
            : errorObj[field];
          setError(field, { type: 'manual', message });
        });
        notifyError(responseData.message || 'Please fill in all required fields.');
      } else {
        notifyError(responseData?.message || err?.message || 'Failed to save faculty member.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full justify-between bg-white dark:bg-gray-800">
      {/* Drawer Header */}
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title title="Update Faculty Member" description="Update faculty details below" />
        ) : (
          <Title title="Add Faculty Member" description="Add a new professor or faculty member below" />
        )}
      </div>

      {/* Drawer Body Scroll */}
      <Scrollbars className="w-full relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="block p-6">
          <div className="space-y-5">
            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Faculty Photo <span className="text-red-500">*</span>
              </label>
              <Uploader
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                setUploadedFile={setUploadedFile}
              />
              <Error errorName={errors.photo} />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('fullName', { required: 'Full Name is mandatory' })}
                type="text"
                placeholder="e.g. Dr. Samkit Shah"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.fullName} />
            </div>

            {/* Teaching Streams / Courses Multi-Selection (Dynamic from Academic Programs & Certificate Courses) */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Teaching Streams / Courses
              </label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                options={programStreamOptions}
                value={
                  selectedCoursesStreams.map((val) => {
                    const matched = programStreamOptions.find(
                      (opt) =>
                        opt.value?.toLowerCase().trim() === val?.toLowerCase().trim() ||
                        opt.label?.toLowerCase().trim() === val?.toLowerCase().trim()
                    );
                    return matched || { value: val, label: val };
                  })
                }
                onChange={(selected) => {
                  const values = selected ? selected.map((item) => item.value) : [];
                  setSelectedCoursesStreams(values);
                }}
                placeholder="Select streams (e.g. B.B.A., B.C.A., M.Com)..."
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: isDark ? '#374151' : '#F9FAFB',
                    borderColor: state.isFocused
                      ? '#991b1b'
                      : isDark
                      ? '#4B5563'
                      : '#E5E7EB',
                    borderRadius: '0.375rem',
                    minHeight: '42px',
                    boxShadow: state.isFocused ? '0 0 0 1px #991b1b' : 'none',
                    '&:hover': {
                      borderColor: '#991b1b',
                    },
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: isDark ? '#4B5563' : '#FEE2E2',
                    borderRadius: '0.25rem',
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: isDark ? '#F3F4F6' : '#991B1B',
                    fontWeight: '600',
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: isDark ? '#F3F4F6' : '#991B1B',
                    '&:hover': {
                      backgroundColor: '#DC2626',
                      color: '#ffffff',
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 9999,
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? '#991B1B'
                      : state.isFocused
                      ? isDark
                        ? '#374151'
                        : '#FEF2F2'
                      : 'transparent',
                    color: state.isSelected
                      ? '#FFFFFF'
                      : isDark
                      ? '#E5E7EB'
                      : '#374151',
                    fontSize: '0.875rem',
                    fontWeight: state.isSelected ? '600' : 'normal',
                    cursor: 'pointer',
                    '&:active': {
                      backgroundColor: '#991B1B',
                      color: '#FFFFFF',
                    },
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: isDark ? '#9CA3AF' : '#9CA3AF',
                    fontSize: '0.875rem',
                  }),
                  input: (base) => ({
                    ...base,
                    color: isDark ? '#E5E7EB' : '#1F2937',
                    caretColor: '#991B1B',
                    margin: '0px',
                    padding: '0px',
                    '& input': {
                      outline: 'none !important',
                      boxShadow: 'none !important',
                      caretColor: '#991B1B !important',
                    },
                  }),
                }}
              />
            </div>

            {/* Designation & Role */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Designation & Role <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('designation', { required: 'Designation is mandatory' })}
                type="text"
                placeholder="e.g. I/C Principal & Professor"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.designation} />
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Qualifications <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('qualifications', { required: 'Qualifications is mandatory' })}
                type="text"
                placeholder="e.g. M.A., Ph.D. (Economics), M.Phil"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.qualifications} />
            </div>

            {/* Teaching Experience */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Teaching Experience (In Years) <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Input
                  {...register('experience', { required: 'Teaching Experience is mandatory' })}
                  type="text"
                  placeholder="e.g. 15"
                  className="w-full pr-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
                />
                <span className="absolute right-3 text-xs font-semibold text-gray-500 dark:text-gray-400 pointer-events-none bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                  Years
                </span>
              </div>
              <Error errorName={errors.experience} />
            </div>

            {/* Academic Overview / Biography */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Overview / Biography <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register('overview', { required: 'Overview is mandatory' })}
                rows="3"
                placeholder="Distinguished academic scholar and administrator specializing in research methodology..."
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.overview} />
            </div>

            {/* Areas of Expertise (Comma-separated) */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Areas of Expertise (Comma-separated) <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('expertise', { required: 'Expertise is mandatory' })}
                type="text"
                placeholder="Economics, Commerce & Finance, Research Methodology"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.expertise} />
            </div>

            {/* Key Highlight */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Key Highlight Banner Text <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('keyHighlight', { required: 'Key Highlight is mandatory' })}
                type="text"
                placeholder="e.g. Published 25+ Research Papers in Peer-Reviewed International Journals"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.keyHighlight} />
            </div>

            {/* Status (Active / Inactive) */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Display Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50 font-medium"
              >
                <option value="active">Active (Visible on Website)</option>
                <option value="inactive">Inactive (Hidden from Website)</option>
              </select>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
            <Button
              layout="outline"
              onClick={closeDrawer}
              type="button"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-red-800 hover:bg-red-900 text-white">
              {id ? 'Update Faculty' : 'Save Faculty'}
            </Button>
          </div>
        </form>
      </Scrollbars>
    </div>
  );
};

export default FacultyDrawer;
