const express = require("express");
const { sendStatus } = require("express/lib/response");
const router = express.Router();
const data = require("../data");
const accountData = data.account;

//Middleware
router.use("/", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/account/login");
  }
  next();
});

router.route("/").get(async (req, res) => {
  sendStatus(200);
});

module.exports = router;
