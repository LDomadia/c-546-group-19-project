const express = require("express");
const router = express.Router();
const gen_outfitData = require('../data/gen_outfit');

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
  
  try {
    let clothingItems = await clothesData.getClothingItems(req.session.user.username);
    res.render("pages/results/clothings", {
      title: "My Clothes",
      clothesPage: true,
      clothingItems: clothingItems,
      stylesheet: "/public/styles/clothes_styles.css"
    });
  } catch (e) {
    res.status(500).render('pages/results/clothings', {
      title: 'My Clothes',
      clothesPage: true,
      error: e
    });
  }
});


router.route("/generate").get(async (req, res) => {
    res.render("pages/medium/outfitGenerated", {
      title: "Generate Outfit",
      outfitsPage: true,
      stylesheet: "/public/styles/clothes_styles.css",
      script: "/public/scripts/gen_outfit_script.js",
    });
  }).post(async (req, res) => {
    const data = req.body;
      
    try {
      if (!data) throw 'Error: Nothing was entered';
      if (!data.name) throw 'Error: Outfit Name is Required';
      if (!data.name.trim()) throw 'Error: Outfit Name is Required';
      
    } catch (e) {
      return res.status(400).render('pages/medium/outfitGenerated', {
        title: "Generate Outfit",
        outfitsPage: true,
        stylesheet: "/public/styles/clothes_styles.css",
        script: "/public/scripts/gen_outfit_script.js",
        error: e
      });
    }
  
    try {
      let result = await gen_outfitData.generateOutfit(
        data['colors-patterns'],
        data.season,
        data.styles
      )
      console.log(result)
      if (result == 'success') {
        res.status(200).redirect('/outfits');
      }
      else {
        throw 'Error: Failed to Generate Outfit';
      }
    } catch (e) {
      return res.status(500).render('pages/medium/outfitGenerated', {
        title: "Generate Outfit",
        outfitsPage: true,
        stylesheet: "/public/styles/clothes_styles.css",
        script: "/public/scripts/gen_outfit_script.js",
        error: e
      });
    }
  });
  
  module.exports = router;
  