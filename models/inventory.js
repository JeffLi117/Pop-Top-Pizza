const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InventorySchema = new Schema({ 
    inventory_ip: { type: String, required: true },
    inventory_contents: [{ type: Object}],
})

InventorySchema.virtual("url").get(function() {
    return `inventory/${this._id}`
})
InventorySchema.virtual("absolute_url").get(function() {
    return `/users/inventory/${this._id}`
})

// Export model
module.exports = mongoose.model("inventory", InventorySchema);