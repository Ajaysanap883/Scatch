const express = require("express");
const router = express.Router();
const isLoggedin = require("../middleware/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");


router.get('/', (req, res) => {
    let success = req.flash("success");
    let error = req.flash("error"); // Retrieve any error messages
    res.render('index', { error,success, loggedin: false }); // Pass the error message to the index view
});

router.get('/shop', isLoggedin,async (req, res) => {
    let success = req.flash("success");
    let error = req.flash("error");

    try {
        // Fetch all products from the database
        const products = await productModel.find();

        // Log the retrieved products
        // console.log("Products fetched:", products);

        // Render the shop view and pass products
        res.render('shop', { products ,loggedin: true ,isOwner: false , success, error});
    } catch (error) {
        console.error("Error fetching products:", error.message);

        // Render an error page or return an error message
        res.status(500).render('error', { message: "Unable to fetch products at the moment. Please try again later." });
    }
});

router.get('/cart', isLoggedin, async (req, res) => {
    let success = req.flash("success");
    let error = req.flash("error");

    let user = await userModel.findOne({ email: req.user.email }).populate("cart")

    res.render('cart', { error,success,user , isOwner: false ,loggedin: true }); // Pass the error message to the index view
});

router.get('/addtocart/:productid', isLoggedin, async (req, res) => {
    try {
        // Find the user by email
        let user = await userModel.findOne({ email: req.user.email });

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/shop");
        }

        // Add the product to the user's cart
        user.cart.push(req.params.productid);
        await user.save();

        // Set the success flash message
        req.flash("success", "Added to Cart");

        // Redirect to the shop page
        return res.redirect("/shop");
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong");
        res.redirect("/shop");
    }
});


router.get('/logout', isLoggedin,(req, res) => {
    res.clearCookie("token");
    req.flash("success", "You have logged out successfully");
    res.render("shop");
});

 

module.exports=router;