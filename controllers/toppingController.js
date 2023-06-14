const Topping = require("../models/topping");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    const [
      numToppings, 
      numCategories
    ] = await Promise.all([
      Topping.countDocuments({}).exec(),
      Category.countDocuments({}).exec(),
    ]);
    
    res.render("index", {
      title: "Poppin' Toppings For Pizza",
      topping_count: numToppings,
      category_count: numCategories,
    })
});

// Display list of all toppings.
exports.topping_list = asyncHandler(async (req, res, next) => {
  const allToppings = await Topping.find({}, "topping_name topping_description topping_category")
    .sort({topping_name: 1})
    .populate("topping_category", "category_name")
    .exec();
  console.log(allToppings[1])
  res.render("topping_list", {title: "Topping List", topping_list: allToppings})
});

// Display detail page for a specific topping.
exports.topping_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: topping detail: ${req.params.id}`);
});

// Display topping create form on GET.
exports.topping_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: topping create GET");
});

// Handle topping create on POST.
exports.topping_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: topping create POST");
});

// Display topping delete form on GET.
exports.topping_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: topping delete GET");
});

// Handle topping delete on POST.
exports.topping_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: topping delete POST");
});

// Display topping update form on GET.
exports.topping_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: topping update GET");
});

// Handle topping update on POST.
exports.topping_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: topping update POST");
});
