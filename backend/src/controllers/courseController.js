import Course from '../models/Course.js';

export const getCourses = async (req, res) => {
  try {
    const { departmentId } = req.query;

    const filter = {};
    if (departmentId) {
      filter.department = departmentId;
    }

    const courses = await Course.find(filter)
      .populate('department', 'deptId name')
      .sort({ name: 1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('department', 'deptId name');

    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy Course' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { courseId, name, credits, department } = req.body;

    if (!courseId || !name || !credits || !department) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ courseId, name, credits, department' });
    }

    const existed = await Course.findOne({ courseId });
    if (existed) {
      return res.status(400).json({ message: 'Course ID đã tồn tại' });
    }

    const course = await Course.create({
      courseId,
      name,
      credits,
      department,
    });

    const populated = await Course.findById(course._id).populate('department', 'deptId name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('department', 'deptId name');

    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy Course' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy Course' });
    }

    res.json({ message: 'Đã xóa Course' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};