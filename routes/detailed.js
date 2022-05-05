const express = require("express");
const { clothes, outfits } = require("../data");
const router = express.Router();
const data = require("../data/detailed");
const data2 = require("../data/clothes");
//add in validation 
const validation = require("../validation/outfits_validation");



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

    if (!outfit.comments || outfit.comments.length == 0){
      condition = true;
    }


    res.render("pages/single/detailed", {
      //get cloths by data
      clothingData: clothes,
      creator: outfit.creator,
      likes: outfit.likes,
      comments: outfit.comments,
      stylesheet: '/public/styles/detailed_styles.css',
      condition:condition
    });
  }
  catch (e) {
    console.log(e);
  }

  //check if public 
  //if private: then if creator = username display


  //need: image; username; likes; comments

});



module.exports = router;