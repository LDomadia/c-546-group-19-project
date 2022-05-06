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
   return res.render("pages/single/calendar", {title:"Calendar"});
  } catch (e) {
    return res.sendStatus(500);
  }
}).post(async (req, res) => {
  let data = req.body

  try {
    date = data.birthday.split("-")
    console.log(date)
    date_obj = {
      year: date[0],
      month: date[1],
      day: date[2]
    }
    mdy_format = `${date_obj["month"]}-${date_obj["day"]}-${date_obj["year"]}`
    


   return res.render("pages/single/calendar", 
                     {title:"Calendar",
                      date: mdy_format});
  } catch (e) {
    return res.sendStatus(500);
  }
});

module.exports = router;
