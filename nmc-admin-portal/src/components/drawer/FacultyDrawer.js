import React, { useContext, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Textarea, Input, Button } from '@windmill/react-ui';
import { useForm } from 'react-hook-form';

import Title from '../form/Title';
import Error from '../form/Error';
import DrawerButton from '../form/DrawerButton';
import Uploader from '../image-uploader/Uploader';
import CustomSelect from '../form/CustomSelect';
import { SidebarContext } from '../../context/SidebarContext';
import { notifySuccess } from '../../utils/toast';

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

const FacultyDrawer = ({ faculty, onSave }) => {
  const { closeDrawer, isDrawerOpen } = useContext(SidebarContext);

  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedBadge, setSelectedBadge] = useState('MANAGEMENT HEAD');
  const [selectedStream, setSelectedStream] = useState('B.B.A.');

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (faculty && isDrawerOpen) {
      setValue('name', faculty.name || '');
      setValue('designation', faculty.designation || '');
      setValue('qualification', faculty.qualification || '');
      setValue('experience', faculty.experience || '');
      setValue('biography', faculty.biography || '');
      setValue('expertise', Array.isArray(faculty.expertise) ? faculty.expertise.join(', ') : faculty.expertise || '');
      setValue('highlight', faculty.highlight || '');
      setSelectedBadge(faculty.badge || 'MANAGEMENT HEAD');
      setSelectedStream(faculty.stream || 'B.B.A.');
      setImageUrl(faculty.image || '');
    } else if (!faculty && isDrawerOpen) {
      reset({
        name: '',
        designation: '',
        qualification: '',
        experience: '',
        biography: '',
        expertise: '',
        highlight: '',
      });
      setSelectedBadge('MANAGEMENT HEAD');
      setSelectedStream('B.B.A.');
      setImageUrl('');
      setUploadedFile(null);
      clearErrors();
    }
  }, [faculty, isDrawerOpen, reset, setValue, clearErrors]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const facultyData = {
        id: faculty?.id || Date.now(),
        name: data.name?.trim(),
        badge: selectedBadge,
        designation: data.designation?.trim(),
        qualification: data.qualification?.trim(),
        experience: data.experience?.trim(),
        stream: selectedStream,
        biography: data.biography?.trim(),
        expertise: data.expertise
          ? data.expertise.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        highlight: data.highlight?.trim(),
        image: imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      };

      if (onSave) {
        onSave(facultyData);
      }

      notifySuccess(faculty?.id ? 'Faculty updated successfully!' : 'Faculty added successfully!');
      closeDrawer();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full justify-between bg-white dark:bg-gray-800">
      {/* Drawer Header */}
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {faculty?.id ? (
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
                Faculty Photo
              </label>
              <Uploader
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                setUploadedFile={setUploadedFile}
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('name', { required: 'Name is required' })}
                type="text"
                placeholder="e.g. Shah Keyurbhai"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.name} />
            </div>

            {/* Category / Badge Tag Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Leadership Badge Tag
              </label>
              <CustomSelect
                options={BADGE_OPTIONS}
                value={selectedBadge}
                onChange={(val) => setSelectedBadge(val)}
                placeholder="Select Badge Tag"
              />
            </div>

            {/* Title / Designation */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Designation & Role <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('designation', { required: 'Designation is required' })}
                type="text"
                placeholder="e.g. I/C Principal & HOD"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.designation} />
            </div>

            {/* Qualification */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Qualification Degrees
              </label>
              <Input
                {...register('qualification')}
                type="text"
                placeholder="e.g. M.B.A. (Finance), B.Com (H), D.B.M."
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
            </div>

            {/* Department Stream Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Department Stream
              </label>
              <CustomSelect
                options={STREAM_OPTIONS}
                value={selectedStream}
                onChange={(val) => setSelectedStream(val)}
                placeholder="Select Stream"
              />
            </div>

            {/* Teaching Experience */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Teaching Experience
              </label>
              <Input
                {...register('experience')}
                type="text"
                placeholder="e.g. 12+ Years Experience"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
            </div>

            {/* Academic Overview & Biography */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Academic Biography / Overview
              </label>
              <Textarea
                {...register('biography')}
                rows="3"
                placeholder="Brief academic profile and achievements..."
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
            </div>

            {/* Expertise & Subjects (Comma-separated) */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Areas of Expertise (Comma-separated)
              </label>
              <Input
                {...register('expertise')}
                type="text"
                placeholder="Financial Analysis, Strategic Management, Business Analytics"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
            </div>

            {/* Key Highlight */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Key Highlight Banner Text
              </label>
              <Input
                {...register('highlight')}
                type="text"
                placeholder="e.g. Organized 10+ Entrepreneurship & Startup Incubation Workshops"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
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
              {faculty?.id ? 'Update Faculty' : 'Save Faculty'}
            </Button>
          </div>
        </form>
      </Scrollbars>
    </div>
  );
};

export default FacultyDrawer;
