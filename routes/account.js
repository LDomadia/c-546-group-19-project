const express = require("express");
const router = express.Router();
const data = require("../data");
const accountData = data.account;

// POST /
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
    //res.redirect("/signup");
    res.status(200).render("pages/single/index", { title: "Digital Closet" });
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = router;