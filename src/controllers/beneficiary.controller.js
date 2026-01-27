const Beneficiary = require("../models/beneficiary.model");

/**
 * GET USER'S SAVED BENEFICIARIES
 */
const getBeneficiaries = async (req, res) => {
    try {
        const list = await Beneficiary.find({ owner: req.user.id })
            .sort({ lastUsedAt: -1 })
            .limit(20);

        res.json({
            success: true,
            count: list.length,
            beneficiaries: list,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * UPDATE BENEFICIARY NICKNAME
 */
const updateNickname = async (req, res) => {
    try {
        const { id } = req.params;
        const { nickname } = req.body;

        const beneficiary = await Beneficiary.findOneAndUpdate(
            { _id: id, owner: req.user.id },
            { nickname: nickname || null },
            { new: true }
        );

        if (!beneficiary) {
            return res.status(404).json({ message: "Beneficiary not found" });
        }

        res.json({
            success: true,
            message: "Nickname updated",
            beneficiary,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * DELETE BENEFICIARY
 */
const deleteBeneficiary = async (req, res) => {
    try {
        const { id } = req.params;

        const beneficiary = await Beneficiary.findOneAndDelete({
            _id: id,
            owner: req.user.id,
        });

        if (!beneficiary) {
            return res.status(404).json({ message: "Beneficiary not found" });
        }

        res.json({ success: true, message: "Beneficiary removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * HELPER: Save/update beneficiary after successful transfer
 * (Called from wallet.controller.js)
 */
const saveBeneficiaryFromTransfer = async (ownerId, recipientUser) => {
    try {
        const filter = {
            owner: ownerId,
            recipientEmail: recipientUser.email,
        };

        const update = {
            $set: {
                recipientName: `${recipientUser.firstName} ${recipientUser.lastName}`,
                recipientId: recipientUser._id,
                lastUsedAt: new Date(),
            },
            $inc: { transferCount: 1 },
        };

        // Upsert: Update if exists, create if new
        await Beneficiary.findOneAndUpdate(filter, update, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        });
    } catch (error) {
        console.error("Failed to save beneficiary:", error);
        
    }
};

module.exports = {
    getBeneficiaries,
    updateNickname,
    deleteBeneficiary,
    saveBeneficiaryFromTransfer,
};