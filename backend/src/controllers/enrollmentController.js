import Enrollment from '../models/Enrollment.js';

export const getEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find()
    .populate('student', 'studentId name')
    .populate('course', 'courseId name credits');
  res.json(enrollments);
};

export const createEnrollment = async (req, res) => {
  const enrollment = await Enrollment.create(req.body);
  res.status(201).json(enrollment);
};

export const updateEnrollment = async (req, res) => {
  const updated = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('student', 'studentId name')
    .populate('course', 'courseId name credits');
  if (!updated) return res.status(404).json({ message: 'Không tìm thấy Enrollment' });
  res.json(updated);
};

export const deleteEnrollment = async (req, res) => {
  const deleted = await Enrollment.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Không tìm thấy Enrollment' });
  res.json({ message: 'Đã xóa Enrollment' });
};