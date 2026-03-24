import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import classRoutes from './routes/classRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';

const app = express();

/* ==============================
   Middleware cơ bản
============================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==============================
   Route kiểm tra server
============================== */
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Student Management API is running',
    });
});

/* ==============================
   API Routes
============================== */
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/enrollments', enrollmentRoutes);

/* ==============================
   404 handler
============================== */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

/* ==============================
   Global error handler
============================== */
app.use((err, req, res, next) => {
    console.error('Global error:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

export default app;