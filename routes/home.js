const express = require("express");
const router = express.Router();

// GET /
router.get("/", async (req, res) => {
  try {
    res.render("pages/single/index", {
      title: "Digital Closet",
      homePage: true,
    });
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = router;
