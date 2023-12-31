const express = require("express");
const router = express.Router();

// Require controller modules
const category_controller = require("../controllers/categoryController");
const topping_controller = require("../controllers/toppingController");
const cart_controller = require("../controllers/cartController");

/// topping routes ///

// GET catalog home page.
router.get("/", topping_controller.index);

// GET request for creating a topping. NOTE This must come before routes that display topping (uses id).
router.get("/topping/create", topping_controller.topping_create_get);

// POST request for creating topping.
router.post("/topping/create", topping_controller.topping_create_post);

// GET request to delete topping.
router.get("/topping/:id/delete", topping_controller.topping_delete_get);

// POST request to delete topping.
router.post("/topping/:id/delete", topping_controller.topping_delete_post);

// GET request to update topping.
router.get("/topping/:id/update", topping_controller.topping_update_get);

// POST request to update topping.
router.post("/topping/:id/update", topping_controller.topping_update_post);

// GET request for one topping.
router.get("/topping/:id", topping_controller.topping_detail);

// GET request for list of all topping items.
router.get("/toppings", topping_controller.topping_list);


/// category routes ///

// GET request for creating a category. NOTE This must come before route that displays category (uses id).
router.get("/category/create", category_controller.category_create_get);

//POST request for creating category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one category. 
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all category.
router.get("/categories", category_controller.category_list);

module.exports = router;