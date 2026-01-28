const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const museumTemplate = (title, body, link = null, btnText = "") => `
<div style="background-color: #f9f7f2; padding: 40px; font-family: 'Georgia', serif; color: #2c2c2c; text-align: center;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0d8c3; padding: 50px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <h1 style="color: #b8860b; letter-spacing: 2px; text-transform: uppercase;">${title}</h1>
        <div style="width: 50px; height: 2px; background-color: #b8860b; margin: 20px auto;"></div>
        <p style="font-size: 16px; line-height: 1.6;">${body}</p>
        ${link ? `<a href="${link}" style="display: inline-block; margin-top: 30px; padding: 15px 35px; background-color: #b8860b; color: #ffffff; text-decoration: none; text-transform: uppercase; font-size: 12px;">${btnText}</a>` : ''}
    </div>
</div>`;

const sendWelcomeEmail = async (email, name) => {
    try {
        await transporter.sendMail({
            from: `"The Museum Curator" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🏛️ Invitation: Your Private Archive is Ready",
            html: museumTemplate(`Welcome, Curator ${name}`, "Your digital vault is now commissioned. We are honored to host your journey.")
        });
    } catch (e) {
        console.error("❌ Welcome Email Error:", e.message);
    }
};

const sendPasswordResetEmail = async (email, token) => {
    try {
        const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        await transporter.sendMail({
            from: `"The Museum Curator" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🔑 Vault Access Recovery",
            html: museumTemplate("Recovery Request", "A request has been made to restore your archive credentials. This link expires in 1 hour.", link, "Reset Password")
        });
    } catch (e) {
        console.error("❌ Password Reset Email Error:", e.message);
        throw e;
    }
};



module.exports = { sendWelcomeEmail, sendPasswordResetEmail };