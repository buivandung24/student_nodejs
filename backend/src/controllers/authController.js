import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register
export const registerUser = async (req, res) => {
  const { username, password, fullName, email, role, phone } = req.body;

  try {
    if (!username || !password || !fullName || !email || !role) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin bắt buộc' });
    }

    const userExists = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
    });

    if (userExists) {
      return res.status(400).json({ message: 'Username hoặc Email đã tồn tại' });
    }

    const user = await User.create({
      username,
      password,
      fullName,
      email,
      role,
      phone,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập username và password' });
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/profile
export const getMyProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/logout
export const logoutUser = async (req, res) => {
  res.json({ message: 'Đăng xuất thành công' });
};