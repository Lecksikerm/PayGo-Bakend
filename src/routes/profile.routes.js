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
 * /api/profile:
 *   get:
 *     tags: [Profile]
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
router.get("/", auth, profileController.getProfile);

/**
 * @swagger
 * /api/profile:
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
 */
router.put("/", auth, profileController.updateProfile);

/**
 * @swagger
 * /api/profile/change-password:
 *   post:
 *     tags: [Profile]
 *     summary: Change password
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
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid password
 */
router.post("/change-password", auth, profileController.changePassword);

/**
 * @swagger
 * /api/profile/avatar:
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
 */
router.post("/avatar", auth, upload.single("avatar"), profileController.uploadAvatar);

/**
 * @swagger
 * /api/profile/delete:
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
 *         description: Incorrect password
 *       401:
 *         description: Unauthorized
 */
router.delete("/delete", auth, profileController.deleteAccount);


module.exports = router;

