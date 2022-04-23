const express = require("express");
const router = express.Router();
const data = require("../data");
const accountData = data.account;

//Middleware
router.use("/", (req, res, next) => {
  //if session logged in 
  if (!req.session.user) {
    return res.redirect("/account/login");
  }
  next();
});

//get profile if signed in 
router.get("/", async (req, res) => {
  try {
    let user = req.session.user;
    let username,bio,stores;

    if(!user.username){
      username = "N/A";
    }
    else{
      username = user.username;
    }
    if(!user.bio){
      bio = "N/A";
    }
    else{
      bio = user.bio;
    }
    if(!user.stores){
      stores = "N/A";
    }
    else{
      //in list
      stores = user.stores;
    }
  


    res.render("pages/single/profile", {
      title: "Profile",
      username:username,
      bio: bio,
      stores:stores
    });
  } catch (e) {
    res.sendStatus(500);
  }
});
module.exports = router;
