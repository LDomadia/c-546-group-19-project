const express = require("express");
const router = express.Router();
const outfitsData = require("../data/outfits");
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

router.route("/new").post(async (req, res) => {
  res.redirect("/outfits");
});
module.exports = router;
