import React, { useContext, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Textarea, Input } from '@windmill/react-ui';
import { useForm } from 'react-hook-form';

import Title from '../form/Title';
import Error from '../form/Error';
import DrawerButton from '../form/DrawerButton';
import CustomSelect from '../form/CustomSelect';
import Uploader from '../image-uploader/Uploader';
import { SidebarContext } from '../../context/SidebarContext';
import TestimonialServices from '../../services/TestimonialServices';
import { notifyError, notifySuccess } from '../../utils/toast';

const TestimonialDrawer = ({ id }) => {
  const { closeDrawer, setIsUpdate, isDrawerOpen } = useContext(SidebarContext);

  const [testimonialType, setTestimonialType] = useState('dignitary');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: 'dignitary',
      rating: 5,
    },
  });

  // Reset form when drawer opens to add new
  useEffect(() => {
    if (!id && isDrawerOpen) {
      setTestimonialType('dignitary');
      setImageUrl('');
      setUploadedFile(null);
      reset({
        type: 'dignitary',
        title: '',
        authorName: '',
        designationSubtext: '',
        quote: '',
        rating: 5,
        avatarUrl: '',
      });
      clearErrors();
    }
  }, [id, isDrawerOpen, reset, clearErrors]);

  // Fetch existing testimonial for update mode
  useEffect(() => {
    if (!id || !isDrawerOpen) return;

    TestimonialServices.getTestimonialById(id)
      .then((res) => {
        const item = res?.data || res;
        if (!item) {
          notifyError('Testimonial details not found!');
          return;
        }

        const currentType = item.type || 'dignitary';
        setTestimonialType(currentType);

        const fetchedAvatar =
          item.avatarUrl ||
          item.avatar ||
          item.imageUrl ||
          item.image ||
          item.image_url ||
          (Array.isArray(item.images) && item.images[0]) ||
          '';
        setImageUrl(fetchedAvatar);
        setUploadedFile(null);

        reset({
          type: currentType,
          title: item.title || '',
          authorName: item.authorName || '',
          designationSubtext: item.designationSubtext || '',
          quote: item.quote || '',
          rating: item.rating || 5,
          avatarUrl: fetchedAvatar,
        });
      })
      .catch((err) => notifyError(err.message || 'Failed to fetch testimonial data'));
  }, [id, isDrawerOpen, reset]);

  // Handle dropdown change for Testimonial Type
  const handleTypeChange = (selectedVal) => {
    setTestimonialType(selectedVal);
    setValue('type', selectedVal);
    clearErrors();
  };

  // Form submission handler matching exact user specification
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let payload;

      if (testimonialType === 'student') {
        payload = {
          type: 'student',
          authorName: data.authorName?.trim() || '',
          designationSubtext: data.designationSubtext?.trim() || '',
          rating: Number(data.rating || 5),
          quote: data.quote?.trim() || '',
          avatarUrl: imageUrl || data.avatarUrl || '',
          isActive: true,
        };
      } else {
        payload = {
          type: 'dignitary',
          title: data.title?.trim() || '',
          authorName: data.authorName?.trim() || '',
          designationSubtext: data.designationSubtext?.trim() || '',
          quote: data.quote?.trim() || '',
          avatarUrl: imageUrl || data.avatarUrl || '',
          isActive: true,
        };
      }

      if (id) {
        const res = await TestimonialServices.updateTestimonial(id, payload);
        notifySuccess(res?.message || 'Testimonial updated successfully!');
      } else {
        const res = await TestimonialServices.addTestimonial(payload);
        notifySuccess(res?.message || 'Testimonial created successfully!');
      }

      setIsUpdate(true);
      closeDrawer();
    } catch (err) {
      console.error('Testimonial submission error:', err);
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to save testimonial';
      notifyError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          title={id ? 'Update Testimonial' : 'Add Testimonial'}
          description={
            id
              ? 'Update testimonial information and details here'
              : 'Select testimonial type and add all required details below'
          }
        />
      </div>

      <Scrollbars className="w-full relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="block p-6 pb-36">
          {/* Testimonial Type Dropdown */}
          <div className="mb-6 flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Testimonial Type <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              name="type"
              register={register}
              required
              value={testimonialType}
              onChange={handleTypeChange}
              options={[
                { label: 'Dignitary Testimonials', value: 'dignitary' },
                { label: 'Student Testimonials', value: 'student' },
              ]}
            />
            <Error errorName={errors.type} />
          </div>

          <hr className="mb-6 border-gray-200 dark:border-gray-600" />

          {/* DIGNITARY TESTIMONIAL FIELDS */}
          {testimonialType === 'dignitary' && (
            <>
              <div className="mb-5 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Headline / Title <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('title', {
                    required: 'Title is required for dignitary testimonial',
                  })}
                  type="text"
                  placeholder="e.g. A BENCHMARK FOR WOMEN'S HIGHER EDUCATION."
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-3"
                />
                <Error errorName={errors.title} />
              </div>

              <div className="mb-5 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Dignitary Name <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('authorName', { required: 'Dignitary name is required' })}
                  type="text"
                  placeholder="e.g. Dr. Rajesh Patel / Vice Chancellor"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-3"
                />
                <Error errorName={errors.authorName} />
              </div>

              <div className="mb-5 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Designation / Subtext <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('designationSubtext', { required: 'Designation is required' })}
                  type="text"
                  placeholder="e.g. M.K. Bhavnagar University / Education Board Member"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-3"
                />
                <Error errorName={errors.designationSubtext} />
              </div>

              <div className="mb-5 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Testimonial Quote <span className="text-red-500">*</span>
                </label>
                <Textarea
                  {...register('quote', { required: 'Testimonial quote is required' })}
                  rows="4"
                  placeholder="e.g. Nandkunvarba Mahila College has set a benchmark for women's higher education..."
                  className="border text-sm p-3 focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md"
                />
                <Error errorName={errors.quote} />
              </div>

              <div className="mb-5 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Profile Photo / Image
                </label>
                <Uploader
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  setUploadedFile={setUploadedFile}
                />
              </div>
            </>
          )}

          {/* STUDENT TESTIMONIAL FIELDS */}
          {testimonialType === 'student' && (
            <>
              <div className="mb-5 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('authorName', { required: 'Student name is required' })}
                  type="text"
                  placeholder="e.g. Priyaba Gohil / Kavita Rathod"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-3"
                />
                <Error errorName={errors.authorName} />
              </div>

              <div className="mb-5 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Course / Subtext <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('designationSubtext', { required: 'Course/subtext is required' })}
                  type="text"
                  placeholder="e.g. BCA Alumna (Batch 2024) / BBA Student"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-3"
                />
                <Error errorName={errors.designationSubtext} />
              </div>

              <div className="mb-5 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  name="rating"
                  register={register}
                  value={watch ? watch('rating') || 5 : 5}
                  onChange={(val) => setValue('rating', val)}
                  options={[
                    { label: '5 Stars ⭐⭐⭐⭐⭐', value: 5 },
                    { label: '4 Stars ⭐⭐⭐⭐', value: 4 },
                    { label: '3 Stars ⭐⭐⭐', value: 3 },
                    { label: '2 Stars ⭐⭐', value: 2 },
                    { label: '1 Star ⭐', value: 1 },
                  ]}
                />
                <Error errorName={errors.rating} />
              </div>

              <div className="mb-5 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Testimonial Quote <span className="text-red-500">*</span>
                </label>
                <Textarea
                  {...register('quote', { required: 'Testimonial quote is required' })}
                  rows="4"
                  placeholder="e.g. The free bus pick-up service gave my parents complete peace of mind..."
                  className="border text-sm p-3 focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md"
                />
                <Error errorName={errors.quote} />
              </div>
            </>
          )}

          <DrawerButton id={id} title="Testimonial" disabled={isSubmitting} />
        </form>
      </Scrollbars>
    </>
  );
};

export default React.memo(TestimonialDrawer);
