const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const pinController = require("../controllers/pin.controller");

/**
 * @swagger
 * tags:
 *   name: Wallet PIN
 *   description: Wallet PIN management
 */

/**
 * @swagger
 * /wallet/pin/status:
 *   get:
 *     summary: Check if user has PIN set
 *     tags: [Wallet PIN]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PIN status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 hasPin:
 *                   type: boolean
 *                 pinSetAt:
 *                   type: string
 *                   format: date-time
 */
router.get("/status", protect, pinController.getPinStatus);

/**
 * @swagger
 * /wallet/pin/set:
 *   post:
 *     summary: Set wallet PIN (requires password)
 *     tags: [Wallet PIN]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pin
 *               - password
 *             properties:
 *               pin:
 *                 type: string
 *                 example: "1234"
 *               password:
 *                 type: string
 *                 example: "yourpassword123"
 *     responses:
 *       200:
 *         description: PIN set successfully
 *       400:
 *         description: Validation error or PIN already set
 */
router.post("/set", protect, pinController.setPin);

/**
 * @swagger
 * /wallet/pin/change:
 *   post:
 *     summary: Change wallet PIN (requires current PIN or password)
 *     tags: [Wallet PIN]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPin
 *             properties:
 *               currentPin:
 *                 type: string
 *                 example: "1234"
 *               newPin:
 *                 type: string
 *                 example: "5678"
 *               password:
 *                 type: string
 *                 example: "yourpassword123"
 *     responses:
 *       200:
 *         description: PIN changed successfully
 *       400:
 *         description: Validation error
 */
router.post("/change", protect, pinController.changePin);

/**
 * @swagger
 * /wallet/pin/verify:
 *   post:
 *     summary: Verify wallet PIN
 *     tags: [Wallet PIN]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pin
 *             properties:
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: PIN verified successfully
 *       400:
 *         description: Invalid PIN
 */
router.post("/verify", protect, pinController.verifyPin);

module.exports = router;