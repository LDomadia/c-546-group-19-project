const express = require("express");
const router = express.Router();

const gen_outfitData = require("../data/gen_outfit");
const outfitsData = require("../data/outfits");
const clothesData = require("../data/clothes");
const multer = require("multer");
const bcrypt = require("bcryptjs");

const upload = multer({ dest: "uploads/" });

//Middleware
router.use("/", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/account/login");
  }
  next();
});

router.route("/").get(async (req, res) => {
  if (!req.session.user)
    return res.render("pages/results/outfits", {
      title: "My Outfits",
      outfitsPage: true,
      not_logged_in: true,
    });

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

router
  .route("/generate")
  .get(async (req, res) => {
    res.render("pages/medium/outfitGenerated", {
      title: "Generate Outfit",
      outfitsPage: true,
      stylesheet: "/public/styles/clothes_styles.css",
      script: "/public/scripts/gen_outfit_script.js",
    });
  })
  .post(async (req, res) => {
    const data = req.body;

    try {
      if (!data) throw "Error: Nothing was entered";
      if (!data.name) throw "Error: Outfit Name is Required";
      if (!data.name.trim()) throw "Error: Outfit Name is Required";
    } catch (e) {
      return res.status(400).render("pages/medium/outfitGenerated", {
        title: "Generate Outfit",
        outfitsPage: true,
        stylesheet: "/public/styles/clothes_styles.css",
        script: "/public/scripts/gen_outfit_script.js",
        error: e,
      });
    }

    try {
      let result = await gen_outfitData.generateOutfit(
        data["colors-patterns"],
        data.season,
        data.styles
      );

      let clothingItems = await clothesData.getClothingbyIds(
        result.map((res) => res._id)
      );

      if (clothingItems.length < 2) {
        throw "Error: Could not find valid matches for query, try using more common search terms";
      }

      const new_outfit = await outfitsData.addNewOutfits(
        req.session.user.username,
        result.map((res) => res._id.toString()),
        "private",
        data.name,
        data.season,
        data.styles
      );

      if (result) {
        res.status(200).render("pages/medium/outfitGenerated", {
          title: "Generate Outfit",
          outfitsPage: true,
          stylesheet: "/public/styles/clothes_styles.css",
          script: "/public/scripts/gen_outfit_script.js",
          error: "outfit generated",
          savePage: true,
          results: clothingItems,
        });
      } else {
        throw "Error: Failed to Generate Outfit";
      }
    } catch (e) {
      return res.status(500).render("pages/medium/outfitGenerated", {
        title: "Generate Outfit",
        outfitsPage: true,
        stylesheet: "/public/styles/clothes_styles.css",
        script: "/public/scripts/gen_outfit_script.js",
        error: e,
      });
    }
  });

module.exports = router;

router.route("/new").get(async (req, res) => {
  try {
    let clothingItems = await clothesData.getClothingItems(
      req.session.user.username
    );
    if (clothingItems.length < 2) {
      let outfitItems = 1;
      return res.render("pages/results/outfits", {
        title: "My Outfits",
        outfitsPage: true,
        outfitItems: outfitItems,
        msg: "You need atleast two clothing items before you can make an outfit",
      });
    }
    for (const item of clothingItems) {
      item._id = item._id.toString();
    }

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

    if (!clothes || clothes.length < 2)
      throw "Error: not enough clothes to make outfit";
    let newOutfit = await outfitsData.addNewOutfits(
      req.session.user.username,
      clothes,
      status,
      name,
      seasons,
      styles
    );
    if (!newOutfit) throw "Error: could not create new outfit";
    //get all outfitd=s
    let outfitItems = 1;
    res.render("pages/results/outfits", {
      title: "My Outfits",
      outfitsPage: true,
      outfitItems: outfitItems,
      msg: "Outfit has successfuly been added!",
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
