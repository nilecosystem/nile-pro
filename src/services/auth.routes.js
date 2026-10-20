// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { signup, login, loginWithGoogle, requireRole } = require('../services/api'); // اگر اسم فایل api.ts هست، بعد از build به js تبدیل میشه

// ثبت‌نام
router.post('/register', async (req, res) => {
  try {
    const user = await signup(req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ورود با ایمیل یا شماره تلفن
router.post('/login', async (req, res) => {
  try {
    const result = await login(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ورود با Google OAuth
router.post('/login/google', async (req, res) => {
  try {
    const result = await loginWithGoogle(req.body.googleProfile);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// پنل ادمین
router.get('/admin/dashboard', requireRole('ADMIN'), (req, res) => {
  res.json({ success: true, message: "خوش آمدید به پنل ادمین" });
});

// پنل سوپرادمین
router.get('/super/dashboard', requireRole('SUPER_ADMIN'), (req, res) => {
  res.json({ success: true, message: "خوش آمدید به پنل سوپرادمین" });
});

// پنل کاربر عادی
router.get('/client/dashboard', requireRole('USER'), (req, res) => {
  res.json({ success: true, message: "خوش آمدید به پنل کاربر" });
});

module.exports = router;
