import db from "../config/db.js";

export const getAllCoursesModel = (callback) => {
  const query = "SELECT * FROM courses";
  db.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

export const getCourseByIdModel = (courseId, callback) => {
  const query = "SELECT * FROM courses WHERE id = ?";
  db.query(query, [courseId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

export const createCourseModel = (data, callback) => {
  const query = "INSERT INTO courses(name,description) values(?,?)";
  db.query(query, [data.name, data.description], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

export const updateCourseModel = (courseId, data, callback) => {
  const query = "UPDATE courses SET name = ?, description = ? WHERE id = ?";
  db.query(
    query,
    [data.name, data.description, courseId],
    (err, results) => {
      if (err) {
        return callback(err, null);
        }
        callback(null, results);
    }
    );
};
export const deleteCourseModel = (courseId, callback) => {
  const query = "DELETE FROM courses WHERE id = ?";
    db.query(query, [courseId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  }
    );
};
