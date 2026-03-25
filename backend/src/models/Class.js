import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  classId:    { type: String, required: true, unique: true },
  name:       { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
}, { timestamps: true });

export default mongoose.model('Class', classSchema);