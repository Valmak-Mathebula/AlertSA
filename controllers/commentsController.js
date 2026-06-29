import db from "../config/db.js";

export const addComment = async (req, res) => {
  try {
    const { incident_id, user_id, anonymous, comment } = req.body;

    if (!incident_id || !comment) {
      return res.status(400).json({
        success: false,
        message: "Comment is required.",
      });
    }

    await db.query(
      `
      INSERT INTO comments
      (
        incident_id,
        user_id,
        anonymous,
        comment
      )
      VALUES
      (?,?,?,?)
      `,
      [
        incident_id,
        anonymous ? null : user_id || null,
        anonymous ? 1 : 0,
        comment,
      ],
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        c.*,
        'User' AS author
      FROM comments c
      LEFT JOIN users u
        ON c.user_id=u.id
      WHERE incident_id=?
      ORDER BY c.created_at ASC
      `,
      [req.params.id],
    );

    res.json(rows);
  } catch (err) {
    console.log(err);

    res.status(500).json([]);
  }
};
