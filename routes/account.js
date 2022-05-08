const express = require("express");
const router = express.Router();
const data = require("../data");
const account_validation = require("../validation/account_validation");
const accountData = data.account;
const xss = require('xss');

//Middleware
router.use("/signup", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/home");
  }
  next();
});

router.use("/login", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/home");
  }
  next();
});

router.use("/logout", (req, res, next) => {
  if (!req.session.user) {
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
  let userInfo = req.body;
  let username = userInfo.username;
  let userPsw = userInfo.psw;
  let pswRepeat = userInfo.pswRepeat;

  try {
    username = account_validation.checkUsername(username);
  } catch (e) {
    return res.status(400).render("pages/medium/signup", {
      error: e,
      usernameErr: true,
      not_logged_in: true,
    });
  }

  try {
    userPsw = account_validation.checkPassword(userPsw);
    pswRepeat = account_validation.checkPassword(pswRepeat);
    if (userPsw.localeCompare(pswRepeat) !== 0)
      throw "Error: password and confirm password fields must match";
  } catch (e) {
    return res.status(400).render("pages/medium/signup", {
      error: e,
      pswErr: true,
      username: username,
      not_logged_in: true,
    });
  }

  try {
    await accountData.addNewUser(xss(username), xss(userPsw));
  } catch (e) {
    return res.status(500).render("pages/medium/signup", {
      error: e,
      dbErr: true,
      username: username,
      not_logged_in: true,
    });
  }

  try {
    return res.redirect("/account/login");
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
    username = account_validation.checkUsername(username);
  } catch (e) {
    return res.status(400).render("pages/medium/login", {
      error: e,
      usernameErr: true,
      not_logged_in: true,
    });
  }

  try {
    userPsw = account_validation.checkPassword(userPsw);
  } catch (e) {
    return res.status(400).render("pages/medium/login", {
      error: e,
      pswErr: true,
      username: username,
      password: userPsw,
      not_logged_in: true,
    });
  }

  try {
    let existingUser = await accountData.login(xss(username), xss(userPsw));
    if (!existingUser) throw "Error: could not login";
    let isAdmin = await accountData.isUserAdmin(xss(username));
    req.session.user = { username: existingUser };
    if (isAdmin.administrator) req.session.admin = true;
    return res.redirect("/home");
  } catch (e) {
    return res.status(400).render("pages/medium/login", {
      error: e,
      dbErr: true,
      username: username,
      not_logged_in: true,
    });
  }
});

// Logout - GET /

router.get("/logout", async (req, res) => {
  req.session.destroy();
  return res.redirect("/home");
});

module.exports = router;
