const express = require("express");
const { clothes, outfits } = require("../data");
const router = express.Router();
const data = require("../data/detailed");
const data2 = require("../data/clothes");
//add in validation 
const validation = require("../validation/outfits_validation");
const validation2 = require("../validation/account_validation");
const xss = require('xss');
const { ObjectId } = require('mongodb');


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
    //public only
    outfit = await data.get_outfit_by_id(req.params.id);
    if (!outfit) throw "not a public outfit";

    //array of clothing datas 
    clothes = await data2.getClothingbyIds(outfit.clothes);
    if (!clothes) throw "no clothes found";

    if (!outfit.comments || outfit.comments.length == 0) {
      condition = true;
    }

    res.render("pages/single/detailed", {
      //get cloths by data
      clothingData: clothes,
      creator: outfit.creator,
      likes: outfit.likes,
      comments: outfit.comments,
      stylesheet: '/public/styles/detailed_styles.css',
      script: '/public/scripts/detailed.js',
      condition: condition
    });
  }
  catch (e) {
    //TODO 
    res.status(404).render("pages/error/error", {
      title: "Error",
      stylesheet: '/public/styles/outfit_card_styles.css',
      error: e,
      code: 404
    });
  }
});


// //get detailed public outfit page
// router.get("/:id/comment", async (req, res) => {
// console.log("here");
// });




router.get("/:id/comment", async (req, res) => {
  try {
    //get all the comments
    let comments = await data.get_all_comments(req.params.id);
    console.log(comments);
    return res.json({ success: true, comments: comments });
  }
  catch (e) {
    return res.status(500).render("pages/error/error", {
      title: "Error",
      stylesheet: '/public/styles/outfit_card_styles.css',
      error: e,
      code: 500
    });

  }


});

router.post("/:id/comment", async (req, res) => {


  let username, newComment, comment, id;
  try {
    //validate 
    username = validation2.checkUsername(req.session.user.username);
    comment = validation2.checkString(req.body.comment);
    id = validation2.checkId(req.params.id);

    newComment = await data.add_comment(id, username, comment);

    //return all outfit comments
    return res.json({ success: true, comment: newComment });
  }
  catch (e) {
    //TODO check over status

    return res.status(500).render("pages/error/error", {
      title: "Error",
      stylesheet: '/public/styles/outfit_card_styles.css',
      error: e,
      code: 500
    });

  }

});


module.exports = router;