import React, { useEffect, useState, useContext } from "react";
import { TableCell, TableBody, TableRow, Badge } from "@windmill/react-ui";
import { notifyError, notifySuccess } from "../../utils/toast";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { AdminContext } from "../../context/AdminContext";
import Tooltip from "../tooltip/Tooltip";
import { FiTrello } from "react-icons/fi";

const PriceManagementTable = ({
    PriceManagement,
    currentPage = 1,
    resultsPerPage = 10,
    onUpdatePrice
}) => {

    const [products, setProducts] = useState([]);
    const { state } = useContext(AdminContext);
    const token = state.adminToken;

    useEffect(() => {
        if (PriceManagement?.length) {
            // add editable fields
            const mapped = PriceManagement.map((item) => ({
                ...item,
                edit_offer_price: item.offer_price || "",
                edit_actual_price: item.actual_price || "",
                isLoading: false,
            }));
            setProducts(mapped);
        }
    }, [PriceManagement]);

    useEffect(() => {
        Fancybox.bind("[data-fancybox]", {});
        return () => {
            Fancybox.unbind("[data-fancybox]");
            Fancybox.close();
        };
    }, []);

    const startIndex = (currentPage - 1) * resultsPerPage;

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

    const handleInputChange = (index, field, value) => {
        const updated = [...products];
        updated[index][field] = value;
        setProducts(updated);
    };

    const handleUpdateClick = async (product, index) => {
        if (!product.edit_offer_price || !product.edit_actual_price) {
            notifyError("Please enter both prices");
            return;
        }

        const updated = [...products];
        updated[index].isLoading = true;
        setProducts(updated);

        await onUpdatePrice({
            id: product._id,
            offer_price: product.edit_offer_price,
            actual_price: product.edit_actual_price,
        });

        updated[index].isLoading = false;
        setProducts(updated);
    };


    return (
        <TableBody>
            {products.map((product, i) => (
                <TableRow key={product._id || i}>
                    <TableCell>
                        <span className="text-xs uppercase font-semibold">
                            {startIndex + i + 1}
                        </span>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center">
                            <div className="relative inline-block w-12 h-12">
                                <a data-fancybox href={product.product_img}>
                                    <img
                                        src={
                                            product.product_img ||
                                            "https://runrkids.s3.ap-south-1.amazonaws.com/media/default/default.png"
                                        }
                                        alt={product.product_title}
                                        className="object-cover w-full h-full"
                                    />
                                </a>
                                <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell style={{ width: "320px", maxWidth: "320px" }}>
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
                                    maxWidth: "900px",
                                    minWidth: "400px",
                                    width: "max-content",
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                    boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
                                }}
                            >
                                {product.product_title}
                            </div>
                        </div>
                    </TableCell>

                    <TableCell className="w-50 text-center">
                        <div className="flex items-center justify-center">
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

                    {/* <TableCell>
                        <span className="text-sm">₹ {product.offer_price || "0"}{' '}</span>
                    </TableCell>

                    <TableCell>
                        <span className="text-sm">₹ {product.actual_price || "0"}{' '}</span>
                    </TableCell> */}

                    {/* Offer Price Input */}
                    <TableCell>
                        ₹ <input
                            type="number"
                            value={product.edit_offer_price}
                            onChange={(e) =>
                                handleInputChange(i, "edit_offer_price", e.target.value)
                            }
                            min={0}
                            className="font-bold w-24 px-2 py-1 text-md border rounded"
                        />
                    </TableCell>

                    {/* Actual Price Input */}
                    <TableCell>
                        ₹ <input
                            type="number"
                            value={product.edit_actual_price}
                            onChange={(e) =>
                                handleInputChange(i, "edit_actual_price", e.target.value)
                            }
                            min={0}
                            className="font-bold w-24 px-2 py-1 text-md border rounded"
                        />
                    </TableCell>

                    <TableCell className="text-center">
                        <div
                            className={`p-2 cursor-pointer ${product.isLoading
                                ? "text-gray-300"
                                : "text-gray-400 hover:text-red-800 dark:hover:text-amber-400"
                                }`}
                            onClick={() => !product.isLoading && handleUpdateClick(product, i)}
                        >
                            <Tooltip
                                id={`update-${product._id}`}
                                Icon={FiTrello}
                                title="Update Price"
                                bgColor="#991b1b"
                            />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}

export default React.memo(PriceManagementTable);
