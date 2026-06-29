/*
==================================================
IMPORTS
==================================================
*/

import bcrypt from "bcryptjs";
import crypto from "crypto";
import db from "../config/db.js";
import { sendVerificationEmail } from "../services/emailService.js";

/*
==================================================
REGISTER USER
==================================================
*/

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,

        message: "Please complete all required fields.",
      });
    }

    const [emailRows] = await db.query(
      "SELECT id FROM users WHERE email = ?",

      [email],
    );

    if (emailRows.length > 0) {
      return res.status(400).json({
        success: false,

        message: "Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    await db.query(
      `

            INSERT INTO users

            (

                email,

                password,

                verification_token

            )

            VALUES

            (?,?,?)

            `,

      [email, hashedPassword, verificationToken],
    );

    await sendVerificationEmail(
      email,

      verificationToken,
    );

    return res.status(201).json({
      success: true,

      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Server error.",
    });
  }
};

/*
==================================================
VERIFY ACCOUNT
==================================================
*/

export const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;

    const [rows] = await db.query(
      "SELECT id FROM users WHERE verification_token = ?",

      [token],
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,

        message: "Invalid verification link.",
      });
    }

    await db.query(
      `

            UPDATE users

            SET

                verified = 1,

                verification_token = NULL

            WHERE

                verification_token = ?

            `,

      [token],
    );

    return res.json({
      success: true,

      message: "Your account has been verified successfully.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Server error.",
    });
  }
};
