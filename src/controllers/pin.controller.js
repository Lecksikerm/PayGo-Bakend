const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

// @desc    Check if user has PIN set
// @route   GET /api/wallet/pin-status
// @access  Private
exports.getPinStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("walletPin");

        res.json({
            success: true,
            hasPin: !!user.walletPin,
            pinSetAt: user.pinSetAt,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Set wallet PIN (requires password verification)
// @route   POST /api/wallet/set-pin
// @access  Private
exports.setPin = async (req, res) => {
    try {
        const { pin, password } = req.body;

        // Validate PIN format
        if (!/^\d{4}$/.test(pin)) {
            return res.status(400).json({
                success: false,
                message: "PIN must be exactly 4 digits"
            });
        }

        // Validate password provided
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required to set PIN"
            });
        }

        // Get user with password
        const user = await User.findById(req.user.id).select("+password +walletPin");

        // Check if PIN already exists
        if (user.walletPin) {
            return res.status(400).json({
                success: false,
                message: "PIN already set. Use change PIN instead."
            });
        }

        // Verify password
        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Set PIN
        user.walletPin = pin;
        user.pinSetAt = new Date();
        await user.save();

        res.json({
            success: true,
            message: "Wallet PIN set successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Change/Reset wallet PIN (requires old PIN or password)
// @route   POST /api/wallet/change-pin
// @access  Private
exports.changePin = async (req, res) => {
    try {
        const { currentPin, newPin, password } = req.body;

        // Validate new PIN format
        if (!/^\d{4}$/.test(newPin)) {
            return res.status(400).json({
                success: false,
                message: "New PIN must be exactly 4 digits"
            });
        }

        // Get user with PIN and password
        const user = await User.findById(req.user.id).select("+walletPin +password");

        if (!user.walletPin) {
            return res.status(400).json({
                success: false,
                message: "No PIN set. Please set PIN first."
            });
        }

        let isAuthorized = false;

        // Option 1: Verify with current PIN
        if (currentPin) {
            isAuthorized = await user.matchPin(currentPin);
            if (!isAuthorized) {
                return res.status(401).json({
                    success: false,
                    message: "Current PIN is incorrect"
                });
            }
        }
        // Option 2: Verify with password (for forgot PIN scenario)
        else if (password) {
            isAuthorized = await user.matchPassword(password);
            if (!isAuthorized) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password"
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Either current PIN or password is required"
            });
        }

        // Update PIN
        user.walletPin = newPin;
        user.pinSetAt = new Date();
        await user.save();

        res.json({
            success: true,
            message: "Wallet PIN changed successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Verify wallet PIN
// @route   POST /api/wallet/verify-pin
// @access  Private
exports.verifyPin = async (req, res) => {
    try {
        const { pin } = req.body;

        if (!pin || !/^\d{4}$/.test(pin)) {
            return res.status(400).json({
                success: false,
                message: "PIN must be 4 digits"
            });
        }

        const user = await User.findById(req.user.id).select("+walletPin");

        if (!user.walletPin) {
            return res.status(400).json({
                success: false,
                message: "No PIN set for this wallet"
            });
        }

        const isMatch = await user.matchPin(pin);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect PIN"
            });
        }

        res.json({
            success: true,
            message: "PIN verified successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

