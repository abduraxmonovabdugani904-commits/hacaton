const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Yangi foydalanuvchini roʻyxatdan oʻtkazish
 *     operationId: post_api_auth_register
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Foydalanuvchi muvaffaqiyatli roʻyxatdan oʻtdi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Foydalanuvchi allaqachon mavjud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server xatosi
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Tizimga kirish (Login)
 *     operationId: post_api_auth_login
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli tizimga kirildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Email yoki parol notoʻgʻri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server xatosi
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Joriy foydalanuvchi profil maʼlumotlarini olish
 *     operationId: get_api_auth_me
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil maʼlumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Avtorizatsiyadan oʻtilmagan
 */
router.get('/me', protect, authController.getMe);

module.exports = router;
