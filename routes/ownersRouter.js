const express = require("express");
const router = express.Router();
const ownersModel = require("../models/owner-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const ownersMiddle = require("../middleware/owners-midd");


// Render owner login page
router.get("/login", function (req, res) {
  let success = req.flash("success");
  let error = req.flash("error");
  res.render("owner-login", { messages: req.flash(), loggedin: false, isOwner: false });
});

// Handle owner login
router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash("error", "Please provide all required fields");
      return res.redirect("/owners/login");
    }

    const owner = await ownersModel.findOne({ email });
    if (!owner) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/owners/login");
    }

    const isValidPassword = await bcrypt.compare(password, owner.password);
    if (!isValidPassword) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/owners/login");
    }

    const token = generateToken(owner);
    res.cookie("token", token);
    req.flash("success", "Login successful");
    res.redirect("/owners/admin"); // Redirect to /owners/admin after successful login
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/owners/login");
  }
});

// Render create owner page
router.get("/create", function (req, res) {
  let success = req.flash("success");
  let error = req.flash("error");
  res.render("createOwner", {success,error, loggedin: true, isOwner: true });
});

// Creating owner
router.post("/create", async function (req, res) {
  let owners = await ownersModel.find();
  if (owners.length > 0) {
    req.flash("error", "You don't have permission to create an owner.");
    return res.redirect("/owners/create");
  } else {
    try {
      const { fullname, email, password } = req.body;

      // Check if the owner already exists
      let owner = await ownersModel.findOne({ email });
      if (owner) {
        req.flash("error", "You already have an account, please login");
        return res.redirect("/owners/login");
      }

      // Generate salt and hash the password
      bcrypt.genSalt(10, async function (err, salt) {
        if (err) {
          req.flash("error", "Error generating salt");
          return res.redirect("/owners/create");
        }

        bcrypt.hash(password, salt, async function (err, hash) {
          if (err) {
            req.flash("error", "Error hashing password");
            return res.redirect("/owners/create");
          }

          // Create the owner
          await ownersModel.create({
            email,
            password: hash,
            fullname,
          });

          // Add success flash message
          req.flash("success", "Owner registered successfully");
          return res.redirect("/owners/create");
        });
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/owners/create");
    }
  }
});

// To open admin panel and to add product
router.get("/admin",ownersMiddle, function (req, res) {
  let success = req.flash("success");
  let error = req.flash("error");
  
  res.render("createproducts", { success , error , loggedin: true, isOwner: true });
});

// Admin logout
router.get("/logout", function (req, res) {
  res.clearCookie("token"); // Remove the token cookie
  req.flash("success", "You have logged out successfully");
  res.redirect("/owners/login");
});

module.exports = router;