import Student from '../models/Student.js';

export const getStudents = async (req, res) => {
  const students = await Student.find()
    .populate('department', 'name')
    .populate('class', 'name');
  res.json(students);
};

export const createStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
};

export const updateStudent = async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('department', 'name')
    .populate('class', 'name');
  if (!updated) return res.status(404).json({ message: 'Không tìm thấy Student' });
  res.json(updated);
};

export const deleteStudent = async (req, res) => {
  const deleted = await Student.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Không tìm thấy Student' });
  res.json({ message: 'Đã xóa Student' });
};