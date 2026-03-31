import Department from '../models/Department.js';

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Không tìm thấy Department' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { deptId, name } = req.body;

    if (!deptId || !name) {
      return res.status(400).json({ message: 'Vui lòng nhập deptId và name' });
    }

    const existed = await Department.findOne({
      $or: [{ deptId }, { name }],
    });

    if (existed) {
      return res.status(400).json({ message: 'Department ID hoặc tên khoa đã tồn tại' });
    }

    const department = await Department.create({ deptId, name });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!department) {
      return res.status(404).json({ message: 'Không tìm thấy Department' });
    }

    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Không tìm thấy Department' });
    }

    res.json({ message: 'Đã xóa Department' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};