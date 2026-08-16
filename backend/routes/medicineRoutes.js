const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

/**
 * @swagger
 * /medicine:
 *   post:
 *     tags: [Medicine]
 *     summary: Dori eslatmasini qoʻshish
 *     operationId: post_api_medicine
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicineInput'
 *     responses:
 *       201:
 *         description: Dori eslatmasi saqlandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medicine'
 *       401:
 *         description: Avtorizatsiyadan oʻtilmagan
 *   get:
 *     tags: [Medicine]
 *     summary: Dorilar roʻyxatini olish
 *     operationId: get_api_medicine
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dorilar roʻyxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Medicine'
 *       401:
 *         description: Avtorizatsiyadan oʻtilmagan
 */
router.post('/', medicineController.addMedicine);
router.get('/', medicineController.getMedicines);

/**
 * @swagger
 * /medicine/{id}:
 *   put:
 *     tags: [Medicine]
 *     summary: Dori ichilganlik holatini yangilash
 *     operationId: put_api_medicine_id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Dori ID si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicineStatusInput'
 *     responses:
 *       200:
 *         description: Holat yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Holat yangilandi
 *       401:
 *         description: Avtorizatsiyadan oʻtilmagan
 */
router.put('/:id', medicineController.updateMedicineStatus);

module.exports = router;
