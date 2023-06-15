const Topping = require("../models/topping");
const Inventory = require("../models/inventory");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.inventory_detail = asyncHandler(async (req, res, next) => {
    
    const [foundInventory] = await Promise.all([
        Inventory.findOne({ inventory_ip: req.ip}).populate("inventory_contents").populate("_id").exec(),
    ])

    console.log(foundInventory)
    
    if (foundInventory === null) {
        // nothing in the inventory with given IP ID
        res.render("inventory_detail", {
            title: "Your Inventory Is Empty!",
        })
    }

    console.log(foundInventory);
    res.render("inventory_detail", {
        title: "Your Inventory Contents",
        inventory_content: foundInventory.inventory_contents,
    })
})

exports.inventory_create = asyncHandler(async (req, res, next) => {
    const [inventoryDB] = await Promise.all([
        Inventory.findOne({ inventory_ip: req.ip})
    ])

    if (inventoryDB === null) {
        const inventory = new Inventory({
            inventory_ip: req.ip,
            inventory_contents: [],
        })
        await inventory.save();
        res.redirect(inventory.absolute_url);
    }
    res.redirect(inventoryDB.absolute_url);    
})

exports.inventory_update = asyncHandler(async (req, res, next) => {
    res.send("This should be inventory updating")
})

exports.inventory_add_get = asyncHandler(async (req, res, next) => {

    const [inventoryDB] = await Promise.all([
        Inventory.findOne({ inventory_ip: req.ip})
    ])

    console.log(inventoryDB);
    /* const [inventoryDB] = await Promise.all([
        inventory.findOne({ inventory_ip: req.ip})
    ])

    const newItem = {
        topping_id: req.params.id, 
        topping_amount: req.params.num,
    }

    if (inventoryDB === null) {
        const inventory = new Inventory({
            inventory_ip: req.ip,
            inventory_contents: [],
        })
        inventory.inventory_contents.push(newItem);
        await inventory.save();
    } else {
        inventoryDB.inventory_contents.push(newItem);
        await inventoryDB.save();
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
    const [inventoryDB, toppingSelected] = await Promise.all([
        Inventory.findOne({ inventory_ip: req.ip}),
        Topping.findById(req.params.id).exec(),
    ])
    
    const newItem = {
        topping_ref: toppingSelected, 
        topping_amount: req.body.toppingAmount,
    }

    if (inventoryDB === null) {
        const inventory = new Inventory({
            inventory_ip: req.ip,
            inventory_contents: [],
        })
        inventory.inventory_contents.push(newItem);
        await inventory.save();
    } else {
        inventoryDB.inventory_contents.push(newItem);
        await inventoryDB.save();
    }

    res.redirect(`/users/inventory/`)
})

exports.inventory_checkout = asyncHandler(async (req, res, next) => {
    const [allToppings, userinventory] = await Promise.all([
        Topping.find().exec(),
        Inventory.findOne({ inventory_ip: req.ip}),
    ]);

    // later, will want to CHECK inventory with overall DB stock to ensure subtraction all checks out (using allToppings from above Promise)

    const newUserInv = new Inventory({
        inventory_ip: userinventory.inventory_ip,
        inventory_contents: userinventory.inventory_contents,
    })

    await newUserInv.save();
    // clear out user inventory after it's been relocated to inventory
    userinventory.inventory_contents = [];
    await userinventory.save();

    res.redirect(`/users/inventory/`)
})