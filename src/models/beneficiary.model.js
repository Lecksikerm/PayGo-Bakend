const mongoose = require("mongoose");

const beneficiarySchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        recipientEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        recipientName: {
            type: String,
            required: true,
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        nickname: {
            type: String,
            trim: true,
            default: null,
        },
        transferCount: {
            type: Number,
            default: 1,
        },
        lastUsedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Prevent duplicate beneficiaries per user (by email)
beneficiarySchema.index({ owner: 1, recipientEmail: 1 }, { unique: true });

module.exports = mongoose.model("Beneficiary", beneficiarySchema);