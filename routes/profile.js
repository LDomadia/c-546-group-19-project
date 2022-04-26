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

  try {
    let user = req.session.user;
    let username, bio, stores;

    if (!user.username) {
      username = "N/A";
    }
    else {
      username = user.username;
    }
    if (!user.bio) {
      bio = "N/A";
    }
    else {
      bio = user.bio;
    }
    if (!user.stores) {
      stores = "N/A";
    }
    else {
      //in list
      stores = user.stores;
    }

    res.render("pages/single/profile", {
      title: "Profile",
      username: username,
      bio: bio,
      stores: stores
    });
  } catch (e) {
    res.sendStatus(500);
  }
});


router.post("/", async (req, res) => {
  //change username 

  let user = req.session.user;
  let username, bio, stores;

  //self checks
  if (!user.username) {
    username = "N/A";
  }
  else {
    username = user.username;
  }
  if (!user.bio) {
    bio = "N/A";
  }
  else {
    bio = user.bio;
  }
  if (!user.stores) {
    stores = "N/A";
  }
  else {
    //in list
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
        bio: bio,
        stores: stores,
        userE: true,
        error: e
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
        bio: bio,
        stores: stores,
        userE: true,
        error: e
      });
      return;
    }

    try {
      username = user.username;
      req.session.user.username = username;
      res.render("pages/single/profile", {
        title: "Profile",
        username: username,
        bio: bio,
        stores: stores,
        userE: false
      });
    }
    catch (e) {
      res.render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: bio,
        stores: stores,
        userE: true,
        error: e
      });
      return;
    }
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
        bio: bio,
        stores: stores,
        PasswordE: true,
        error: e
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
        bio: bio,
        stores: stores,
        PasswordE: true,
        error: e
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
        bio: bio,
        stores: stores,
        PasswordE: true,
        error: e
      });
      return;
    }
  }
})

//   }

//   if (req.body.bio) {
//     //change username
//     bio= data.changeBio(name, req.body.bio).bio;
//     let user = req.session.user;
//     let username, bio, stores;

//     if (!user.username) {
//       username = "N/A";
//     }
//     else {
//       username = user.username;
//     }

//     if (!user.stores) {
//       stores = "N/A";
//     }
//     else {
//       //in list
//       stores = user.stores;
//     }

//     res.render("pages/single/profile", {
//       title: "Profile",
//       username: username,
//       bio: bio,
//       stores: stores
//     });
//   }

//   if (req.body.store) {
//     //change username
//     stores =data.addStore(name, req.body.store).stores;


//     if (!user.username) {
//       username = "N/A";
//     }
//     else {
//       username = user.username;
//     }
//     if (!user.bio) {
//       bio = "N/A";
//     }
//     else {
//       bio = user.bio;
//     }

//     res.render("pages/single/profile", {
//       title: "Profile",
//       username: username,
//       bio: bio,
//       stores: stores
//     });
//   }
// }
// catch (e) {
//   //error page 
//   res.sendStatus(500);
// }

//});



module.exports = router;
