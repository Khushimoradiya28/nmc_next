import React, { useState, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Input, Textarea } from "@windmill/react-ui";
import Title from "../form/Title";
import DrawerButton from "../form/DrawerButton";
import CustomSelect from "../form/CustomSelect";

const categoryOptions = [
  { label: "Campus & Labs", value: "Campus & Labs" },
  { label: "Events & Culture", value: "Events & Culture" },
  { label: "Video Highlights", value: "Video Highlights" },
];

const GalleryDrawer = ({ open, onClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    badgeTitle: "",
    category: "Campus & Labs",
    mediaType: "image",
    mediaUrl: "",
    thumbnail: "",
    description: "",
    status: true,
  });

  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (editData) {
      setFormData({
        badgeTitle: editData.badgeTitle || editData.title || "",
        category: editData.category || "Campus & Labs",
        mediaType: editData.mediaType || "image",
        mediaUrl: editData.mediaUrl || "",
        thumbnail: editData.thumbnail || "",
        description: editData.description || "",
        status: editData.status !== undefined ? editData.status : true,
      });
      setUploadedFile(null);
    } else {
      setFormData({
        badgeTitle: "",
        category: "Campus & Labs",
        mediaType: "image",
        mediaUrl: "",
        thumbnail: "",
        description: "",
        status: true,
      });
      setUploadedFile(null);
    }
  }, [editData, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    const localUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      mediaUrl: localUrl,
      thumbnail: prev.mediaType === "image" ? localUrl : prev.thumbnail,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...formData,
        id: editData ? editData.id : Date.now(),
        title: formData.badgeTitle, // Use badgeTitle as primary title fallback
        thumbnail: formData.thumbnail || formData.mediaUrl,
        updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        createdAt: editData ? editData.createdAt : new Date().toISOString().replace("T", " ").substring(0, 16),
      });
    }
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col w-full h-full justify-between bg-white dark:bg-gray-800">
      {/* Top Drawer Header matching Testimonial & Course Drawer */}
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          title={editData ? "Update Gallery Media" : "Add Gallery Media"}
          description={
            editData
              ? "Update existing photo or video media item details below"
              : "Add a new photo or video item to the photo & video gallery"
          }
        />
      </div>

      {/* Drawer Form Body */}
      <Scrollbars className="w-full relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit} className="block p-6 pb-36 space-y-5">
          {/* Media Type Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Media Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, mediaType: "image" }))}
                className={`py-2.5 px-4 rounded-md border text-sm font-semibold transition-all ${
                  formData.mediaType === "image"
                    ? "border-red-700 bg-red-50 text-red-800 dark:bg-gray-700 dark:text-red-400 shadow-xs"
                    : "border-gray-200 text-gray-600 dark:border-gray-600 dark:text-gray-400 bg-gray-50"
                }`}
              >
                Photo Image
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, mediaType: "video" }))}
                className={`py-2.5 px-4 rounded-md border text-xs font-semibold transition-all ${
                  formData.mediaType === "video"
                    ? "border-red-700 bg-red-50 text-red-800 dark:bg-gray-700 dark:text-red-400 shadow-xs"
                    : "border-gray-200 text-gray-600 dark:border-gray-600 dark:text-gray-400 bg-gray-50"
                }`}
              >
                Video Tour
              </button>
            </div>
          </div>

          {/* Reusable Custom Category Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Gallery Category <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              options={categoryOptions}
              value={formData.category}
              onChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}
              heightClass="h-12"
              textSize="text-sm"
              width="w-full"
            />
          </div>

          {/* Badge Tag Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Badge Tag Title <span className="text-red-500">*</span>
            </label>
            <Input
              name="badgeTitle"
              value={formData.badgeTitle}
              onChange={handleChange}
              placeholder="e.g. Campus, IT Lab, Video Tour, Studio"
              required
              className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-3"
            />
          </div>

          {/* Choose File Uploader */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {formData.mediaType === "video" ? "Video File" : "Image File"} <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center mt-1">
              <label className="bg-red-50 text-red-800 text-xs font-semibold px-4 py-2.5 rounded-md hover:bg-red-100 cursor-pointer border-none transition-colors inline-block shadow-xs">
                Choose File
                <input
                  type="file"
                  accept={formData.mediaType === "video" ? "video/*" : "image/*"}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-3 truncate max-w-[220px]">
                {uploadedFile ? uploadedFile.name : "No file chosen"}
              </span>
            </div>

            {formData.mediaUrl && (
              <div className="mt-3 relative inline-block">
                {formData.mediaType === "video" ? (
                  <video src={formData.mediaUrl} className="w-24 h-24 object-cover rounded-md border border-gray-200 dark:border-gray-600 shadow-xs bg-black" />
                ) : (
                  <img src={formData.mediaUrl} alt="Preview" className="w-24 h-24 object-cover rounded-md border border-gray-200 dark:border-gray-600 shadow-xs" />
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description / Details
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter description about this media item..."
              className="border text-sm p-3 focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md"
            />
          </div>

          {/* Fixed Bottom Action Bar */}
          <DrawerButton id={editData?.id} title="Gallery Media" />
        </form>
      </Scrollbars>
    </div>
  );
};

export default GalleryDrawer;
