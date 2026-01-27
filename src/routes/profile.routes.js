const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const profileController = require("../controllers/profile.controller");
const upload = require("../middlewares/upload.middleware");


/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     tags: [Profile]
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, profileController.getProfile);

/**
 * @swagger
 * /profile:
 *   put:
 *     tags: [Profile]
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/", auth, profileController.updateProfile);

/**
 * @swagger
 * /profile/change-password:
 *   put:
 *     tags: [Profile]
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword456"
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Invalid password or missing fields
 *       401:
 *         description: Unauthorized or incorrect current password
 */
router.put("/change-password", auth, profileController.changePassword);

/**
 * @swagger
 * /profile/avatar:
 *   post:
 *     tags: [Profile]
 *     summary: Upload or update profile avatar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: No image file uploaded
 */
router.post("/avatar", auth, upload.single("avatar"), profileController.uploadAvatar);

/**
 * @swagger
 * /profile/delete:
 *   delete:
 *     tags: [Profile]
 *     summary: Delete user account permanently (requires password confirmation)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "userpassword123"
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Password is required or incorrect
 *       401:
 *         description: Unauthorized
 */
router.delete("/delete", auth, profileController.deleteAccount);


module.exports = router;

