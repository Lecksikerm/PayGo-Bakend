const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["credit", "debit", "wallet_funded", "security"],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
        },
        relatedTransaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
        },
        read: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
        }
    },
    { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model("Notification", notificationSchema);