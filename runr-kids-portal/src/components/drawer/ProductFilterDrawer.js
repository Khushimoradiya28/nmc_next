import React, { useContext, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Select from "react-select";
import { Button } from '@windmill/react-ui';
import Title from '../form/Title';
import LabelArea from '../form/LabelArea';
import { SidebarContext } from '../../context/SidebarContext';
import CategoryServices from '../../services/CategoryServices';
import BrandServices from '../../services/master/BrandService';
import CharacterServices from '../../services/master/CharacterService';
import { notifyError } from '../../utils/toast';
import { ThemeContext } from "../../context/ThemeContext";
import { useForm } from "react-hook-form";


// React-Select MULTISELECT COMPONENT

const MultiSelect = ({
  options = [],
  value = [],
  onChange,
  labelKey = "name",
  valueKey = "_id",
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark' || theme === true;

  const formatted = options.map((item) => ({
    value: item[valueKey],
    label:
      item[labelKey] ||
      item.category_name ||
      item.brand_name ||
      item.character_name ||
      item.tag_name ||
      item.age_name ||
      item.parent,
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
            ? (isDark ? "#374151" : "#edf2f7")
            : "transparent",
          color: isDark ? "#fff" : "#374151",
        }),
      }}
      menuPortalTarget={document.body}
      menuPosition={'fixed'}
    />
  );
};

// React-Select SINGLE SELECT COMPONENT

const SingleSelect = ({
  options = [],
  value = null,
  onChange,
  labelKey = "name",
  valueKey = "_id",
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark' || theme === true;

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
            ? (isDark ? "#374151" : "#edf2f7")
            : "transparent",
          color: isDark ? "#fff" : "#374151",
        }),
      }}
      menuPortalTarget={document.body}
      menuPosition={'fixed'}
    />
  );
};

const FilterDrawer = ({ setFilter, setCategoryType, filter, onReset }) => {
  const { closefilterDrawer } = useContext(SidebarContext);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [characters, setCharacters] = useState([]);

  const attributesForm = useForm({
    defaultValues: {
      categoryidlist: filter.categoryidlist || [],
      brand_id: filter.brand_id || [],
      characteridlist: filter.characteridlist || [],
      stock_status: filter.is_stock === 1 ? "in_stock" : filter.is_stock === 0 ? "out_of_stock" : "",
      price_sort: filter.sort_by === "offer_price" && filter.sort_order === "asc" ? "low_to_high" :
        filter.sort_by === "offer_price" && filter.sort_order === "desc" ? "high_to_low" : "",
    }
  });

  // Sync when parent filter changes
  useEffect(() => {
    attributesForm.reset({
      categoryidlist: filter.categoryidlist || [],
      brand_id: filter.brand_id || [],
      characteridlist: filter.characteridlist || [],
      stock_status: filter.is_stock === 1 ? "in_stock" : filter.is_stock === 0 ? "out_of_stock" : "",
      price_sort: filter.sort_by === "offer_price" && filter.sort_order === "asc" ? "low_to_high" :
        filter.sort_by === "offer_price" && filter.sort_order === "desc" ? "high_to_low" : "",
    });
  }, [filter]);

  // Fetch categories, brands, characters
  useEffect(() => {
    CategoryServices.getAllFilterCategory()
      .then((res) => setCategories(res.data || []))
      .catch((err) => notifyError(err.message || String(err)));

    BrandServices.getAllBrands()
      .then((res) => setBrands(res.data || []))
      .catch((err) => notifyError(err.message || String(err)));

    CharacterServices.getAllCharacters()
      .then((res) => setCharacters(res.data || []))
      .catch((err) => notifyError(err.message || String(err)));
  }, []);

  // Apply Filter
  const handleApplyFilter = () => {
    const data = attributesForm.getValues();
    const final = {
      categoryidlist: data.categoryidlist.length ? data.categoryidlist : "",
      brand_id: data.brand_id.length ? data.brand_id : "",
      characteridlist: data.characteridlist.length ? data.characteridlist : "",
      is_stock: data.stock_status === "in_stock" ? 1 :
        data.stock_status === "out_of_stock" ? 0 : null,
      sort_by: data.price_sort === "low_to_high" || data.price_sort === "high_to_low" ? "offer_price" : "",
      sort_order: data.price_sort === "low_to_high" ? "asc" :
        data.price_sort === "high_to_low" ? "desc" : "",
    };
    setFilter(final);
    closefilterDrawer();
  };

  // Reset Filter
  const handleResetFilter = () => {
    attributesForm.reset({
      categoryidlist: [],
      brand_id: [],
      characteridlist: [],
      stock_status: "",
      price_sort: "",
    });

    setFilter({
      categoryidlist: "",
      brand_id: "",
      characteridlist: "",
      is_stock: null,
      sort_by: "",
      sort_order: "",
    });

    onReset && onReset();
  };

  return (
    <div className="flex flex-col w-full h-full justify-between">
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title title="Filters" />
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <div className="px-6 pt-8 pb-8 w-full">
          {/* Category Filter */}
          <div className="grid grid-cols-6 gap-6 mb-6">
            {/* <LabelArea label="Category" /> */}
            <label className="col-span-2 mt-2 text-gray-800 dark:text-gray-200 font-medium text-lg">
                Category
            </label>
            <div className="col-span-4 mt-2">
              <MultiSelect
                options={categories}
                value={attributesForm.watch("categoryidlist") || []}
                onChange={(v) => attributesForm.setValue("categoryidlist", v)}
                labelKey="category_name"
                valueKey="_id"
              />
            </div>
          </div>

          {/* Brand Filter */}
          <div className="grid grid-cols-6 gap-6 mb-6">
            {/* <LabelArea label="Brand" /> */}
            <label className="col-span-2 mt-2 text-gray-800 dark:text-gray-200 font-medium text-lg">
                Brand
            </label>
            <div className="col-span-4 mt-2">
              <MultiSelect
                options={brands}
                value={attributesForm.watch("brand_id") || []}
                onChange={(v) => attributesForm.setValue("brand_id", v)}
                labelKey="brand_name"
                valueKey="_id"
              />
            </div>
          </div>

          {/* Character Filter */}
          <div className="grid grid-cols-6 gap-6 mb-6">
            {/* <LabelArea label="Character" /> */}
            <label className="col-span-2 mt-2 text-gray-800 dark:text-gray-200 font-medium text-lg">
                Character
            </label>
            <div className="col-span-4 mt-2">
              <MultiSelect
                options={characters}
                value={attributesForm.watch("characteridlist") || []}
                onChange={(v) => attributesForm.setValue("characteridlist", v)}
                labelKey="character_name"
                valueKey="_id"
              />
            </div>
          </div>

          {/* Stock Filter */}
          <div className="grid grid-cols-6 gap-6 mb-6">
            {/* <LabelArea label="Stock" /> */}
            <label className="col-span-2 mt-2 text-gray-800 dark:text-gray-200 font-medium text-lg">
                Stock
            </label>
            <div className="col-span-4 mt-2">
              <SingleSelect
                options={[
                  { _id: "in_stock", brand_name: "In Stock" },
                  { _id: "out_of_stock", brand_name: "Out of Stock" }
                ]}
                value={attributesForm.watch("stock_status") || null}
                onChange={(v) => attributesForm.setValue("stock_status", v)}
                labelKey="brand_name"
                valueKey="_id"
              />
            </div>
          </div>

          {/* Price Filter */}
          <div className="grid grid-cols-6 gap-6 mb-6">
            {/* <LabelArea label="Price" /> */}
            <label className="col-span-2 mt-2 text-gray-800 dark:text-gray-200 font-medium text-lg">
                Price
            </label>
            <div className="col-span-4 mt-2">
              <SingleSelect
                options={[
                  { _id: "low_to_high", brand_name: "Low to High" },
                  { _id: "high_to_low", brand_name: "High to Low" }
                ]}
                value={attributesForm.watch("price_sort") || null}
                onChange={(v) => attributesForm.setValue("price_sort", v)}
                labelKey="brand_name"
                valueKey="_id"
              />
            </div>
          </div>
        </div>
      </Scrollbars>

      <div className="w-full py-4 lg:py-6 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
          <Button
            onClick={handleResetFilter}
            layout="outline"
            className="h-12 w-full"
          >
            Reset Filter
          </Button>
        </div>
        <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
          <Button onClick={handleApplyFilter} className="w-full h-12">
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FilterDrawer);
