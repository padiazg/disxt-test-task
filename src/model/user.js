const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "missing username"],
        max: 128,
        min: [6, 'username too short']
    },
    password: {
        type: String,
        required: [true, "missing password"],
        max: 1024,
        min: [6, 'password too short']
    },
    name: {
        type: String,
        required: [true, "missing name"],
        max: 256
    },
    lastname: {
        type: String,
        max: 256
    },
    age: {
        type: Number,
    },
    role: {
        type: String,
        enum: [ "admin", "client"],
        required: [true, "Role can be admin or client, and is required"],
    },
}); // userSchema ...

module.exports = mongoose.model('User', UserSchema);