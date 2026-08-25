const cron = require("node-cron");
const Order = require("../Model/productOrder");
const User = require("../Model/user");
const { sendMail } = require("../Utils/mailer");
const moment = require("moment-timezone");
const config = require("../Config/app");
const logger = require("../Utils/logger");

const scheduleDailyReport = () => {
    cron.schedule("59 23 * * *", async () => {
        logger.info("Running Daily Order Report Cron Job...");
        
        try {
            const todayStart = moment().tz("Asia/Kolkata").startOf("day").toDate();
            const todayEnd = moment().tz("Asia/Kolkata").endOf("day").toDate();
            
            // Find orders for today with status Active (1) and order_status Completed (1) or Confirmed (2)
            const orders = await Order.find({
                status: 1,
                order_status: 1,
                created_at: { $gte: todayStart, $lte: todayEnd }
            })
            .populate("user_id", "first_name last_name")
            .sort({ created_at: 1 });
            
            if (orders.length === 0) {
                logger.info("No orders found for today. Skipping daily report email.");
                return;
            }
            
            const bucketName = config.AWS_BUCKET_NAME || "runrkids";
            const region = config.AWS_REGION || "ap-south-1";
            const s3BaseUrl = `https://${bucketName}.s3.${region}.amazonaws.com/`;
            const appBaseUrl = config.APP_URL || "http://localhost:5000/"; // Fallback

            let totalRevenue = 0;
            
            const formattedOrders = orders.map(order => {
                const userName = order.user_id ? `${order.user_id.first_name} ${order.user_id.last_name}` : "Unknown User";
                
                // Construct Invoice URL
                let invoiceUrl = "#";
                if (order.invoice_path) {
                    if (config.NODE_ENV === "production") {
                        invoiceUrl = s3BaseUrl + order.invoice_path;
                    } else {
                        invoiceUrl = appBaseUrl + order.invoice_path;
                    }
                }
                
                totalRevenue += order.order_grandtotal;
                
                return {
                    user_name: userName,
                    order_offer_total: order.order_offer_total,
                    order_tax: order.order_tax,
                    order_discount: order.order_discount,
                    order_total: order.order_grandtotal,
                    order_status: order.order_status,
                    payment_method: order.payment_method || '-',
                    invoice_path: order.invoice_path,
                    invoice_url: invoiceUrl
                };
            });
            
            const dateStr = moment().tz("Asia/Kolkata").format("DD MMM YYYY");
            
            // Email Options
            const toEmail = "runrkids@runr.in";
            const subject = `RunrKids Order Report - ${dateStr}`;
            const templateName = "daily-order-report.ejs";
            const emailData = {
                date: dateStr,
                orders: formattedOrders,
                totalRevenue: totalRevenue
            };
            const ccEmails = [
                "sagar@runr.in",
                "kaushal@themidnight.in",
                "nirali@themidnight.in",
                "jyoti@themidnight.in",
                "vidhi@themidnight.in",
                "kinal@insomniacs.in"
            ];
            const bccEmails = [];
            await sendMail(toEmail, ccEmails, bccEmails, subject, templateName, emailData);
            logger.info(`Daily Order Report sent to ${toEmail}`);
            
        } catch (error) {
            logger.error(`Error in Daily Order Report Cron Job: ${error.message}`);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });
    
    logger.info("Daily Order Report Cron Job Scheduled for 23:59 Asia/Kolkata");
};

module.exports = {
    scheduleDailyReport
};
