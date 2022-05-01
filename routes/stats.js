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
  try {
    const statistics = await accountData.getStats(req.session.user.username);
    return res.status(200).render("pages/single/statistics", {
      title: req.session.user.username + " Statistics",
      brands: statistics.brands,
      types: statistics.type,
      statsPage: true,
      "colors-patterns": statistics["colors-patterns"],
    });
  } catch (e) {
    return res.status(500).json(e);
  }
});

module.exports = router;
