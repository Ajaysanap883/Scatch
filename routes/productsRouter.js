const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

router.post("/create", upload.single("image"), async function (req, res) {
  const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

  if (!req.file) {
    return res.status(400).send({ message: "No image provided" });
  }

  try {
    const product = await productModel.create({
      image: req.file.buffer.toString('base64'),
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
    });
    req.flash("success", "Product created successfully.");
    res.redirect("/owners/admin");
  } catch (err) {
    res.status(500).send({ message: "Error creating product", error: err.message });
  }
});

module.exports=router;