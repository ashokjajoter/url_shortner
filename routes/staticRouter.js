const express = require("express");
const URL = require("../model/url");
const { restricTo } = require("../middleware/auth");

const router = express.Router();

router.get("/admin/urls", restricTo(["ADMIN"]), async (req, res) => {
    const allurls = await URL.find({});
    return res.render("home", {
        urls: allurls,
    });
});

router.get("/", restricTo(["NORMAL","ADMIN"]), async (req, res) => {
    if(!req.user) return res.redirect("/login");
    const allurls = await URL.find({ createdBy: req.user._id });
    return res.render("home", {
        urls: allurls,
    });
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.get("/login", (req, res) => {
    return res.render("login");
});

module.exports = router;