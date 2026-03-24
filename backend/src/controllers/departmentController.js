import Department from '../models/Department.js';

export const getDepartments = async (req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.json(departments);
};

export const createDepartment = async (req, res) => {
  const { deptId, name } = req.body;
  const department = await Department.create({ deptId, name });
  res.status(201).json(department);
};

export const updateDepartment = async (req, res) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!department) return res.status(404).json({ message: 'Không tìm thấy Department' });
  res.json(department);
};

export const deleteDepartment = async (req, res) => {
  const department = await Department.findByIdAndDelete(req.params.id);
  if (!department) return res.status(404).json({ message: 'Không tìm thấy Department' });
  res.json({ message: 'Đã xóa Department' });
};