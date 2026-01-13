import express from "express";
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} from "../controller/subjectController.js";
import {
  authMiddleware,
  autherizationMiddleware
} from "../middlewares/auth.middlewares.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /subjects - Get all subjects
router.get("/", getAllSubjects);

// GET /subjects/:id - Get subject by ID
router.get("/:id", getSubjectById);

// POST /subjects - Create new subject (Admin only)
router.post(
  "/",
  autherizationMiddleware(["admin"]),
  createSubject
);

// PUT /subjects/:id - Update subject (Admin only)
router.put(
  "/:id",
  autherizationMiddleware(["admin"]),
  updateSubject
);

// DELETE /subjects/:id - Delete subject (Admin only)
router.delete(
  "/:id",
  autherizationMiddleware(["admin"]),
  deleteSubject
);

export default router;