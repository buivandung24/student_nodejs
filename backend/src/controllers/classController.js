import Class from '../models/Class.js';

export const getClasses = async (req, res) => {
  const classes = await Class.find().populate('department', 'name');
  res.json(classes);
};

export const createClass = async (req, res) => {
  const classData = await Class.create(req.body);
  res.status(201).json(classData);
};

export const updateClass = async (req, res) => {
  const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Không tìm thấy Class' });
  res.json(updated);
};

export const deleteClass = async (req, res) => {
  const deleted = await Class.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Không tìm thấy Class' });
  res.json({ message: 'Đã xóa Class' });
};