const express = require("express");
const router = express.Router();
const clothesData = require('../data/clothes');

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
  let data = req.body

  try {
    if (!data.img.trim()) throw 'Error: Image is Required';
    if (!data.name.trim()) throw 'Error: Clothing Name is Required';
    if (!data.type.trim() || data.type.trim() == 'null') throw 'Error: Type is Required';
    
  } catch (e) {
    return res.status(400).render('pages/medium/clothingNew', {
      title: "Add New Clothing",
      clothesPage: true,
      stylesheet: "/public/styles/clothes_styles.css",
      script: "/public/scripts/clothes_script.js",
      error: e
    });
  }

  try {
    let result = await clothesData.addNewClothes(
      data.name,
      data.img,
      data.type,
      data['colors-patterns'],
      data.season,
      data.styles,
      data.brand,
      req.session.user.username
    )
  } catch (e) {
    return res.status(500).render('pages/medium/clothingNew', {
      title: "Add New Clothing",
      clothesPage: true,
      stylesheet: "/public/styles/clothes_styles.css",
      script: "/public/scripts/clothes_script.js",
      error: e
    });
  }
});

module.exports = router;
