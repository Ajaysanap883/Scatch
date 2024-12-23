const jwt = require('jsonwebtoken');
const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {
    res.locals.messages = req.flash();
    if (!req.cookies.token) {
        req.flash("error"," you need to login first");
        return res.redirect("/");
    }

    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel
            .findOne({email : decoded.email})
            .select("-password");
        req.user = user;
        next();
    } catch (error) {
    console.error(error);
       req.flash("error","something went wrong.");
       res.redirect("/");
    }
}