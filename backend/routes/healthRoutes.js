const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

/**
 * @swagger
 * /health/score:
 *   get:
 *     tags: [Health]
 *     summary: Bugungi umumiy salomatlik ballini (Health Score) hisoblash va olish
 *     operationId: get_api_health_score
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Salomatlik bali va tafsilotlari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 health_score:
 *                   type: integer
 *                   example: 85
 *                 details:
 *                   type: object
 *                   properties:
 *                     waterScore:
 *                       type: number
 *                       example: 20
 *                     workoutScore:
 *                       type: number
 *                       example: 15
 *                     sleepScore:
 *                       type: number
 *                       example: 30
 *                     medicineScore:
 *                       type: number
 *                       example: 20
 *       401:
 *         description: Avtorizatsiyadan oʻtilmagan
 */
router.get('/score', healthController.calculateHealthScore);

module.exports = router;
