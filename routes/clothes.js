const express = require("express");
const router = express.Router();
//Middleware
router.use("/", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/account/login");
  }
  next();
});

router.route("/").get(async (req, res) => {
  if (!req.session.user)
    return res.render("pages/results/clothings", {
      title: "My Clothes",
      clothesPage: true,
      not_logged_in: true,
    });
  res.render("pages/results/clothings", {
    title: "My Clothes",
    clothesPage: true,
  });
});

router.route("/new").get(async (req, res) => {
  res.render("pages/medium/clothingNew", {
    title: "Add New Clothing",
    clothesPage: true,
    stylesheet: "/public/styles/clothes_styles.css",
    script: "/public/scripts/clothes_script.js",
  });
}).post(async (req, res) => {
  console.log(req.body);
});

module.exports = router;
