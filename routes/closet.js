const express = require("express");
const router = express.Router();
const data = require("../data");
const closetData = data.closet;

// GET /
router.get("/", async (req, res) => {
  try {
    res.render("pages/single/index", {
      title: "Digital Closet",
      signed_in: true,
      home_not_signed_in: false,
    });
  } catch (e) {
    res.sendStatus(500);
  }
});
router.get("/signup", async (req, res) => {
  try {
    res.render("pages/medium/signup", { title: "Sign Up" });
  } catch (e) {
    res.sendStatus(500);
  }
});
module.exports = router;
