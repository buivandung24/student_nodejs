import Class from '../models/Class.js';

export const getClasses = async (req, res) => {
  try {
    const { departmentId } = req.query;

    const filter = {};
    if (departmentId) {
      filter.department = departmentId;
    }

    const classes = await Class.find(filter)
      .populate('department', 'deptId name')
      .sort({ name: 1 });

    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id).populate('department', 'deptId name');

    if (!classData) {
      return res.status(404).json({ message: 'Không tìm thấy Class' });
    }

    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createClass = async (req, res) => {
  try {
    const { classId, name, department } = req.body;

    if (!classId || !name || !department) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ classId, name, department' });
    }

    const existed = await Class.findOne({ classId });
    if (existed) {
      return res.status(400).json({ message: 'Class ID đã tồn tại' });
    }

    const classData = await Class.create({ classId, name, department });
    const populated = await Class.findById(classData._id).populate('department', 'deptId name');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('department', 'deptId name');

    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy Class' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy Class' });
    }

    res.json({ message: 'Đã xóa Class' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};