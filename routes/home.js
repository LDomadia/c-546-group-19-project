const express = require("express");
const router = express.Router();
const outfitsData = require('../data/outfits');
const accountData = require('../data/account');
const { ObjectId } = require('mongodb');
const xss = require('xss');

//Middleware
// router.use("/", (req, res, next) => {
//   if (!req.session.user) {
//     return res.render("pages/single/index", {
//       title: "Digital Closet",
//       homePage: true,
//       not_logged_in: true,
//     });
//   }
//   next();
// });

// GET /
router.route('/').get( async (req, res) => {
  const publicOutfits = await outfitsData.getAllOutfits();
  try {
    if (!req.session.user) throw 'Error: No user is logged in';
    const userId = await accountData.getUserIdByUserName(xss(req.session.user.username));

    res.status(200).render("pages/single/index", {
      title: "Digital Closet",
      homePage: true,
      outfits: publicOutfits,
      userId: userId,
      stylesheet: '/public/styles/outfit_card_styles.css',
      script: '/public/scripts/home_script.js'
    });
  } catch (e) {
    res.status(200).render("pages/single/index", {
      title: "Digital Closet",
      homePage: true,
      outfits: publicOutfits,
      userId: '',
      stylesheet: '/public/styles/outfit_card_styles.css',
      script: '/public/scripts/home_script.js',
      not_logged_in: true,
    });
  }
});

router.route('/like/:id').post(async (req, res) => {
  try {
    if (!req.session.user) throw 'Error: No user is logged in';
    if (!ObjectId.isValid(req.params.id)) throw "Error: Outfit id is not valid";
    const result = await outfitsData.likeOutfit(xss(req.params.id), xss(req.session.user.username));
    if (result.result == 'success') {
      return res.json(result);
    }
    else {
      throw 'Error: Failed to like/dislike Outfit';
    }
  } catch (e) {
    return res.json({ result: e });
  }
});

router.route('/save/:id').post(async (req, res) => {
  try {
    if (!req.session.user) throw 'Error: No user is logged in';
    if (!ObjectId.isValid(req.params.id)) throw "Error: Outfit id is not valid";
    const result = await outfitsData.saveOutfit(xss(req.params.id), xss(req.session.user.username));
    if (result.result == 'success') {
      return res.json(result);
    }
    else {
      throw 'Error: Failed to save/unsave Outfit';
    }
  } catch (e) {
    return res.json({ result: e });
  }
});

module.exports = router;
