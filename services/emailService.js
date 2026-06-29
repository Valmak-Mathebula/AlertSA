import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `https://alertssa.co.za/verify/${token}`;

  try {
    const result = await resend.emails.send({
      from: "Alert SA <noreply@alertssa.co.za>",
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

    console.log("Verification email sent:", result);
  } catch (error) {
    console.error("RESEND ERROR:");
    console.error(error);
    throw error;
  }
};
