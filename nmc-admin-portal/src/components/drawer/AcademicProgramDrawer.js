import React, { useContext, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Textarea, Input, Select, Button } from '@windmill/react-ui';
import { useForm } from 'react-hook-form';

import Title from '../form/Title';
import Error from '../form/Error';
import { SidebarContext } from '../../context/SidebarContext';
import AcademicProgramServices from '../../services/AcademicProgramServices';
import { notifyError, notifySuccess } from '../../utils/toast';

// Utility to clean raw fees value when populating form so no stray symbol remains
const cleanFeeValue = (val) => {
  if (!val) return '';
  return String(val).replace(/^[₹\sRs\.]+/i, '').trim();
};

const AcademicProgramDrawer = ({ id }) => {
  const { closeDrawer, setIsUpdate, isDrawerOpen } = useContext(SidebarContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  // Reset form when drawer opens to add new
  useEffect(() => {
    if (!id && isDrawerOpen) {
      reset({
        programType: 'ug',
        degreeBadge: 'UG DEGREE',
        shortTitle: '',
        fullName: '',
        duration: '',
        fees: '',
        status: 'active',
        description: '',
        highlightsText: '',
      });
      clearErrors();
    }
  }, [id, isDrawerOpen, reset, clearErrors]);

  // Fetch existing academic program for edit mode
  useEffect(() => {
    if (!id || !isDrawerOpen) return;

    AcademicProgramServices.getProgramById(id)
      .then((res) => {
        const data = res?.data || res?.program || res;
        if (data) {
          const rawFees = data.fees || data.fee || '';
          reset({
            programType: data.programType || 'ug',
            degreeBadge: data.degreeBadge || '',
            shortTitle: data.shortTitle || data.shortName || '',
            fullName: data.fullName || '',
            duration: data.duration || '',
            fees: cleanFeeValue(rawFees),
            status: data.status || 'active',
            description: data.description || '',
            highlightsText: Array.isArray(data.highlights)
              ? data.highlights.join('\n')
              : data.highlights || '',
          });
          clearErrors();
        }
      })
      .catch((err) => {
        notifyError(err.response?.data?.message || err.message || 'Failed to fetch program details');
      });
  }, [id, isDrawerOpen, reset, clearErrors]);

  // Auto-fill degreeBadge based on programType if user hasn't set custom
  const handleProgramTypeChange = (e) => {
    const pType = e.target.value;
    if (pType === 'ug') setValue('degreeBadge', 'UG DEGREE');
    else if (pType === 'pg') setValue('degreeBadge', 'PG DEGREE');
    else if (pType === 'diploma') setValue('degreeBadge', 'DIPLOMA');
    else setValue('degreeBadge', '');
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const highlightsArray = data.highlightsText
        ? data.highlightsText
            .split('\n')
            .map((h) => h.trim())
            .filter((h) => h.length > 0)
        : [];

      const cleanFee = cleanFeeValue(data.fees);

      const payload = {
        programType: data.programType,
        degreeBadge: data.degreeBadge?.trim(),
        shortTitle: data.shortTitle?.trim(),
        fullName: data.fullName?.trim(),
        description: data.description?.trim(),
        highlights: highlightsArray,
        duration: data.duration?.trim(),
        fees: cleanFee,
        status: data.status || 'active',
      };

      if (id) {
        const res = await AcademicProgramServices.updateProgram(id, payload);
        notifySuccess(res?.message || 'Academic program updated successfully!');
      } else {
        const res = await AcademicProgramServices.addProgram(payload);
        notifySuccess(res?.message || 'Academic program created successfully!');
      }

      setIsUpdate(true);
      closeDrawer();
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        if (Array.isArray(backendErrors)) {
          backendErrors.forEach((errorItem) => {
            if (errorItem.param) {
              setError(errorItem.param, {
                type: 'manual',
                message: errorItem.msg || errorItem.message,
              });
            }
          });
        } else if (typeof backendErrors === 'object') {
          Object.keys(backendErrors).forEach((field) => {
            setError(field, {
              type: 'manual',
              message: backendErrors[field]?.message || backendErrors[field],
            });
          });
        }
        notifyError(err.response?.data?.message || 'Validation error, please check the form fields');
      } else {
        notifyError(
          err.response?.data?.message || err.message || 'Failed to save academic program'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full justify-between bg-white dark:bg-gray-800">
      {/* Drawer Header */}
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 shrink-0">
        {id ? (
          <Title title="Update Academic Program" description="Update academic program course details below" />
        ) : (
          <Title title="Add Academic Program" description="Add a new academic course master record below" />
        )}
      </div>

      {/* Form with Flex Column layout */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 justify-between">
        {/* Scrollable Form Body */}
        <Scrollbars
          autoHide
          className="w-full flex-1 relative dark:bg-gray-700 dark:text-gray-200"
        >
          <div className="p-6 space-y-4">
            {/* Program Type & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Program Type <span className="text-red-500">*</span>
                </label>
                <Select
                  {...register('programType', { required: 'Program type is required' })}
                  name="programType"
                  onChange={handleProgramTypeChange}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
                >
                  <option value="ug">Undergraduate (UG)</option>
                  <option value="pg">Postgraduate (PG)</option>
                  <option value="diploma">Diploma / Vocational</option>
                </Select>
                <Error errorName={errors.programType} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <Select
                  {...register('status', { required: 'Status is required' })}
                  name="status"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
                <Error errorName={errors.status} />
              </div>
            </div>

            {/* Short Title & Degree Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Short Title <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('shortTitle', { required: 'Short title is required' })}
                  name="shortTitle"
                  type="text"
                  placeholder="e.g. B.B.A., B.C.A., M.B.A."
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
                />
                <Error errorName={errors.shortTitle} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Degree Badge
                </label>
                <Input
                  {...register('degreeBadge')}
                  name="degreeBadge"
                  type="text"
                  placeholder="e.g. UG DEGREE, PG DEGREE"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
                />
                <Error errorName={errors.degreeBadge} />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('fullName', { required: 'Full name is required' })}
                name="fullName"
                type="text"
                placeholder="e.g. Bachelor of Business Administration"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.fullName} />
            </div>

            {/* Duration & Fees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Duration <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('duration', { required: 'Duration is required' })}
                  name="duration"
                  type="text"
                  placeholder="e.g. 3 Years (6 Sems)"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
                />
                <Error errorName={errors.duration} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Fees <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-md shadow-xs overflow-hidden border border-gray-200 dark:border-gray-600 focus-within:border-red-800">
                  <span className="inline-flex items-center px-3 text-sm font-semibold bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-600 select-none">
                    ₹
                  </span>
                  <input
                    {...register('fees', { required: 'Fees is required' })}
                    name="fees"
                    type="text"
                    placeholder="e.g. 8,000 / Sem"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none"
                  />
                </div>
                <Error errorName={errors.fees} />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                Program Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register('description', { required: 'Description is required' })}
                name="description"
                rows="3"
                placeholder="Comprehensive corporate leadership training covering marketing strategy, corporate finance, and business management."
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.description} />
            </div>

            {/* Highlights (1 point per line) */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                Key Highlights (1 point per line)
              </label>
              <Textarea
                {...register('highlightsText')}
                name="highlightsText"
                rows="4"
                placeholder={"Strategic Marketing & Human Resources\nFinancial Analysis & Corporate Law\nExecutive Presentation & 100% Internships"}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Enter each highlight bullet on a new line.
              </p>
              <Error errorName={errors.highlightsText} />
            </div>
          </div>
        </Scrollbars>

        {/* Drawer Footer Buttons (Pinned to Bottom without overlap) */}
        <div className="w-full py-4 lg:py-6 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 shrink-0">
          <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
            <Button
              onClick={closeDrawer}
              className="h-12 bg-white w-full text-red-500 hover:bg-red-50 hover:border-red-100 hover:text-red-600 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-red-700"
              layout="outline"
              type="button"
            >
              Cancel
            </Button>
          </div>
          <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-red-800 hover:bg-red-900 text-white"
            >
              {id ? 'Update Program' : 'Add Program'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AcademicProgramDrawer;
