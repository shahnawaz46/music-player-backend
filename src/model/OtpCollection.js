const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    otp: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        expires: 600,
        default: Date.now()
    }
})

otpSchema.pre('save', async function (next) {
    if (this.isModified("otp")) {
        this.otp = await bcrypt.hash(this.otp, 12)
    }
    next()
})

const OtpCollection = mongoose.model('otp', otpSchema, 'otp')

module.exports = OtpCollection
