import express from 'express';
import {
  getStudents,
  getStudentById,
  getStudentDetail,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';

const router = express.Router();

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.get('/:id/detail', getStudentDetail);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;