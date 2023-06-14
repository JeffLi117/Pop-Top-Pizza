const Category = require("../models/category");
const Topping = require("../models/topping");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({category_name: 1}).exec();
  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
  })
});

// Display detail page for a specific category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  // get details of category & all associated toppings (in parallel)
  const [category, toppingsInCat] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Topping.find({ topping_category: req.params.id}, "topping_name  topping_description").exec(),
  ]);

  if (category === null) {
    //no results
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  } 

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_toppings: toppingsInCat,
  })
});

// Display category create form on GET.
exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};

// Handle category create on POST.
exports.category_create_post = [
  // validate and sanitize name field
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({min:3})
    .escape(),

  //process request after validation & sanitization
  asyncHandler(async (req, res, next) => {
    //extract validation errors from a req
    const errors = validationResult(req);

    //create category object w/ escaped & trimmed data
    const category = new Category({ category_name: req.body.name});

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors:  errors.array(),
      });
      return;
    } else {
      //data from form is valid, check if category already exists
      const catExists = await Category.findOne({ category_name: req.body.name}).exec();
      if (catExists) {
        res.redirect(catExists.absolute_url)
      } else {
        await category.save();
        res.redirect(category.absolute_url)
      }
    }
  })
]

// Display category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category delete GET");
});

// Handle category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category delete POST");
});

// Display category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update GET");
});

// Handle category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update POST");
});
