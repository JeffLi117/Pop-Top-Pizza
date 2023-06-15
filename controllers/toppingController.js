const Topping = require("../models/topping");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  const [topping, toppingStock] = await Promise.all([
    Topping.findById(req.params.id). populate("topping_name").populate("topping_category").populate("topping_stock").exec(),
  ])

  if (topping === null) {
    //no results
    const err = new Error("Topping not found");
    err.status = 404;
    return next(err);
  }

  res.render("topping_detail", {
    title: topping.topping_name,
    topping: topping,
    topping_stock: toppingStock,
  })
});

// Display topping create form on GET.
exports.topping_create_get = asyncHandler(async (req, res, next) => {
  // get all categories so we can use them to add to topping
  const [allCategories] = await Promise.all([
    Category.find().exec(),
  ]);

  res.render("topping_form", {
    title: "Create Topping",
    categories: allCategories,
  })
});

// Handle topping create on POST.
exports.topping_create_post = [
  // convert category to array
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  // validate & sanitize fields 
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1})
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1})
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1})
    .escape(),
  body("stock", "Stock must be greater than 1.")
    .trim()
    .isLength({ min: 1})
    .escape(),
  body("category.*").escape(),

  // process request after validation & sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const topping = new Topping({ 
      topping_name: req.body.name,
      topping_description: req.body.description,
      topping_category: req.body.category,
      topping_price: req.body.price,
      topping_stock: req.body.stock  
    });

    if (!errors.isEmpty()) {
      const [allCategories] = await Promise.all([
        Category.find().exec(),
      ]);

      // Mark our selected categories as checked.
      for (const category of allCategories) {
        if (topping.category.indexOf(category._id) > -1) {
          category.checked = "true";
        }
      }

      res.render("topping_form", {
        title: "Create Topping",
        categories: allCategories,
        errors: errors.array(),
      })
    } else {
      await topping.save();
      res.redirect(topping.absolute_url);
    }
  })
]

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
