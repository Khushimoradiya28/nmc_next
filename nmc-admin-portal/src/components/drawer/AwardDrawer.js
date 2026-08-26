import React, { useContext, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Textarea, Input } from '@windmill/react-ui';
import { useForm } from 'react-hook-form';

import Title from '../form/Title';
import Error from '../form/Error';
import DrawerButton from '../form/DrawerButton';
import Uploader from '../image-uploader/Uploader';
import { SidebarContext } from '../../context/SidebarContext';
import AwardServices from '../../services/AwardServices';
import { notifyError, notifySuccess } from '../../utils/toast';

const AwardDrawer = ({ id }) => {
  const { closeDrawer, setIsUpdate, isDrawerOpen } = useContext(SidebarContext);

  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  // Reset form when drawer opens/closes or when adding new
  useEffect(() => {
    if (!id && isDrawerOpen) {
      setImageUrl('');
      reset({
        title: '',
        description: '',
        imageUrl: '',
      });
      clearErrors();
    }
  }, [id, isDrawerOpen, reset, clearErrors]);

  // Fetch existing award for edit mode
  useEffect(() => {
    if (!id || !isDrawerOpen) return;

    AwardServices.getAwardById(id)
      .then((res) => {
        if (res && res.data) {
          const data = res.data;
          setValue('title', data.title || '');
          setValue('description', data.description || '');
          setImageUrl(data.imageUrl || '');
        }
      })
      .catch((err) => {
        notifyError(err.message || 'Failed to fetch award details');
      });
  }, [id, isDrawerOpen, setValue]);

  // Form submit handler
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const payload = {
        title: data.title ? data.title.trim() : '',
        description: data.description ? data.description.trim() : '',
        imageUrl: imageUrl || '',
      };

      if (!payload.title) {
        notifyError('Award title is required');
        setIsSubmitting(false);
        return;
      }

      if (!payload.description) {
        notifyError('Award description is required');
        setIsSubmitting(false);
        return;
      }

      if (id) {
        const res = await AwardServices.updateAward(id, payload);
        notifySuccess(res.message || 'Award updated successfully!');
      } else {
        const res = await AwardServices.addAward(payload);
        notifySuccess(res.message || 'Award created successfully!');
      }

      setIsUpdate(true);
      closeDrawer();
    } catch (err) {
      notifyError(
        err.response?.data?.message || err.message || 'Failed to save award'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full justify-between bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title title="Update Award & Certificate" description="Update award details below" />
        ) : (
          <Title title="Add Award & Certificate" description="Add new award and certificate details below" />
        )}
      </div>

      {/* Drawer Content */}
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="block p-6">
          <div className="space-y-5">
            {/* Award Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Award Title <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('title', {
                  required: 'Award title is required',
                })}
                name="title"
                type="text"
                placeholder="e.g. Campus Infrastructure Award"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.title} />
            </div>

            {/* Award Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Description / Subtext <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register('description', {
                  required: 'Description is required',
                })}
                name="description"
                rows="4"
                placeholder="e.g. Modern facilities, equipped labs, and student-friendly campus."
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.description} />
            </div>

            {/* Award Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Award Image
              </label>
              <Uploader imageUrl={imageUrl} setImageUrl={setImageUrl} />
            </div>
          </div>

          {/* Drawer Footer Buttons */}
          <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
            <DrawerButton id={id} title="Award" isSubmitting={isSubmitting} />
          </div>
        </form>
      </Scrollbars>
    </div>
  );
};

export default AwardDrawer;
