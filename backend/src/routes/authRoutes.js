// src/backend/main/routes/authroutes.js
const express = require('express');
const router = express.Router();
const { signup, login, loginWithGoogle } = require('../services/api');
const { requireRole } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const user = await signup(req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Login with email or phone
router.post('/login', async (req, res) => {
  try {
    const result = await login(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Login with Google OAuth
router.post('/login/google', async (req, res) => {
  try {
    const result = await loginWithGoogle(req.body.googleProfile);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Admin dashboard
router.get('/admin/dashboard', requireRole('ADMIN'), (req, res) => {
  res.json({ success: true, message: "Welcome to Admin Dashboard" });
});

// Super Admin dashboard
router.get('/super/dashboard', requireRole('SUPER_ADMIN'), (req, res) => {
  res.json({ success: true, message: "Welcome to Super Admin Dashboard" });
});

// User dashboard
router.get('/client/dashboard', requireRole('USER'), (req, res) => {
  res.json({ success: true, message: "Welcome to User Dashboard" });
});

module.exports = router;
