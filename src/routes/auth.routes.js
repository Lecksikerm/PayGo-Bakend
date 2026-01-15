const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication & verification
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user and receive OTP via email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       201:
 *         description: User registered successfully. OTP sent to email.
 *       400:
 *         description: User already exists.
 */
router.post("/register", auth.register);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify user OTP sent to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *       400:
 *         description: Invalid or expired OTP.
 */
router.post("/verify-otp", auth.verifyOtp);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and return access token + user data
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials or account not verified
 */
router.post("/login", auth.login);

module.exports = router;


