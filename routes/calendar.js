const express = require("express");
const router = express.Router();
const accountData = require("../data/account");
const outfitsData = require("../data/outfits");
const validate = require('../validation/clothes_validation');

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
    date = date.map(e => validate.checkNumericTextInput(e, "date"))
    date_obj = {
      year: date[0],
      month: date[1],
      day: date[2]
    }

    date_num = date.map(e => validate.checkNumericTextInput(e, "date", true))



    mdy_format = `${date_obj["month"]}/${date_obj["day"]}/${date_obj["year"]}`

    const update_calendar = await accountData.updateCalendar(req.session.user.username);


   return res.render("pages/single/calendar", 
                     {title:"Calendar",
                      date: mdy_format});
  } catch (e) {
    return res.status(500).render("pages/single/calendar", 
    {title:"Calendar",
     error: e});;
  }
});

router.route("/log").get(async (req, res) => {
  try {
    let outfitItems = await outfitsData.getOutfitItems(req.session.user.username)
    //before sending this, remove all outfits found in calendar for current date
      
    return res.render("pages/medium/calendar_log", {title:"Log Outfits",
                                                    outfitItems: outfitItems});
  } catch (e) {
    return res.status(500).render("pages/medium/calendar_log", {title:"Log Outfits",
                                                              outfitItems: outfitItems,
                                                              error: e});
  }
}).post(async (req, res) => {
  try {
    const id = req.body
    console.log(id)

      
    return res.render("pages/medium/calendar_log", {title:"Log Outfits",
                                                    outfitItems: outfitItems});
  } catch (e) {
    return res.status(500).render("pages/medium/calendar_log", {title:"Log Outfits",
                                                              outfitItems: outfitItems,
                                                              error: e});
  }


});

module.exports = router;
