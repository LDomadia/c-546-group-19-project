const express = require("express");
const router = express.Router();
const data = require("../data");
const { route } = require("./home");
const outfitsData = data.outfits;

//Middleware
router.use("/", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/account/login");
  }
  next();
});
router.route("/").patch(async (req, res) => {
  try {
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
