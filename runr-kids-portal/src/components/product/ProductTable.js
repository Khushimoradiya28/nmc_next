import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TableCell,
  TableBody,
  TableRow,
  TableHeader,
  Badge,
  Avatar,
} from '@windmill/react-ui';
import { FiEye } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import Tooltip from '../tooltip/Tooltip';
import MainModal from '../modal/MainModal';
import MainDrawer from '../drawer/MainDrawer';
import ProductDrawer from '../drawer/ProductDrawer';
import ShowHideButton from '../table/ShowHideButton';
import EditDeleteButton from '../table/EditDeleteButton';
import useToggleDrawer from '../../hooks/useToggleDrawer';
import DateBox from '../form/DateBox';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { notifyError, notifySuccess } from "../../utils/toast";

const ProductTable = ({ products, currentPage = 1, resultsPerPage = 10, sortBy = "", sortOrder = "", onSort = () => { } }) => {
  const history = useHistory();
  const goToDetail = (id) => history.push(`/product-details/${id}`);
  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      // Your custom options
      // Example:
      // dragToClose: false,
    });

    return () => {
      Fancybox.unbind("[data-fancybox]");
      Fancybox.close();
    };
  }, []);
  const { serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  // Copy SKU 
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

  const FRONTEND_URL = "https://uat.runrkids.in";

  const getPreviewUrl = (slug) => {
    if (!slug) return "#";
    return `${FRONTEND_URL}/productdetail?product_slug=${slug}`;
  };



  // Calculate the starting index for the current page
  const startIndex = (currentPage - 1) * resultsPerPage;

  return (
    <>
      <MainModal id={serviceId} />

      <MainDrawer>
        <ProductDrawer id={serviceId} />
      </MainDrawer>

      <TableHeader>
        <tr>
          <TableCell>Sr. No.</TableCell>
          <TableCell>Image</TableCell>
          <TableCell>
            {/* <div className="flex items-center gap-2">
              <span>Product Name</span>
              <div className="flex flex-col gap-0">
                <span
                  className={`cursor-pointer text-base leading-none ${sortBy === "product_name" && sortOrder === "asc"
                    ? "text-green-500"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
                  onClick={() => onSort("product_name")}
                >
                  ↑
                </span>
                <span
                  className={`cursor-pointer text-base leading-none ${sortBy === "product_name" && sortOrder === "desc"
                    ? "text-green-500"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
                  onClick={() => onSort("product_name")}
                >
                  ↓
                </span>
              </div>
            </div> */}
            <div className="flex items-center gap-2">
              <span>Product Name</span>
              <div className="flex items-center gap-1">
                <span
                  className={`cursor-pointer text-base leading-none ${sortBy === "product_name" && sortOrder === "asc"
                    ? "text-green-500"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
                  onClick={() => onSort("product_name")}
                >
                  ↑
                </span>

                <span
                  className={`cursor-pointer text-base leading-none ${sortBy === "product_name" && sortOrder === "desc"
                    ? "text-green-500"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
                  onClick={() => onSort("product_name")}
                >
                  ↓
                </span>
              </div>
            </div>

          </TableCell>
          <TableCell>Categories</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <span>SKU</span>
              <div className="flex items-center gap-1">
                <span
                  className={`cursor-pointer text-base leading-none ${sortBy === "product_sku" && sortOrder === "asc"
                    ? "text-green-500"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
                  onClick={() => onSort("product_sku")}
                >
                  ↑
                </span>

                <span
                  className={`cursor-pointer text-base leading-none ${sortBy === "product_sku" && sortOrder === "desc"
                    ? "text-green-500"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
                  onClick={() => onSort("product_sku")}
                >
                  ↓
                </span>
              </div>
            </div>

          </TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Stock</TableCell>
          <TableCell>Stock Quantity</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Actions</TableCell>
        </tr>
      </TableHeader>

      <TableBody>
        {products
          ?.filter((product) => product.status == 1) // ✅ filter first
          .map((product, i) => (                    // ✅ then map
            <TableRow key={product._id || i}>

              {/* Index */}
              <TableCell>
                <span className="text-xs uppercase font-semibold">
                  {startIndex + i + 1}
                </span>
              </TableCell>
              {/* Product Image  */}
              <TableCell>
                <div className="flex items-center">
                  <div className="relative inline-block w-12 h-12">
                    <a
                      data-fancybox
                      href={product.product_img}
                    >
                      {/* <img
                        src={product.product_img}
                        alt={product.product_title}
                        className="object-cover w-full h-full"
                      /> */}
                      <img
                        src={product.product_img || "https://runrkids.s3.ap-south-1.amazonaws.com/media/default/default.png"}
                        alt={product.product_title}
                        className="object-cover w-full h-full"
                      />
                    </a>
                    <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
                  </div>
                </div>
              </TableCell>
              {/* Product Name */}
              {/* <TableCell>
                <div className="flex items-center">

                  <h2 className="text-sm font-medium">
                    {product.product_title}
                  </h2>
                </div>
              </TableCell> */}

              <TableCell>
                <div style={{ position: "relative", width: "320px" }}>
                  <span
                    style={{
                      display: "block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.nextSibling.style.display = "block";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.nextSibling.style.display = "none";
                    }}
                  >
                    {product.product_title}
                  </span>

                  <div
                    style={{
                      display: "none",
                      position: "absolute",
                      left: "0",
                      top: "110%",
                      zIndex: 9999,

                      backgroundColor: "#1a1c23",
                      color: "#fff",

                      padding: "12px 16px",
                      borderRadius: "8px",

                      fontSize: "13px",
                      lineHeight: "1.7",

                      maxWidth: "900px",        // 🔥 allow much wider tooltip
                      minWidth: "400px",        // 🔥 readable base width
                      width: "max-content",     // 🔥 grow with content
                      whiteSpace: "normal",     // allow wrapping
                      wordBreak: "break-word",

                      boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
                    }}
                  >
                    {product.product_title}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-1 items-center">
                  {product.categorynamelist && product.categorynamelist.length > 0 ? (
                    product.categorynamelist.map((category, index) => (
                      <Badge key={index} type="primary" className="text-xs">
                        {category}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center">

                  <h2 className="text-sm font-medium">
                    <span
                      className="text-sm font-medium cursor-pointer hover:underline"
                      title="Click to copy SKU"
                      onClick={() => copySku(product.product_sku)}
                    >
                      {product.product_sku}
                    </span>
                  </h2>
                </div>
              </TableCell>

              {/* Price + Offer Price */}
              <TableCell>
                <span className="text-sm font-semibold">
                  ₹ {product.offer_price || "0"}{' '}
                  <span className="line-through text-red-500 text-xs">
                    ₹ {product.actual_price || "0"}
                  </span>
                </span>
              </TableCell>

              {/* Stock */}
              <TableCell className="hidden">
                <span className="text-sm">{product.is_stock}</span>
              </TableCell>


              {/* Quantity */}
              {/* <TableCell>
            <span className="text-sm">{product.net_quantity}</span>
          </TableCell> */}
              {/* <TableCell>
            <span className="text-sm font-semibold">
              {product.discount !== 0 && (
                <span>{product.discount} Off</span>
              )}
            </span>
          </TableCell>        */}

              {/* Status */}
              <TableCell>
                {product.stock_quantity > 0 ? (
                  <Badge type="success">In Stock</Badge>
                ) : (
                  <Badge type="danger">Out of Stock</Badge>
                )}
              </TableCell>

              {/* Stock Quantity */}
              <TableCell>
                <span className="text-sm">{product.stock_quantity || "-"}</span>
              </TableCell>

              <TableCell>
                <DateBox created_at={product.created_at} updated_at={product.updated_at} />
              </TableCell>

              {/* Edit/Delete Button */}
              <TableCell>
                <div className="flex items-center gap-3">
                  {/* Preview */}
                  <a
                    href={getPreviewUrl(
                      product.product_slug || product.slug || product.seo_slug
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 cursor-pointer"
                    title="Preview"
                  >
                    <Tooltip
                      id="preview"
                      Icon={FiEye}
                      title="Preview"
                      bgColor="#2563EB"
                    />
                    {/* <FiEye size={18} /> */}
                  </a>

                  <EditDeleteButton
                    id={product._id}
                    handleUpdate={() => goToDetail(product._id)}
                    handleModalOpen={handleModalOpen}
                  />
                </div>
              </TableCell>

            </TableRow>
          ))}
      </TableBody>
    </>

  );
};

export default React.memo(ProductTable);
