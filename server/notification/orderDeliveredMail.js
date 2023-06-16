const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'siggmaalimiteds@gmail.com',
        pass: 'ltlbykvtgfryrqav'
    }
});

// Function to send email alerts
const orderDeliverEmailAlert = async (to, subject, text) => {
    try {
        // Define email options
        const mailOptions = {
            from: 'siggmaalimiteds@gmail.com',
            to: to,
            subject: subject,
            text: text
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.log('Error sending email: ' + error);
    }
};

module.exports = {
    orderDeliverEmailAlert
};
