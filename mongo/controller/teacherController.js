import Teacher from "../model/teacherModel.js";
import Subject from "../model/subjectModel.js";

// Create Teacher
export async function createTeacher(req, res) {
  try {
    const { name, email, department, subjects, qualification, experience } = req.body;

    if (!name || !email || !department) {
      return res.status(400).json({
        message: "Missing required fields: name, email, department"
      });
    }

    // Check if email already exists
    const existingTeacher = await Teacher.findOne({ email: email.toLowerCase() });
    if (existingTeacher) {
      return res.status(409).json({ 
        message: "Teacher with this email already exists" 
      });
    }

    // Validate subject IDs if provided
    if (subjects && subjects.length > 0) {
      const validSubjects = await Subject.find({ 
        _id: { $in: subjects },
        isActive: true 
      });
      
      if (validSubjects.length !== subjects.length) {
        return res.status(400).json({ 
          message: "One or more subject IDs are invalid" 
        });
      }
    }

    const teacher = await Teacher.create({
      name,
      email: email.toLowerCase(),
      department,
      subjects: subjects || [],
      qualification,
      experience: experience || 0
    });

    // Populate subjects for response
    const populatedTeacher = await Teacher.findById(teacher._id)
      .populate("subjects", "name code");

    return res.status(201).json({
      message: "Teacher created successfully",
      teacher: populatedTeacher
    });
  } catch (error) {
    console.error("Create Teacher Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Get All Teachers
export async function getAllTeachers(req, res) {
  try {
    const { activeOnly, populateSubjects } = req.query;
    const filter = activeOnly === "true" ? { isActive: true } : {};
    
    let query = Teacher.find(filter).sort({ name: 1 });
    
    if (populateSubjects === "true") {
      query = query.populate("subjects", "name code");
    }
    
    const teachers = await query;
    
    return res.status(200).json({
      count: teachers.length,
      teachers
    });
  } catch (error) {
    console.error("Get All Teachers Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Get Teacher by ID
export async function getTeacherById(req, res) {
  try {
    const { id } = req.params;
    
    const teacher = await Teacher.findById(id)
      .populate("subjects", "name code credits");
    
    if (!teacher) {
      return res.status(404).json({ 
        message: "Teacher not found" 
      });
    }
    
    return res.status(200).json({ teacher });
  } catch (error) {
    console.error("Get Teacher Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Update Teacher
export async function updateTeacher(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Validate subject IDs if provided
    if (updates.subjects && updates.subjects.length > 0) {
      const validSubjects = await Subject.find({ 
        _id: { $in: updates.subjects },
        isActive: true 
      });
      
      if (validSubjects.length !== updates.subjects.length) {
        return res.status(400).json({ 
          message: "One or more subject IDs are invalid" 
        });
      }
    }
    
    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }
    
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate("subjects", "name code");
    
    if (!teacher) {
      return res.status(404).json({ 
        message: "Teacher not found" 
      });
    }
    
    return res.status(200).json({
      message: "Teacher updated successfully",
      teacher
    });
  } catch (error) {
    console.error("Update Teacher Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Delete Teacher
export async function deleteTeacher(req, res) {
  try {
    const { id } = req.params;
    
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!teacher) {
      return res.status(404).json({ 
        message: "Teacher not found" 
      });
    }
    
    return res.status(200).json({
      message: "Teacher deactivated successfully",
      teacher
    });
  } catch (error) {
    console.error("Delete Teacher Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Add Subject to Teacher
export async function addSubjectToTeacher(req, res) {
  try {
    const { teacherId, subjectId } = req.params;
    
    // Check if teacher exists and is active
    const teacher = await Teacher.findOne({ 
      _id: teacherId, 
      isActive: true 
    });
    
    if (!teacher) {
      return res.status(404).json({ 
        message: "Teacher not found or inactive" 
      });
    }
    
    // Check if subject exists and is active
    const subject = await Subject.findOne({ 
      _id: subjectId, 
      isActive: true 
    });
    
    if (!subject) {
      return res.status(404).json({ 
        message: "Subject not found or inactive" 
      });
    }
    
    // Check if subject already assigned
    if (teacher.subjects.includes(subjectId)) {
      return res.status(400).json({ 
        message: "Subject already assigned to this teacher" 
      });
    }
    
    // Add subject to teacher
    teacher.subjects.push(subjectId);
    await teacher.save();
    
    const updatedTeacher = await Teacher.findById(teacherId)
      .populate("subjects", "name code");
    
    return res.status(200).json({
      message: "Subject added to teacher successfully",
      teacher: updatedTeacher
    });
  } catch (error) {
    console.error("Add Subject to Teacher Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}