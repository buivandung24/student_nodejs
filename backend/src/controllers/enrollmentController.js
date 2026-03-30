import Enrollment from '../models/Enrollment.js';
import Student from '../models/Student.js';

const calcOverallGrade = (midtermScore, finalScore) => {
    const mid = Number(midtermScore ?? 0);
    const fin = Number(finalScore ?? 0);
    const avg = mid * 0.4 + fin * 0.6;

    if (avg >= 85) return 'A';
    if (avg >= 80) return 'B+';
    if (avg >= 75) return 'B';
    if (avg >= 70) return 'C+';
    if (avg >= 65) return 'C';
    if (avg >= 60) return 'D+';
    if (avg >= 50) return 'D';
    return 'F';
};

export const getEnrollments = async (req, res) => {
    try {
        const { semester, studentId, courseId, classId } = req.query;

        const filter = {};
        if (semester) filter.semester = semester;
        if (studentId) filter.student = studentId;
        if (courseId) filter.course = courseId;

        if (classId) {
            const studentsInClass = await Student.find({ class: classId }).select('_id');
            filter.student = { $in: studentsInClass.map((s) => s._id) };
        }

        const enrollments = await Enrollment.find(filter)
            .populate({
                path: 'student',
                select: 'studentId name email class department',
                populate: [
                    { path: 'class', select: 'classId name' },
                    { path: 'department', select: 'deptId name' },
                ],
            })
            .populate({
                path: 'course',
                select: 'courseId name credits department',
                populate: { path: 'department', select: 'deptId name' },
            })
            .sort({ createdAt: -1 });

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createEnrollment = async (req, res) => {
    try {
        const { student, course, semester } = req.body;

        const existed = await Enrollment.findOne({ student, course, semester });
        if (existed) {
            return res.status(409).json({ message: 'Sinh viên đã đăng ký môn này trong học kỳ này' });
        }

        const enrollment = await Enrollment.create(req.body);
        const populated = await Enrollment.findById(enrollment._id)
            .populate('student', 'studentId name')
            .populate('course', 'courseId name credits');

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const bulkRegisterStudents = async (req, res) => {
    try {
        const { studentIds, courseId, semester } = req.body;

        if (!Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({ message: 'Danh sách sinh viên trống' });
        }

        if (!courseId || !semester) {
            return res.status(400).json({ message: 'Thiếu courseId hoặc semester' });
        }

        let createdCount = 0;
        let skippedCount = 0;

        for (const studentId of studentIds) {
            const existed = await Enrollment.findOne({
                student: studentId,
                course: courseId,
                semester,
            });

            if (existed) {
                skippedCount += 1;
                continue;
            }

            await Enrollment.create({
                student: studentId,
                course: courseId,
                semester,
            });

            createdCount += 1;
        }

        res.json({
            message: 'Đăng ký môn hàng loạt thành công',
            createdCount,
            skippedCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const bulkUnregisterStudents = async (req, res) => {
    try {
        const { studentIds, courseId, semester } = req.body;

        if (!Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({ message: 'Danh sách sinh viên trống' });
        }

        if (!courseId || !semester) {
            return res.status(400).json({ message: 'Thiếu courseId hoặc semester' });
        }

        const result = await Enrollment.deleteMany({
            student: { $in: studentIds },
            course: courseId,
            semester,
        });

        res.json({
            message: 'Hủy đăng ký môn hàng loạt thành công',
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const saveGrades = async (req, res) => {
    try {
        const { grades } = req.body;

        if (!Array.isArray(grades) || grades.length === 0) {
            return res.status(400).json({ message: 'Không có dữ liệu điểm để lưu' });
        }

        for (const item of grades) {
            const midtermScore = item.midtermScore === '' ? undefined : Number(item.midtermScore);
            const finalScore = item.finalScore === '' ? undefined : Number(item.finalScore);

            const updateData = {
                midtermScore,
                finalScore,
            };

            if (midtermScore !== undefined && finalScore !== undefined) {
                updateData.overallGrade = calcOverallGrade(midtermScore, finalScore);
            }

            await Enrollment.findByIdAndUpdate(item.enrollmentId, updateData, { new: true });
        }

        res.json({ message: 'Lưu điểm thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEnrollment = async (req, res) => {
    try {
        const payload = { ...req.body };

        if (
            payload.midtermScore !== undefined &&
            payload.finalScore !== undefined &&
            payload.midtermScore !== '' &&
            payload.finalScore !== ''
        ) {
            payload.overallGrade = calcOverallGrade(payload.midtermScore, payload.finalScore);
        }

        const updated = await Enrollment.findByIdAndUpdate(req.params.id, payload, { new: true })
            .populate('student', 'studentId name')
            .populate('course', 'courseId name credits');

        if (!updated) {
            return res.status(404).json({ message: 'Không tìm thấy Enrollment' });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEnrollment = async (req, res) => {
    try {
        const deleted = await Enrollment.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Không tìm thấy Enrollment' });
        }

        res.json({ message: 'Đã xóa Enrollment' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};