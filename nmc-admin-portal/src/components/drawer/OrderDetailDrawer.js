import React, { useEffect, useState } from "react";
import { Card, CardBody, Button } from "@windmill/react-ui";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import OrderService from "../../services/OrderServices";
import PageTitle from "../../components/Typography/PageTitle";
import Breadcrumb from "../../components/form/Breadcrumb";
import { notifyError, notifySuccess } from "../../utils/toast";

// -------------------------------------------------------------
// HELPERS
// -------------------------------------------------------------
const getOrderStatus = (statusInt) => {
  const status = Number(statusInt);

  switch (status) {
    case 0:
      return { name: "Pending", color: "danger" };
    case 1:
      return { name: "Completed", color: "success" };
    case 2:
      return { name: "Confirmed", color: "success" };
    case 3:
      return { name: "Cancelled", color: "warning" };
    case 4:
      return { name: "Shipped", color: "primary" };
    case 5:
      return { name: "Delivered", color: "primary" };
    default:
      return { name: "Unknown", color: "neutral" };
  }
};

const statusColors = {
  success: "bg-green-200 text-green-700 dark:bg-green-700 dark:text-green-200",
  warning:
    "bg-yellow-200 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-200",
  primary: "bg-blue-200 text-blue-700 dark:bg-blue-700 dark:text-blue-200",
  danger: "bg-red-200 text-red-700 dark:bg-red-700 dark:text-red-200",
  neutral: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
};

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString.replace(" ", "T"));
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day}-${month}-${year} • ${hours}:${minutes} ${ampm}`;
};

const formatINR = (num) => {
  if (!num) return "0";
  return Number(num).toLocaleString("en-IN");
};

// -------------------------------------------------------------
// SKU COPY 
// -------------------------------------------------------------
const copySku = async (sku) => {
  if (!sku) {
    notifyError("Nothing to copy!");
    return;
  }

  try {
    await navigator.clipboard.writeText(sku);
    notifySuccess("SKU copied to clipboard!");
  } catch (err) {
    notifyError("Failed to copy SKU");
  }
};

// -------------------------------------------------------------
// UI HELPERS
// -------------------------------------------------------------
const SectionTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
    {children}
  </h2>
);

const SectionDivider = () => (
  <hr className="border-gray-200 dark:border-gray-700" />
);

// -------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------
const OrderDrawer = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);

  // SUB TOTAL 
  const subTotal = orderData?.order_items?.reduce(
    (sum, item) => sum + (Number(item.total_price) || 0),
    0
  ) || 0;

  useForm(); // form is unused but kept to avoid breaking structure

  useEffect(() => {
    if (!id) return;

    OrderService.getAllOrders({ type: "order_detail", _id: id })
      .then((res) => setOrderData(res.data?.[0] || {}))
      .catch(() => notifyError("Failed to load order"));
  }, [id]);

  const status = getOrderStatus(orderData?.order_status);

  return (
    <div className="w-full p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* HEADER */}
      <div className="flex flex-col text-left w-full mb-6">
        <PageTitle>Order Summary</PageTitle>
        <Breadcrumb
          items={[
            { label: "Orders", link: "/orders" },
            { label: "Order Summary" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-8">
          {/* ORDER SUMMARY */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300">
              <div className="space-y-2">
                <p>
                  <strong>Invoice No:</strong>{" "}
                  {orderData?.order_invoice_no || "-"}
                </p>
                <p>
                  <strong>Client Name:</strong> {orderData?.user_name || "-"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${statusColors[status.color]
                      }`}
                  >
                    {status.name}
                  </span>
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {formatDateTime(orderData?.created_at)}
                </p>
              </div>

              <div className="space-y-2">
                <p>
                  <strong>Subtotal:</strong> ₹
                  {formatINR(orderData?.order_offer_total)}
                </p>
                <p>
                  <strong>Tax:</strong> ₹{formatINR(orderData?.order_tax)}
                  {(orderData?.total_cgst > 0 ||
                    orderData?.total_sgst > 0 ||
                    orderData?.total_igst > 0) && (
                      <div className="text-xs text-gray-500">
                        {orderData?.total_cgst > 0 && (
                          <span>CGST: ₹{formatINR(orderData.total_cgst)}</span>
                        )}

                        {orderData?.total_sgst > 0 && (
                          <span>
                            {orderData?.total_cgst > 0 && " | "}
                            SGST: ₹{formatINR(orderData.total_sgst)}
                          </span>
                        )}

                        {orderData?.total_igst > 0 && (
                          <span>
                            {(orderData?.total_cgst > 0 || orderData?.total_sgst > 0) && " | "}
                            IGST: ₹{formatINR(orderData.total_igst)}
                          </span>
                        )}
                      </div>
                    )}
                </p>
                <p>
                  <strong>Discount:</strong> -₹
                  {formatINR(orderData?.order_discount)}
                </p>
                <p>
                  <strong>Shipping:</strong> ₹
                  {formatINR(orderData?.order_shipping_charge)}
                </p>
                <p className="font-bold text-green-600 dark:text-green-400">
                  Total: ₹{formatINR(orderData?.order_total)}
                </p>
              </div>
            </div>
          </div>

          <SectionDivider />

          {/* ADDRESSES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Billing Address",
                data: orderData?.billing_address?.[0],
              },
              {
                title: "Shipping Address",
                data: orderData?.shipping_address?.[0],
              },
            ].map((addr, idx) => (
              <div key={idx} className="space-y-2">
                <SectionTitle>{addr.title}</SectionTitle>

                {addr.data ? (
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {addr.data.street_address}
                    <br />
                    {addr.data.city}, {addr.data.state} {addr.data.postal_code}
                    <br />
                    {addr.data.country}
                  </p>
                ) : (
                  <p className="text-sm italic text-gray-400">
                    No address found
                  </p>
                )}
              </div>
            ))}
          </div>

          <SectionDivider />

          {/* ITEMS */}
          <div className="space-y-3">
            <SectionTitle>Items</SectionTitle>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr className="text-gray-700 dark:text-gray-200">
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Offer</th>
                    <th className="p-2 text-left">Tax</th>
                    <th className="p-2 text-left">Qty</th>
                    <th className="p-2 text-left">Total</th>
                  </tr>
                </thead>

                <tbody className="text-gray-700 dark:text-gray-200">
                  {orderData?.order_items?.map((item, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2">
                        <div className="font-medium">
                          {item.product_name || item.product_id}
                        </div>


                        <div
                          className="text-xs text-gray-500 cursor-pointer hover:underline"
                          title="Click to copy SKU"
                          onClick={() => copySku(item.product_sku)}
                        >
                          SKU: {item.product_sku}
                        </div>
                      </td>
                      <td className="p-2">₹{formatINR(item.base_price)}</td>
                      <td className="p-2">₹{formatINR(item.offer_price)}</td>
                      <td className="p-2">
                        ₹{formatINR(item.tax_amount)}
                        {(item.cgst > 0 || item.sgst > 0 || item.igst > 0) && (
                          <div className="text-xs text-gray-500">
                            {item.cgst > 0 && (
                              <span>CGST: ₹{formatINR(item.cgst)}</span>
                            )}

                            {item.sgst > 0 && (
                              <span>
                                {item.cgst > 0 && " | "}
                                SGST: ₹{formatINR(item.sgst)}
                              </span>
                            )}

                            {item.igst > 0 && (
                              <span>
                                {(item.cgst > 0 || item.sgst > 0) && " | "}
                                IGST: ₹{formatINR(item.igst)}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-2">{item.qty}</td>
                      <td className="p-2 font-semibold">
                        ₹{formatINR(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-gray-300 dark:border-gray-600">
                  <tr className="text-gray-800 dark:text-gray-100 font-semibold">
                    <td colSpan={6} className="p-2 text-right">
                      Sub Total :
                    </td>
                    <td className="p-2">
                      ₹{formatINR(subTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <SectionDivider />

          {/* PAYMENT DETAILS */}
          <div className="space-y-2">
            <SectionTitle>Payment Details</SectionTitle>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>
                <strong>Method:</strong> {orderData?.payment_method || "N/A"}
              </p>
              <p>
                <strong>Razorpay Order ID:</strong>{" "}
                {orderData?.razorpay_order_id || "-"}
              </p>
              <p>
                <strong>Payment ID:</strong>{" "}
                {orderData?.razorpay_payment_id || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6">
          <div className="space-y-4">
            <SectionTitle>Order Activity</SectionTitle>

            <div className="relative">
              {orderData?.order_activity?.map((a, index) => (
                <div key={index} className="relative flex gap-6 pb-6 last:pb-0">
                  {/* <div className="relative flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 z-10"></span>
                    {index !== orderData.order_activity.length - 1 && (
                      <span className="absolute top-3 w-px h-full bg-gray-300 dark:bg-gray-600"></span>
                    )}
                  </div> */}
                  <div className="relative flex flex-col items-center">
                    <span className="w-3 h-3 rounded-full bg-white border-2 border-blue-500 z-10"></span>
                    <span className="absolute top-3 w-px h-full bg-gray-300 dark:bg-gray-600"></span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      {formatDateTime(a.created_at)}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {a.order_activity_type}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {a.order_activity_details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OrderDrawer);
