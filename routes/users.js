var express = require('express');
var router = express.Router();

const cart_controller = require("../controllers/cartController");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('"Home" page for the usersRouter');
});

router.get('/cart', cart_controller.cart_create_post)

/* function(req, res, next) {
  res.send(`A specific cart id, for ID of ${req.params.id}`)
} */
router.get('/cart/:id', cart_controller.cart_detail)

module.exports = router;
