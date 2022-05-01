const express = require("express");
const router = express.Router();
const outfitsData = require("../data/outfits");
const clothesData = require("../data/clothes");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

//Middleware
router.use("/", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/account/login");
  }
  next();
});

router.route("/").get(async (req, res) => {
  try {
    let outfitItems = await outfitsData.getOutfitItems(
      req.session.user.username
    );
    res.render("pages/results/outfits", {
      title: "My Outfits",
      outfitsPage: true,
      outfitItems: outfitItems,
    });
  } catch (e) {
    res.status(500).render("pages/results/outfits", {
      title: "My Outfits",
      outfitsPage: true,
      error: e,
    });
  }
});

router.route("/new").get(async (req, res) => {
  try {
    let clothingItems = await clothesData.getClothingItems(
      req.session.user.username
    );
    res.status(200).render("pages/medium/outfitNew", {
      title: "Add new outfit",
      outfitsPage: true,
      clothingItems: clothingItems,
    });
  } catch (e) {
    res.status(500).render("pages/medium/outfitNew", {
      title: "Add new outfit",
      outfitsPage: true,
      error: e,
    });
  }
});

router.route("/new").post(async (req, res) => {
  //console.log(req.body);
  try {
    let name = req.body.name;
    let clothes = req.body.outfits;
    let seasons = req.body.season ? req.body.season : [];
    let status = req.body.public ? "public" : "private";
    let styles = req.body.styles ? req.body.styles : [];

    let newOutfit = await outfitsData.addNewOutfits(
      req.session.user.username,
      clothes,
      status,
      name,
      seasons,
      styles
    );
    //get all outfitd=s
    let outfitItems = 1;
    res.render("pages/results/outfits", {
      title: "My Outfits",
      outfitsPage: true,
      outfitItems: outfitItems,
      successMsg: "Outfit has successfuly been added!",
    });
  } catch (e) {
    res.status(500).render("pages/results/outfits", {
      title: "My Outfits",
      outfitsPage: true,
      error: e,
    });
  }
});
module.exports = router;
