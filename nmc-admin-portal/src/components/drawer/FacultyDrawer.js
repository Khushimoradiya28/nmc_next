import React, { useContext, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Textarea, Input, Button } from '@windmill/react-ui';
import { useForm } from 'react-hook-form';

import Title from '../form/Title';
import Error from '../form/Error';
import Uploader from '../image-uploader/Uploader';
import CustomSelect from '../form/CustomSelect';
import { SidebarContext } from '../../context/SidebarContext';
import FacultyServices from '../../services/FacultyServices';
import { notifySuccess, notifyError } from '../../utils/toast';

const BADGE_OPTIONS = [
  { label: 'I/C PRINCIPAL', value: 'I/C PRINCIPAL' },
  { label: 'SENIOR LEADERSHIP', value: 'SENIOR LEADERSHIP' },
  { label: 'MANAGEMENT HEAD', value: 'MANAGEMENT HEAD' },
  { label: 'CHIEF COORDINATOR', value: 'CHIEF COORDINATOR' },
  { label: 'B.B.A.', value: 'B.B.A.' },
  { label: 'PROFESSOR', value: 'PROFESSOR' },
];

const STREAM_OPTIONS = [
  { label: 'B.B.A.', value: 'B.B.A.' },
  { label: 'B.Com (Commerce)', value: 'B.Com' },
  { label: 'M.Com (Commerce)', value: 'M.Com' },
  { label: 'Economics', value: 'Economics' },
  { label: 'B.C.A. & IT (Computer Applications)', value: 'B.C.A. & IT' },
  { label: 'Science & Bio-Tech', value: 'Science' },
];

const FacultyDrawer = ({ id }) => {
  const { closeDrawer, isDrawerOpen, setIsUpdate } = useContext(SidebarContext);

  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedBadge, setSelectedBadge] = useState('MANAGEMENT HEAD');
  const [selectedStream, setSelectedStream] = useState('B.B.A.');

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

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
      });
      setSelectedBadge('MANAGEMENT HEAD');
      setSelectedStream('B.B.A.');
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
          setValue('experience', data.experience || '');
          setValue('overview', data.overview || data.biography || '');
          setValue(
            'expertise',
            Array.isArray(data.expertise)
              ? data.expertise.join(', ')
              : data.expertise || ''
          );
          setValue('keyHighlight', data.keyHighlight || data.highlight || '');

          const rawDept = data.department || data.stream || '';
          const matchedStream = STREAM_OPTIONS.find(
            (opt) =>
              rawDept.toLowerCase().includes(opt.value.toLowerCase()) ||
              opt.label.toLowerCase().includes(rawDept.toLowerCase())
          );
          setSelectedStream(matchedStream ? matchedStream.value : 'B.B.A.');

          const rawBadge = data.badgeTag || data.badge || '';
          const matchedBadge = BADGE_OPTIONS.find(
            (opt) =>
              rawBadge.toLowerCase().includes(opt.value.toLowerCase()) ||
              opt.label.toLowerCase().includes(rawBadge.toLowerCase())
          );
          setSelectedBadge(matchedBadge ? matchedBadge.value : 'MANAGEMENT HEAD');
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
      const experience = (data.experience || '').trim();
      const overview = (data.overview || '').trim();
      const expertise = (data.expertise || '').trim();
      const keyHighlight = (data.keyHighlight || '').trim();

      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('badgeTag', selectedBadge);
      formData.append('designation', designation);
      formData.append('qualifications', qualifications);
      formData.append('department', selectedStream);
      formData.append('experience', experience);
      formData.append('overview', overview);
      formData.append('expertise', expertise);
      formData.append('keyHighlight', keyHighlight);

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

            {/* Leadership Badge Tag Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Leadership Badge Tag <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                options={BADGE_OPTIONS}
                value={selectedBadge}
                onChange={(val) => setSelectedBadge(val)}
                placeholder="Select Badge Tag"
              />
              <Error errorName={errors.badgeTag} />
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

            {/* Department Stream Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Department Stream <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                options={STREAM_OPTIONS}
                value={selectedStream}
                onChange={(val) => setSelectedStream(val)}
                placeholder="Select Stream"
              />
              <Error errorName={errors.department} />
            </div>

            {/* Teaching Experience */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Teaching Experience <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('experience', { required: 'Experience is mandatory' })}
                type="text"
                placeholder="e.g. 15+ Years of Academic Experience"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
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
