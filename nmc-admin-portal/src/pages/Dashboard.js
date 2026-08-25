import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableContainer,
  Pagination,
} from "@windmill/react-ui";
import { ImStack, ImCreditCard } from "react-icons/im";
import {
  FiShoppingCart,
  FiTruck,
  FiRefreshCw,
  FiCheck,
  FiXCircle,
  FiFilter,
} from "react-icons/fi";
import { useHistory } from "react-router-dom";
import Tooltip from "../components/tooltip/Tooltip";
import { FiTrello } from "react-icons/fi";
import useAsync from "../hooks/useAsync";
import useFilter from "../hooks/useFilter";
import OrderServices from "../services/OrderServices";
import DashboardServices from "../services/DashboardServices";
import Loading from "../components/preloader/Loading";
import ChartCard from "../components/chart/ChartCard";
import CardItem from "../components/dashboard/CardItem";
import PageTitle from "../components/Typography/PageTitle";
import OrderTable from "../components/dashboard/OrderTable";
import CardItemTwo from "../components/dashboard/CardItemTwo";
import { barOptions, doughnutOptions } from "../utils/chartsData";
import ProductTable from "../components/order/OrderTable";
import NotFound from "../components/table/NotFound";

const Dashboard = () => {
  const fetchRecentOrders = useCallback(() => {
    return OrderServices.getAllOrders({
      type: "order_list",
      payment_status: ["success", "failed"],
      sort_order: "desc",
      sort_by: "created_at",
    });
  }, []);
  const filterRef = useRef(null);
  const { data, loading } = useAsync(fetchRecentOrders, []);
  const [categoryFilter, setCategoryFilter] = useState("this_year");
  const [showFilter, setShowFilter] = useState(false);
  const [customRange, setCustomRange] = useState({
    from_date: "",
    to_date: "",
  });

  const [brandFilter, setBrandFilter] = useState("this_year");
  const [brandTempFilter, setBrandTempFilter] = useState("this_year");
  const [brandCustomRange, setBrandCustomRange] = useState({
    from_date: "",
    to_date: "",
  });
  const [showBrandFilter, setShowBrandFilter] = useState(false);
  const brandFilterRef = useRef(null);

  const FILTER_OPTIONS = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "this_week" },
    { label: "Last Week", value: "last_week" },
    { label: "Last 7 Days", value: "last_7_days" },
    { label: "This Month", value: "this_month" },
    { label: "Last Month", value: "last_month" },
    { label: "Last 28 Days", value: "last_28_days" },
    { label: "Last 6 Months", value: "last_6_months" },
    { label: "This Year", value: "this_year" },
    { label: "Custom", value: "custom" },
  ];

  const [orderSummary, setOrderSummary] = useState({
    today: 0,
    month: 0,
    year: 0,
  });
  const [orderStatus, setOrderStatus] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });
  const [categoryStats, setCategoryStats] = useState({
    labels: [], // months
    datasets: [], // categories
  });
  const [brandStats, setBrandStats] = useState({
    labels: [],
    datasets: [],
  });
  const [highestSellingStats, setHighestSellingStats] = useState({
    labels: [],
    datasets: [],
  });

  const hasHighestSellingData = highestSellingStats?.labels?.length > 0;

  const ordersData = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  useEffect(() => {
    fetchOrderSummary();
    fetchOrderStatus();
    // fetchBrandStats();
    fetchHighestSellingProducts();
  }, []);
  useEffect(() => {
    fetchCategoryStats(categoryFilter);
  }, [categoryFilter]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    fetchBrandStats(brandFilter); // <-- modify fetchBrandStats to accept a filter
  }, [brandFilter]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        brandFilterRef.current &&
        !brandFilterRef.current.contains(event.target)
      ) {
        setShowBrandFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [tempFilter, setTempFilter] = useState(categoryFilter);

  const fetchOrderSummary = async () => {
    try {
      const res = await DashboardServices.getAllRevenueSummary();

      // ✅ FIX HERE
      const summary = res?.data;

      setOrderSummary({
        today: summary?.today_total || 0,
        month: summary?.month_total || 0,
        year: summary?.year_total || 0,
      });
    } catch (error) {
      console.error("Dashboard summary error:", error);
    }
  };
  const fetchOrderStatus = async () => {
    try {
      const res1 = await DashboardServices.getAllOrderStatus();

      const status = res1?.data;

      setOrderStatus({
        total: status?.total || 0,
        pending: status?.pending || 0,
        confirmed: status?.confirmed || 0,
        completed: status?.completed || 0,
        cancelled: status?.cancelled || 0,
      });
    } catch (err) {
      console.error("Order status error:", err);
    }
  };

  const fetchCategoryStats = async (date_filter = categoryFilter) => {
    try {
      const body =
        date_filter === "custom"
          ? {
            date_filter,
            from_date: customRange.from_date,
            to_date: customRange.to_date,
          }
          : { date_filter };

      const res = await DashboardServices.getAllCategoryStats(body);
      const data = res?.data || [];

      if (data.length > 0) {
        const labels = data.map((item) => item.month);

        const categoriesSet = new Set();
        data.forEach((item) => {
          Object.keys(item).forEach((key) => {
            if (key !== "month") categoriesSet.add(key);
          });
        });

        const categories = Array.from(categoriesSet);

        const colors = [
          "#FB8B42", // #F97316 → slightly lighter than dark
          "#3AC0F5", // #0EA5E9 → slightly lighter
          "#2BD9A8", // #10B981 → slightly lighter
          "#FCD23B", // #EAB308 → slightly lighter
          "#F7607A", // #F43F5E → slightly lighter
          "#25BA5C", // #16A34A → slightly lighter
          "#5EA0F8", // #3B82F6 → slightly lighter
          "#F36A6A", // #EF4444 → slightly lighter
          "#A675F8", // #8B5CF6 → slightly lighter
          "#FBB728", // #F59E0B → slightly lighter
          "#1AB9B1", // #14B8A6 → slightly lighter
          "#E63A88", // #DB2777 → slightly lighter
          "#6B6FF8", // #6366F1 → slightly lighter
          "#2AD8EE", // #22D3EE → slightly lighter
          "#BFA3FC", // #A78BFA → slightly lighter
          "#F584B8", // #F472B6 → slightly lighter
          "#91D123", // #84CC16 → slightly lighter
          "#FCD93B", // #FACC15 → slightly lighter
          "#0FA397", // #0F766E → slightly lighter
        ];

        //
        const datasets = categories.map((cat, idx) => ({
          label: cat,
          data: data.map((item) => item[cat] || 0),
          backgroundColor: colors[idx % colors.length],
          // barThickness: 30,
        }));

        setCategoryStats({ labels, datasets });
      } else {
        setCategoryStats({ labels: [], datasets: [] });
      }
    } catch (err) {
      console.error("Category stats error:", err);
    }
  };

  const fetchBrandStats = async (date_filter = "this_year") => {
    try {
      const body =
        date_filter === "custom"
          ? {
            date_filter,
            from_date: brandCustomRange.from_date,
            to_date: brandCustomRange.to_date,
          }
          : { date_filter };

      const res = await DashboardServices.getAllBrandStats(body);
      const data = res?.data || [];

      if (data.length > 0) {
        const labels = data.map((item) => item.brand_name);

        const colors = [
          "#FB8B42", // #F97316 → slightly lighter than dark
          "#3AC0F5", // #0EA5E9 → slightly lighter
          "#2BD9A8", // #10B981 → slightly lighter
          "#FCD23B", // #EAB308 → slightly lighter
          "#F7607A", // #F43F5E → slightly lighter
          "#25BA5C", // #16A34A → slightly lighter
          "#5EA0F8", // #3B82F6 → slightly lighter
          "#F36A6A", // #EF4444 → slightly lighter
          "#A675F8", // #8B5CF6 → slightly lighter
          "#FBB728", // #F59E0B → slightly lighter
          "#1AB9B1", // #14B8A6 → slightly lighter
          "#E63A88", // #DB2777 → slightly lighter
          "#6B6FF8", // #6366F1 → slightly lighter
          "#2AD8EE", // #22D3EE → slightly lighter
          "#BFA3FC", // #A78BFA → slightly lighter
          "#F584B8", // #F472B6 → slightly lighter
          "#91D123", // #84CC16 → slightly lighter
          "#FCD93B", // #FACC15 → slightly lighter
          "#0FA397", // #0F766E → slightly lighter
        ];

        const datasets = [
          {
            data: data.map((item) => item.count || 0),
            backgroundColor: colors.slice(0, data.length),
          },
        ];

        setBrandStats({ labels, datasets });
      } else {
        setBrandStats({ labels: [], datasets: [] });
      }
    } catch (err) {
      console.error("Brand stats error:", err);
    }
  };
  const fetchHighestSellingProducts = async () => {
    try {
      const res = await DashboardServices.getAllHightSellingProduct({});
      const data = res?.data || [];

      if (data.length > 0) {
        setHighestSellingStats({
          labels: data.map((item) =>
            item.product_name.length > 25
              ? item.product_name.slice(0, 25) + "…"
              : item.product_name
          ),
          datasets: [
            {
              label: "Units Sold",
              data: data.map((item) => item.total_sold),
              borderColor: "#3AC0F5",
              backgroundColor: "rgba(58,192,245,0.15)",
              fill: true,
              tension: 0.4,
              pointRadius: 4,
            },
          ],
        });
      } else {
        setHighestSellingStats({ labels: [], datasets: [] });
      }
    } catch (err) {
      console.error("Highest selling products error:", err);
    }
  };

  // ---------------------------
  // LOW STOCK PRODUCT STATES
  // ---------------------------
  const history = useHistory();
  const [lowStockLoading, setLowStockLoading] = useState(false);
  const [lowStockData, setLowStockData] = useState([]);
  const [lowStockTotal, setLowStockTotal] = useState(0);

  // LOW STOCK PRODUCT STATES
  const [lowStockPage, setLowStockPage] = useState(1);
  const lowStockResultsPerPage = 10;

  // Slice data for current page
  const startIndex = (lowStockPage - 1) * lowStockResultsPerPage;
  const endIndex = startIndex + lowStockResultsPerPage;
  const currentLowStockData = lowStockData.slice(startIndex, endIndex);

  const handleLowStockPageChange = (page) => setLowStockPage(page);


  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        setLowStockLoading(true);
        const res = await DashboardServices.getLowStockProducts();
        setLowStockData(res?.data || []);
        setLowStockTotal(res?.data?.length || 0);
      } catch (error) {
        console.error("Low stock API error:", error);
      } finally {
        setLowStockLoading(false);
      }
    };

    fetchLowStockProducts();
  }, []);

  const handleViewProduct = (product) => {
    if (!product?._id) return;
    history.push(`/product-details/${product._id}`);
  };


  const {
    handleChangePage,
    totalResults,
    resultsPerPage: orderResultsPerPage,
    dataTable,
    serviceData,
    currentPage,
  } = useFilter(ordersData);
  const hasCategoryData =
    categoryStats?.datasets?.length > 0 &&
    categoryStats.datasets.some((ds) => ds.data.some((v) => v > 0));

  const hasBrandData =
    brandStats?.datasets?.length > 0 &&
    brandStats.datasets[0]?.data?.some((v) => v > 0);

  return (
    <>
      <PageTitle>Dashboard Overview</PageTitle>

      <div className="grid gap-4 mb-8 md:grid-cols-3 xl:grid-cols-3">
        <CardItemTwo
          title="Today Order"
          Icon={ImStack}
          price={orderSummary.today}
          className="text-white bg-teal-500"
        />
        <CardItemTwo
          title="This Month"
          Icon={FiShoppingCart}
          price={orderSummary.month}
          className="text-white bg-blue-500"
        />
        <CardItemTwo
          title="Total Order"
          Icon={ImCreditCard}
          price={orderSummary.year}
          className="text-white bg-green-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <CardItem
          title="Total Order"
          Icon={FiShoppingCart}
          quantity={orderStatus.total}
          className="text-orange-600 bg-orange-100 dark:bg-orange-500 dark:text-orange-100"
        />
        <CardItem
          title="Order Pending"
          Icon={FiRefreshCw}
          quantity={orderStatus.pending}
          className="text-blue-600 bg-blue-100 dark:bg-blue-500 dark:text-blue-100"
        />
        <CardItem
          title="Order Confirmed"
          Icon={FiTruck}
          quantity={orderStatus.confirmed}
          className="text-teal-600 bg-teal-100 dark:bg-teal-500 dark:text-teal-100"
        />
        <CardItem
          title="Order Completed"
          Icon={FiCheck}
          quantity={orderStatus.completed}
          className="text-green-600 bg-green-100 dark:bg-green-500 dark:text-green-100"
        />
        <CardItem
          title="Order Cancelled"
          Icon={FiXCircle}
          quantity={orderStatus.cancelled}
          className="text-red-600 bg-red-100 dark:bg-red-500 dark:text-red-100"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 my-8">
        <ChartCard
          title="Conversions This Year"
          action={
            <div className="relative">
              <button
                className="p-2 hover:bg-green-100 rounded-full text-green-500"
                title="Reset Filter"
                onClick={() => {
                  setCategoryFilter("this_year"); // useEffect will call fetchCategoryStats
                  setTempFilter("this_year");
                  setCustomRange({ from_date: "", to_date: "" });
                  setShowFilter(false);
                }}
              >
                <FiRefreshCw size={16} />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setShowFilter(!showFilter)}
              >
                <FiFilter size={18} className="text-green-500" />
              </button>
              {/* RESET ICON */}
              {showFilter && (
                <div
                  ref={filterRef}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg z-50 p-2"
                  style={{ maxHeight: "220px", overflowY: "auto" }}
                >
                  {FILTER_OPTIONS.map((item) => (
                    <div key={item.value} className="mb-1">
                      <button
                        onClick={() => {
                          setTempFilter(item.value);
                          if (item.value !== "custom") {
                            setCategoryFilter(item.value);
                            setShowFilter(false);
                          }
                        }}
                        className={`
                        block w-full text-left px-4 py-2 rounded
                        text-gray-800 dark:text-gray-200
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        ${tempFilter === item.value
                            ? "bg-green-100 dark:bg-green-900 font-semibold"
                            : ""
                          }
                      `}
                      >
                        {item.label}
                      </button>

                      {item.value === "custom" && tempFilter === "custom" && (
                        <div className="px-4 py-2">
                          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                            From:
                          </label>
                          <input
                            type="date"
                            value={customRange.from_date}
                            onChange={(e) =>
                              setCustomRange((prev) => ({
                                ...prev,
                                from_date: e.target.value,
                              }))
                            }
                            className="w-full rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 mb-2 border border-gray-300 dark:border-gray-600"
                          />

                          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                            To:
                          </label>
                          <input
                            type="date"
                            value={customRange.to_date}
                            onChange={(e) =>
                              setCustomRange((prev) => ({
                                ...prev,
                                to_date: e.target.value,
                              }))
                            }
                            className="w-full rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 mb-2 border border-gray-300 dark:border-gray-600"
                          />

                          <button
                            onClick={() => {
                              setCategoryFilter("custom");
                              setShowFilter(false);
                            }}
                            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700"
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          }
        >
          {hasCategoryData ? (
            <Bar
              data={categoryStats}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                },
                scales: {
                  x: {
                    stacked: false,
                    ticks: { padding: 10 },
                    grid: { drawTicks: false, drawBorder: false },
                    barPercentage: 0.4,
                    categoryPercentage: 0.5,
                  },
                  y: { beginAtZero: true },
                },
              }}
            />
          ) : (
            <NotFound title="Conversions This Year" />
            // <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            //   No data found
            // </div>
          )}
        </ChartCard>
        <ChartCard
          title="Top Revenue Product"
          action={
            <div className="relative">
              <button
                className="p-2 hover:bg-green-100 rounded-full text-green-500"
                title="Reset Filter"
                onClick={() => {
                  setBrandFilter("this_year");
                  setBrandTempFilter("this_year");
                  setBrandCustomRange({ from_date: "", to_date: "" });
                  setShowBrandFilter(false);
                }}
              >
                <FiRefreshCw size={16} />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setShowBrandFilter(!showBrandFilter)}
              >
                <FiFilter size={18} className="text-green-500" />
              </button>

              {showBrandFilter && (
                <div
                  ref={brandFilterRef}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg z-50 p-2"
                  style={{ maxHeight: "220px", overflowY: "auto" }}
                >
                  {FILTER_OPTIONS.map((item) => (
                    <div key={item.value} className="mb-1">
                      <button
                        onClick={() => {
                          setBrandTempFilter(item.value);
                          if (item.value !== "custom") {
                            setBrandFilter(item.value);
                            setShowBrandFilter(false);
                          }
                        }}
                        className={`
                  block w-full text-left px-4 py-2 rounded
                  text-gray-800 dark:text-gray-200
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  ${brandTempFilter === item.value
                            ? "bg-green-100 dark:bg-green-900 font-semibold"
                            : ""
                          }
                `}
                      >
                        {item.label}
                      </button>

                      {item.value === "custom" &&
                        brandTempFilter === "custom" && (
                          <div className="px-4 py-2">
                            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                              From:
                            </label>
                            <input
                              type="date"
                              value={brandCustomRange.from_date}
                              onChange={(e) =>
                                setBrandCustomRange((prev) => ({
                                  ...prev,
                                  from_date: e.target.value,
                                }))
                              }
                              className="w-full rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 mb-2 border border-gray-300 dark:border-gray-600"
                            />

                            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                              To:
                            </label>
                            <input
                              type="date"
                              value={brandCustomRange.to_date}
                              onChange={(e) =>
                                setBrandCustomRange((prev) => ({
                                  ...prev,
                                  to_date: e.target.value,
                                }))
                              }
                              className="w-full rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 mb-2 border border-gray-300 dark:border-gray-600"
                            />

                            <button
                              onClick={() => {
                                setBrandFilter("custom");
                                setShowBrandFilter(false);
                              }}
                              className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700"
                            >
                              Apply
                            </button>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          }
        >
          {hasBrandData ? (
            <Doughnut
              data={brandStats}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                },
              }}
              className="chart"
            />
          ) : (
            // <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            //   No data found
            // </div>
            <NotFound title="Top Revenue Product" />
          )}
        </ChartCard>
      </div>
      <div className="grid gap-4 md:grid-cols-2 my-8">
        <ChartCard title="Top Performer of the Year">
          {hasHighestSellingData ? (
            <Line
              data={highestSellingStats}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                },
                scales: {
                  x: {
                    ticks: {
                      autoSkip: false,
                      maxRotation: 45,
                      minRotation: 30,
                    },
                    grid: { drawBorder: false },
                  },
                  y: {
                    beginAtZero: true,
                    grid: { drawBorder: false },
                  },
                },
              }}
            />
          ) : (
            <NotFound title="Top Performer of the Year" />
            // <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            //   No data found
            // </div>
          )}
        </ChartCard>
        <ChartCard title={
          <div className="relative flex items-center gap-2">
            {/* Show red dot ONLY when low stock exists */}
            {!lowStockLoading && lowStockData.length > 0 && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
              </span>
            )}

            <span>Low Stock Products</span>
          </div>
        }
        >
          {lowStockLoading ? (
            <Loading loading={lowStockLoading} />
          ) : lowStockData.length > 0 ? (
            <TableContainer className="mb-8 rounded-b-lg">
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>Sr. No.</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Actions</TableCell>
                  </tr>
                </TableHeader>

                <TableBody>
                  {currentLowStockData.map((item, index) => (
                    <TableRow key={item._id}>
                      <TableCell>{startIndex + index + 1}</TableCell>

                      <TableCell>
                        {item.product_title.slice(0, Math.ceil(item.product_title.length / 3)) + "..."}
                      </TableCell>


                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${item.stock_quantity <= 5
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                            }`}
                        >
                          {item.stock_quantity}
                        </span>
                      </TableCell>

                      <TableCell>
                        <button
                          className="text-blue-600 hover:underline text-sm"
                          onClick={() => handleViewProduct(item)}
                        >
                          <Tooltip
                            Icon={FiTrello}
                            title="View Product"
                            bgColor="#2563EB"
                          />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TableFooter>
                <Pagination
                  totalResults={lowStockTotal}
                  resultsPerPage={lowStockResultsPerPage}
                  onChange={handleLowStockPageChange}
                  label="Low Stock Product Navigation"
                />
              </TableFooter>
            </TableContainer>
          ) : (
            <NotFound title="Low Stock Products" />
          )}
        </ChartCard>

      </div>

      <PageTitle>Recent Orders</PageTitle>

      {loading ? (
        <Loading loading={loading} />
      ) : serviceData.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Sub Total</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Shipping Charge</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Mode</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </tr>
            </TableHeader>

            <ProductTable
              products={dataTable}
              currentPage={currentPage}
              resultsPerPage={orderResultsPerPage}
            />
          </Table>

          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={orderResultsPerPage}
              onChange={handleChangePage}
              label="Order Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Order" />
      )}
    </>
  );
};

export default Dashboard;
