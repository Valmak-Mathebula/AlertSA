import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
    }

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",

      [email],
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = rows[0];

    const match = await bcrypt.compare(
      password,

      user.password,
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.verified === 0) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,

        email: user.email,

        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "30d",
      },
    );

    await db.query(
      "UPDATE users SET last_login = NOW() WHERE id = ?",

      [user.id],
    );

    res.json({
      success: true,

      message: "Login successful.",

      token,

      user: {
        id: user.id,

        email: user.email,

        fullname: user.fullname,

        profile_picture: user.profile_picture,

        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Server error.",
    });
  }
};
