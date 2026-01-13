import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  }],
  qualification: {
    type: String,
    trim: true
  },
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;