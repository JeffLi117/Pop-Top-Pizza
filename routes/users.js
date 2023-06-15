var express = require('express');
var router = express.Router();

const cart_controller = require("../controllers/cartController");
const inventory_controller = require("../controllers/inventoryController");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('"Home" page for the usersRouter');
});

router.get('/userinventory', inventory_controller.inventory_detail);

router.get('/cart', cart_controller.cart_create)

// GET req to ADD one topping
router.get("/topping/:id/add", cart_controller.topping_add_get)

router.get('/cart/update/add/:id/amt/:num', cart_controller.cart_add_get
/* function(req, res, next) { res.send(`Here is where the cart should update with ${req.params.num} quantity of the item with ID of ${req.params.id}`); }*/
)




// POST req to ADD one topping
router.post("/topping/:id/add", cart_controller.topping_add_post)
/*
router.get('/cart/update', cart_controller.cart_update) */

/* router.get('/userinventory', cart_controller.inventory_create_post) */

/* function(req, res, next) {
  res.send(`A specific cart id, for ID of ${req.params.id}`)
} */
router.get('/cart/:id', cart_controller.cart_detail)

router.post('/cart/:id', cart_controller.cart_checkout)


module.exports = router;
