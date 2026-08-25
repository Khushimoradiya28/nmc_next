import React, { useContext, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Textarea, Select, Input } from '@windmill/react-ui';
import { useForm } from 'react-hook-form';

import Title from '../form/Title';
import Error from '../form/Error';
import DrawerButton from '../form/DrawerButton';
import Uploader from '../image-uploader/Uploader';
import { SidebarContext } from '../../context/SidebarContext';
import TestimonialServices from '../../services/TestimonialServices';
import { notifyError, notifySuccess } from '../../utils/toast';

const TestimonialDrawer = ({ id }) => {
  const { closeDrawer, setIsUpdate, isDrawerOpen } = useContext(SidebarContext);

  // Default selected testimonial type is "dignitary" (Dignitary Testimonials)
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
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: 'dignitary',
      rating: 5,
    },
  });

  // Reset form when drawer opens/closes or when adding new
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

  // Fetch existing testimonial for update
  useEffect(() => {
    if (!id || !isDrawerOpen) return;

    TestimonialServices.getTestimonialById(id)
      .then((res) => {
        const item = res?.data;
        if (!item) {
          notifyError('Testimonial details not found!');
          return;
        }

        const currentType = item.type || 'dignitary';
        setTestimonialType(currentType);
        setImageUrl(item.avatarUrl || '');

        reset({
          type: currentType,
          title: item.title || '',
          authorName: item.authorName || '',
          designationSubtext: item.designationSubtext || '',
          quote: item.quote || '',
          rating: item.rating || 5,
          avatarUrl: item.avatarUrl || '',
        });
      })
      .catch((err) => notifyError(err.message || 'Failed to fetch testimonial data'));
  }, [id, isDrawerOpen, reset]);

  // Handle dropdown change for Testimonial Type
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setTestimonialType(selectedType);
    setValue('type', selectedType);
    clearErrors();
  };

  // Form submission handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        type: testimonialType,
        authorName: data.authorName?.trim(),
        designationSubtext: data.designationSubtext?.trim(),
        quote: data.quote?.trim(),
        avatarUrl: imageUrl || data.avatarUrl || '',
        title: testimonialType === 'dignitary' ? data.title?.trim() : '',
        rating: testimonialType === 'student' ? Number(data.rating || 5) : 5,
      };

      if (id) {
        const res = await TestimonialServices.updateTestimonial(id, payload);
        notifySuccess(res.message || 'Testimonial updated successfully!');
      } else {
        const res = await TestimonialServices.addTestimonial(payload);
        notifySuccess(res.message || 'Testimonial created successfully!');
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
          
          {/* First Field: Testimonial Type Dropdown (Top Priority) */}
          <div className="mb-6 flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Testimonial Type <span className="text-red-500">*</span>
            </label>
            <Select
              {...register('type', { required: 'Please select testimonial type' })}
              value={testimonialType}
              onChange={handleTypeChange}
              className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-3"
            >
              <option value="dignitary">Dignitary Testimonials</option>
              <option value="student">Student Testimonials</option>
            </Select>
            <Error errorName={errors.type} />
          </div>

          <hr className="mb-6 border-gray-200 dark:border-gray-600" />

          {/* DIGNITARY TESTIMONIAL FIELDS */}
          {testimonialType === 'dignitary' && (
            <>
              {/* Dignitary Headline / Title */}
              <div className="mb-5 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Headline / Title <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('title', {
                    required: testimonialType === 'dignitary' ? 'Title is required for dignitary testimonial' : false,
                  })}
                  type="text"
                  placeholder="e.g. A BENCHMARK FOR WOMEN'S HIGHER EDUCATION."
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-3"
                />
                <Error errorName={errors.title} />
              </div>

              {/* Dignitary Name */}
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

              {/* Designation / Organization */}
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

              {/* Testimonial Quote / Message */}
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

              {/* Dignitary Image Uploader */}
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
              {/* Student Name */}
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

              {/* Course / Designation / Subtext */}
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

              {/* Rating (Stars) */}
              <div className="mb-5 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <Select
                  {...register('rating')}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-3"
                >
                  <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                  <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                  <option value={3}>3 Stars ⭐⭐⭐</option>
                  <option value={2}>2 Stars ⭐⭐</option>
                  <option value={1}>1 Star ⭐</option>
                </Select>
                <Error errorName={errors.rating} />
              </div>

              {/* Testimonial Quote / Message */}
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

              {/* Student Photo / Avatar */}
              <div className="mb-5 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Student Photo / Avatar
                </label>
                <Uploader
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  setUploadedFile={setUploadedFile}
                />
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
