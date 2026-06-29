import express from "express";
import upload from "../middleware/upload.js";

import {
  createIncident,
  getIncidents,
  getIncident,
} from "../controllers/incidentsController.js";
const router = express.Router();

router.post("/", upload.array("media", 20), createIncident);

router.get("/", getIncidents);
router.get("/:id", getIncident);

export default router;
