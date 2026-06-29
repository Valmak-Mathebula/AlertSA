import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    const [rows] = await db.query(
      `
      SELECT
    place_name AS suburb,
    '' AS town,
    '' AS province
FROM postal_codes
WHERE place_name LIKE ?
OR postal_code LIKE ?

UNION

SELECT
    suburb,
    town,
    province
FROM user_locations
WHERE suburb LIKE ?

ORDER BY
CHAR_LENGTH(suburb),
suburb

LIMIT 15
      `,
      [`${q}%`, `${q}%`, `${q}%`],
    );

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
});

export default router;
