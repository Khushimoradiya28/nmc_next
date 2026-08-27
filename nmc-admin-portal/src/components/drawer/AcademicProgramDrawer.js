import React, { useContext, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Textarea, Input, Button } from '@windmill/react-ui';
import { useForm } from 'react-hook-form';

import Title from '../form/Title';
import Error from '../form/Error';
import DrawerButton from '../form/DrawerButton';
import CustomSelect from '../form/CustomSelect';
import { SidebarContext } from '../../context/SidebarContext';
import { notifySuccess } from '../../utils/toast';

const CATEGORY_OPTIONS = [
  { label: 'Select Category', value: '' },
  { label: 'Undergraduate (UG)', value: 'UG' },
  { label: 'Postgraduate (PG)', value: 'PG' },
  { label: 'Diploma & Vocational', value: 'Diploma' },
];

const AcademicProgramDrawer = ({ program, onSave }) => {
  const { closeDrawer, isDrawerOpen } = useContext(SidebarContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (program && isDrawerOpen) {
      setValue('shortName', program.shortName || '');
      setValue('fullName', program.fullName || '');
      setValue('description', program.description || '');
      setValue('highlights', Array.isArray(program.highlights) ? program.highlights.join('\n') : program.highlights || '');
      setValue('duration', program.duration || '');
      setValue('fee', program.fee || '');
      setSelectedCategory(program.category || '');
    } else if (!program && isDrawerOpen) {
      reset({
        shortName: '',
        fullName: '',
        description: '',
        highlights: '',
        duration: '',
        fee: '',
      });
      setSelectedCategory('');
      clearErrors();
    }
  }, [program, isDrawerOpen, reset, setValue, clearErrors]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const programData = {
        id: program?.id || Date.now(),
        shortName: data.shortName?.trim(),
        fullName: data.fullName?.trim(),
        category: selectedCategory,
        description: data.description?.trim(),
        highlights: data.highlights
          ? data.highlights.split('\n').map((s) => s.trim()).filter(Boolean)
          : [],
        duration: data.duration?.trim(),
        fee: data.fee?.trim(),
        icon: program?.icon || 'briefcase',
      };

      if (onSave) {
        onSave(programData);
      }

      notifySuccess(program?.id ? 'Program updated successfully!' : 'Program added successfully!');
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
        {program?.id ? (
          <Title title="Update Academic Program" description="Update program details below" />
        ) : (
          <Title title="Add Academic Program" description="Add a new academic program below" />
        )}
      </div>

      {/* Drawer Body Scroll */}
      <Scrollbars className="w-full relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="block p-6 pb-32">
          <div className="space-y-5">
            {/* Program Category - FIRST FIELD */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Program Category <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                options={CATEGORY_OPTIONS}
                value={selectedCategory}
                onChange={(val) => setSelectedCategory(val)}
                placeholder="Select Category"
              />
            </div>

            {/* Short Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Short Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('shortName', { required: 'Short name is required' })}
                type="text"
                placeholder="e.g. B.B.A., B.C.A., M.Com"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.shortName} />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('fullName', { required: 'Full name is required' })}
                type="text"
                placeholder="e.g. Bachelor of Business Administration"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.fullName} />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register('description', { required: 'Description is required' })}
                rows="3"
                placeholder="Comprehensive corporate leadership training covering marketing, strategy, corporate finance, and business management."
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.description} />
            </div>

            {/* Highlights (1 point per line) */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Key Highlights (1 point per line) <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register('highlights', { required: 'At least one highlight is required' })}
                rows="4"
                placeholder={"Strategic Marketing & Human Resources\nFinancial & Corporate Law\nExecutive Presentation & Internships"}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Enter each highlight on a new line
              </p>
              <Error errorName={errors.highlights} />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Duration <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('duration', { required: 'Duration is required' })}
                type="text"
                placeholder="e.g. 3 Years (6 Sems)"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.duration} />
            </div>

            {/* Fee */}
            <div className="pb-8">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Fee
              </label>
              <Input
                {...register('fee')}
                type="text"
                placeholder="e.g. ₹8,000 / Sem or Affordable Fee"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
            </div>


          </div>

          {/* Submit Buttons */}
          <div className="mt-6 pb-10">
            <DrawerButton
              id={program?.id}
              title="Program"
              isSubmitting={isSubmitting}
            />
          </div>
        </form>
      </Scrollbars>
    </div>
  );
};

export default AcademicProgramDrawer;
