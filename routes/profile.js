const express = require("express");
const router = express.Router();
const data = require("../data/profile");
const validation = require("../validation")

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

  let user;
  try {
    user = await data.get(req.session.user.username);
  }
  catch (e) {
    res.status(404).render("pages/error/error", {error:e});
    return;
  }

  try {
    let username, bio, stores;
    let err= false;

    if (!user.username || user.username == null) {
      username = "N/A";
    }
    else {
      username = user.username;
    }
    if (!user.bio || user.bio == null) {
      bio = "N/A";
    }
    else {
      bio = user.bio;
    }
    if (!user.stores || user.stores == null) {
      stores = "N/A";
      err=true;
    }
    else {
      //in list
      stores = user.stores;
    }

    res.render("pages/single/profile", {
      title: "Profile",
      username: username,
      bio: bio,
      stores: stores,
      err:err
    });
  } catch (e) {
    res.sendStatus(500);
  }
});


router.post("/", async (req, res) => {
  //change username 


  let user;
  try {
    user = await data.get(req.session.user.username);
  }
  catch (e) {
    res.status(404).render("pages/error/error", {error:e});
    return;
  }

  let username, bio, stores;
  let err= false;

  //self checks
  if (!user.username || user.username == null) {
    username = "N/A";
  }
  else {
    username = user.username;
  }
  if (!user.bio || user.bio == null) {
    bio = "N/A";
  }
  else {
    bio = user.bio;
  }
  if (!user.stores || user.stores == null) {
    stores = "N/A";
    err =true;
  }
  else {
    stores = user.stores;
  }

   if (req.body.username) {
    //change username
    try {
      username = validation.checkUsername(req.body.username);
    }
    catch (e) {
      res.render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: user.bio,
        stores: user.stores,
        userE: true,
        error: e,
        err:err
      });
      return;
    }


    try {
      user = await data.changeUsername(user.username, req.body.username);
    }
    catch (e) {
      res.render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: user.bio,
        stores: user.stores,
        userE: true,
        error: e,
        err:err
      });
      return;
    }

    try {
      username = user.username;
      req.session.user.username = username;
      res.render("pages/single/profile", {
        title: "Profile",
        username: username,
        bio: user.bio,
        stores: user.stores,
        userE: false,
        err:err
      });
    }
    catch (e) {
      res.render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: user.bio,
        stores: user.stores,
        userE: true,
        error: e,
        err:err
      });
      return;
    }
  }

  //password
  else if (req.body.password) {
    //change username
    try {
      validation.checkPassword(req.body.password);
    }
    catch (e) {
      res.render("pages/single/profile", {
        title: "Profile",
        username: username,
        bio: user.bio,
        stores: user.stores,
        userE: true,
        error: e,
        err:err
      });
      return;
    }


    try {
      user = await data.changePassword(req.session.user.username, req.body.password);
    }
    catch (e) {
      res.render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: user.bio,
        stores: user.stores,
        userE: true,
        error: e,
        err:err
      });
      return;
    }

    try {
      req.session.user.password = user.password;
      res.render("pages/medium/passwordchange", {});
    }
    catch (e) {
      res.render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: user.bio,
        stores: user.stores,
        userE: true,
        error: e,
        err:err
      });
      return;
    }
  }

  //bio
  else if (req.body.bio) {
    //change username

    try {
      bio = validation.checkString(req.body.bio);
    }
    catch (e) {
      res.render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: user.bio,
        stores: user.stores,
        bioE: true,
        error: e,
        err:err
      });
      return;
    }

    try {
      //change bio
      user = await data.changeBio(req.session.user.username, req.body.bio);
    }
    catch (e) {
      res.render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: user.bio,
        stores: user.stores,
        bioE: true,
        error: e,
        err:err
      });
      return;
    }


    //update page
    try {

      req.session.user.bio = user.bio;
    

      res.render("pages/single/profile", {
        title: "Profile",
        username: username,
        bio: user.bio,
        stores: user.stores,
        bioE: false,
        err:err
      });
    }
    catch (e) {
      res.render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: user.bio,
        stores: user.stores,
        bioE: true,
        error: e,
        err:err
      });
      return;
    }

  }

  else if (req.body.storename) {
    //change username

    try {
      //validation 
      storename = validation.checkString(req.body.storename);
      storelink = validation.checkWebsite(req.body.storelink);
    }
    catch (e) {
      res.render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: user.bio,
        stores: user.stores,
        storeE: true,
        error: e
      });
      return;
    }

    try {
      //change store 
      user = await data.changeStore(req.session.user.username, req.body.storename, req.body.storelink);
    }
    catch (e) {
      res.render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: user.bio,
        stores: user.stores,
        storeE: true,
        error: e
      });
      return;
    }


    //update page
    try {
      req.session.user.stores = user.stores;

      res.render("pages/single/profile", {
        title: "Profile",
        username: username,
        bio: user.bio,
        stores: user.stores,
        storeE: false,
      });
    }
    catch (e) {
      res.render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: user.bio,
        stores: user.stores,
        storeE: true,
        error: e
      });
      return;
    }

  }
  else{
    res.render("pages/single/profile", {
      title: "Profile",
      username: req.session.user.username,
      bio: user.bio,
      stores: user.stores,
      submitE: true,
      error: "Must Provide Input inside text box"
    });
  }

});


//get profile if signed in 
router.get("/delete", async (req, res) => {
  res.render("pages/medium/delete", {});
});

router.post("/delete",async (req, res) => {

    try{
      await data.removeAccount(req.session.user.username);
      req.session.destroy();
      return res.redirect("/home");}
      
    catch(e){
      res.render("pages/medium/delete", {
        error:e,
        deleteE:true
      });
    }
  
});


module.exports = router;
