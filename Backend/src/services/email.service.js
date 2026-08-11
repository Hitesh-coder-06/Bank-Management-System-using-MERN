//here our all third party service code is present
const nodemailer = require("nodemailer");

//After deployment google auth service is not working mean render provide backend gmail service paid
//so use resender

const{Resend}=require("resend")


// transporter == used to connect to Gmail SMTP (GMAIL-SMTP)
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

const resend=new Resend(process.env.RESEND_API_KEY)



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
    } catch (gmailError) {
        console.log("Gmail email Failed")
        console.error("trying Resend fallback");

        //if gmail failed  (resend )
       try {
        const { data, error } = await resend.emails.send({

                from: "Bank Management System <onboarding@resend.dev>",

                to: [to],

                subject,

                text,

                html,

            });
            if(error){
                console.log("Resend email failed",error);
                throw error;
            }
            console.log("Email send successfully using Resend");
            console.log("Email_Id:" ,data.id);
            return data;


       } catch (resendError) {
        console.log("Both Gmail and Resend email failed");
        console.log("Gmail error",gmailError.message);
        console.log("Resend Error:",resendError.message);
        throw resendError;


        
       }
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