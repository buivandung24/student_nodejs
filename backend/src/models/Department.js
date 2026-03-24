const departmentSchema = new mongoose.Schema({
  deptId: { type: String, required: true, unique: true },
  name:   { type: String, required: true, unique: true },
}, { timestamps: true });