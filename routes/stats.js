const express = require("express");
const { sendStatus } = require("express/lib/response");
const { ObjectId } = require("mongodb");
const router = express.Router();
const data = require("../data");
const accountData = data.account;
const clothesData = data.clothes;
const outfitsData = data.outfits;
//Middleware
router.use("/", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/account/login");
  }
  next();
});

router.route("/").get(async (req, res) => {
  try {
    const statistics = await accountData.getStats(req.session.user.username);
    let stats_clothes = statistics.clothesWorn
    let stats_outfits = statistics.outfitsWorn

    if(!stats_clothes || stats_clothes==null){
      throw 'Error: clothesWorn not found'
    }

    if(!stats_outfits || stats_outfits==null){
      throw 'Error: outfitsWorn not found'
    }

    let cloth_ids = Object.keys(stats_clothes).map(id => ObjectId(id))

    clothes = await clothesData.getClothingbyIds(cloth_ids)

    clothes = clothes.map(cloth => cloth.name)

    clothes_obj = []
    for(let i = 0; i < clothes.length; i++){
      clothes_obj.push(
        {_id: cloth_ids[i],
        cloth: clothes[i],
        total: stats_clothes[cloth_ids[i]].toString()}
      )
    }

    let outfit_ids = Object.keys(stats_outfits).map(id => ObjectId(id))
    outfits = await outfitsData.getOutfitbyIds(outfit_ids)
    outfits = outfits.map(outfit => outfit.outfitName)

    outfits_obj = []
    for(let i = 0; i < outfits.length; i++){
      outfits_obj.push(
        {_id: outfit_ids[i],
        outfit: outfits[i],
        total: stats_outfits[outfit_ids[i]].toString()}
      )
    }

    return res.status(200).render("pages/single/statistics", {
      title: req.session.user.username + " Statistics",
      brands: statistics.brands,
      types: statistics.type,
      statsPage: true,
      "colors-patterns": statistics["colors-patterns"],
      clothesWorn: clothes_obj,
      outfitsWorn: outfits_obj
    });
  } catch (e) {
    return res.status(500).render("pages/single/statistics", {
      title: req.session.user.username + " Statistics",
      statsPage: true,
      error: e
    });
  }
});

module.exports = router;
