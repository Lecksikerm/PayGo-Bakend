const express = require("express");
const router = express.Router();
const walletController = require("../controllers/wallet.controller");
const auth = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Wallet operations (balance, funding, transfers)
 */

/**
 * @swagger
 * /wallet/balance:
 *   get:
 *     tags: [Wallet]
 *     summary: Get wallet balance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   example: 15000.00
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 */
router.get("/balance", auth, walletController.getWallet);

/**
 * @swagger
 * /wallet/fund/paystack:
 *   post:
 *     tags: [Wallet]
 *     summary: Initialize Paystack wallet funding
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Paystack payment initialized
 */
router.post("/fund/paystack", auth, walletController.fundWalletPaystack);

/**
 * @swagger
 * /wallet/verify/{reference}:
 *   get:
 *     tags: [Wallet]
 *     summary: Verify Paystack payment
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet funded successfully
 */
router.get("/verify/:reference", auth, walletController.verifyFunding);

/**
 * @swagger
 * /wallet/webhook/paystack:
 *   post:
 *     tags: [Wallet]
 *     summary: Paystack webhook for automatic wallet funding
 *     description: Does not require Bearer auth (uses Paystack signature verification)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 */
router.post("/webhook/paystack", walletController.paystackWebhook);

/**
 * @swagger
 * /wallet/transfer:
 *   post:
 *     tags: [Wallet]
 *     summary: Transfer funds to another user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientEmail
 *               - amount
 *               - pin
 *             properties:
 *               recipientEmail:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               amount:
 *                 type: number
 *                 example: 1000
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Transfer successful
 */
router.post("/transfer", auth, walletController.transfer);

/**
 * @swagger
 * /wallet/transactions:
 *   get:
 *     tags: [Wallet]
 *     summary: Get transaction history (Paginated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [credit, debit]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 */
router.get("/transactions", auth, walletController.getTransactions);

/**
 * @swagger
 * /wallet/transactions/{id}:
 *   get:
 *     tags: [Wallet]
 *     summary: Get transaction by ID
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
 *         description: Transaction found
 *       404:
 *         description: Transaction not found
 */
router.get("/transactions/:id", auth, walletController.getTransactionById);

module.exports = router;