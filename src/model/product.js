const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Missing name"],
        max: 256
    },
    price: {
        type: Number,
        required: [true, "Missing price"],
    },
    description: {
        type: String,        
        max: 2048
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}); // productSchema ...

module.exports = mongoose.model('Product', ProductSchema);