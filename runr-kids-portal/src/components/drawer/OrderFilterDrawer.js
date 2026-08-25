import React, { useContext, useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Select from "react-select";
import { Button } from "@windmill/react-ui";
import Title from "../form/Title";
import LabelArea from "../form/LabelArea";
import { SidebarContext } from "../../context/SidebarContext";
import { notifyError } from "../../utils/toast";
import { useForm } from "react-hook-form";
import { ThemeContext } from "../../context/ThemeContext";
import Masteruserservices from "../../services/master/MasterUserService";
// import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/material_blue.css"; // you can change theme

// React-Select SINGLE SELECT COMPONENT
// -------------------------------------------------------------
const SingleSelect = ({
  options = [],
  value = null,
  onChange,
  labelKey = "name",
  valueKey = "_id",
  placeholder = "Select Type",
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark" || theme === true;

  // Format the options
  const formatted = options.map((item) => ({
    value: item[valueKey],
    label: item[labelKey] || item.name || "Unknown",
  }));

  // Find the currently selected option
  // // const selectedOption = formatted.find((f) => f.value === value) || null;
  // const selectedOption = value === "" || value === null
  //     ? null
  //     : formatted.find((f) => f.value === String(value)) || null;
  const selectedOption =
    value === "" || value === null || value === undefined
      ? null
      : formatted.find((f) => String(f.value) === String(value)) || null;

  return (
    <Select
      options={formatted}
      isMulti={false}
      closeMenuOnSelect={true}
      value={selectedOption}
      placeholder={placeholder}
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
          color: isDark ? "#9CA3AF" : "#9CA3AF",
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
      menuPosition="fixed"
    />
  );
};

const ORDER_STATUS_OPTIONS = [
  // { id: "", name: "Select Order Status" },
  { id: 0, name: "Pending" },
  { id: 1, name: "Completed" },
  { id: 2, name: "Confirmed" },
  { id: 3, name: "Cancelled" },
  { id: 4, name: "Shipped" },
  { id: 5, name: "Delivered" },
];

const OrderFilterDrawer = ({ setFilter, onReset, filter }) => {
  const { closeordersfilterDrawer } = useContext(SidebarContext);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);

        const res = await Masteruserservices.getAllBrands({});

        // ✅ API returns ARRAY directly
        if (Array.isArray(res?.data)) {
          const formattedUsers = res.data.map((user) => ({
            ...user,
            full_name:
              `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
              user.email ||
              user.mobile ||
              "Unknown User",
          }));

          setUsers(formattedUsers);
        } else {
          setUsers([]);
        }
      } catch (error) {
        notifyError("Failed to load users");
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Initialize react-hook-form

  // const attributesForm = useForm({
  //     defaultValues: {
  //         order_status: filter.order_status !== undefined ? Number(filter.order_status) : null,
  //         user_id: filter.user_id || null,
  //         from_date: filter.from_date || "",
  //         to_date: filter.to_date || "",
  //     },
  // });

  const attributesForm = useForm({
    defaultValues: {
      order_status:
        filter.order_status !== undefined && filter.order_status !== null
          ? filter.order_status
          : null,
      user_id: filter.user_id || null,
      from_date: filter.from_date || "",
      to_date: filter.to_date || "",
    },
  });

  const { register, handleSubmit, getValues, reset, watch, setValue } =
    attributesForm;

  // Watch order_status for dropdown
  const orderTypeValue = watch("order_status");

  // Apply Filter
  const handleApplyFilter = () => {
    const data = getValues();

    const final = {
      order_status: data.order_status ?? null,
      user_id: data.user_id ?? null, // ✅ ADD THIS
      from_date: data.from_date || "",
      to_date: data.to_date || "",
    };

    setFilter(final);
    closeordersfilterDrawer();
  };

  // Reset Filter from parent
  // useEffect(() => {
  //     reset({
  //         order_status: filter.order_status !== undefined ? Number(filter.order_status) : null,
  //         user_id: filter.user_id || null,
  //         from_date: filter.from_date || "",
  //         to_date: filter.to_date || "",
  //     });
  // }, [filter, reset]);

  useEffect(() => {
    reset({
      order_status:
        filter.order_status !== undefined && filter.order_status !== null
          ? filter.order_status
          : null,
      user_id: filter.user_id || null,
      from_date: filter.from_date || "",
      to_date: filter.to_date || "",
    });
  }, [filter, reset]);

  return (
    <div className="flex flex-col w-full h-full justify-between">
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title title="Filters" />
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <div className="px-6 pt-8 pb-8 w-full">
          {/* Static Dropdown Filter */}
          <div className="grid grid-cols-6 gap-6 mb-6">
            <label className="col-span-2 mt-2 text-gray-800 dark:text-gray-200 font-medium text-lg">
              Order Status
            </label>
            <div className="col-span-4 mt-2">
              <SingleSelect
                options={ORDER_STATUS_OPTIONS}
                value={watch("order_status")}
                onChange={(val) => setValue("order_status", val)}
                labelKey="name"
                valueKey="id"
                placeholder="Select Order Status"
              />
            </div>
          </div>

          {/* User Filter */}
          <div className="grid grid-cols-6 gap-6 mb-6">
            <label className="col-span-2 mt-2 text-gray-800 dark:text-gray-200 font-medium text-lg">
              User
            </label>

            <div className="col-span-4 mt-2">
              <SingleSelect
                options={users}
                value={watch("user_id")}
                onChange={(val) => setValue("user_id", val)}
                labelKey="full_name"
                valueKey="_id"
                placeholder={loadingUsers ? "Loading users..." : "Select User"}
              />
            </div>
          </div>

          {/* From Date */}
          <div className="grid grid-cols-6 gap-6 mb-6">
            <label className="col-span-2 mt-2 text-gray-800 dark:text-gray-200 font-medium text-lg">
              From Date
            </label>
            <div className="col-span-4 mt-2">
              <input
                type="date"
                {...register("from_date")}
                className="w-full rounded px-3 py-2 dark:bg-gray-600 dark:text-gray-200"
                style={{
                  border: "1px solid hsl(0, 0%, 20%)",
                  backgroundColor: "transparent",
                }}
              />
            </div>
          </div>

          {/* <div className="grid grid-cols-6 gap-6 mb-6">
                        <label className="col-span-2 mt-2 text-gray-800 dark:text-gray-200 font-medium text-lg">
                            From Date
                        </label>

                        <div className="col-span-4 mt-2">
                            <Flatpickr
                                value={watch("from_date")}
                                options={{
                                    dateFormat: "Y-m-d",
                                    maxDate: watch("to_date") || null,
                                }}
                                onChange={(date) => {
                                    setValue(
                                        "from_date",
                                        date.length ? date[0].toISOString().slice(0, 10) : ""
                                    );
                                }}
                                className="w-full rounded px-3 py-2 dark:bg-gray-600 dark:text-gray-200"
                                style={{
                                    border: "1px solid hsl(0, 0%, 20%)",
                                    backgroundColor: "transparent",
                                }}
                                placeholder="Select From Date"
                            />
                        </div>
                    </div> */}

          {/* To Date */}
          <div className="grid grid-cols-6 gap-6 mb-6">
            <label className="col-span-2 mt-2 text-gray-800 dark:text-gray-200 font-medium text-lg">
              To Date
            </label>
            <div className="col-span-4 mt-2">
              <input
                type="date"
                {...register("to_date")}
                className="w-full rounded px-3 py-2 dark:bg-gray-600 dark:text-gray-200"
                style={{
                  border: "1px solid hsl(0, 0%, 20%)",
                  backgroundColor: "transparent",
                }}
              />
            </div>
          </div>

          {/* <div className="grid grid-cols-6 gap-6 mb-6">
                        <label className="col-span-2 mt-2 text-gray-800 dark:text-gray-200 font-medium text-lg">
                            To Date
                        </label>

                        <div className="col-span-4 mt-2">
                            <Flatpickr
                                value={watch("to_date")}
                                options={{
                                    dateFormat: "Y-m-d",
                                    minDate: watch("from_date") || null,
                                }}
                                onChange={(date) => {
                                    setValue(
                                        "to_date",
                                        date.length ? date[0].toISOString().slice(0, 10) : ""
                                    );
                                }}
                                className="w-full rounded px-3 py-2 dark:bg-gray-600 dark:text-gray-200"
                                style={{
                                    border: "1px solid hsl(0, 0%, 20%)",
                                    backgroundColor: "transparent",
                                }}
                                placeholder="Select To Date"
                            />
                        </div>
                    </div> */}
        </div>
      </Scrollbars>
      <div className="w-full py-4 lg:py-6 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {/* <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                    <Button
                        onClick={handleResetFilter}
                        layout="outline"
                        className="h-12 w-full"
                    >
                        Reset Filter
                    </Button>
                </div> */}
        <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
          <Button onClick={handleApplyFilter} className="w-full h-12">
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OrderFilterDrawer);
