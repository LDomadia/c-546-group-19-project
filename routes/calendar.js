const express = require("express");
const router = express.Router();

//Middleware
router.use("/", (req, res, next) => {
  if (req.session.user) {
    return res.render("pages/single/index", {
      title: "Digital Closet",
      homePage: true,
      logged_in: true,
    });
  }
  next();
});

// GET /
router.get("/", async (req, res) => {
  try {
    res.render("pages/single/calendar", {});
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = router;
