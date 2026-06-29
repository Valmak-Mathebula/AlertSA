/*
==================================================
IMPORTS
==================================================
*/

import express from "express";

const router = express.Router();

/*
==================================================
TEST
==================================================
*/

router.get("/", (req, res) => {
  res.json({
    project: "Alert SA",

    status: "Running",
  });
});

export default router;
