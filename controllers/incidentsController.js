import db from "../config/db.js";

export const createIncident = async (req, res) => {
  try {
    const {
      user_id,
      anonymous,
      description,
      province,
      town,
      suburb,
      latitude,
      longitude,
    } = req.body;

    if (!description || !suburb) {
      return res.status(400).json({
        success: false,
        message: "Description and suburb are required.",
      });
    }

    const [result] = await db.query(
      `
  INSERT INTO incidents
  (
    user_id,
    anonymous,
    description,
    province,
    town,
    suburb,
    latitude,
    longitude
  )
  VALUES
  (?,?,?,?,?,?,?,?)
  `,
      [
        anonymous ? null : user_id || null,
        Number(anonymous),
        description,
        province || "",
        town || "",
        suburb,
        latitude && latitude !== "undefined" ? latitude : null,
        longitude && longitude !== "undefined" ? longitude : null,
      ],
    );

    const incidentId = result.insertId;

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await db.query(
          `
      INSERT INTO incident_media
      (
        incident_id,
        media_type,
        media_url
      )
      VALUES (?,?,?)
      `,
          [
            incidentId,
            file.mimetype.startsWith("image") ? "image" : "video",
            file.path,
          ],
        );
      }
    }

    res.json({
      success: true,
      message: "Incident reported successfully.",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};
export const getIncidents = async (req, res) => {
  try {
    const [rows] = await db.query(`
    SELECT
    i.*,
    'User' AS reported_by,

    (
    SELECT media_url
    FROM incident_media
    WHERE incident_id = i.id
    ORDER BY id
    LIMIT 1
) AS thumbnail,

(
    SELECT media_type
    FROM incident_media
    WHERE incident_id = i.id
    ORDER BY id
    LIMIT 1
) AS thumbnail_type,

    (
        SELECT COUNT(*)
        FROM incident_media
        WHERE incident_id = i.id
    ) AS media_count,

    p.latitude,
    p.longitude

FROM incidents i

LEFT JOIN
(
    SELECT
        place_name,
        AVG(latitude) AS latitude,
        AVG(longitude) AS longitude
    FROM postal_codes
    GROUP BY place_name
) p
ON LOWER(TRIM(i.suburb)) = LOWER(TRIM(p.place_name))

ORDER BY i.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.log(err);

    res.status(500).json([]);
  }
};

export const getIncident = async (req, res) => {
  try {
    const { id } = req.params;

    const [incident] = await db.query(
      `
      SELECT *
      FROM incidents
      WHERE id = ?
      `,
      [id],
    );

    if (incident.length === 0) {
      return res.status(404).json({
        message: "Incident not found",
      });
    }

    const [media] = await db.query(
      `
      SELECT *
      FROM incident_media
      WHERE incident_id = ?
      ORDER BY id
      `,
      [id],
    );

    incident[0].media = media;

    res.json(incident[0]);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};
