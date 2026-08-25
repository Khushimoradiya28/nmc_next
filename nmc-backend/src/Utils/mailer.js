const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const logger = require("./logger");
const config = require("../Config/app")

// Debug: Log email configuration (without password)
// logger.info(`Email Config - Host: ${config.HOST}, Port: ${config.EMAIL_PORT}, User: ${config.SMTP_USERNAME}`);

const transporter = nodemailer.createTransport({
    host: config.HOST,
    port: parseInt(config.EMAIL_PORT),
    secure: false, // false for STARTTLS (port 587)
    auth: {
        user: config.SMTP_USERNAME,
        pass: config.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendMail = async (to, cc = [], bcc = [], subject, templateName, data, attachments = []) => {
    // Ensure arrays and filter empty strings
    if (Array.isArray(cc)) cc = cc.filter(email => email && email.trim() !== "");
    if (Array.isArray(bcc)) bcc = bcc.filter(email => email && email.trim() !== "");

    try {
        const templatePath = path.join(__dirname, "..", "views", templateName);
        const html = await ejs.renderFile(templatePath, data);

        // Explicitly join arrays to comma-separated strings for compatibility
        if (Array.isArray(cc)) cc = cc.join(',');
        if (Array.isArray(bcc)) bcc = bcc.join(',');

        const mailOptions = {
            from: config.SMTP_USERNAME,
            to,
            cc,
            bcc,
            subject,
            html,
            attachments,
        };
        
        // Log keys to verify bcc is present
        logger.info(`Preparing email`, { 
            to, 
            cc, 
            bccCount: bcc ? bcc.split(',').length : 0, 
            subject 
        });

        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error(`Error sending email: ${error.message}`);
        throw error;
    }
};

module.exports = { sendMail };
