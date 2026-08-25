const moment = require("moment-timezone");

// Random string generator
function generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
function generateSlug(text) {
    return text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')       // Replace spaces with -
        .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
        .replace(/\-\-+/g, '-')     // Replace multiple - with single -
        .replace(/^-+/, '')         // Trim - from start
        .replace(/-+$/, '');        // Trim - from end
}
const calculateDiscount = (actual, offer) => {
  if (!actual || !offer || actual <= 0) return 0;
  return Math.round(((actual - offer) / actual) * 100);
};

async function generateInvoiceNumber(prefix = "RUNRKIDS") {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const financialYear = `${currentYear}${nextYear.toString().slice(-2)}`;

  const ProductOrder = require("./Model/productOrder");
  
  let isUnique = false;
  let invoiceNo = "";

  while (!isUnique) {
    // Generate 6-char uppercase alphanumeric suffix
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let suffix = "";
    for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    invoiceNo = `${prefix}${financialYear}${suffix}`;

    // Ensure uniqueness
    const exists = await ProductOrder.findOne({ order_invoice_no: invoiceNo });
    if (!exists) {
        isUnique = true;
    }
  }

  return invoiceNo;
}

const calculateDateRange = (date_filter, from_date, to_date, timezone = "Asia/Kolkata") => {
    let startDate, endDate;
    const today = moment().tz(timezone);

    // Default to 'this_year' if not provided
    if (!date_filter) date_filter = "this_year";

    switch (date_filter) {
        case "today":
            startDate = today.clone().startOf("day");
            endDate = today.clone().endOf("day");
            break;
        case "yesterday":
            startDate = today.clone().subtract(1, "days").startOf("day");
            endDate = today.clone().subtract(1, "days").endOf("day");
            break;
        case "this_week":
            startDate = today.clone().startOf("week");
            endDate = today.clone().endOf("week");
            break;
        case "last_week":
            startDate = today.clone().subtract(1, "weeks").startOf("week");
            endDate = today.clone().subtract(1, "weeks").endOf("week");
            break;
        case "last_7_days":
            startDate = today.clone().subtract(6, "days").startOf("day");
            endDate = today.clone().endOf("day");
            break;
        case "this_month":
            startDate = today.clone().startOf("month");
            endDate = today.clone().endOf("month");
            break;
        case "last_month":
            startDate = today.clone().subtract(1, "months").startOf("month");
            endDate = today.clone().subtract(1, "months").endOf("month");
            break;
        case "last_28_days":
            startDate = today.clone().subtract(27, "days").startOf("day");
            endDate = today.clone().endOf("day");
            break;
        case "last_6_months":
            startDate = today.clone().subtract(6, "months").startOf("day");
            endDate = today.clone().endOf("day");
            break;
        case "this_year":
            startDate = today.clone().startOf("year");
            endDate = today.clone().endOf("year");
            break;
        case "custom":
             if (from_date && to_date) {
                 startDate = moment.tz(from_date, timezone).startOf("day");
                 endDate = moment.tz(to_date, timezone).endOf("day");
             } else {
                 // Fallback if custom dates missing
                 startDate = today.clone().startOf("year");
                 endDate = today.clone().endOf("year");
             }
             break;
        default:
             startDate = today.clone().startOf("year");
             endDate = today.clone().endOf("year");
             break;
    }
    return { startDate, endDate };
};

function escapeRegex(text) {
    if (!text) return "";
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); // Escape regex special characters
}

// Export the function (you can export more functions here later)
module.exports = {
    generateRandomString,
    generateSlug,
    calculateDiscount,
    generateInvoiceNumber,
    calculateDateRange,
    escapeRegex
};