/*
==================================================
IMPORTS
==================================================
*/

import express from "express";

import { registerUser, verifyAccount } from "../controllers/usersController.js";

const router = express.Router();

/*
==================================================
REGISTER
==================================================
*/

router.post(
  "/register",

  registerUser,
);

/*
==================================================
VERIFY EMAIL
==================================================
*/

router.get(
  "/verify/:token",

  verifyAccount,
);

export default router;
