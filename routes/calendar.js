const express = require("express");
const router = express.Router();

//Middleware
//have to log in
router.use("/", (req, res, next) => {
  //if session not logged in 
  if (!req.session.user) {
    return res.redirect("/account/login");
  }
  next();
});

// GET /
router.get("/", async (req, res) => {
  try {
   return res.render("pages/single/calendar", {title:"Calendar"});
  } catch (e) {
    return res.sendStatus(500);
  }
});

module.exports = router;
