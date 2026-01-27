const Notification = require("../models/notification.model");

/**
 * Get user's notifications
 */
const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly = false } = req.query;

        const filter = { user: req.user.id };
        if (unreadOnly === 'true') filter.read = false;

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const unreadCount = await Notification.countDocuments({
            user: req.user.id,
            read: false
        });

        res.json({
            notifications,
            unreadCount,
            total: await Notification.countDocuments({ user: req.user.id })
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Mark notification as read
 */
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { read: true, readAt: new Date() },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        const unreadCount = await Notification.countDocuments({
            user: req.user.id,
            read: false
        });

        res.json({ message: "Marked as read", unreadCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Mark all as read
 */
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, read: false },
            { read: true, readAt: new Date() }
        );

        res.json({ message: "All notifications marked as read", unreadCount: 0 });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Delete notification
 */
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findOneAndDelete({ _id: id, user: req.user.id });
        res.json({ message: "Notification deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};