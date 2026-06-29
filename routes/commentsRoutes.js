import express from "express";
import { addComment, getComments } from "../controllers/commentsController.js";

const router = express.Router();

router.post("/", addComment);

router.get("/:id", getComments);

export default router;
