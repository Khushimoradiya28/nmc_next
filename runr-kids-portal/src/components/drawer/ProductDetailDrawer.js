import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { Textarea, Card, CardBody } from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Assume these imports are provided in your project
import Error from "../form/Error";
import LabelArea from "../form/LabelAreaProject";
import LabelAreacheckbox from "../form/LabelAreacheckbox";
import InputArea from "../form/InputArea";
import Teaxtarea from "../form/Teaxtarea";    
import { Button } from "@windmill/react-ui";
import ProductService from "../../services/ProductServices";
import { Controller } from "react-hook-form";

import { SidebarContext } from "../../context/SidebarContext";
import { notifySuccess, notifyError } from "../../utils/toast";
import GalleryService from "../../services/GalleryService";
import { Camera, Package, Tag, Search, Save, AlertCircle } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import PageTitle from "../../components/Typography/PageTitle";
import Breadcrumb from "../../components/form/Breadcrumb";

// -------------------------------------------------------------
// React-Select MULTISELECT COMPONENT
// -------------------------------------------------------------

const MultiSelect = ({
  options = [],
  value = [],
  onChange,
  labelKey = "name",
  valueKey = "_id",
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark" || theme === true;

  const formatted = options.map((item) => ({
    value: item[valueKey],
    label:
      item[labelKey] ||
      item.category_name ||
      item.brand_name ||
      item.character_name ||
      item.tag_name ||
      item.age_name,
  }));

  return (
    <Select
      options={formatted}
      isMulti
      closeMenuOnSelect={false}
      value={formatted.filter((f) => value.includes(f.value))}
      onChange={(selected) => {
        const ids = selected ? selected.map((s) => s.value) : [];
        onChange(ids);
      }}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        control: (base) => ({
          ...base,
          backgroundColor: "transparent",
          borderColor: isDark ? "#4B5563" : "#e2e8f0",
          color: isDark ? "#fff" : "#374151",
          boxShadow: "none",
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: isDark ? "#374151" : "#edf2f7",
          color: isDark ? "#fff" : "#374151",
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: isDark ? "#fff" : "#374151",
        }),
        placeholder: (base) => ({
          ...base,
          color: "#9CA3AF",
        }),
        singleValue: (base) => ({
          ...base,
          color: isDark ? "#fff" : "#374151",
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: isDark ? "#1F2937" : "#fff",
          color: isDark ? "#fff" : "#374151",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused
            ? isDark
              ? "#374151"
              : "#edf2f7"
            : "transparent",
          color: isDark ? "#fff" : "#374151",
        }),
      }}
      menuPortalTarget={document.body}
      menuPosition={"fixed"}
    />
  );
};

// -------------------------------------------------------------
// React-Select SINGLE SELECT COMPONENT
// -------------------------------------------------------------

const SingleSelect = ({
  options = [],
  value = null,
  onChange,
  labelKey = "name",
  valueKey = "_id",
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark" || theme === true;

  const formatted = options.map((item) => ({
    value: item[valueKey],
    label:
      item[labelKey] ||
      item.category_name ||
      item.brand_name ||
      item.character_name ||
      item.tag_name ||
      item.age_name ||
      item.color_name ||
      item.material_name ||
      item.commodity_name,
  }));

  const selectedOption = formatted.find((f) => f.value === value) || null;

  return (
    <Select
      options={formatted}
      isMulti={false}
      closeMenuOnSelect={true}
      value={selectedOption}
      onChange={(selected) => {
        const id = selected ? selected.value : null;
        onChange(id);
      }}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        control: (base) => ({
          ...base,
          backgroundColor: "transparent",
          borderColor: isDark ? "#4B5563" : "#e2e8f0",
          color: isDark ? "#fff" : "#374151",
          boxShadow: "none",
        }),
        singleValue: (base) => ({
          ...base,
          color: isDark ? "#fff" : "#374151",
        }),
        placeholder: (base) => ({
          ...base,
          color: "#9CA3AF",
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: isDark ? "#1F2937" : "#fff",
          color: isDark ? "#fff" : "#374151",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused
            ? isDark
              ? "#374151"
              : "#edf2f7"
            : "transparent",
          color: isDark ? "#fff" : "#374151",
        }),
      }}
      menuPortalTarget={document.body}
      menuPosition={"fixed"}
    />
  );
};

const ProjectDrawer = () => {
  const { id } = useParams();
  const { closeDrawer } = useContext(SidebarContext);
  const { theme: mode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("general");
  const [productDescription, setProductDescription] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm();
  // LISTS
  const [categoryList, setCategoryList] = useState([]);
  const [colorList, setColorList] = useState([]);
  const [intrestList, setIntrest] = useState([]);
  const [commudityList, setCommudity] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [characterList, setCharacterList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [ageList, setAgeList] = useState([]);

  // IMAGE STATES
  const [imagePreview, setImagePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  // SEPARATE FORMS FOR EACH TAB
  const generalForm = useForm({ mode: "onBlur" });
  const imagesForm = useForm({ mode: "onBlur" });
  const attributesForm = useForm({ mode: "onBlur" });
  const seoForm = useForm({ mode: "onBlur" });

  // --- FETCH LIST DATA ---
  useEffect(() => {
    const filterByStatusOne = (data) =>
      Array.isArray(data) ? data.filter((item) => item.status === 1) : [];

    ProductService.getAllCategories().then((res) =>
      setCategoryList(filterByStatusOne(res.data))
    );
    ProductService.getAllColor().then((res) =>
      setColorList(filterByStatusOne(res.data))
    );
    ProductService.getAllIntrest({}).then((res) =>
      setIntrest(filterByStatusOne(res.data))
    );
    ProductService.getAllCommudity().then((res) =>
      setCommudity(filterByStatusOne(res.data))
    );
    ProductService.getAllBrands().then((res) =>
      setBrandList(filterByStatusOne(res.data))
    );
    ProductService.getAllCharacters().then((res) =>
      setCharacterList(filterByStatusOne(res.data))
    );
    ProductService.getAllTags({}).then((res) =>
      setTagList(filterByStatusOne(res.data))
    );
    ProductService.getAllAges().then((res) =>
      setAgeList(filterByStatusOne(res.data))
    );
  }, []);

  // --- LOAD PRODUCT DATA FOR EDIT ---
  useEffect(() => {
    if (!id) return;

    ProductService.getAllProducts({ type: "product_detail", _id: id })
      .then((res) => {
        const d = res.data[0] || {};

        // FEATURE IMAGE
        if (d.product_img && typeof d.product_img === "string") {
          setImagePreview(d.product_img);
        } else {
          setImagePreview(null);
        }
        imagesForm.setValue("product_img", undefined);

        setGalleryImages(
          (d.gallery_images || []).map((img) => ({
            ...img,
            product_gallery_url: `${img.product_gallery_url}`,
          }))
        );

        // GENERAL FORM VALUES
        generalForm.setValue("product_name", d.product_name || "");
        generalForm.setValue("product_title", d.product_title || "");
        generalForm.setValue("product_sku", d.product_sku || "");
        generalForm.setValue("offer_price", d.offer_price || "");
        generalForm.setValue("actual_price", d.actual_price || "");
        generalForm.setValue("is_stock", d.is_stock == 1);
        generalForm.setValue("is_bestseller", d.is_bestseller == 1);
        generalForm.setValue("is_trending", d.is_trending == 1);
        generalForm.setValue(
          "product_short_description",
          d.product_short_description || ""
        );

        setProductDescription(d.product_description || "");
        generalForm.setValue(
          "product_description",
          d.product_description || ""
        );

        generalForm.setValue("package_content", d.package_content || "");
        generalForm.setValue("product_dimensions", d.product_dimensions || "");
        generalForm.setValue("product_weight", d.product_weight || "");
        generalForm.setValue("package_dimensions", d.package_dimensions || "");
        generalForm.setValue("net_quantity", d.net_quantity || "");
        generalForm.setValue("country_of_origin", d.country_of_origin || "");
        generalForm.setValue("manufacturer_name", d.manufacturer_name || "");
        generalForm.setValue(
          "manufacturer_address",
          d.manufacturer_address || ""
        );
        generalForm.setValue("marketer_name", d.marketer_name || "");
        generalForm.setValue("marketer_address", d.marketer_address || "");
        generalForm.setValue("stock_quantity", d.stock_quantity || 0 );
        generalForm.setValue("product_slug", d.product_slug || "");

        // ATTRIBUTES FORM VALUES
        attributesForm.setValue("color", d.color_id || null);
        attributesForm.setValue("material_id", d.material_id || null);
        attributesForm.setValue("commodity_id", d.commodity_id || null);
        attributesForm.setValue("brand_id", d.brand_id || null);
        attributesForm.setValue("category_id", d.category_id || []);
        attributesForm.setValue("character_id", d.character_id || []);
        attributesForm.setValue("tag_id", d.tag_id || []);
        attributesForm.setValue("age_id", d.age_id || []);

        // SEO FORM VALUES
        seoForm.setValue("seo_title", d.seo_title || "");
        seoForm.setValue("seo_keyword", d.seo_keyword || "");
        seoForm.setValue("seo_url", d.seo_url || "");
        seoForm.setValue("seo_canonical", d.seo_canonical || "");
      })
      .catch(() => notifyError("Failed to load product"));
  }, [id]);

  // ---------- FEATURE IMAGE handlers ----------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    imagesForm.setValue("product_img", e.target.files, {
      shouldValidate: true,
    });
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    imagesForm.setValue("product_img", undefined);
    const fileInput = document.getElementById("product_img_input");
    if (fileInput) fileInput.value = "";
  };

  // ---------- GALLERY upload handlers ----------
  const handleGallerySelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsGalleryUploading(true);

    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("product_id", id);
        fd.append("product_gallery_url", file);

        const response = await GalleryService.addGallery(fd);
        if (response.data && response.data[0]) {
          setGalleryImages((prev) => [
            ...prev,
            ...response.data.map((img) => ({
              ...img,
              product_gallery_url: `${process.env.REACT_APP_BASE_URL}/${img.product_gallery_url}`,
            })),
          ]);
        }
      }

      notifySuccess("Gallery upload complete");
    } catch (err) {
      notifyError(err?.response?.data?.message || "Gallery upload failed");
    } finally {
      setIsGalleryUploading(false);
      const galleryInput = document.getElementById("product_gallery_input");
      if (galleryInput) galleryInput.value = "";
    }
  };

  // ---------- DELETE GALLERY IMAGE ----------
  const handleDeleteGallery = async (galleryId) => {
    if (!galleryId) return;

    try {
      await GalleryService.deleteGallery(galleryId);
      notifySuccess("Image deleted");

      setGalleryImages((prev) => prev.filter((img) => img._id !== galleryId));
    } catch (err) {
      notifyError(
        err?.response?.data?.message || "Failed to delete gallery image"
      );
    }
  };

  // -------------------------------------------------------------
  // SUBMIT HANDLERS FOR EACH TAB
  // -------------------------------------------------------------

  // 1. GENERAL INFO SUBMIT
  const onSubmitGeneral = (data) => {
    const formData = new FormData();

    formData.append("product_name", data.product_name || "");
    formData.append("product_title", data.product_title || "");
    formData.append("product_sku", data.product_sku || "");
    formData.append("offer_price", data.offer_price || "");
    formData.append("actual_price", data.actual_price || "");
    formData.append("is_stock", data.is_stock ? "1" : "0");
    formData.append("is_bestseller", data.is_bestseller ? "1" : "0");
    formData.append("is_trending", data.is_trending ? "1" : "0");
    formData.append(
      "product_short_description",
      data.product_short_description || ""
    );
    formData.append("product_description", data.product_description || "");
    formData.append("package_content", data.package_content || "");
    formData.append("product_dimensions", data.product_dimensions || "");
    formData.append("product_weight", data.product_weight || "");
    formData.append("package_dimensions", data.package_dimensions || "");
    formData.append("net_quantity", data.net_quantity || "");
    formData.append("country_of_origin", data.country_of_origin || "");
    formData.append("manufacturer_name", data.manufacturer_name || "");
    formData.append("manufacturer_address", data.manufacturer_address || "");
    formData.append("marketer_name", data.marketer_name || "");
    formData.append("marketer_address", data.marketer_address || "");
    formData.append("stock_quantity", data.stock_quantity || 0 );
    formData.append("product_slug", data.product_slug || "");

    const token = localStorage.getItem("adminToken");

    ProductService.UpdateProduct(id, formData, token)
      .then(() => {
        notifySuccess("Product Info Updated Successfully!");
      })
      .catch((err) =>
        notifyError(err?.message || "Failed to update product info")
      );
  };

  // 2. IMAGES SUBMIT
  const onSubmitImages = (data) => {
    const formData = new FormData();

    if (data.product_img && data.product_img.length > 0) {
      formData.append("product_img", data.product_img[0]);
    } else if (id && !imagePreview) {
      formData.append("remove_product_img", "true");
    }

    const token = localStorage.getItem("adminToken");

    ProductService.UpdateProduct(id, formData, token)
      .then(() => {
        notifySuccess("Product Image Updated Successfully!");
      })
      .catch((err) =>
        notifyError(err?.message || "Failed to update product image")
      );
  };

  // 3. ATTRIBUTES SUBMIT
  const onSubmitAttributes = (data) => {
    const formData = new FormData();

    formData.append("color", data.color || "");
    formData.append("material_id", data.material_id || "");
    formData.append("commodity_id", data.commodity_id || "");
    formData.append("brand_id", data.brand_id || "");

    // CATEGORY
    if (Array.isArray(data.category_id)) {
      if (data.category_id.length === 0) {
        formData.append("category_list", "__EMPTY__");
      } else {
        data.category_id.forEach((v) => formData.append("category_list[]", v));
      }
    }

    // CHARACTER
    if (Array.isArray(data.character_id)) {
      if (data.character_id.length === 0) {
        formData.append("character_list", "__EMPTY__");
      } else {
        data.character_id.forEach((v) =>
          formData.append("character_list[]", v)
        );
      }
    }

    // TAG
    if (Array.isArray(data.tag_id)) {
      if (data.tag_id.length === 0) {
        formData.append("tag_list", "__EMPTY__");
      } else {
        data.tag_id.forEach((v) => formData.append("tag_list[]", v));
      }
    }

    // AGE
    if (Array.isArray(data.age_id)) {
      if (data.age_id.length === 0) {
        formData.append("age_list", "__EMPTY__");
      } else {
        data.age_id.forEach((v) => formData.append("age_list[]", v));
      }
    }

    const token = localStorage.getItem("adminToken");

    ProductService.UpdateProduct(id, formData, token)
      .then(() => {
        notifySuccess("Product Attributes Updated Successfully!");
      })
      .catch((err) =>
        notifyError(err?.message || "Failed to update product attributes")
      );
  };

  // 4. SEO SUBMIT
  const onSubmitSEO = (data) => {
    const formData = new FormData();

    formData.append("seo_title", data.seo_title || "");
    formData.append("seo_keyword", data.seo_keyword || "");
    formData.append("seo_url", data.seo_url || "");
    formData.append("seo_canonical", data.seo_canonical || "");

    const token = localStorage.getItem("adminToken");

    ProductService.UpdateProduct(id, formData, token)
      .then(() => {
        notifySuccess("SEO Details Updated Successfully!");
      })
      .catch((err) =>
        notifyError(err?.message || "Failed to update SEO details")
      );
  };

  const tabs = [
    { id: "general", label: "Product Info", icon: Package },
    { id: "images", label: "Media Assets", icon: Camera },
    { id: "attributes", label: "Attributes", icon: Tag },
    { id: "content", label: "SEO & Content", icon: Search },
  ];

  // --- UI ---
  return (
    <div className="w-full grid">
      {/* <Card> */}
      <CardBody>
        {/* ➤ ADD THIS BLOCK */}
        <div className="flex flex-col text-left w-full sm:w-auto">
          <PageTitle>Product Details</PageTitle>
          <Breadcrumb
            items={[
              { label: "Products", link: "/products" },
              { label: "Product Details" },
            ]}
          />
        </div>

        {/* --- TAB NAVIGATION --- */}
        <div className="flex border-b border-gray-700 mb-6 mt-2">
          {["general", "images", "attributes", "content"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`py-2 px-4 text-sm font-medium bg-transparent focus:outline-none focus:ring-0 active:bg-transparent ${
                activeTab === tab
                  ? "border-b-2 border-green-500 text-green-500"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "general" && "Product Info"}
              {tab === "images" && "Product Assets"}
              {tab === "attributes" && "Product Attributes"}
              {tab === "content" && "SEO"}
            </button>
          ))}
        </div>

        {/* <form onSubmit={handleSubmit(onSubmit)} className="mb-6"> */}

        {/* 1. GENERAL INFO */}
        {activeTab === "general" && (
          <form onSubmit={generalForm.handleSubmit(onSubmitGeneral)}>
            <>
              {/* ... (same as your original general tab UI) ... */}
              <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-white">
                Product Details
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <LabelArea label="Product Name" />
                  <InputArea
                    register={generalForm.register}
                    required
                    name="product_name"
                    placeholder="Product Name"
                  />
                  <Error
                    errorName={generalForm.formState.errors.product_name}
                  />
                </div>

                <div>
                  <LabelArea label="Product Title" />
                  <InputArea
                    register={generalForm.register}
                    name="product_title"
                    required
                    placeholder="Product Title"
                  />
                  <Error
                    errorName={generalForm.formState.errors.product_title}
                  />
                </div>

                <div>
                  <LabelArea label="SKU Code" />
                  <InputArea
                    register={generalForm.register}
                    name="product_sku"
                    required
                    placeholder="Product SKU"
                  />
                  <Error errorName={generalForm.formState.errors.product_sku} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div
                  onClick={() => {
                    const title = generalForm.getValues("product_title") || "";

                    const slug = title
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "");

                    generalForm.setValue("product_slug", slug, {
                      shouldValidate: true,
                    });
                  }}
                >
                  <LabelArea label="Slug" />
                  <InputArea
                    register={generalForm.register}
                    name="product_slug"
                    placeholder="Product Slug"
                    readOnly
                    value={generalForm.watch("product_slug") || ""}
                  />
                </div>

                {/* <div>
                      <LabelArea label="Stock Quantity" />
                      <InputArea 
                        register={generalForm.register}
                        name="stock_quantity" 
                        type="number"
                        placeholder="Stock Quantity" 
                        min={0}
                      />
                      <Error errorName={generalForm.formState.errors.stock_quantity} />
                    </div> */}
                <div>
                  <LabelArea label="Stock Quantity" />
                  <InputArea
                    register={generalForm.register}
                    name="stock_quantity"
                    type="number"
                    placeholder="Stock Quantity"
                  />
                  <Error
                    errorName={generalForm.formState.errors.stock_quantity}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 mb-6">
                <LabelArea label="Short Description" />
                <Textarea
                  register={generalForm.register}
                  name="product_short_description"
                  placeholder="A brief summary..."
                  value={generalForm.watch("product_short_description")}
                  onChange={(e) =>
                    generalForm.setValue(
                      "product_short_description",
                      e.target.value,
                      { shouldValidate: true }
                    )
                  }
                />
                {/* <Teaxtarea {...generalForm.register("product_short_description",{ required: true })} rows={3} placeholder="A brief summary of the product..." /> */}
                <Error
                  errorName={
                    generalForm.formState.errors.product_short_description
                  }
                />
              </div>

              <div className="grid grid-cols-1 mb-6">
                <LabelArea label="Detailed Product Description" />
                <ReactQuill
                  theme="snow"
                  value={productDescription}
                  onChange={(value) => {
                    setProductDescription(value);
                    generalForm.setValue("product_description", value, {
                      shouldValidate: true,
                    });
                  }}
                  placeholder="Full, detailed product information, features, and specifications."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      [{ color: [] }, { background: [] }],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "list",
                    "bullet",
                    "link",
                    "image",
                    "color",
                    "background",
                  ]}
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
                  style={{ minHeight: "200px" }}
                />

                <Error
                  errorName={generalForm.formState.errors.product_description}
                />
              </div>

              {/* Logistics fields (kept minimal for brevity; same as your original) */}
              <div className="grid grid-cols-4 gap-4 mb-6 py-8">
                <div>
                  <LabelArea label="Dimensions" />
                  <InputArea
                    register={generalForm.register}
                    name="product_dimensions"
                    placeholder="e.g., 10x5x3 cm"
                  />
                </div>
                <div>
                  <LabelArea label="Weight" />
                  <InputArea
                    register={generalForm.register}
                    name="product_weight"
                    placeholder="e.g., 0.5 kg"
                  />
                </div>
                <div>
                  <LabelArea label="Net Quantity" />
                  <InputArea
                    register={generalForm.register}
                    name="net_quantity"
                    placeholder="e.g., 1 piece"
                  />
                </div>
                <div>
                  <LabelArea label="Package Content" />
                  <InputArea
                    register={generalForm.register}
                    name="package_content"
                    placeholder="List of items"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                {/* <div>
                      <LabelArea label="Actual Price" />
                      <InputArea type="number" register={generalForm.register} name="actual_price" placeholder="1234" min={0} />
                    </div>
                    <div>
                      <LabelArea label="Offer Price" />
                      <InputArea type="number" register={generalForm.register} name="offer_price" placeholder="999" min={0} />
                    </div> */}
                <div>
                  <LabelArea label="Actual Price" />
                  <InputArea
                    type="number"
                    register={(name, options) =>
                      generalForm.register(name, {
                        ...options,
                        min: {
                          value: 0,
                          message: "Actual price cannot be negative",
                        },
                      })
                    }
                    name="actual_price"
                    placeholder="1234"
                  />
                </div>

                <div>
                  <LabelArea label="Offer Price" />
                  <InputArea
                    type="number"
                    register={(name, options) =>
                      generalForm.register(name, {
                        ...options,
                        min: {
                          value: 0,
                          message: "Offer price cannot be negative",
                        },
                      })
                    }
                    name="offer_price"
                    placeholder="999"
                  />
                </div>

                <div className="col-span-2 mt-6 flex gap-x-8 gap-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...generalForm.register("is_stock")}
                      className="form-checkbox h-5 w-5 text-green-500"
                    />
                    <LabelAreacheckbox label="In Stock" />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...generalForm.register("is_bestseller")}
                      className="form-checkbox h-5 w-5 text-green-500"
                    />
                    <LabelAreacheckbox label="Bestseller" />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...generalForm.register("is_trending")}
                      className="form-checkbox h-5 w-5 text-green-500"
                    />
                    <LabelAreacheckbox label="Trending" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <LabelArea label="Manufacturer Name" />
                  <InputArea
                    register={generalForm.register}
                    name="manufacturer_name"
                    placeholder="Manufacturer's Name"
                  />
                </div>
                <div>
                  <LabelArea label="Marketer Name" />
                  <InputArea
                    register={generalForm.register}
                    name="marketer_name"
                    placeholder="Marketer's Name"
                  />
                </div>
                <div>
                  <LabelArea label="Country of Origin" />
                  <InputArea
                    register={generalForm.register}
                    name="country_of_origin"
                    placeholder="e.g., India"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <LabelArea label="Manufacturer Address" />

                  <Textarea
                    register={generalForm.register}
                    name="manufacturer_address"
                    value={generalForm.watch("manufacturer_address")}
                    onChange={(e) =>
                      generalForm.setValue(
                        "manufacturer_address",
                        e.target.value,
                        { shouldValidate: true }
                      )
                    }
                  />
                  <Error
                    errorName={
                      generalForm.formState.errors.manufacturer_address
                    }
                  />
                </div>

                <div>
                  <LabelArea label="Marketer Address" />

                  <Textarea
                    register={generalForm.register}
                    name="marketer_address"
                    value={generalForm.watch("marketer_address")}
                    onChange={(e) =>
                      generalForm.setValue("marketer_address", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                  />
                  <Error
                    errorName={generalForm.formState.errors.marketer_address}
                  />
                </div>
              </div>
            </>
          </form>
        )}

        {/* 2. IMAGES TAB */}
        {activeTab === "images" && (
          <form onSubmit={imagesForm.handleSubmit(onSubmitImages)}>
            <>
              <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-white">
                Product Assets
              </h3>

              {/* FEATURED IMAGE */}
              <div className="mb-6 rounded-lg p-4">
                <LabelArea label="Feature Image" />

                {imagePreview ? (
                  <div className="mt-4 relative w-40 h-40 border border-green-500 rounded-lg overflow-hidden">
                    <label
                      htmlFor="product_img_input"
                      className="w-full h-full block relative cursor-pointer group"
                      title="Click to Change Image"
                    >
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-150">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.218A2 2 0 0110.69 4h2.62a2 2 0 011.664.89l.812 1.218A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    </label>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-red-600 p-1 rounded-full text-white hover:bg-red-700 transition duration-150 z-10"
                      aria-label="Remove Image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    <input
                      id="product_img_input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="mt-2 w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-green-500 transition duration-200 cursor-pointer">
                    <input
                      id="product_img_input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="product_img_input"
                      className="flex flex-col items-center justify-center cursor-pointer text-gray-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 mb-2 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <p className="text-sm font-medium">
                        Drag 'n' drop or click to select a file
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </label>
                  </div>
                )}
                <Error errorName={imagesForm.formState.errors.product_img} />
              </div>

              {/* GALLERY UPLOAD */}
              <div className="mb-6 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <LabelArea label="Product Gallery" />

                {/* <div className="mt-2">
                  <input id="product_gallery_input" type="file" accept="image/*" multiple onChange={handleGallerySelect} />
                  {isGalleryUploading && <p className="text-sm text-yellow-400 mt-2">Uploading images...</p>}
                </div> */}

                {/* Upload Button */}
                <div className="mt-2">
                  <input
                    id="product_gallery_input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGallerySelect}
                    className="hidden"
                  />

                  <label
                    htmlFor="product_gallery_input"
                    className="
                    inline-flex items-center px-4 py-2 text-sm font-medium rounded cursor-pointer transition
                    bg-gray-100 text-gray-800 border border-gray-300
                    hover:bg-gray-200
                    dark:bg-gray-800 dark:text-white dark:border-gray-600
                    dark:hover:bg-gray-700"
                  >
                    Upload Gallery Images
                  </label>

                  {isGalleryUploading && (
                    <p className="text-sm text-yellow-500 dark:text-yellow-400 mt-2">
                      Uploading images...
                    </p>
                  )}
                </div>

                {/* GALLERY IMAGES GRID */}

                <div className="grid grid-cols-6 gap-3 mt-4">
                  {galleryImages.length > 0 ? (
                    galleryImages.map((g) => (
                      <div
                        key={g._id}
                        className="relative w-28 h-28 rounded-lg border overflow-hidden"
                        style={{ position: "relative" }} // <-- double safety
                      >
                        {/* IMAGE */}
                        <img
                          src={g.product_gallery_url}
                          alt="gallery"
                          className="w-full h-full object-cover"
                        />

                        {/* DELETE CROSS – forced visible */}
                        <button
                          type="button"
                          onClick={() => handleDeleteGallery(g._id)}
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            width: "20px",
                            height: "20px",
                            borderRadius: "10%",
                            backgroundColor: "red",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 999999, // <-- MAX FORCE
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-4 text-gray-400 text-sm text-center">
                      No gallery images uploaded yet.
                    </p>
                  )}
                </div>
              </div>
            </>
          </form>
        )}

        {/* 3. ATTRIBUTES TAB */}
        {activeTab === "attributes" && (
          <form onSubmit={attributesForm.handleSubmit(onSubmitAttributes)}>
            <>
              <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-white">
                Core Attributes
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <LabelArea label="Color" />
                  <SingleSelect
                    options={colorList}
                    value={attributesForm.watch("color") || null}
                    onChange={(v) => attributesForm.setValue("color", v)}
                    labelKey="color_name"
                    valueKey="_id"
                  />
                </div>

                <div>
                  <LabelArea label="Interest / Material" />
                  <SingleSelect
                    options={intrestList}
                    value={attributesForm.watch("material_id") || null}
                    onChange={(v) => attributesForm.setValue("material_id", v)}
                    labelKey="material_name"
                    valueKey="_id"
                  />
                </div>

                <div>
                  <LabelArea label="Commodity" />
                  <SingleSelect
                    options={commudityList}
                    value={attributesForm.watch("commodity_id") || null}
                    onChange={(v) => attributesForm.setValue("commodity_id", v)}
                    labelKey="commodity_name"
                    valueKey="_id"
                  />
                </div>

                <div>
                  <LabelArea label="Brands" />
                  <SingleSelect
                    options={brandList}
                    value={attributesForm.watch("brand_id") || null}
                    onChange={(v) => attributesForm.setValue("brand_id", v)}
                    labelKey="brand_name"
                    valueKey="_id"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-40">
                <div>
                  <LabelArea label="Categories" />
                  <MultiSelect
                    options={categoryList}
                    value={attributesForm.watch("category_id") || []}
                    onChange={(v) => attributesForm.setValue("category_id", v)}
                    labelKey="category_name"
                    valueKey="_id"
                  />
                </div>

                <div>
                  <LabelArea label="Age Group" />
                  <MultiSelect
                    options={ageList}
                    value={attributesForm.watch("age_id") || []}
                    onChange={(v) => attributesForm.setValue("age_id", v)}
                    labelKey="age_group"
                    valueKey="_id"
                  />
                </div>

                <div>
                  <LabelArea label="Characters" />
                  <MultiSelect
                    options={characterList}
                    value={attributesForm.watch("character_id") || []}
                    onChange={(v) => attributesForm.setValue("character_id", v)}
                    labelKey="character_name"
                    valueKey="_id"
                  />
                </div>

                <div>
                  <LabelArea label="Tags" />
                  <MultiSelect
                    options={tagList}
                    value={attributesForm.watch("tag_id") || []}
                    onChange={(v) => attributesForm.setValue("tag_id", v)}
                    labelKey="tag_name"
                    valueKey="_id"
                  />
                </div>
              </div>
            </>
          </form>
        )}

        {/* 4. SEO TAB */}
        {activeTab === "content" && (
          <form onSubmit={seoForm.handleSubmit(onSubmitSEO)}>
            <>
              <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-white">
                SEO Details
              </h3>
              <div className="grid grid-cols-1 mb-6">
                <LabelArea label="SEO Title" />
                <InputArea
                  register={seoForm.register}
                  name="seo_title"
                  placeholder="SEO Title"
                  required
                />
                <Error errorName={seoForm.formState.errors.seo_title} />
              </div>

              <div className="grid grid-cols-1 mb-6">
                <LabelArea label="SEO Keyword" />
                <InputArea
                  register={seoForm.register}
                  name="seo_keyword"
                  placeholder="SEO Keyword"
                />
                <Error errorName={seoForm.formState.errors.seo_keyword} />
              </div>

              <div className="grid grid-cols-1 mb-6">
                <LabelArea label="SEO URL" />
                <InputArea
                  register={seoForm.register}
                  name="seo_url"
                  placeholder="SEO URL"
                />
                <Error errorName={seoForm.formState.errors.seo_url} />
              </div>

              <div className="grid grid-cols-1 mb-6">
                <LabelArea label="SEO Canonical" />
                <InputArea
                  register={seoForm.register}
                  name="seo_canonical"
                  placeholder="SEO Canonical"
                />
                <Error errorName={seoForm.formState.errors.seo_canonical} />
              </div>
            </>
          </form>
        )}

        {/* <div className="mt-8 pt-4 border-t border-gray-700">
              <Button type="submit" className="h-12">{id ? <span>Update Product</span> : <span>Add Product</span>}</Button>
            </div> */}
        {/* MAIN SUBMIT BUTTON */}
        <div className="mt-8 pt-4 border-t border-gray-700">
          {activeTab === "general" && (
            <Button onClick={generalForm.handleSubmit(onSubmitGeneral)}>
              Submit
            </Button>
          )}
          {activeTab === "images" && (
            <Button onClick={imagesForm.handleSubmit(onSubmitImages)}>
              Submit
            </Button>
          )}
          {activeTab === "attributes" && (
            <Button onClick={attributesForm.handleSubmit(onSubmitAttributes)}>
              Submit
            </Button>
          )}
          {activeTab === "content" && (
            <Button onClick={seoForm.handleSubmit(onSubmitSEO)}>Submit</Button>
          )}
        </div>

        {/* </form> */}
      </CardBody>
      {/* </Card> */}
    </div>
  );
};

export default ProjectDrawer;
