const jwt = require('jsonwebtoken');
const ownersModel = require("../models/owner-model");

module.exports = async function (req, res, next) {
    res.locals.messages = req.flash();
    if (!req.cookies.token) {
        req.flash("error", "You need to login first");
        return res.redirect("/owners/login");
    }

    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let owner = await ownersModel
            .findOne({ email: decoded.email })
            .select("-password");
        req.user = owner;
        next();
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong.");
        res.redirect("/owners/login");
    }
}