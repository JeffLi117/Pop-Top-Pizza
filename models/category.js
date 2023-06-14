const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({ 
    category_name: { type: String, required: true, maxLength: 100 },
})

CategorySchema.virtual("url").get(function() {
    return `/category/${this._id}`
})

// Export model
module.exports = mongoose.model("Category", CategorySchema);