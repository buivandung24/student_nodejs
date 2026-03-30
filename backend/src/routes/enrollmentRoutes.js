import express from 'express';
import {
  getEnrollments,
  createEnrollment,
  bulkRegisterStudents,
  bulkUnregisterStudents,
  saveGrades,
  updateEnrollment,
  deleteEnrollment,
} from '../controllers/enrollmentController.js';

const router = express.Router();

router.get('/', getEnrollments);
router.post('/', createEnrollment);
router.post('/bulk-register', bulkRegisterStudents);
router.post('/bulk-unregister', bulkUnregisterStudents);
router.put('/grades', saveGrades);
router.put('/:id', updateEnrollment);
router.delete('/:id', deleteEnrollment);

export default router;