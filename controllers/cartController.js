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
            errors: [],
        })
    }

    console.log(foundCart.cart_contents);
    res.render("cart_detail", {
        title: "Your Cart Contents",
        cart_content: foundCart.cart_contents,
        errors: [],
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

exports.cart_checkout = [

    (req, res, next) => {
        console.log("req.body.checkout_input ", req.body.checkout_input);
        next();
    },
    // check that code entered matches "PizzaIsLyfe"
    body("checkout_input", "Checkout code must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .matches("PizzaIsLyfe")
        .withMessage("Checkout code must be correctly entered")
        .escape(),
        

    // process req after validation & sanitiz.
    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);
        
        const [allToppings, userCart, userInv] = await Promise.all([
            Topping.find().exec(),
            Cart.findOne({ cart_ip: req.ip}),
            Inventory.findOne({ inventory_ip: req.ip}),
        ]);

        if (!errors.isEmpty()) {
            // render cart again w/ error msgs
            res.render("cart_detail", {
                title: "Your Cart Contents",
                cart_ip: req.ip,
                cart_content: userCart.cart_contents,
                errors: errors.array(),
            })
        } else {
            // later, will want to CHECK cart with overall DB stock to ensure subtraction all checks out (using allToppings from above Promise)
    
        if (userInv === null) {
            const newUserInv = new Inventory({
                inventory_ip: userCart.cart_ip,
                inventory_contents: userCart.cart_contents,
            })
            await newUserInv.save();
        } else {
            const userPriorInv = userInv.inventory_contents;
            for (let i = 0; i < userCart.cart_contents.length; i++) {
                let alreadyDone = false;
                for (let k = 0; k < userPriorInv.length; k++) {
                    // checks for same item already in inventory 
                    if (alreadyDone === true) {
                        console.log("Break b/c done");
                        break;
                    } else if (userPriorInv[k].topping_ref.topping_name === userCart.cart_contents[i].topping_ref.topping_name) {
                        // if item exists in inventory, add that amount to it
                        let expectedTotal = Number(userCart.cart_contents[i].topping_amount) + Number(userPriorInv[k].topping_amount)
                        console.log("Item name: ", userPriorInv[k].topping_ref.topping_name, " total expected qty: ", expectedTotal);
                        await Inventory.updateOne(
                            {
                                inventory_ip: req.ip,
                                inventory_contents: { $elemMatch: { "topping_ref.topping_name": userCart.cart_contents[i].topping_ref.topping_name} }
                            },
                            { $set: { "inventory_contents.$.topping_amount" : expectedTotal.toString() } }
                        )
                        alreadyDone = true;
                    } else if (alreadyDone === false && k === userPriorInv.length - 1) {
                        // create new "item slot" by pushing into array;
                        console.log("This is what is being pushed in: ", userCart.cart_contents[i]);
                        userInv.inventory_contents.push(userCart.cart_contents[i]);
                        alreadyDone = true;
                    } 
                }
            }
            console.log("userInv's inventory_contents are ", userInv.inventory_contents);
            await userInv.save();
        }
        
        // clear out user cart after it's been relocated to inventory
        userCart.cart_contents = [];
        await userCart.save();
    
        res.redirect(`/users/userinventory/`)
        }
    })
]

