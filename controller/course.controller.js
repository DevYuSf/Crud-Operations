import {
  getAllCoursesModel,
  getCourseByIdModel,
  createCourseModel,
} from "../model/course.model.js";
export const getAllCourses = (req, res) => {
  getAllCoursesModel((err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results);
  });
};

export const getCourseById = (req, res) => {
  const courseId = req.params.id;
  getCourseByIdModel(courseId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(results[0]);
  });
};

export const createCourse = (req, res) => {
  const body = req.body;
  createCourseModel(body, (err, results) => {
    console.log(body)
    if (err) {
      return res.status(500).json({ error: "Database insert error" });
    }
    res
      .status(201)
      .json({ message: "Course created successfully", courseId: results.insertId });
  });
};


export const updateCourse = (req, res) => {
  const courseId = req.params.id;
  const body = req.body;
  updateCourseModel(courseId, body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database update error" });
    }
    res.json({ message: "Course updated successfully" });
  });
};

export const deleteCourse = (req, res) => {
  const courseId = req.params.id;
  deleteCourseModel(courseId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database delete error" });
    }
    res.json({ message: "Course deleted successfully" });
  });
};