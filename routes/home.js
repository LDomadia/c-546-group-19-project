const express = require("express");
const router = express.Router();
const outfitsData = require('../data/outfits');

//Middleware
router.use("/", (req, res, next) => {
  if (req.session.user) {
    return res.render("pages/single/index", {
      title: "Digital Closet",
      homePage: true,
      logged_in: true,
    });
  }
  next();
});

// GET /
router.get("/", async (req, res) => {
  try {
    let logged_in = false;
    if (req.session.user) logged_in = true;

    const publicOutfits = await outfitsData.getAllOutfits(); 
    // console.log(publicOutfits);

    res.render("pages/single/index", {
      title: "Digital Closet",
      homePage: true,
      not_logged_in: !logged_in,
      outfits: publicOutfits,
      stylesheet: '/public/styles/outfit_card_styles.css'
    });
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = router;
