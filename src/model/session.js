const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: true
    },
    iat: {
        type: Number,
        default: Date.now,
    },
    exp: {
        type: Number,
        default: Math.floor(Date.now() / 1000) + process.env.TOKEN_TTL,
    }
}); // SessionSchema ...

module.exports = mongoose.model('Session', SessionSchema);