import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kết nối DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Routes
import authRoutes from './src/routes/authRoutes.js';
import departmentRoutes from './src/routes/departmentRoutes.js';
import classRoutes from './src/routes/classRoutes.js';
import courseRoutes from './src/routes/courseRoutes.js';
import studentRoutes from './src/routes/studentRoutes.js';
import enrollmentRoutes from './src/routes/enrollmentRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.get('/', (req, res) => res.send('🚀 Student Management API is running!'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
