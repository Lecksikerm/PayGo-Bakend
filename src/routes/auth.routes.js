const express = require("express");
const router = express.Router();
const User = require("../models/user.model"); // ← ADD THIS IMPORT
const auth = require("../controllers/auth.controller");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (no OTP required)
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
 *         description: User registered successfully. You can now log in.
 *       400:
 *         description: User already exists.
 */
router.post("/register", auth.register);

/**
 * @swagger
 * /auth/login:
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
 *         description: Invalid credentials
 */
router.post("/login", auth.login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send OTP to email for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully for password reset
 *       400:
 *         description: User not found
 */
router.post("/forgot-password", auth.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password using email + OTP
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
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "newstrongpassword"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid OTP or OTP expired
 */
router.post("/reset-password", auth.resetPassword);

/**
 * @swagger
 * /auth/verify-user:
 *   post:
 *     tags: [Auth]
 *     summary: Verify if user exists by email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: User verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 */
router.post("/verify-user", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() })
            .select('firstName lastName email');

        if (user) {
            res.json({
                exists: true,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            });
        } else {
            res.json({ exists: false });
        }
    } catch (err) {
        console.error("Verify user error:", err);
        res.status(500).json({ message: "Verification failed" });
    }
});

module.exports = router;