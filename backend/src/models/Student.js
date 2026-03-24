const studentSchema = new mongoose.Schema({
  studentId:  { type: String, required: true, unique: true },
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  dob:        { type: Date, required: true },
  gender:     { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  class:      { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
}, { timestamps: true });