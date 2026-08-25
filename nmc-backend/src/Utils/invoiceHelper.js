// src/Utils/invoiceHelper.js
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const config = require("../Config/app")

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const Order = require("../Model/productOrder");
const OrderItem = require("../Model/productOrderItem");
const DeliveryAddress = require("../Model/deliveryAddress");
const User = require("../Model/user");
const logger = require("../Utils/logger");
const { sendMail } = require("./mailer");

// ---------- S3 CONFIG (v3 SDK) ----------
const s3Client = new S3Client({
    region: config.AWS_REGION || "ap-south-1",
});

const S3_BUCKET = config.AWS_BUCKET_NAME || "runrkids";
const S3_INVOICE_PREFIX = "media/invoice";
const S3_INVOICE_BASE_URL =
    config.S3_INVOICE_BASE_URL ||
    "https://runrkids.s3.ap-south-1.amazonaws.com/media/invoice";
// ----------------------------------------

function numberToWords(n) {
    if (n === 0) return "Zero";

    const a = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
    ];
    const b = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
    ];

    const num = parseFloat(n).toFixed(2).split(".");
    let numInteger = parseInt(num[0]);
    let numDecimal = parseInt(num[1]);

    if (numInteger.toString().length > 9) return "Overflow";

    const n_array = ("000000000" + numInteger)
        .substr(-9)
        .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n_array) return "";

    let str = "";
    str +=
        n_array[1] != 0
            ? (a[Number(n_array[1])] ||
                b[n_array[1][0]] + " " + a[n_array[1][1]]) + " Crore "
            : "";
    str +=
        n_array[2] != 0
            ? (a[Number(n_array[2])] ||
                b[n_array[2][0]] + " " + a[n_array[2][1]]) + " Lakh "
            : "";
    str +=
        n_array[3] != 0
            ? (a[Number(n_array[3])] ||
                b[n_array[3][0]] + " " + a[n_array[3][1]]) + " Thousand "
            : "";
    str +=
        n_array[4] != 0
            ? (a[Number(n_array[4])] ||
                b[n_array[4][0]] + " " + a[n_array[4][1]]) + " Hundred "
            : "";
    str +=
        n_array[5] != 0
            ? (str != "" ? "and " : "") +
            (a[Number(n_array[5])] ||
                b[n_array[5][0]] + " " + a[n_array[5][1]])
            : "";

    // Handle Decimals
    if (numDecimal > 0) {
        let decimalStr = "";
        if (numDecimal < 20) {
            decimalStr = a[numDecimal];
        } else {
            const tens = Math.floor(numDecimal / 10);
            const units = numDecimal % 10;
            decimalStr = b[tens] + (units !== 0 ? " " + a[units] : "");
        }
        str += " Point " + decimalStr;
    }

    return str.trim();
}

async function generateInvoice(orderId) {
    try {
        logger.info(`generateInvoice called for order: ${orderId}`);
        logger.info(`NODE_ENV: ${config.NODE_ENV}`);

        // Fetch order
        const order = await Order.findById(orderId).lean();
        if (!order) {
            logger.error(`Order not found for ID: ${orderId}`);
            throw new Error("Order not found");
        }

        // Map _id to order_id for the template
        order.order_id = order._id;

        // Format Date to DD/MM/YYYY
        if (order.created_at) {
            const date = new Date(order.created_at);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            order.created_at = `${day}/${month}/${year}`;
        }

        // 1.1 Fetch User
        const user = await User.findById(order.user_id).lean();

        // Fetch order items
        const dbItems = await OrderItem.find({ order_id: orderId })
            .populate("product_id")
            .lean();

        logger.info(`Found ${dbItems.length} order items for order: ${orderId}`);

        const orderitems = dbItems.map((item) => ({
            product_name: item.product_id
                ? item.product_id.product_name || item.product_id.name || "Product"
                : "Product",
            order_product_quantity: item.qty,
            actual_price: item.product_id?.actual_price || 0,
            offer_price: item.product_id?.offer_price || 0,
            order_product_amount: item.base_price,
            order_product_tax: item.tax_amount,
            order_product_total: (item.product_id?.offer_price || 0) * item.qty, // Total without tax
        }));

        // Business info
        const businessinfo = {
            business_name: "RUNR KIDS",
            business_address1: "6th Floor, Swara Park Square, Rupani Circle, Sanskar Mandal Road,",
            business_city: "Bhavnagar",
            business_state: "Gujarat",
            business_country: "India",
            business_pincode: "364001",
            business_tax_no: "24AAOCM2784J1Z0"
        };

        // Fetch addresses using IDs from Order
        let shippingAddress = null;
        let billingAddress = null;

        if (order.shipping_address_id) {
            shippingAddress = await DeliveryAddress.findById(order.shipping_address_id).lean();
        }

        if (order.billing_address_id) {
            billingAddress = await DeliveryAddress.findById(order.billing_address_id).lean();
        }

        // Fallback logic if needed (e.g. if IDs missing but user_id exists - old logic)
        if (!shippingAddress || !billingAddress) {
             const addresses = await DeliveryAddress.find({
                user_id: order.user_id,
                status: 1
            }).lean();
            
            if (!shippingAddress) {
                 shippingAddress = addresses.find(a => a.checkout_address_type === "shipping") || addresses[0] || null;
            }
            if (!billingAddress) {
                 billingAddress = addresses.find(a => a.checkout_address_type === "billing") || shippingAddress || null;
            }
        }

        logger.info("Resolved shipping address:", shippingAddress);
        logger.info("Resolved billing address:", billingAddress);

        const orderdetail = {
            // name / phone — adjust to your DeliveryAddress schema
            user_first_name:
                user?.first_name ||
                user?.name ||
                "Customer",
            user_last_name: user?.last_name || "",
            user_phone: user?.mobile || user?.phone || "",

            // SHIPPING
            shipping_address: shippingAddress?.street_address || "",
            shipping_city: shippingAddress?.city || "",
            shipping_pincode: shippingAddress?.postal_code || "",
            shipping_state: shippingAddress?.state || "",
            shipping_country: shippingAddress?.country || "",

            // BILLING
            billing_address: billingAddress?.street_address || "",
            billing_city: billingAddress?.city || "",
            billing_pincode: billingAddress?.postal_code || "",
            billing_state: billingAddress?.state || "",
            billing_country: billingAddress?.country || "",
        };

        // Calculate Tax based on billing state
        const ordertax = [];
        const billingState = billingAddress?.state || "";
        const isGujarat = billingState.toLowerCase() === "gujarat";

        // Calculate total taxable amount from order items
        const totalTaxAmount = orderitems.reduce((sum, item) => sum + (item.order_product_tax || 0), 0);

        // Calculate Total Amount Without Tax (Sum of all item totals)
        const totalAmountWithoutTax = orderitems.reduce((sum, item) => sum + (item.order_product_total || 0), 0);

        if (isGujarat) {
            // Gujarat: Split into CGST and SGST (9% each)
            const cgstAmount = (totalTaxAmount / 2).toFixed(2);
            const sgstAmount = (totalTaxAmount / 2).toFixed(2);
            ordertax.push(
                { tax_name: "CGST", tax_amount: cgstAmount },
                { tax_name: "SGST", tax_amount: sgstAmount }
            );
        } else {
            // Other states: IGST (18%)
            ordertax.push({ tax_name: "IGST", tax_amount: totalTaxAmount.toFixed(2) });
        }

        const total_in_words = numberToWords(order.order_grandtotal || 0);

        // Prepare Logo (Base64)
        const rootDir = path.join(__dirname, ".."); // src/
        const logoPath = path.join(rootDir, "media", "logo", "logo.webp");
        let logoBase64 = "";
        try {
            if (fs.existsSync(logoPath)) {
                const logoBuffer = fs.readFileSync(logoPath);
                logoBase64 = `data:image/webp;base64,${logoBuffer.toString("base64")}`;
            } else {
                logger.warn(`Logo file not found at: ${logoPath}`);
            }
        } catch (err) {
            logger.error(`Error reading logo file: ${err.message}`);
        }

        // Render invoice.ejs -> HTML
        const templatePath = path.join(rootDir, "views", "invoice.ejs");

        logger.info(`Invoice template path: ${templatePath}`);

        if (!fs.existsSync(templatePath)) {
            logger.error(`invoice.ejs not found at: ${templatePath}`);
            throw new Error("invoice.ejs file not found");
        }

        const html = await ejs.renderFile(templatePath, {
            order,
            businessinfo,
            orderdetail,
            orderitems,
            ordertax,
            total_in_words,
            logoBase64,
            totalAmountWithoutTax: totalAmountWithoutTax.toFixed(2), // Pass the calculated total
        });

        const fileName = `${order.order_invoice_no || "invoice_" + order._id}.pdf`;

        // Generate PDF buffer with Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        let finalPathOrUrl;

        // ENV-based storage
        if (config.NODE_ENV === "production") {
            const s3Key = `${S3_INVOICE_PREFIX}/${fileName}`;

            logger.info("Uploading invoice to S3", {
                bucket: S3_BUCKET,
                key: s3Key,
            });

            const command = new PutObjectCommand({
                Bucket: S3_BUCKET,
                Key: s3Key,
                Body: pdfBuffer,
                ContentType: "application/pdf",
                ACL: "public-read",
            });

            await s3Client.send(command);

            finalPathOrUrl = `${S3_INVOICE_BASE_URL}/${fileName}`;

            logger.info(`Invoice uploaded to S3 at: ${finalPathOrUrl}`);
        } else {
            const invoiceDir = path.join(rootDir, "media", "invoice");

            logger.info(`Saving invoice locally to: ${invoiceDir}`);

            if (!fs.existsSync(invoiceDir)) {
                fs.mkdirSync(invoiceDir, { recursive: true });
                logger.info(`Created invoice directory: ${invoiceDir}`);
            }

            const filePath = path.join(invoiceDir, fileName);
            fs.writeFileSync(filePath, pdfBuffer);

            finalPathOrUrl = filePath;

            logger.info(`Invoice PDF saved locally at: ${filePath}`);
        }

        // Send Email
        try {
            const recipientEmail = user?.email;
            const ccEmails = [
                "runrkids@runr.in"
            ];
            const bccEmails = [
                "sagar@runr.in",
                "kaushal@themidnight.in",
                "nirali@themidnight.in",
                "jyoti@themidnight.in",
                "vidhi@themidnight.in",
                "kinal@insomniacs.in"
            ];

            await sendMail(
                recipientEmail,
                ccEmails,
                bccEmails,
                `Invoice for Order #${order.order_invoice_no || order.order_id}`,
                "invoice-email.ejs",
                {
                    name: `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Customer",
                    orderId: order.order_invoice_no || order.order_id,
                    orderDate: order.created_at,
                    orderPaymentMode: order.payment_method,
                    orderdetail,
                    orderitems,
                    order,
                    ordertax,
                    total_in_words,
                    logoBase64,
                    totalAmountWithoutTax: totalAmountWithoutTax.toFixed(2),
                },
                [
                    {
                        filename: fileName,
                        content: pdfBuffer,
                        contentType: "application/pdf",
                    },
                ]
            );
            logger.info(`Invoice email sent to ${recipientEmail}`);
            // Return object for better handling
            return {
                filePath: finalPathOrUrl,
                emailSent: true,
                emailError: null
            };
        } catch (emailErr) {
            logger.error(`Failed to send invoice email: ${emailErr.message}`);
            // Return object indicating email failure but invoice success
            return {
                filePath: finalPathOrUrl,
                emailSent: false,
                emailError: emailErr.message
            };
        }
    } catch (err) {
        logger.error(`generateInvoice error for order ${orderId}: ${err.message}`, {
            stack: err.stack,
        });
        throw err;
    }
}

module.exports = { generateInvoice };
