//google service SMTP is use when local machine
//resend mail is use for deployment

const nodemailer = require("nodemailer");
const { Resend } = require("resend");

// GMAIL TRANSPORTER


const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },

    // If Gmail connection hangs, fail and use Resend
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
});



// RESEND


// Create Resend only when API key exists.
// This is important for GitHub/offline users.
const resendApiKey = process.env.RESEND_API_KEY;

const resend = resendApiKey
    ? new Resend(resendApiKey)
    : null;

console.log(
    "Resend API Key:",
    resend ? "Loaded" : "Missing"
);


// GENERIC EMAIL SENDER


async function sendEmail({ to, subject, text, html }) {

    
    // FIRST TRY: GMAIL
    

    try {

        const info = await transporter.sendMail({

            from: `"BankManagement" <${process.env.EMAIL_USER}>`,

            to,

            subject,

            text,

            html,

        });

        console.log("Email sent successfully using Gmail");
        console.log("Message ID:", info.messageId);

        return info;

    } catch (gmailError) {

        console.log("Gmail email failed.");
        console.log("Gmail Error:", gmailError.message);

        
        // SECOND TRY: RESEND
    

        if (!resend) {

            console.log(
                "Resend is not configured. No RESEND_API_KEY found."
            );

            // Gmail failed and Resend is not available
            throw gmailError;
        }

        try {

            console.log("Trying Resend fallback...");

            const { data, error } = await resend.emails.send({

                from: "Bank Management System <onboarding@resend.dev>",

                to: [to],

                subject,

                text,

                html,

            });

            if (error) {

                console.log("Resend email failed:", error);

                throw error;
            }

            console.log("Email sent successfully using Resend");
            console.log("Email ID:", data.id);

            return data;

        } catch (resendError) {

            console.log("Both Gmail and Resend email failed.");

            console.log(
                "Gmail Error:",
                gmailError.message
            );

            console.log(
                "Resend Error:",
                resendError.message || resendError
            );

            // Return the final failure
            throw resendError;
        }
    }
}


// REGISTRATION EMAIL


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



// TRANSACTION SUCCESS EMAIL

async function sendTransactionEmail(
    userEmail,
    name,
    amount,
    toAccount
) {

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


// TRANSACTION FAILURE EMAIL


async function sendTransactionFailureEmail(
    userEmail,
    name,
    amount,
    toAccount
) {

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



// EXPORT


module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};