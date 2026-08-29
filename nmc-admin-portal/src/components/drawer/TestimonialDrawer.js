import React, { useState, useEffect, useContext } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useForm } from 'react-hook-form';
import { Input, Textarea } from '@windmill/react-ui';

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
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: 'dignitary',
      title: '',
      authorName: '',
      designationSubtext: '',
      quote: '',
      rating: 5,
    },
  });

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
      });
      clearErrors();
    }
  }, [id, isDrawerOpen, reset, clearErrors]);

  useEffect(() => {
    if (!id || !isDrawerOpen) return;

    TestimonialServices.getTestimonialById(id)
      .then((res) => {
        const item = res?.data || res;
        if (!item) return;

        const currentType = (item.type || 'dignitary').toLowerCase();
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
          rating: item.rating ? Number(item.rating) : 5,
        });
      })
      .catch((err) => {
        notifyError(
          err?.response?.data?.message ||
            err.message ||
            'Failed to fetch testimonial details'
        );
      });
  }, [id, isDrawerOpen, reset]);

  const handleTypeChange = (selectedVal) => {
    setTestimonialType(selectedVal);
    setValue('type', selectedVal);
    clearErrors();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', testimonialType);
      formData.append('authorName', data.authorName?.trim() || '');
      formData.append('designationSubtext', data.designationSubtext?.trim() || '');
      formData.append('quote', data.quote?.trim() || '');
      formData.append('isActive', 'true');

      if (testimonialType === 'dignitary') {
        formData.append('title', data.title?.trim() || '');
      } else {
        formData.append('rating', String(data.rating || 5));
      }

      if (uploadedFile && typeof uploadedFile === 'object') {
        formData.append('avatar', uploadedFile);
      } else if (imageUrl && !imageUrl.startsWith('blob:')) {
        formData.append('avatarUrl', imageUrl);
      }

      if (id) {
        const res = await TestimonialServices.updateTestimonial(id, formData);
        notifySuccess(res?.message || 'Testimonial updated successfully!');
      } else {
        const res = await TestimonialServices.addTestimonial(formData);
        notifySuccess(res?.message || 'Testimonial added successfully!');
      }

      setIsUpdate(true);
      closeDrawer();
    } catch (err) {
      notifyError(
        err?.response?.data?.message ||
          err.message ||
          'An error occurred while saving the testimonial'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          title={id ? 'Edit Testimonial' : 'Add Testimonial'}
          description={
            id
              ? 'Update existing dignitary or student testimonial'
              : 'Add a new dignitary or student testimonial to the portal'
          }
        />
      </div>

      <Scrollbars className="w-full relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="block p-6 pb-36">
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
                    { label: '5 Stars ★★★★★', value: 5 },
                    { label: '4 Stars ★★★★', value: 4 },
                    { label: '3 Stars ★★★', value: 3 },
                    { label: '2 Stars ★★', value: 2 },
                    { label: '1 Star ★', value: 1 },
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
