const User = require("../models/user.model");
const cloudinary = require("../config/cloudinary");
const {
    sendPasswordChangedEmail,
    sendAccountDeletedEmail
} = require("../services/email.service");


// GET PROFILE
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            message: "Profile fetched successfully",
            user
        });
    } catch (err) {
        console.error("Get profile error:", err);
        res.status(500).json({ message: "Failed to fetch profile" });
    }
};


// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, address } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Only update provided fields
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            message: "Profile updated successfully",
            user: userResponse
        });
    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ message: "Failed to update profile" });
    }
};


// CHANGE PASSWORD (Non-blocking email)
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" });
        }

        const user = await User.findById(req.user.id).select("+password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

        // Check if new password is same as old
        const samePassword = await user.matchPassword(newPassword);
        if (samePassword) return res.status(400).json({ message: "New password cannot be the same as the current password" });

        // Update password
        user.password = newPassword;
        await user.save();

        // Send email in background (non-blocking)
        sendPasswordChangedEmail(user.email)
            .catch(err => console.error("Password changed email failed:", err));

        res.json({ message: "Password changed successfully" });

    } catch (err) {
        console.error("Change password error:", err);
        res.status(500).json({ message: "Failed to change password" });
    }
};


// UPLOAD AVATAR
exports.uploadAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!req.file) return res.status(400).json({ message: "No image file uploaded" });

        // Delete old avatar if exists
        if (user.avatar && user.avatar.includes('cloudinary')) {
            try {
                const oldPublicId = user.avatar.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy("paygo/avatars/" + oldPublicId);
            } catch (cloudErr) {
                console.error("Failed to delete old avatar:", cloudErr);
                
            }
        }

        user.avatar = req.file.path;
        await user.save();

        res.json({
            message: "Avatar uploaded successfully",
            avatar: user.avatar,
        });

    } catch (err) {
        console.error("Upload avatar error:", err);
        res.status(500).json({ message: "Failed to upload avatar" });
    }
};


// DELETE ACCOUNT 
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password } = req.body;

        if (!password) return res.status(400).json({ message: "Password is required to delete account" });

        const user = await User.findById(userId).select("+password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        // Delete user
        await User.findByIdAndDelete(userId);

        // Send email in background 
        sendAccountDeletedEmail(user.email)
            .catch(err => console.error("Account deleted email failed:", err));

        res.json({ message: "Account deleted successfully" });

    } catch (err) {
        console.error("Delete account error:", err);
        res.status(500).json({ message: "Failed to delete account" });
    }
};
