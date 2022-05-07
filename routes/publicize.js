const express = require("express");
const router = express.Router();
const data = require("../data");
const { route } = require("./home");
const outfitsData = data.outfits;
const clothesData = data.clothes;

//Middleware
router.use("/", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/account/login");
  }
  next();
});
router.route("/").patch(async (req, res) => {
  try {
    let outfits = await outfitsData.getUserOutfits(req.session.user.username);
    if (outfits.length === 0)
      throw "Error: user does not have any outfits to make public";

    const updateOutfits = await outfitsData.makeAllOutfitsPublic(
      req.session.user.username
    );
    if (!updateOutfits || !updateOutfits.updated)
      throw "Could not make outfits public";
    res.json("All outfits are now public!");
  } catch (e) {
    res.json(e);
  }
});

module.exports = router;
