const express = require("express");
const router = express.Router();
const gen_outfitData = require('../data/gen_outfit');
const clothesData = require('../data/clothes');

//Middleware
router.use("/", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/account/login");
  }
  next();
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
    console.log(data)

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
      
      let clothingItems = await clothesData.getClothingbyIds(result.map(res => res._id))

      console.log(clothingItems)


      if (result) {
        res.status(200).render('pages/medium/outfitGenerated', {
          title: "Generate Outfit",
          outfitsPage: true,
          stylesheet: "/public/styles/clothes_styles.css",
          script: "/public/scripts/gen_outfit_script.js",
          error: "outfit generated",
          savePage: true,
          results: clothingItems
        });
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
  