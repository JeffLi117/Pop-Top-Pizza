#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Topping = require("./models/topping");

const categories = [];
const toppings = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
console.log("Debug: About to connect");
await mongoose.connect(mongoDB);
console.log("Debug: Should be connected?");

//my stuff
await createCategories();
await createToppings();

console.log("Debug: Closing mongoose");
mongoose.connection.close();
}

//my stuff
async function categoryCreate(name) {
    const category = new Category({ category_name: name });
    await category.save();
    categories.push(category);
    console.log(`Added category: ${name}`);
}
async function toppingCreate(toppingName, toppingDeets, toppingCat, toppingPrice, toppingStock) {
    const newTop = {
        topping_name: toppingName,
        topping_description: toppingDeets,
        topping_category: toppingCat,
        topping_price: toppingPrice,
        topping_stock: toppingStock,
    }
    
    const topping = new Topping(newTop);
    await topping.save();
    toppings.push(topping);
    console.log(`Added topping: ${toppingName}`);
}

async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
        categoryCreate("Cheese"),
        categoryCreate("Vegetable"),
        categoryCreate("Meat"),
    ]);
}

async function createToppings() {
    console.log("Adding Books");
    await Promise.all([
        toppingCreate(
            "Mozzarella Cheese", "Creamy white or pale ivory in colour, mozzarella has a mild, fresh lactic flavour and is used primarily in cooking, especially as a main ingredient in pizza -- isn't that why we're all here?!", [categories[0]], "12.99", "30"
        ),
        toppingCreate(
            "Cheddar Cheese", "It can come in many different strengths, from mild to strong, depending on its period of maturation. The older the cheddar, the sharper it'll taste.", [categories[0]], "10.99", "40"
        ),
        toppingCreate(
            "Parmesan Cheese", "An Italian hard, granular cheese produced from cows' milk and aged at least 12 months.", [categories[0]], "11.99", "40"
        ),

        toppingCreate(
            "Bell Peppers", "Roasting, charring, or pan sautéing before adding to pizza can balance richer toppings such as meats.", [categories[1]], "3.99", "50"
        ),
        toppingCreate(
            "Red Onions", "With purplish-red skin and white flesh tinged with red, these delicacies can be placed as a pizza topping prior to cooking as long as they are sliced thinly (to allow for even cooking)", [categories[1]], "2.49", "70"
        ),
        toppingCreate(
            "Cherry Tomatoes", "Believed to be an intermediate genetic admixture between wild currant-type tomatoes and domesticated garden tomatoes, cherry tomatoes are most often split and cooked while on the pizza, allowing them to soften and their flavor to intensify.", [categories[1]], "4.99", "45"
        ),

        toppingCreate(
            "Pepperoni", "An American variety of spicy salami made from cured pork and beef seasoned with paprika or other chili pepper. These bad boys right here will give you all the cupping your pizza heart desires.", [categories[2]], "12.99", "60"
        ),
        toppingCreate(
            "Ground Sausage", "Most sausage is made from pork, but the real secret behind making delicious sausage is in the addition of pork fat. Best believe we've got that!", [categories[2]], "11.99", "50"
        ),
        toppingCreate(
            "Bacon", "People love bacon so much that they'll put it on just about anything... including pizza!", [categories[2]], "9.99", "40"
        ),
    ]);
}