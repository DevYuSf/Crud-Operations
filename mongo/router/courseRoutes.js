import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByTeacher,
  getCoursesBySubject
} from "../controller/courseController.js";
import {
  authMiddleware,
  autherizationMiddleware
} from "../middlewares/auth.middlewares.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /courses - Get all courses
router.get("/", getAllCourses);

// GET /courses/teacher/:teacherId - Get courses by teacher
router.get("/teacher/:teacherId", getCoursesByTeacher);

// GET /courses/subject/:subjectId - Get courses by subject
router.get("/subject/:subjectId", getCoursesBySubject);

// GET /courses/:id - Get course by ID
router.get("/:id", getCourseById);

// POST /courses - Create new course (Admin only)
router.post(
  "/",
  autherizationMiddleware(["admin"]),
  createCourse
);

// PUT /courses/:id - Update course (Admin only)
router.put(
  "/:id",
  autherizationMiddleware(["admin"]),
  updateCourse
);

// DELETE /courses/:id - Delete course (Admin only)
router.delete(
  "/:id",
  autherizationMiddleware(["admin"]),
  deleteCourse
);

export default router;