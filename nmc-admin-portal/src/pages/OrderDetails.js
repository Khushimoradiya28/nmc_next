import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody, Badge } from '@windmill/react-ui';
import { FiDollarSign, FiTruck, FiUser, FiCalendar } from 'react-icons/fi'; // Icons for visual appeal

import useAsync from '../hooks/useAsync'; 
import OrderServices from '../services/OrderServices'; 
import PageTitle from '../components/Typography/PageTitle';
import Loading from '../components/preloader/Loading';
import NotFound from '../components/table/NotFound'; 

// Helper function (copied from previous discussion, handles integer status)
const getOrderStatus = (statusInt) => {
  switch (statusInt) {
    case 0: return { name: 'Pending', color: 'warning' };
    case 1: return { name: 'Confirmed', color: 'primary' };
    case 2: return { name: 'Delivered', color: 'success' };
    case 3: return { name: 'Cancelled', color: 'danger' };
    default: return { name: 'Unknown', color: 'neutral' };
  }
};

const OrderDetails = () => {
  const { id } = useParams();

  // 1. Fetch data using the specific POST service
  // const { data, loading, error } = useAsync(() => OrderServices.getAllOrders({ type: "order_detail",_id}));
  
  // Extract the single order object from the data array
  // The structure is: data.data[0]
  const order = data?.data?.[0];
  const statusInfo = getOrderStatus(order?.order_status);

  // --- Conditional Rendering ---

  if (loading) {
    return <Loading loading={loading} />;
  }

  // Handle case where API request fails or returns no data
  if (error || !order) {
    console.error("Order Details Error:", error || "No order data found.");
    return <NotFound title={`Order ID: ${id} could not be loaded.`} />;
  }
  
  // --- Helper component for cleaner financial details display ---
  const DetailItem = ({ label, value, color, isCurrency = true }) => (
    <div className="border border-gray-100 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-lg font-semibold mt-1 ${color || 'text-gray-900 dark:text-white'}`}>
            {isCurrency ? `$${(value || 0).toFixed(2)}` : value}
        </p>
    </div>
  );

  // --- Successful Render ---
  return (
    <>
      <PageTitle>Order Details: #{order._id.substring(0, 8)}</PageTitle>

      {/* 1. Basic Status & Customer Card */}
      <Card className="mb-4 shadow-md">
        <CardBody>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <InfoBox icon={FiUser} title="Customer" value={order.user_name || 'N/A'} />
            <InfoBox icon={FiCalendar} title="Created At" value={order.created_at.split(' ')[0]} />
            
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Status</p>
              <Badge type={statusInfo.color} className="mt-1 text-base font-bold w-fit">
                {statusInfo.name}
              </Badge>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Status</p>
              <Badge type={order.payment_status === 'pending' ? 'warning' : 'success'} className="mt-1 text-base font-bold w-fit">
                {order.payment_status || 'N/A'}
              </Badge>
            </div>
          </div>
        </CardBody>
      </Card>
      
      {/* 2. Financial Breakdown Card */}
      <Card className="mb-8 shadow-md">
        <CardBody>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-white">Financial Breakdown</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <DetailItem label="Order Subtotal" value={order.order_subtotal} />
            <DetailItem label="Order Tax" value={order.order_tax} />
            <DetailItem label="Order Offer Total" value={order.order_offer_total} />
            
            <DetailItem label="Discount Applied" value={order.order_discount} color="text-red-500" />
            <DetailItem label="Shipping Charge" value={order.order_shipping_charge} />
            
            {/* Final Total - Highlighted */}
            <DetailItem 
                label="FINAL ORDER TOTAL" 
                value={order.order_total} 
                color="text-green-600 dark:text-green-400" 
            />
          </div>
        </CardBody>
      </Card>

      {/* 3. Payment & Invoice Details */}
       <Card className="mb-4 shadow-md">
        <CardBody>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-white">Payment & Logistics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <DetailItem label="Payment Method" value={order.payment_method || 'N/A'} isCurrency={false} />
            <DetailItem label="Payment ID" value={order.invoice_payment_id || 'N/A'} isCurrency={false} />
            <DetailItem label="Invoice Path" value={order.invoice_path || 'None'} isCurrency={false} />
          </div>
        </CardBody>
      </Card>
      
    </>
  );
};

// Helper component for clean display of basic information
const InfoBox = ({ icon: Icon, title, value }) => (
    <div className="flex items-center space-x-3">
        <Icon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-lg font-semibold dark:text-white">{value}</p>
        </div>
    </div>
);


export default OrderDetails;