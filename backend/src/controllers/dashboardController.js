import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Department from '../models/Department.js';
import Class from '../models/Class.js';
import Enrollment from '../models/Enrollment.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const [
      totalStudents,
      totalCourses,
      totalDepartments,
      totalClasses,
      totalEnrollments,
    ] = await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      Department.countDocuments(),
      Class.countDocuments(),
      Enrollment.countDocuments(),
    ]);

    res.json({
      totalStudents,
      totalCourses,
      totalDepartments,
      totalClasses,
      totalEnrollments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};