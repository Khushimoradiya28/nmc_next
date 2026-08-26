import React, { useContext, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Textarea, Input } from '@windmill/react-ui';
import { useForm } from 'react-hook-form';

import Title from '../form/Title';
import Error from '../form/Error';
import DrawerButton from '../form/DrawerButton';
import Uploader from '../image-uploader/Uploader';
import { SidebarContext } from '../../context/SidebarContext';
import CourseServices from '../../services/CourseServices';
import { notifyError, notifySuccess } from '../../utils/toast';

const CourseDrawer = ({ id }) => {
  const { closeDrawer, setIsUpdate, isDrawerOpen } = useContext(SidebarContext);

  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  // Reset form when drawer opens to add new
  useEffect(() => {
    if (!id && isDrawerOpen) {
      setImageUrl('');
      setUploadedFile(null);
      reset({
        title: '',
        category: '',
        badge: '',
        duration: '',
        fees: '',
        description: '',
        highlightsText: '',
        enrollUrl: '',
      });
      clearErrors();
    }
  }, [id, isDrawerOpen, reset, clearErrors]);

  // Fetch existing course for update mode
  useEffect(() => {
    if (!id || !isDrawerOpen) return;

    CourseServices.getCourseById(id)
      .then((res) => {
        const data = res?.data || res;
        if (data) {
          reset({
            title: data.title || '',
            category: data.category || '',
            badge: data.badge || '',
            duration: data.duration || '',
            fees: data.fees || '',
            description: data.description || '',
            enrollUrl: data.enrollUrl || '',
            highlightsText: Array.isArray(data.highlights) ? data.highlights.join('\n') : '',
          });

          // Backend returns imageUrl, image, image_url, or images
          const fetchedImage =
            data.imageUrl ||
            data.image ||
            data.image_url ||
            (Array.isArray(data.images) && data.images[0]) ||
            '';
          setImageUrl(fetchedImage);
          setUploadedFile(null);
          clearErrors();
        }
      })
      .catch((err) => {
        notifyError(err.message || 'Failed to fetch course details');
      });
  }, [id, isDrawerOpen, reset, clearErrors]);


  // Submit handler matching exact user specification
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const highlightsArray = data.highlightsText
        ? data.highlightsText
            .split('\n')
            .map((h) => h.trim())
            .filter((h) => h.length > 0)
        : [];

      const formData = new FormData();
      formData.append('title', data.title ? data.title.trim() : '');
      formData.append('category', data.category ? data.category.trim() : '');
      formData.append('description', data.description ? data.description.trim() : '');
      formData.append('duration', data.duration ? data.duration.trim() : '');
      formData.append('fees', data.fees ? data.fees.trim() : '');
      if (data.badge) formData.append('badge', data.badge.trim());
      if (data.enrollUrl) formData.append('enrollUrl', data.enrollUrl.trim());
      if (highlightsArray.length > 0) formData.append('highlights', JSON.stringify(highlightsArray));

      // If user uploaded a new file
      if (uploadedFile) {
        formData.append('image', uploadedFile); // File instance from input
      } else if (imageUrl && typeof imageUrl === 'string' && !imageUrl.startsWith('blob:')) {
        formData.append('imageUrl', imageUrl);
      }


      if (id) {
        const res = await CourseServices.updateCourse(id, formData);
        notifySuccess(res?.message || 'Course updated successfully!');
      } else {
        const res = await CourseServices.addCourse(formData);
        notifySuccess(res?.message || 'Course created successfully!');
      }

      setIsUpdate(true);
      closeDrawer();
    } catch (err) {
      notifyError(
        err.response?.data?.message || err.message || 'Failed to save course'
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
          <Title title="Update Professional Course" description="Update course details below" />
        ) : (
          <Title title="Add Professional Course" description="Add new certificate course details below" />
        )}
      </div>

      {/* Drawer Content */}
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="block p-6">
          <div className="space-y-4">
            {/* Course Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                Course Title <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('title', {
                  required: 'Course title is required',
                })}
                name="title"
                type="text"
                placeholder="e.g. Tally ERP & GST Accounting"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.title} />
            </div>

            {/* Category & Badge */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Category Badge
                </label>
                <Input
                  {...register('category')}
                  name="category"
                  type="text"
                  placeholder="e.g. ACCOUNTING & FINANCE"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Badge / Tag
                </label>
                <Input
                  {...register('badge')}
                  name="badge"
                  type="text"
                  placeholder="e.g. Popular / High Demand"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
                />
              </div>
            </div>

            {/* Duration & Fees */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Duration
                </label>
                <Input
                  {...register('duration')}
                  name="duration"
                  type="text"
                  placeholder="e.g. 6 Months"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Fees
                </label>
                <Input
                  {...register('fees')}
                  name="fees"
                  type="text"
                  placeholder="e.g. Rs. 8,000/Sem."
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
                />
              </div>
            </div>

            {/* Enroll / Admission Link URL */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                Enroll / Admission URL
              </label>
              <Input
                {...register('enrollUrl')}
                name="enrollUrl"
                type="text"
                placeholder="e.g. https://admission.example.com"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                Description / Overview <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register('description', {
                  required: 'Description is required',
                })}
                name="description"
                rows="3"
                placeholder="e.g. Comprehensive computerized accounting, corporate taxation, and live GST return filing practice."
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
              <Error errorName={errors.description} />
            </div>

            {/* Highlights (Bullet Points) */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                Key Highlights (1 point per line)
              </label>
              <Textarea
                {...register('highlightsText')}
                name="highlightsText"
                rows="3"
                placeholder="TallyPrime & Inventory Management&#10;GST Invoicing, E-Way & Tax Audits&#10;Practical Accounting Live Projects"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:border-red-800 focus:outline-none dark:bg-gray-700 dark:text-gray-200 text-sm bg-gray-50"
              />
            </div>

            {/* Course Image */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                Course Cover Image
              </label>
              <Uploader
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                setUploadedFile={setUploadedFile}
              />
            </div>
          </div>

          {/* Drawer Footer Buttons */}
          <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
            <DrawerButton id={id} title="Course" isSubmitting={isSubmitting} />
          </div>
        </form>
      </Scrollbars>
    </div>
  );
};

export default CourseDrawer;
