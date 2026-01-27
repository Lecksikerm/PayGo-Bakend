const express = require("express");
const router = express.Router();
const beneficiaryController = require("../controllers/beneficiary.controller");
const auth = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Beneficiaries
 *   description: Saved beneficiaries management for quick transfers
 */

/**
 * @swagger
 * /beneficiaries:
 *   get:
 *     tags: [Beneficiaries]
 *     summary: Get user's saved beneficiaries
 *     description: Retrieve list of saved transfer recipients sorted by most recently used
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of beneficiaries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 5
 *                 beneficiaries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       recipientEmail:
 *                         type: string
 *                       recipientName:
 *                         type: string
 *                       nickname:
 *                         type: string
 *                       transferCount:
 *                         type: number
 *                       lastUsedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", auth, beneficiaryController.getBeneficiaries);

/**
 * @swagger
 * /beneficiaries/{id}/nickname:
 *   patch:
 *     tags: [Beneficiaries]
 *     summary: Update beneficiary nickname
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 example: "My Brother"
 *     responses:
 *       200:
 *         description: Nickname updated
 *       404:
 *         description: Beneficiary not found
 */
router.patch("/:id/nickname", auth, beneficiaryController.updateNickname);

/**
 * @swagger
 * /beneficiaries/{id}:
 *   delete:
 *     tags: [Beneficiaries]
 *     summary: Remove a beneficiary
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Beneficiary removed
 *       404:
 *         description: Beneficiary not found
 */
router.delete("/:id", auth, beneficiaryController.deleteBeneficiary);

module.exports = router;