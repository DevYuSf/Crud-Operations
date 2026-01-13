import Course from "../model/courseModel.js";
import Teacher from "../model/teacherModel.js";
import Subject from "../model/subjectModel.js";

// Create Course
export async function createCourse(req, res) {
  try {
    const { title, code, description, teacher, subject, schedule, maxStudents } = req.body;

    if (!title || !code || !teacher || !subject) {
      return res.status(400).json({
        message: "Missing required fields: title, code, teacher, subject"
      });
    }

    // Check if code already exists
    const existingCourse = await Course.findOne({ code: code.toUpperCase() });
    if (existingCourse) {
      return res.status(409).json({ 
        message: "Course with this code already exists" 
      });
    }

    // Validate teacher exists and is active
    const validTeacher = await Teacher.findOne({ 
      _id: teacher, 
      isActive: true 
    });
    
    if (!validTeacher) {
      return res.status(400).json({ 
        message: "Teacher not found or inactive" 
      });
    }

    // Validate subject exists and is active
    const validSubject = await Subject.findOne({ 
      _id: subject, 
      isActive: true 
    });
    
    if (!validSubject) {
      return res.status(400).json({ 
        message: "Subject not found or inactive" 
      });
    }

    // Check if teacher is qualified to teach this subject
    if (!validTeacher.subjects.includes(subject)) {
      return res.status(400).json({ 
        message: "Teacher is not qualified to teach this subject" 
      });
    }

    const course = await Course.create({
      title,
      code: code.toUpperCase(),
      description,
      teacher,
      subject,
      schedule,
      maxStudents: maxStudents || 30
    });

    // Populate references for response
    const populatedCourse = await Course.findById(course._id)
      .populate("teacher", "name email department")
      .populate("subject", "name code credits");

    return res.status(201).json({
      message: "Course created successfully",
      course: populatedCourse
    });
  } catch (error) {
    console.error("Create Course Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Get All Courses
export async function getAllCourses(req, res) {
  try {
    const { activeOnly, teacherId, subjectId } = req.query;
    
    let filter = {};
    
    if (activeOnly === "true") {
      filter.isActive = true;
    }
    
    if (teacherId) {
      filter.teacher = teacherId;
    }
    
    if (subjectId) {
      filter.subject = subjectId;
    }
    
    const courses = await Course.find(filter)
      .populate("teacher", "name email department")
      .populate("subject", "name code")
      .sort({ code: 1 });
    
    return res.status(200).json({
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error("Get All Courses Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Get Course by ID
export async function getCourseById(req, res) {
  try {
    const { id } = req.params;
    
    const course = await Course.findById(id)
      .populate("teacher", "name email department qualification")
      .populate("subject", "name code credits description");
    
    if (!course) {
      return res.status(404).json({ 
        message: "Course not found" 
      });
    }
    
    return res.status(200).json({ course });
  } catch (error) {
    console.error("Get Course Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Update Course
export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Validate teacher if being updated
    if (updates.teacher) {
      const validTeacher = await Teacher.findOne({ 
        _id: updates.teacher, 
        isActive: true 
      });
      
      if (!validTeacher) {
        return res.status(400).json({ 
          message: "Teacher not found or inactive" 
        });
      }
      
      // Check if teacher is qualified for the subject
      if (updates.subject) {
        if (!validTeacher.subjects.includes(updates.subject)) {
          return res.status(400).json({ 
            message: "Teacher is not qualified to teach this subject" 
          });
        }
      } else {
        // Get current course to check existing subject
        const currentCourse = await Course.findById(id);
        if (currentCourse && !validTeacher.subjects.includes(currentCourse.subject)) {
          return res.status(400).json({ 
            message: "Teacher is not qualified to teach this course's subject" 
          });
        }
      }
    }
    
    // Validate subject if being updated
    if (updates.subject) {
      const validSubject = await Subject.findOne({ 
        _id: updates.subject, 
        isActive: true 
      });
      
      if (!validSubject) {
        return res.status(400).json({ 
          message: "Subject not found or inactive" 
        });
      }
      
      // Check if teacher (current or updated) is qualified
      const teacherId = updates.teacher || (await Course.findById(id)).teacher;
      const teacher = await Teacher.findById(teacherId);
      
      if (!teacher.subjects.includes(updates.subject)) {
        return res.status(400).json({ 
          message: "Teacher is not qualified to teach this subject" 
        });
      }
    }
    
    if (updates.code) {
      updates.code = updates.code.toUpperCase();
    }
    
    const course = await Course.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
      .populate("teacher", "name email department")
      .populate("subject", "name code");
    
    if (!course) {
      return res.status(404).json({ 
        message: "Course not found" 
      });
    }
    
    return res.status(200).json({
      message: "Course updated successfully",
      course
    });
  } catch (error) {
    console.error("Update Course Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Delete Course
export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    
    const course = await Course.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!course) {
      return res.status(404).json({ 
        message: "Course not found" 
      });
    }
    
    return res.status(200).json({
      message: "Course deactivated successfully",
      course
    });
  } catch (error) {
    console.error("Delete Course Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Get Courses by Teacher
export async function getCoursesByTeacher(req, res) {
  try {
    const { teacherId } = req.params;
    
    // Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ 
        message: "Teacher not found" 
      });
    }
    
    const courses = await Course.find({ 
      teacher: teacherId,
      isActive: true 
    })
      .populate("subject", "name code credits")
      .populate("teacher", "name department")
      .sort({ code: 1 });
    
    return res.status(200).json({
      teacher: teacher.name,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error("Get Courses by Teacher Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Get Courses by Subject
export async function getCoursesBySubject(req, res) {
  try {
    const { subjectId } = req.params;
    
    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ 
        message: "Subject not found" 
      });
    }
    
    const courses = await Course.find({ 
      subject: subjectId,
      isActive: true 
    })
      .populate("teacher", "name email department")
      .populate("subject", "name code")
      .sort({ code: 1 });
    
    return res.status(200).json({
      subject: subject.name,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error("Get Courses by Subject Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}