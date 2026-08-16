const express = require('express');
const router = express.Router();
const waterController = require('../controllers/waterController');

/**
 * @swagger
 * /water:
 *   post:
 *     tags: [Water]
 *     summary: Suv isteʼmolini kiritish
 *     operationId: post_api_water
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WaterInput'
 *     responses:
 *       201:
 *         description: Suv yozuvi qoʻshildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Water'
 *       401:
 *         description: Avtorizatsiyadan oʻtilmagan
 *   get:
 *     tags: [Water]
 *     summary: Suv isteʼmoli tarixini olish
 *     operationId: get_api_water
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Suv yozuvlari roʻyxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Water'
 *       401:
 *         description: Avtorizatsiyadan oʻtilmagan
 */
router.post('/', waterController.addWater);
router.get('/', waterController.getWaterLogs);

module.exports = router;
