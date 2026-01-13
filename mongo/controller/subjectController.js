import Subject from "../model/subjectModel.js";

// Create Subject (Admin only)
export async function createSubject(req, res) {
  try {
    const { name, code, description, credits } = req.body;

    if (!name || !code || !credits) {
      return res.status(400).json({
        message: "Missing required fields: name, code, credits"
      });
    }

    const existingSubject = await Subject.findOne({ 
      $or: [{ name }, { code }] 
    });

    if (existingSubject) {
      return res.status(409).json({ 
        message: "Subject with this name or code already exists" 
      });
    }

    const subject = await Subject.create({
      name,
      code: code.toUpperCase(),
      description,
      credits
    });

    return res.status(201).json({
      message: "Subject created successfully",
      subject
    });
  } catch (error) {
    console.error("Create Subject Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Get All Subjects
export async function getAllSubjects(req, res) {
  try {
    const { activeOnly } = req.query;
    const filter = activeOnly === "true" ? { isActive: true } : {};
    
    const subjects = await Subject.find(filter).sort({ name: 1 });
    
    return res.status(200).json({
      count: subjects.length,
      subjects
    });
  } catch (error) {
    console.error("Get All Subjects Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Get Subject by ID
export async function getSubjectById(req, res) {
  try {
    const { id } = req.params;
    
    const subject = await Subject.findById(id);
    
    if (!subject) {
      return res.status(404).json({ 
        message: "Subject not found" 
      });
    }
    
    return res.status(200).json({ subject });
  } catch (error) {
    console.error("Get Subject Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Update Subject
export async function updateSubject(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.code) {
      updates.code = updates.code.toUpperCase();
    }
    
    const subject = await Subject.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!subject) {
      return res.status(404).json({ 
        message: "Subject not found" 
      });
    }
    
    return res.status(200).json({
      message: "Subject updated successfully",
      subject
    });
  } catch (error) {
    console.error("Update Subject Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Delete Subject (Soft delete by setting isActive to false)
export async function deleteSubject(req, res) {
  try {
    const { id } = req.params;
    
    const subject = await Subject.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!subject) {
      return res.status(404).json({ 
        message: "Subject not found" 
      });
    }
    
    return res.status(200).json({
      message: "Subject deactivated successfully",
      subject
    });
  } catch (error) {
    console.error("Delete Subject Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}