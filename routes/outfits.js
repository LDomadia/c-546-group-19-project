const express = require("express");
const router = express.Router();
const gen_outfitData = require('../data/gen_outfit');

router.route("/generate").get(async (req, res) => {
    res.render("pages/medium/outfitGenerated", {
      title: "Generate Outfit",
      clothesPage: true,
      stylesheet: "/public/styles/clothes_styles.css",
      script: "/public/scripts/clothes_script.js",
    });
  }).post(async (req, res) => {
    const data = req.body;
  
    try {
      if (!data) throw 'Error: Nothing was entered';
      if (!data.name) throw 'Error: Clothing Name is Required';
      if (!data.type) throw 'Error: Type is Required';
      if (!data.name.trim()) throw 'Error: Clothing Name is Required';
      if (!data.type.trim() || data.type.trim() == 'null') throw 'Error: Type is Required';
      if (!req.file) throw 'Error: Image is required';
      
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
      console.log(`image id: ${JSON.stringify(req.file)}`)
      let result = await clothesData.addNewClothes(
        data.name,
        req.file.filename,
        data.type,
        data['colors-patterns'],
        data.season,
        data.styles,
        data.brand,
        req.session.user.username
      )
      if (result == 'success') {
        res.status(200).redirect('/clothes');
      }
      else {
        throw 'Error: Failed to add Clothing Item';
      }
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
  