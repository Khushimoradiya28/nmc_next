import React, { useState, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Input } from "@windmill/react-ui";
import Title from "../form/Title";
import DrawerButton from "../form/DrawerButton";

const BannerDrawer = ({ open, onClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    status: true,
  });

  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        image: editData.image || "",
        status: editData.status !== undefined ? editData.status : true,
      });
      setUploadedFile(null);
    } else {
      setFormData({
        title: "",
        image: "",
        status: true,
      });
      setUploadedFile(null);
    }
  }, [editData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    const localUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      image: localUrl,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...formData,
        id: editData ? editData.id : Date.now(),
        image: formData.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
        updated_at: new Date().toISOString().replace("T", " ").substring(0, 16),
        created_at: editData ? editData.created_at : new Date().toISOString().replace("T", " ").substring(0, 16),
      });
    }
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col w-full h-full justify-between bg-white dark:bg-gray-800">
      {/* Top Drawer Header matching Gallery & Testimonial Drawer */}
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          title={editData ? "Update Banner Image" : "Add Banner Image"}
          description={
            editData
              ? "Update slide title and image for homepage hero slider"
              : "Add slide title and image for the homepage hero slider"
          }
        />
      </div>

      {/* Drawer Form Body */}
      <Scrollbars className="w-full relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit} className="block p-6 pb-36 space-y-6">
          {/* Admin Internal Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Orientation Program 2026"
              required
              className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-3"
            />
          </div>

          {/* Banner Image File Uploader */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Banner Image <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center mt-1">
              <label className="bg-red-50 text-red-800 text-xs font-semibold px-4 py-2.5 rounded-md hover:bg-red-100 cursor-pointer border-none transition-colors inline-block shadow-xs">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-3 truncate max-w-[220px]">
                {uploadedFile ? uploadedFile.name : "No file chosen"}
              </span>
            </div>

            {formData.image && (
              <div className="mt-4 relative inline-block">
                <img
                  src={formData.image}
                  alt="Banner Preview"
                  className="w-48 h-28 object-cover rounded-md border border-gray-200 dark:border-gray-600 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Fixed Bottom Action Bar */}
          <DrawerButton id={editData?.id} title="Banner Image" />
        </form>
      </Scrollbars>
    </div>
  );
};

export default BannerDrawer;
