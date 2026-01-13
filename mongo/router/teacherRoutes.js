import express from "express";
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  addSubjectToTeacher
} from "../controller/teacherController.js";
import {
  authMiddleware,
  autherizationMiddleware
} from "../middlewares/auth.middlewares.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /teachers - Get all teachers
router.get("/", getAllTeachers);

// GET /teachers/:id - Get teacher by ID
router.get("/:id", getTeacherById);

// POST /teachers - Create new teacher (Admin only)
router.post(
  "/",
  autherizationMiddleware(["admin"]),
  createTeacher
);

// PUT /teachers/:id - Update teacher (Admin only)
router.put(
  "/:id",
  autherizationMiddleware(["admin"]),
  updateTeacher
);

// DELETE /teachers/:id - Delete teacher (Admin only)
router.delete(
  "/:id",
  autherizationMiddleware(["admin"]),
  deleteTeacher
);

// POST /teachers/:teacherId/subjects/:subjectId - Add subject to teacher
router.post(
  "/:teacherId/subjects/:subjectId",
  autherizationMiddleware(["admin"]),
  addSubjectToTeacher
);

export default router;