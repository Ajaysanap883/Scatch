const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
    
    try {
        const { fullname, email, password } = req.body;

        // Check if the user already exists
        let user = await userModel.findOne({ email });
        if (user) {
            req.flash("error", "You already have an account, please login");
            return res.redirect("/"); // Redirect to the login page
        }

        // Generate salt and hash the password
        bcrypt.genSalt(10, async function (err, salt) {
            if (err) {
                req.flash("error", "Error generating salt");
                return res.redirect("/");
            }

            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) {
                    req.flash("error", "Error hashing password");
                    return res.redirect("/");
                }

                // Create the user
                await userModel.create({
                    email,
                    password: hash,
                    fullname,
                });

                // Add success flash message
                req.flash("error", "User registered successfully");
                return res.redirect("/"); // Stay on the same page
                
            });
        });
    } catch (error) {
        req.flash("error", error.message);
        return res.redirect("/");
    }
};

module.exports.loginUser = async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Please provide all required fields");
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).send("Invalid email or password");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).send("Invalid email or password");
        }

        const token = generateToken(user);
        res.cookie("token", token);
        res.redirect("/shop"); // Redirect to /shop after successful login
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports.logoutUser = async function (req, res) {
    res.clearCookie("token"); // Remove the token cookie
    res.redirect("/"); // Redirect to the home page
};
