/*
==================================================
IMPORTS
==================================================
*/

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./config/db.js";

import usersRoutes from "./routes/usersRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postalRoutes from "./routes/postalRoutes.js";
import incidentsRoutes from "./routes/incidentsRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";
/*
==================================================
CONFIG
==================================================
*/

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

/*
==================================================
ROUTES
==================================================
*/

app.use("/api/users", usersRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentsRoutes);
app.use("/api/comments", commentsRoutes);

app.use("/api/postal", postalRoutes);
/*
==================================================
ROOT
==================================================
*/

app.get("/", (req, res) => {
  res.send("Alert SA Backend Running");
});

/*
==================================================
MYSQL
==================================================
*/

try {
  const connection = await db.getConnection();

  console.log("MySQL Connected Successfully");

  connection.release();
} catch (error) {
  console.log(error);
}

/*
==================================================
SERVER
==================================================
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
