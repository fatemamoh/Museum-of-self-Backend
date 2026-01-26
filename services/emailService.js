const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const frontendUrl = process.env.FRONTEND_URL || '#';
        const htmlContent = `
        <div style="background-color: #f9f7f2; padding: 40px; font-family: 'Georgia', serif; color: #2c2c2c; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0d8c3; padding: 50px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <h1 style="color: #b8860b; font-weight: normal; letter-spacing: 2px; text-transform: uppercase;">Welcome, Curator ${userName}</h1>
            <div style="width: 50px; height: 2px; background-color: #b8860b; margin: 20px auto;"></div>
            <p style="font-size: 18px; font-style: italic; line-height: 1.8;">"Every life is a collection of masterpieces, waiting to be cataloged."</p>
            <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">Your digital vault is now commissioned. We are honored to host your journey.</p>
            <a href="${frontendUrl}" style="display: inline-block; margin-top: 40px; padding: 15px 35px; background-color: #b8860b; color: #ffffff; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Begin Curating</a>
            <p style="margin-top: 50px; font-size: 12px; color: #999; letter-spacing: 1px;">ESTABLISHED 2026 • THE MUSEUM OF SELF</p>
        </div>
        </div>`;

        return transporter.sendMail({
            from: `"The Museum Curator" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "🏛️ Invitation: Your Private Archive is Ready",
            html: htmlContent
        })
    } catch (error) {
        console.error("❌ Welcome Email Error:", error.message);
    }

    
}

const sendUnlockNotification = async (userEmail, userName, artifactTitle) => {
    try {
        const htmlContent = `
        <div style="background-color: #1a1a1a; padding: 40px; font-family: 'Georgia', serif; color: #e0d8c3; text-align: center; border: 2px solid #b8860b;">
            <p style="text-transform: uppercase; letter-spacing: 3px; font-size: 10px;">Vault Release Notice</p>
            <h2 style="color: #ffffff;">A piece of history returns.</h2>
            <div style="background-color: #2c2c2c; padding: 20px; margin: 20px 0;">
                <p style="font-size: 20px; color: #ffffff; margin: 0;"><strong>${artifactTitle}</strong></p>
            </div>
            <p>Curator ${userName}, a time capsule has reached its unlock date and is now available.</p>
        </div>`;

        return await transporter.sendMail({
            from: `"The Museum Curator" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "🕒 Archive Notice: An Artifact has Unlocked",
            html: htmlContent
        });
    } catch (error) {
        console.error("❌ Unlock Email Error:", error.message);
    }
};

module.exports = { sendWelcomeEmail, sendUnlockNotification }