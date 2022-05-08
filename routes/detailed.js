const express = require("express");
const { clothes, outfits } = require("../data");
const router = express.Router();
const data = require("../data/detailed");
const data2 = require("../data/clothes");
const accountData = require("../data/account");
//add in validation
const validation = require("../validation/outfits_validation");
const validation2 = require("../validation/account_validation");
const xss = require("xss");
const { ObjectId } = require("mongodb");

//Middleware
router.use("/", (req, res, next) => {
  //if session not logged in
  if (!req.session.user) {
    return res.redirect("/account/login");
  }
  next();
});

//get detailed public outfit page
router.get("/:id", async (req, res) => {
  //outfit id
  let outfit;
  let clothes;
  let condition;
  try {
    validation2.checkId(req.params.id);
  } catch (e) {
    return res.status(400).render("pages/error/error", {
      title: "Error",
      stylesheet: "/public/styles/outfit_card_styles.css",
      error: e,
      code: 400,
    });
  }

  try {
    //public only
    outfit = await data.get_outfit_by_id(req.params.id);
    if (!outfit) throw "not a public outfit";

    //array of clothing data
    clothes = await data2.getClothingbyIds(outfit.clothes);
    if (!clothes) throw "no clothes found";

    if (!outfit.comments || outfit.comments.length == 0) {
      condition = true;
    }

    const userId = await accountData.getUserIdByUserName(
      req.session.user.username
    );

    return res.render("pages/single/detailed", {
      //get cloths by data
      outfitData: outfit,
      clothingData: clothes,
      creator: outfit.creator,
      userId: userId,
      title: "Outfit Details",
      stylesheet: "/public/styles/detailed_styles.css",
      script: "/public/scripts/detailed.js",
      condition: condition,
    });
  } catch (e) {
    //404 bc no clothes or outfits found
    res.status(404).render("pages/error/error", {
      title: "Error",
      stylesheet: "/public/styles/outfit_card_styles.css",
      error: e,
      code: 404,
    });
  }
});

// //get detailed public outfit page
//get all comments
router.get("/:id/comment", async (req, res) => {
  //check parameters
  let id;
  try {
    id = validation2.checkId(req.params.id);
  } catch (e) {
    return res.status(400).render("pages/error/error", {
      title: "Error",
      stylesheet: "/public/styles/outfit_card_styles.css",
      error: e,
      code: 400,
    });
  }

  try {
    //get all the comments
    let comments = await data.get_all_comments(id);
    let admin = req.session.admin ? true : false;
    return res.json({ success: true, comments: comments, admin: admin });
  } catch (e) {
    //unable to get outfit
    return res.status(404).json({ error: e });
  }
});

//add comment
router.post("/:id/comment", async (req, res) => {
  let username, newComment, comment, id;
  try {
    //validate
    username = validation2.checkUsername(req.session.user.username);
    comment = validation2.checkString(req.body.comment);
    id = validation2.checkId(req.params.id);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    newComment = await data.add_comment(id, username, comment);

    //return all outfit comments
    return res.json({ success: true, comment: newComment });
  } catch (e) {
    //TODO check over status
    //404: no comment found
    return res.status(404).json({ error: e });
  }
});

router.delete("/:id/comment", async (req, res) => {
  //check parameters
  let outfitId, commentId;
  try {
    outfitId = validation2.checkId(req.params.id);
    commentId = validation2.checkId(req.body.commentId);
  } catch (e) {
    return res.status(400).render("pages/error/error", {
      title: "Error",
      stylesheet: "/public/styles/outfit_card_styles.css",
      error: e,
    });
  }
  if (!req.session.admin) {
    return res.status(403).render("pages/error/error", {
      title: "Error",
      stylesheet: "/public/styles/outfit_card_styles.css",
      error: "403: Forbidden",
    });
  }
  try {
    let deletionInfo = await data.deleteComment(outfitId, commentId);
    if (!deletionInfo.deleted) throw "Error: could not delete comment";
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

module.exports = router;
