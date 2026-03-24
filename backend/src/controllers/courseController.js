import Course from '../models/Course.js';

export const getCourses = async (req, res) => {
  const courses = await Course.find().populate('department', 'name');
  res.json(courses);
};

export const createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
};

export const updateCourse = async (req, res) => {
  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Không tìm thấy Course' });
  res.json(updated);
};

export const deleteCourse = async (req, res) => {
  const deleted = await Course.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Không tìm thấy Course' });
  res.json({ message: 'Đã xóa Course' });
};