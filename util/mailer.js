require('dotenv').config(); // Load environment variables

const nodemailer = require("nodemailer");

// Create a transporter object using your email service's settings
const transporter = nodemailer.createTransport({
    service: 'gmail', // or any email service like 'outlook', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER,  // Use the environment variable for the email address
        pass: process.env.EMAIL_PASS   // Use the environment variable for the password
    }
});

/**
 * Sends an email using Nodemailer.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} htmlContent - The HTML content of the email body.
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 */
const sendEmail = async (sentMail, msg, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's email
        to: sentMail, // Doctor's email from the database
        subject: msg, // Subject of the email
        html: htmlContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
            return next(new Error("Failed to send email"));
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};

module.exports = sendEmail;
