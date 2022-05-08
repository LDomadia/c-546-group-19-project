const express = require("express");
const router = express.Router();
const outfitValidation = require("../validation/outfit_validation");
const gen_outfitData = require("../data/gen_outfit");
const outfitsData = require("../data/outfits");
const clothesData = require("../data/clothes");
const accountData = require("../data/account");

//Middleware
router.use("/", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/account/login");
  }
  next();
});

router.route("/").get(async (req, res) => {
  try {
    let outfitItems = await outfitsData.getUserOutfits(
      req.session.user.username
    );
    if (req.session.outfitDeletion) {
      req.session.outfitDeletion = false;
      return res.status(200).render("pages/results/outfits", {
        title: "My Outfits",
        outfitsPage: true,
        stylesheet: "/public/styles/outfit_card_styles.css",
        script: "/public/scripts/outfits.js",
        outfits: outfitItems,
        msg: "Outfit has successfully been deleted!",
      });
    }

    return res.status(200).render("pages/results/outfits", {
      title: "My Outfits",
      outfitsPage: true,
      stylesheet: "/public/styles/outfit_card_styles.css",
      script: "/public/scripts/outfits.js",
      outfits: outfitItems,
      msg: "",
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
  }) //TODO - add error checking here
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
        data.styles,
        req.session.user.username
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
          savePage: true,
          results: clothingItems,
        });
      } else {
        throw "Error: Failed to Generate Outfit";
      }
    } catch (e) {
      return res.status(400).render("pages/medium/outfitGenerated", {
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
      let outfitItems = await outfitsData.getUserOutfits(
        req.session.user.username
      );
      return res.render("pages/results/outfits", {
        title: "My Outfits",
        outfitsPage: true,
        outfitItems: outfitItems,
        msg: "You need atleast two clothing items before you can make an outfit",
      });
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
  let name = req.body.name;
  let images = req.body.outfits;
  let seasons = req.body.season ? req.body.season : [];
  let status = req.body.public ? "public" : "private";
  let styles = req.body.styles ? req.body.styles : [];

  try {
    name = outfitValidation.checkOutfitName(name);
    images = outfitValidation.checkImages(images);
    seasons = outfitValidation.checkSeasons(seasons);
    status = outfitValidation.checkStatus(status);
    styles = outfitValidation.checkStyles(styles);
  } catch (e) {
    res.status(400).render("pages/results/outfits", {
      title: "My Outfits",
      stylesheet: "/public/styles/outfit_card_styles.css",
      script: "/public/scripts/outfits.js",
      outfitsPage: true,
      error: e,
    });
  }
  try {
    let clothesIdArr = await clothesData.getClothingIdsByImages(images);
    let isValid = await clothesData.checkTypes(clothesIdArr);
    let newOutfit = await outfitsData.addNewOutfits(
      req.session.user.username,
      clothesIdArr,
      status,
      name,
      seasons,
      styles
    );
    if (!newOutfit) throw "Error: could not create new outfit";
    let outfitItems = await outfitsData.getUserOutfits(
      req.session.user.username
    );
    res.status(200).render("pages/results/outfits", {
      title: "My Outfits",
      outfitsPage: true,
      stylesheet: "/public/styles/outfit_card_styles.css",
      script: "/public/scripts/outfits.js",
      outfits: outfitItems,
      msg: "Outfit has successfuly been added!",
    });
  } catch (e) {
    res.status(500).render("pages/results/outfits", {
      title: "My Outfits",
      stylesheet: "/public/styles/outfit_card_styles.css",
      script: "/public/scripts/outfits.js",
      outfitsPage: true,
      error: e,
    });
  }
});

router.route("/edit/:id").get(async (req, res) => {
  let id;
  try {
    id = outfitValidation.checkId(req.params.id);
    let clothingItems = await clothesData.getClothingItems(
      req.session.user.username
    );
    //change this to a redirect to outfits page, use session for msg
    if (clothingItems.length < 2) {
      let outfitItems = await outfitsData.getUserOutfits(
        req.session.user.username
      );
      return res.status(403).render("pages/results/outfits", {
        title: "My Outfits",
        outfitsPage: true,
        outfitItems: outfitItems,
        msg: "You need more clothing items to edit this outfit",
      });
    }

    let currentOutfit = await outfitsData.getUserOutfitById(
      req.session.user.username,
      id
    );
    return res.status(200).render("pages/single/outfitEdit", {
      title: "Edit Outfit",
      outfitsPage: true,
      clothingItems: clothingItems,
      script: "/public/scripts/outfit_edit.js",
      outfit: currentOutfit,
    });
  } catch (e) {
    res.status(400).render("pages/results/outfits", {
      title: "My Outfits",
      stylesheet: "/public/styles/outfit_card_styles.css",
      script: "/public/scripts/outfits.js",
      outfitsPage: true,
      error: e,
    });
  }
});
router.route("/edit/:id").post(async (req, res) => {
  let name = req.body.name;
  let images = req.body.outfits;
  let seasons = req.body.season ? req.body.season : [];
  let status = req.body.public ? "public" : "private";
  let styles = req.body.styles ? req.body.styles : [];
  let id = outfitValidation.checkId(req.params.id);
  try {
    name = outfitValidation.checkOutfitName(name);
    images = outfitValidation.checkImages(images);
    seasons = outfitValidation.checkSeasons(seasons);
    status = outfitValidation.checkStatus(status);
    styles = outfitValidation.checkStyles(styles);
  } catch (e) {
    res.status(400).render("pages/results/outfits", {
      title: "My Outfits",
      stylesheet: "/public/styles/outfit_card_styles.css",
      script: "/public/scripts/outfits.js",
      outfitsPage: true,
      error: e,
    });
  }
  try {
    let clothesIdArr = await clothesData.getClothingIdsByImages(images);
    let updateInfo = await outfitsData.updateUserOutfit(
      req.session.user.username,
      id,
      clothesIdArr,
      status,
      name,
      seasons,
      styles
    );
    if (!updateInfo.updated) throw "Error: could not update outfit";
    let outfitItems = await outfitsData.getUserOutfits(
      req.session.user.username
    );
    res.status(200).render("pages/results/outfits", {
      title: "My Outfits",
      outfitsPage: true,
      stylesheet: "/public/styles/outfit_card_styles.css",
      script: "/public/scripts/outfits.js",
      outfits: outfitItems,
      msg: "Outfit has successfuly been edited!",
    });
  } catch (e) {
    res.status(400).render("pages/results/outfits", {
      title: "My Outfits",
      stylesheet: "/public/styles/outfit_card_styles.css",
      script: "/public/scripts/outfits.js",
      outfitsPage: true,
      error: e,
    });
  }
});
router.route("/delete/:id").delete(async (req, res) => {
  let id;
  try {
    id = outfitValidation.checkId(req.params.id);
    let deletionInfo = await outfitsData.delUserOutfit(
      req.session.user.username,
      id
    );
    if (!deletionInfo) throw "Error: could not delete outfit";
    req.session.outfitDeletion = true;
    return res.status(303).json({ redirect: true });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});
router.route("/likes").get(async (req, res) => {
  try {
    if (!req.session.user) throw "Error: User is not logged in";
    const outfitLikes = await outfitsData.getUserLikedOutfits(
      req.session.user.username
    );
    const userId = await accountData.getUserIdByUserName(
      req.session.user.username
    );
    return res.status(200).render("pages/results/outfitsLikes", {
      title: "My Liked Outfits",
      outfitsPage: true,
      outfits: outfitLikes,
      userId: userId,
      stylesheet: "/public/styles/outfit_card_styles.css",
      script: "/public/scripts/home_script.js",
    });
  } catch (e) {
    return res.status(404).render("pages/results/outfitsLikes", {
      title: "My Liked Outfits",
      outfitsPage: true,
      stylesheet: "/public/styles/outfit_card_styles.css",
      error: e,
    });
  }
});
router.route("/saves").get(async (req, res) => {
  try {
    if (!req.session.user) throw "Error: User is not logged in";
    const outfitSaves = await outfitsData.getUserSavedOutfits(
      req.session.user.username
    );
    const userId = await accountData.getUserIdByUserName(
      req.session.user.username
    );
    return res.status(200).render("pages/results/outfitsSaves", {
      title: "My Saved Outfits",
      outfitsPage: true,
      outfits: outfitSaves,
      userId: userId,
      stylesheet: "/public/styles/outfit_card_styles.css",
      script: "/public/scripts/home_script.js",
    });
  } catch (e) {
    return res.status(404).render("pages/results/outfitsSaves", {
      title: "My Saved Outfits",
      outfitsPage: true,
      stylesheet: "/public/styles/outfit_card_styles.css",
      error: e,
    });
  }
});

module.exports = router;
