import Student from '../models/Student.js';
import Enrollment from '../models/Enrollment.js';

export const getStudents = async (req, res) => {
  try {
    const { departmentId, classId, search } = req.query;

    const filter = {};
    if (departmentId) filter.department = departmentId;
    if (classId) filter.class = classId;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(filter)
      .populate('department', 'deptId name')
      .populate('class', 'classId name')
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('department', 'deptId name')
      .populate('class', 'classId name');

    if (!student) {
      return res.status(404).json({ message: 'Không tìm thấy Student' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentDetail = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('department', 'deptId name')
      .populate('class', 'classId name');

    if (!student) {
      return res.status(404).json({ message: 'Không tìm thấy Student' });
    }

    const enrollments = await Enrollment.find({ student: student._id })
      .populate({
        path: 'course',
        select: 'courseId name credits department',
        populate: { path: 'department', select: 'deptId name' },
      })
      .sort({ createdAt: -1 });

    res.json({
      student,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { studentId, name, email, dob, gender, department, class: classId } = req.body;

    if (!studentId || !name || !email || !dob || !gender || !department || !classId) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin sinh viên' });
    }

    const existed = await Student.findOne({
      $or: [{ studentId }, { email }],
    });

    if (existed) {
      return res.status(400).json({ message: 'Student ID hoặc email đã tồn tại' });
    }

    const student = await Student.create({
      studentId,
      name,
      email,
      dob,
      gender,
      department,
      class: classId,
    });

    const populated = await Student.findById(student._id)
      .populate('department', 'deptId name')
      .populate('class', 'classId name');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('department', 'deptId name')
      .populate('class', 'classId name');

    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy Student' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy Student' });
    }

    await Enrollment.deleteMany({ student: deleted._id });

    res.json({ message: 'Đã xóa Student' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};