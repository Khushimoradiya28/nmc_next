import React, { useContext, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useForm } from "react-hook-form";
import { SidebarContext } from "../../context/SidebarContext";
import DrawerButton from "../form/DrawerButton";
import Title from "../form/Title";
import Error from "../form/Error";
import Select from "react-select";
import { ThemeContext } from "../../context/ThemeContext";
import OrderService from "../../services/OrderServices";
import { notifyError, notifySuccess } from "../../utils/toast";

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

const statusOptions = [
    { value: 0, label: "Pending" },
    { value: 1, label: "Completed" },
    { value: 2, label: "Confirmed" },
    { value: 3, label: "Cancelled" },
    { value: 4, label: "Shipped" },
    { value: 5, label: "Delivered" },
];

const OrderStatusDrawer = ({ orderId, onUpdateSuccess }) => {
    const { closeDrawer, setIsUpdate } = useContext(SidebarContext);
    const { theme } = useContext(ThemeContext);

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    // // Load order status
    // useEffect(() => {
    //     if (!orderId) return;

    //     OrderService.getAllOrders1({ type: "order_list", id: orderId })
    //         .then((res) => {
    //             const order = res.data.find((o) => o._id === orderId) || res.data;
    //             if (order) setValue("order_status", order.order_status);
    //             else notifyError("Order not found");
    //         })
    //         .catch(() => notifyError("Failed to load order"));
    // }, [orderId, setValue]);


    // // ✅ UPDATE STATUS
    // const onSubmit = async (data) => {
    //     try {
    //         await OrderService.updateOrder(orderId, { order_status: data.order_status });

    //         notifySuccess("Order status updated successfully");
    //         setIsUpdate(true); // triggers parent table refresh
    //         closeDrawer();
    //     } catch (err) {
    //         notifyError("Update failed");
    //         console.error(err);
    //     }
    // };

    // 🔹 Load order status using /order/list API
    useEffect(() => {
        if (!orderId) return;

        OrderService.getAllOrders1({ type: "order_list", id: orderId })
            .then((res) => {
                const order = res.data.find((o) => o._id === orderId) || res.data;
                if (order) {
                    setValue("order_status", order.order_status);
                } else {
                    notifyError("Order not found");
                }
            })
            .catch(() => notifyError("Failed to load order"));
    }, [orderId, setValue]);

    // 🔹 Update order status using /order/manage-order API
    const onSubmit = async (data) => {
        try {
            await OrderService.getAllOrderstatus({
                order_id: orderId,
                order_status: data.order_status
            });

            notifySuccess("Order status updated successfully");
            setIsUpdate(true); // trigger table refresh
            closeDrawer();
        } catch (err) {
            // Check if API returned a message
            const msg =
                err?.response?.data?.message ||
                "Update failed"; // fallback message
            notifyError(msg);
            console.error(err);
        }
    };


    return (
        <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
            <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <Title
                    title="Update Order Status"
                    description="Update Order Status for this order"
                />
            </div>

            {/* <form onSubmit={handleSubmit(onSubmit)} className="block px-6 pt-8 pb-40">
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <label className="col-span-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-center mt-6">Order Status</label>
                    <div className="col-span-4">
                        <Select
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={(opt) => setValue("order_status", opt.value)}
                            placeholder="Select status"
                        />
                        <Error errorName={errors.order_status} />
                    </div>
                </div>
                <DrawerButton title="Update Order Status" />
            </form> */}
            <form onSubmit={handleSubmit(onSubmit)} className="block px-6 pt-8 pb-40">

                <div className="grid grid-cols-6 gap-6 mb-6">

                    {/* Label */}
                    <label className="col-span-2 mt-2 text-gray-800 dark:text-gray-200 font-medium text-lg">
                        Order Status
                    </label>

                    {/* Select */}
                    <div className="col-span-4 mt-2">
                        <SingleSelect
                            options={statusOptions}
                            value={watch("order_status")}
                            onChange={(v) => setValue("order_status", v)}
                            labelKey="label"
                            valueKey="value"
                            placeholder="Select Order Status"
                        />


                        {errors.order_status && (
                            <Error errorName={errors.order_status.message || "Order status is required"} />
                        )}
                    </div>

                </div>

                <DrawerButton title="Order Status" />
            </form>

        </Scrollbars>
    );
};

export default React.memo(OrderStatusDrawer);
