const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

/**
 * @swagger
 * /workout:
 *   post:
 *     tags: [Workout]
 *     summary: Mashgʻulot (sport) yozuvini qoʻshish
 *     operationId: post_api_workout
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutInput'
 *     responses:
 *       201:
 *         description: Mashgʻulot saqlandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       401:
 *         description: Avtorizatsiyadan oʻtilmagan
 *   get:
 *     tags: [Workout]
 *     summary: Barcha mashgʻulotlar roʻyxatini olish
 *     operationId: get_api_workout
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mashgʻulotlar roʻyxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout'
 *       401:
 *         description: Avtorizatsiyadan oʻtilmagan
 */
router.post('/', workoutController.addWorkout);
router.get('/', workoutController.getWorkouts);

module.exports = router;
