const Topping = require("../models/topping");
const Cart = require("../models/cart");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.cart_detail = asyncHandler(async (req, res, next) => {
    /* const [cartStuff] = await Promise.all([
        Cart.findById(req.ip).populate("cart_contents").exec(),
    ])

    if (cartStuff === null) {
        // cart with given IP address isn't found
        // need to create it
        res.send("Need to make a new log with this IP address!")
    }

    res.render("cart_detail", {
        title: "Your Cart Contents",
        cart_content: cartStuff,
    }) */
})

exports.cart_create_post = asyncHandler(async (req, res, next) => {
    const [cartDB] = await Promise.all([
        Cart.findOne({ cart_ip: req.ip})
    ])

    if (cartDB === null) {
        const cart = new Cart({
            cart_ip: req.ip,
            cart_contents: [],
        })
        await cart.save();
        res.redirect(cart.url);
    }
    res.redirect(cartDB.url);    
})