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
    res.status(404).render("pages/error/error", { code: 404, error: e });
    return;
  }

  try {
    let username, bio, stores;
    let noStore = false;

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
      noStore = true;
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
      noStore: noStore
    });
  } catch (e) {
    res.sendStatus(500);
  }
});


router.post("/bio", async (req, res) => {
  //change bio
  let user;

  try {
    user = await data.get(req.session.user.username);
  }
  catch (e) {
    //error page
    res.status(404).render("pages/error/error", { error: e });
    return;
  }

  let username, bio, stores;
  let err = false;

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
    err = true;
  }
  else {
    stores = user.stores;
  }


  //password
  if (req.body.password) {
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
        err: err
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
        err: err
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
        err: err
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
        err: err
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
        err: err
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
        err: err
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
        err: err
      });
      return;
    }

  }


  else {
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


router.post("/stores", async (req, res) => {



  if (req.body.storename) {
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






})



//get profile if signed in 
router.get("/password", async (req, res) => {

  try {
    return res.render("pages/single/changepassword", {});
  }
  catch (e) {
    return res.status(500).render("pages/error/error", { code: 500, error: e });
  }

});

//change password
router.post("/password", async (req, res) => {

  let username = req.session.user.username;
  let password;

  try {
    password = validation.checkPassword(req.body.password);
  }
  catch (e) {
    //error
    return res.render("pages/single/changepassword", { passwordE: true, error: e })
  }

  try {
    await data.checkPassword(username, password);
  } catch (e) {
    return res.status(500).render("pages/single/changepassword", {
      passwordE:true,
      error: e,
    });
  }

  try {
    return res.render("pages/single/changepassword2", {});
  }
  catch (e) {
    return res.status(500).render("pages/error/error", { code: 500, error: e });
  }

});

router.post("/password2", async (req, res) => {


  let username = req.session.user.username;
  let password1,password2;

  try {
    //verify both passwords
    password1 = validation.checkPassword(req.body.password);
    password2 = validation.checkPassword(req.body.password2);
  }
  catch (e) {
    //error
    return res.render("pages/single/changepassword2", { passwordE: true, error: e })
  }


  try {
      await data.changePassword(username, password1,password2);
    
  } catch (e) {
    return res.status(500).render("pages/single/changepassword2", {
      passwordE:true,
      error: e,
    });
  }

  try {    
    req.session.destroy();

    return res.render("pages/single/changepassword3", {      not_logged_in: true,});
  }
  catch (e) {
    return res.status(500).render("pages/error/error", { code: 500, error: e });
  }

});


//get profile if signed in 
router.get("/delete", async (req, res) => {
  res.render("pages/medium/delete", {});
});

router.post("/delete", async (req, res) => {

  try {
    await data.removeAccount(req.session.user.username);
    req.session.destroy();
    return res.redirect("/home");
  }

  catch (e) {
    res.render("pages/medium/delete", {
      error: e,
      deleteE: true
    });
  }

});




module.exports = router;
