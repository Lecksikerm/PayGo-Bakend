const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const notificationController = require("../controllers/notification.controller");

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notifications management
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get user notifications
 *     description: Retrieve paginated list of notifications with unread count
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Filter only unread notifications
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [credit, debit, wallet_funded, security]
 *                       title:
 *                         type: string
 *                       message:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       read:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 unreadCount:
 *                   type: number
 *                   example: 5
 *                 total:
 *                   type: number
 *                   example: 25
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, notificationController.getNotifications);

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark notification as read
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Marked as read"
 *                 unreadCount:
 *                   type: number
 *                   example: 4
 *       404:
 *         description: Notification not found
 */
router.patch("/:id/read", auth, notificationController.markAsRead);

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All notifications marked as read"
 *                 unreadCount:
 *                   type: number
 *                   example: 0
 */
router.patch("/read-all", auth, notificationController.markAllAsRead);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete notification
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted
 *       404:
 *         description: Notification not found
 */
router.delete("/:id", auth, notificationController.deleteNotification);

module.exports = router;