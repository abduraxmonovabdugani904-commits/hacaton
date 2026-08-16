const express = require('express');
const router = express.Router();
const sleepController = require('../controllers/sleepController');

/**
 * @swagger
 * /sleep:
 *   post:
 *     tags: [Sleep]
 *     summary: Uyqu maʼlumotlarini kiritish
 *     operationId: post_api_sleep
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SleepInput'
 *     responses:
 *       201:
 *         description: Uyqu yozuvi saqlandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sleep'
 *       401:
 *         description: Avtorizatsiyadan oʻtilmagan
 *   get:
 *     tags: [Sleep]
 *     summary: Uyqu yozuvlari tarixini olish
 *     operationId: get_api_sleep
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Uyqu yozuvlari roʻyxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sleep'
 *       401:
 *         description: Avtorizatsiyadan oʻtilmagan
 */
router.post('/', sleepController.addSleep);
router.get('/', sleepController.getSleepLogs);

module.exports = router;
