//here our all third party service code is present
const nodemailer = require("nodemailer");

// transporter == used to connect to Gmail SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// VERIFY
transporter.verify((error, success) => {
    if (error) {
        console.error("Transporter verification failed:", error);
    } else {
        console.log("Transporter verified successfully");
    }
});

// Generic Email Sender
async function sendEmail({ to, subject, text, html }) {
    try {
        const info = await transporter.sendMail({
            from: `"BankManagement" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("Email sent successfully");
        console.log("Message ID:", info.messageId);

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

// Registration Email
// Registration Email
async function sendRegistrationEmail(userEmail, name) {

    const subject = "Registration Successful";

    const text = `
Hi ${name},

Welcome to Bank Management System.

Your account has been created successfully.

Thank you for registering!

Regards,
Bank Management Team
`;

    await sendEmail({
        to: userEmail,
        subject,
        text
    });
}


// Transaction Success Email
async function sendTransactionEmail(userEmail, name, amount, toAccount) {

    const subject = "Transaction Successful";

    const text = `
Hi ${name},

Your transaction has been completed successfully.

Amount: ₹${amount}
Transferred To: ${toAccount}

Thank you for using Bank Management System.

Regards,
Bank Management Team
`;

    await sendEmail({
        to: userEmail,
        subject,
        text
    });
}


// Transaction Failure Email
async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {

    const subject = "Transaction Failed";

    const text = `
Hi ${name},

Unfortunately, your transaction could not be completed.

Amount: ₹${amount}
Attempted To: ${toAccount}

Please try again later.

Regards,
Bank Management Team
`;

    await sendEmail({
        to: userEmail,
        subject,
        text
    });
}


module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};