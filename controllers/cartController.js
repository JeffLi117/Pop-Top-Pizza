const Topping = require("../models/topping");
const Cart = require("../models/cart");
const Inventory = require("../models/inventory");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.cart_detail = asyncHandler(async (req, res, next) => {
    
    const [foundCart] = await Promise.all([
        Cart.findById(req.params.id).populate("cart_contents").populate("_id").exec(),
    ])
    
    if (foundCart === null) {
        // nothing in the cart with given IP ID
        res.render("cart_detail", {
            title: "Your Cart Is Empty!",
        })
    }

    console.log(foundCart);
    res.render("cart_detail", {
        title: "Your Cart Contents",
        cart_content: foundCart.cart_contents,
    })
})

exports.cart_create = asyncHandler(async (req, res, next) => {
    const [cartDB] = await Promise.all([
        Cart.findOne({ cart_ip: req.ip})
    ])

    if (cartDB === null) {
        const cart = new Cart({
            cart_ip: req.ip,
            cart_contents: [],
        })
        await cart.save();
        res.redirect(cart.absolute_url);
    }
    res.redirect(cartDB.absolute_url);    
})

exports.cart_update = asyncHandler(async (req, res, next) => {
    res.send("This should be cart updating")
})

exports.cart_add_get = asyncHandler(async (req, res, next) => {

    const [cartDB] = await Promise.all([
        Cart.findOne({ cart_ip: req.ip})
    ])

    console.log(cartDB);
    /* const [cartDB] = await Promise.all([
        Cart.findOne({ cart_ip: req.ip})
    ])

    const newItem = {
        topping_id: req.params.id, 
        topping_amount: req.params.num,
    }

    if (cartDB === null) {
        const cart = new Cart({
            cart_ip: req.ip,
            cart_contents: [],
        })
        cart.cart_contents.push(newItem);
        await cart.save();
    } else {
        cartDB.cart_contents.push(newItem);
        await cartDB.save();
    } */
})

// Display topping add form on GET.
 exports.topping_add_get = asyncHandler(async (req, res, next) => {
    const foundTopping = await Promise.all([
      Topping.findById(req.params.id).populate("topping_category").exec(),
    ])
  
    res.render("topping_add", {
      topping: foundTopping[0],
    })
});
 
exports.topping_add_post = asyncHandler(async (req, res, next) => {
    const [cartDB, toppingSelected] = await Promise.all([
        Cart.findOne({ cart_ip: req.ip}),
        Topping.findById(req.params.id).exec(),
    ])
    
    const newItem = {
        topping_ref: toppingSelected, 
        topping_amount: req.body.toppingAmount,
    }

    if (cartDB === null) {
        const cart = new Cart({
            cart_ip: req.ip,
            cart_contents: [],
        })
        cart.cart_contents.push(newItem);
        await cart.save();
    } else {
        cartDB.cart_contents.push(newItem);
        await cartDB.save();
    }

    res.redirect(`/users/cart/`)
})

exports.cart_checkout = asyncHandler(async (req, res, next) => {
    const [allToppings, userCart] = await Promise.all([
        Topping.find().exec(),
        Cart.findOne({ cart_ip: req.ip}),
    ]);

    // later, will want to CHECK cart with overall DB stock to ensure subtraction all checks out (using allToppings from above Promise)

    const newUserInv = new Inventory({
        inventory_ip: userCart.cart_ip,
        inventory_contents: userCart.cart_contents,
    })

    await newUserInv.save();
    // clear out user cart after it's been relocated to inventory
    userCart.cart_contents = [];
    await userCart.save();

    res.redirect(`/users/cart/`)
})