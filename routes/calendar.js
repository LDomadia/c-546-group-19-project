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
router.route("/").get(async (req, res) => {
  try {
    console.log("test123")
   return res.render("pages/single/calendar", {title:"Calendar"});
  } catch (e) {
    return res.sendStatus(500);
  }
}).post(async (req, res) => {
  let data = req.body

  console.log(data)

  try {
   return res.render("pages/single/calendar", {title:"Calendar"});
  } catch (e) {
    return res.sendStatus(500);
  }
});

module.exports = router;
