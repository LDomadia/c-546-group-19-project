const express = require("express");
const router = express.Router();
const outfitsData = require('../data/outfits');

//Middleware
router.use("/", (req, res, next) => {
  if (!req.session.user) {
    return res.render("pages/single/index", {
      title: "Digital Closet",
      homePage: true,
      not_logged_in: true,
    });
  }
  next();
});

// GET /
router.route('/').get( async (req, res) => {
  try {
    const publicOutfits = await outfitsData.getAllOutfits(); 

    res.status(200).render("pages/single/index", {
      title: "Digital Closet",
      homePage: true,
      outfits: publicOutfits,
      stylesheet: '/public/styles/outfit_card_styles.css',
      script: '/public/scripts/home_script.js'
    });
  } catch (e) {
    res.status(404).render("pages/single/index", {
      title: "Digital Closet",
      homePage: true,
      stylesheet: '/public/styles/outfit_card_styles.css',
      script: '/public/scripts/home_script.js',
      error: e
    });
  }
});

router.route('/like/:id').post(async (req, res) => {
  try {
    if (!req.session.user) throw 'Error: No user is logged in';
    if (!ObjectId.isValid(req.params.id)) throw "Error: Clothing Item id is not valid";
    
  } catch (e) {

  }
})

module.exports = router;
