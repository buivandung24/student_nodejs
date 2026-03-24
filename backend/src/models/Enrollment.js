const enrollmentSchema = new mongoose.Schema({
  student:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester:  { type: String, required: true },        // ví dụ: "Semester 1 2026"

  enrolledAt: { type: Date, default: Date.now },

  midtermScore: { type: Number, min: 0, max: 100 },
  finalScore:   { type: Number, min: 0, max: 100 },
  overallGrade: { type: String, enum: ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'] },

}, { timestamps: true });

enrollmentSchema.index({ student: 1, course: 1, semester: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);