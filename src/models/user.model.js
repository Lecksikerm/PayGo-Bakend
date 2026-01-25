const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        phone: { type: String, default: null },
        address: { type: String, default: null },
        avatar: { type: String, default: null },
        otp: { type: String },
        otpExpires: { type: Date },
        isVerified: { type: Boolean, default: false },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        isSuspended: { type: Boolean, default: false },

        walletPin: { type: String, default: null, select: false },
        pinSetAt: { type: Date, default: null },
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre("save", async function () {
    if (!this.isModified("walletPin") || !this.walletPin) return;

    const salt = await bcrypt.genSalt(10);
    this.walletPin = await bcrypt.hash(this.walletPin, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) throw new Error("Password not selected");
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.matchPin = async function (enteredPin) {
    if (!this.walletPin) return false;
    return bcrypt.compare(enteredPin, this.walletPin);
};

module.exports = mongoose.model("User", userSchema);




