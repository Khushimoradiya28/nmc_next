import React, { useContext, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Input, Button } from '@windmill/react-ui';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

import Title from '../form/Title';
import Error from '../form/Error';
import Uploader from '../image-uploader/Uploader';
import { SidebarContext } from '../../context/SidebarContext';
import { ThemeContext } from '../../context/ThemeContext';
import RankerServices from '../../services/RankerServices';
import AcademicProgramServices from '../../services/AcademicProgramServices';
import { notifySuccess, notifyError } from '../../utils/toast';

const RankerDrawer = ({ id }) => {
  const { closeDrawer, isDrawerOpen, setIsUpdate } = useContext(SidebarContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark' || theme === true;

  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);

  const [programmeOptions, setProgrammeOptions] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch Academic Programs for the Programme dropdown
  useEffect(() => {
    AcademicProgramServices.getAllPrograms({ page: 1, limit: 100 })
      .then((res) => {
        const list = res?.data || res?.programs || (Array.isArray(res) ? res : []);
        if (Array.isArray(list)) {
          const seen = new Set();
          const opts = [];
          list.forEach((item) => {
            const short = (item.shortTitle || item.shortName || item.fullName || '').trim();
            if (short && !seen.has(short.toLowerCase())) {
              seen.add(short.toLowerCase());
              opts.push({ value: short, label: short });
            }
          });
          setProgrammeOptions(opts);
        }
      })
      .catch((err) => console.error('Error fetching academic program options:', err));
  }, []);

  // Reset on add
  useEffect(() => {
    if (!id && isDrawerOpen) {
      reset({ name: '', programme: '', semesterYear: '', academicYear: '', rankNum: '', rankLabel: '' });
      setSelectedProgramme('');
      setImageUrl('');
      setUploadedFile(null);
      setUploaderKey((k) => k + 1);
      clearErrors();
    }
  }, [id, isDrawerOpen, reset, clearErrors]);

  // Load existing on edit
  useEffect(() => {
    if (!id || !isDrawerOpen) return;
    RankerServices.getRankerByIdOrSlug(id)
      .then((res) => {
        const data = res?.data || res;
        if (data) {
          setValue('name', data.name || '');
          setValue('programme', data.programme || '');
          setSelectedProgramme(data.programme || '');
          setValue('semesterYear', data.semesterYear || '');
          setValue('academicYear', data.academicYear || '');
          setValue('rankNum', data.rankNum != null ? String(data.rankNum) : '');
          setValue('rankLabel', data.rankLabel || '');
          setImageUrl(data.image_url || data.image_webp_url || data.image || '');
          setUploadedFile(null);
          setUploaderKey((k) => k + 1);
        }
      })
      .catch((err) => notifyError(err?.response?.data?.message || err.message || 'Failed to fetch ranker details'));
  }, [id, isDrawerOpen, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      clearErrors();

      const name = (data.name || '').trim();
      const programme = (selectedProgramme || '').trim();
      const semesterYear = (data.semesterYear || '').trim();
      const academicYear = (data.academicYear || '').trim();
      const rankNum = (data.rankNum || '').toString().trim();
      const rankLabel = (data.rankLabel || '').trim();

      if (!programme) {
        setError('programme', { type: 'manual', message: 'Programme / Degree is mandatory' });
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('programme', programme);
      formData.append('semesterYear', semesterYear);
      formData.append('academicYear', academicYear);
      formData.append('rankNum', rankNum);
      if (rankLabel) formData.append('rankLabel', rankLabel);

      if (uploadedFile && typeof uploadedFile === 'object') {
        formData.append('image', uploadedFile);
      } else if (imageUrl) {
        formData.append('image', imageUrl);
      }

      let res;
      if (id) {
        res = await RankerServices.updateRanker(id, formData);
        notifySuccess(res?.message || 'Ranker updated successfully!');
      } else {
        res = await RankerServices.addRanker(formData);
        notifySuccess(res?.message || 'Ranker added successfully!');
      }

      setIsUpdate(true);
      closeDrawer();
    } catch (err) {
      const responseData = err?.response?.data;
      if (err?.response?.status === 422 && responseData) {
        if (Array.isArray(responseData.errors)) {
          responseData.errors.forEach((msg) => {
            const lower = msg.toLowerCase();
            const field = ['name', 'programme', 'semesteryear', 'academicyear', 'ranknum', 'image'].find((f) =>
              lower.startsWith(f.toLowerCase())
            );
            const fieldMap = { semesteryear: 'semesterYear', academicyear: 'academicYear', ranknum: 'rankNum' };
            if (field) setError(fieldMap[field] || field, { type: 'manual', message: msg });
          });
          notifyError(responseData.message || 'Please fill in all required fields.');
        } else if (responseData.error) {
          Object.keys(responseData.error).forEach((field) => {
            const m = Array.isArray(responseData.error[field]) ? responseData.error[field][0] : responseData.error[field];
            setError(field, { type: 'manual', message: m });
          });
          notifyError(responseData.message || 'Please fill in all required fields.');
        } else {
          notifyError(responseData.message || 'Validation failed.');
        }
      } else {
        notifyError(responseData?.message || err?.message || 'Failed to save ranker.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? '#374151' : '#F9FAFB',
      borderColor: state.isFocused ? '#991b1b' : isDark ? '#4B5563' : '#E5E7EB',
      borderRadius: '0.375rem',
      minHeight: '42px',
      boxShadow: state.isFocused ? '0 0 0 1px #991b1b' : 'none',
      '&:hover': { borderColor: '#991b1b' },
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
      backgroundColor: state.isSelected ? '#991B1B' : state.isFocused ? (isDark ? '#374151' : '#FEF2F2') : 'transparent',
      color: state.isSelected ? '#FFFFFF' : isDark ? '#E5E7EB' : '#374151',
      fontSize: '0.875rem',
      fontWeight: state.isSelected ? '600' : 'normal',
      cursor: 'pointer',
      '&:active': { backgroundColor: '#991B1B', color: '#FFFFFF' },
    }),
    singleValue: (base) => ({ ...base, color: isDark ? '#E5E7EB' : '#1F2937' }),
    placeholder: (base) => ({ ...base, color: '#9CA3AF', fontSize: '0.875rem' }),
    input: (base) => ({ ...base, color: isDark ? '#E5E7EB' : '#1F2937', caretColor: '#991B1B' }),
  };

  return (
    <div className="flex flex-col w-full h-full justify-between bg-white dark:bg-gray-800">
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title title="Update Ranker" description="Update rank holder details below" />
        ) : (
          <Title title="Add Ranker" description="Add a new university rank holder below" />
        )}
      </div>

      <Scrollbars className="w-full relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="block p-6">
          <div className="space-y-5">
            {/* Photo */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Student Photo <span className="text-red-500">*</span>
              </label>
              <Uploader key={uploaderKey} imageUrl={imageUrl} setImageUrl={setImageUrl} setUploadedFile={setUploadedFile} />
              <Error errorName={errors.image} />
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('name', { required: 'Name is mandatory' })}
                type="text"
                placeholder="e.g. PAREKH KHUSHBHU"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.name} />
            </div>

            {/* Programme dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Programme / Degree <span className="text-red-500">*</span>
              </label>
              <Select
                options={programmeOptions}
                value={
                  selectedProgramme
                    ? (programmeOptions.find((opt) => opt.value?.toLowerCase().trim() === selectedProgramme.toLowerCase().trim()) || { value: selectedProgramme, label: selectedProgramme })
                    : null
                }
                onChange={(selected) => {
                  setSelectedProgramme(selected ? selected.value : '');
                  if (selected) clearErrors('programme');
                }}
                placeholder="Select programme (e.g. B.A., B.C.A., M.Com)..."
                isClearable
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                styles={selectStyles}
              />
              <Error errorName={errors.programme} />
            </div>

            {/* Semester / Year */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Semester / Year <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('semesterYear', { required: 'Semester / Year is mandatory' })}
                type="text"
                placeholder="e.g. BA SEM-1"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.semesterYear} />
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('academicYear', { required: 'Academic year is mandatory' })}
                type="text"
                placeholder="e.g. 2011-12"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.academicYear} />
            </div>

            {/* Rank Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                University Rank (Number) <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('rankNum', {
                  required: 'Rank is mandatory',
                  validate: (v) => (parseInt(v) >= 1 ? true : 'Rank must be a positive number'),
                })}
                type="number"
                min="1"
                placeholder="e.g. 1"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.rankNum} />
            </div>

            {/* Rank Label */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Achievement Label
              </label>
              <Input
                {...register('rankLabel')}
                type="text"
                placeholder="e.g. University Rank Holder"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
            <Button layout="outline" onClick={closeDrawer} type="button" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-red-800 hover:bg-red-900 text-white">
              {id ? 'Update Ranker' : 'Save Ranker'}
            </Button>
          </div>
        </form>
      </Scrollbars>
    </div>
  );
};

export default RankerDrawer;
