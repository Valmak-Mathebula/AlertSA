import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",

  port: 587,

  secure: false,

  auth: {
    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

  const verificationLink = `${FRONTEND_URL}/verify/${token}`;

  try {
    await transporter.sendMail({
      from: `"Alert SA" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: "Verify your Alert SA account",

      html: `

        <h2>Welcome to Alert SA</h2>

        <p>Thank you for registering.</p>

        <p>Please click the button below to verify your account.</p>

        <p>

            <a
                href="${verificationLink}"
                style="
                    background:#dc3545;
                    color:white;
                    padding:12px 20px;
                    text-decoration:none;
                    border-radius:5px;
                "
            >
                Verify My Account
            </a>

        </p>

        <p>If you did not create this account, please ignore this email.</p>

        `,
    });

    console.log("Verification email sent successfully to:", email);
  } catch (error) {
    console.error("EMAIL ERROR:");
    console.error(error);

    throw error;
  }
};
