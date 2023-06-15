const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CartSchema = new Schema({ 
    cart_ip: { type: String, required: true },
    cart_contents: [{ type: Object}],
})

CartSchema.virtual("url").get(function() {
    return `cart/${this._id}`
})
CartSchema.virtual("absolute_url").get(function() {
    return `/users/cart/${this._id}`
})

// Export model
module.exports = mongoose.model("Cart", CartSchema);