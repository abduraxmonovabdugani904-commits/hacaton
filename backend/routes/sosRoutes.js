const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sosController');

/**
 * @swagger
 * /sos/contact:
 *   post:
 *     tags: [SOS]
 *     summary: Shoshilinch aloqa kontaktini qoʻshish
 *     operationId: post_api_sos_contact
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SOSContactInput'
 *     responses:
 *       201:
 *         description: SOS kontakti saqlandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SOSContact'
 *       401:
 *         description: Avtorizatsiyadan oʻtilmagan
 *   get:
 *     tags: [SOS]
 *     summary: SOS kontaktlari roʻyxatini olish
 *     operationId: get_api_sos_contact
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SOS kontaktlari roʻyxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SOSContact'
 *       401:
 *         description: Avtorizatsiyadan oʻtilmagan
 */
router.post('/contact', sosController.addSOSContact);
router.get('/contact', sosController.getSOSContacts);

/**
 * @swagger
 * /sos/send:
 *   post:
 *     tags: [SOS]
 *     summary: Saqlangan barcha kontaktlarga Shoshilinch SOS xabarini yuborish
 *     operationId: post_api_sos_send
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SOS xabari muvaffaqiyatli yuborildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SOS yuborildi 2 ta kontaktga
 *                 contacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SOSContact'
 *       401:
 *         description: Avtorizatsiyadan oʻtilmagan
 */
router.post('/send', sosController.sendSOS);

module.exports = router;
