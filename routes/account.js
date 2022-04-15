const express = require("express");
const router = express.Router();
const data = require("../data");
const accountData = data.account;

//Middleware
router.use("/", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/home");
  }
  next();
});

// Signup - GET /
router.get("/signup", async (req, res) => {
  try {
    res.render("pages/medium/signup", {
      title: "Sign Up",
      not_logged_in: true,
    });
  } catch (e) {
    res.sendStatus(500);
  }
});
// Signup - POST /
router.post("/signup", async (req, res) => {
  //Todo - check if user is already logged in, need to handle redirection
  let userInfo = req.body;
  let username = userInfo.username;
  let userPsw = userInfo.psw;
  let pswRepeat = userInfo.pswRepeat;

  try {
    if (!username) throw "Error: username was not provided";
    if (typeof username !== "string")
      throw "Error: username should be a string";
    username = username.trim();
    if (username.length < 2)
      throw "Error: username must have at least two characters";
  } catch (e) {
    return res
      .status(400)
      .render("pages/medium/signup", { error: e, usernameErr: true });
  }

  try {
    if (!userPsw) throw "Error: password was not provided";
    if (!pswRepeat) throw "Error: no entry for confirm password";

    if (typeof userPsw !== "string") throw "Error: password should be a string";
    if (typeof pswRepeat !== "string")
      throw "Error: confirm password should be a string";

    userPsw = userPsw.trim();
    pswRepeat = pswRepeat.trim();

    if (userPsw.length < 8)
      throw "Error: password must have at least eight characters";
    if (userPsw.localeCompare(pswRepeat) !== 0)
      throw "Error: password and confirm password fields must match";
  } catch (e) {
    return res.status(400).render("pages/medium/signup", {
      error: e,
      pswErr: true,
      username: username,
    });
  }

  try {
    await accountData.addNewUser(username, userPsw);
  } catch (e) {
    return res.status(500).render("pages/medium/signup", {
      error: e,
      dbErr: true,
      username: username,
    });
  }

  try {
    res
      .status(200)
      .render("pages/medium/login", {
        title: "Digital Closet",
        not_logged_in: true,
      });
  } catch (e) {
    res.status(500);
  }
});

router.get("/login", async (req, res) => {
  try {
    res.render("pages/medium/login", { title: "Log In", not_logged_in: true });
  } catch (e) {
    res.sendStatus(500);
  }
});

router.post("/login", async (req, res) => {
  let userInfo = req.body;
  let username = userInfo.username;
  let userPsw = userInfo.psw;

  //error checking
  try {
    if (!username) throw "Error: username was not provided";
    if (typeof username !== "string")
      throw "Error: username should be a string";
    username = username.trim();
    if (username.length < 2)
      throw "Error: username must have at least two characters";
  } catch (e) {
    return res
      .status(400)
      .render("pages/medium/login", { error: e, usernameErr: true });
  }

  try {
    if (!userPsw) throw "Error: password was not provided";
    if (typeof userPsw !== "string") throw "Error: password should be a string";

    userPsw = userPsw.trim();

    if (userPsw.length < 8)
      throw "Error: Password must be at least eight characters";
  } catch (e) {
    return res.status(400).render("pages/medium/login", {
      error: e,
      pswErr: true,
      username: username,
      password: userPsw,
    });
  }

  try {
    let existingUser = await accountData.login(username, userPsw);
    if (existingUser) {
      req.session.user = { username: username };
      return res.redirect("/home");
    }
  } catch (e) {
    return res.status(400).render("pages/medium/login", {
      error: e,
      dbErr: true,
      username: username,
    });
  }

  try {
    res.status(200).render("pages/single/index", { title: "Digital Closet" });
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = router;
