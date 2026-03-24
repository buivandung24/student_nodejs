import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseId:   { type: String, required: true, unique: true },
  name:       { type: String, required: true },
  credits:    { type: Number, required: true, min: 1 },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);