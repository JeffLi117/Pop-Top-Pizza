const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ToppingSchema = new Schema({ 
    topping_name: { type: String, required: true, maxLength: 100 },
    topping_description: { type: String, required: true, maxLength: 450 },
    topping_category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    topping_price: { type: String, required: true, maxLength: 12 },
    topping_stock: { type: String, required: true, maxLength: 10 },
})

ToppingSchema.virtual("url").get(function() {
    return `topping/${this._id}`
})
ToppingSchema.virtual("absolute_url").get(function() {
    return `/catalog/topping/${this._id}`
})
ToppingSchema.virtual("cart_url").get(function() {
    return `/users/topping/${this._id}`
})
ToppingSchema.virtual("img_url").get(function() {
    let lowerAndNoSpace = this.topping_name.toLowerCase().split(" ").join("");
    return `/${lowerAndNoSpace}.jpg`
})

// Export model
module.exports = mongoose.model("Topping", ToppingSchema);