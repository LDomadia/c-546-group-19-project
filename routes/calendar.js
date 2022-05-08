const express = require("express");
const moment = require("moment");
const { ObjectId } = require("mongodb");
const router = express.Router();
const accountData = require("../data/account");
const outfitsData = require("../data/outfits");
const profile = require("../data/profile");
const profileData = require("../data/profile");
const account_validation = require("../validation/account_validation");
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
    return res.render("pages/single/calendar", { title: "Calendar" });
  } catch (e) {
    return res.sendStatus(500);
  }
}).post(async (req, res) => {
  let data = req.body
  let bday = data.birthday

  try {
    let bday = data.birthday

    if (!moment(bday).isValid()) {
      throw "Invalid date!"
    }

    if (!moment().isAfter(bday)) {
      throw "Cannot log date in the future!"
    }

    if (moment(bday).isBefore("2022-01-01", "year")) {
      throw "Cannot log date before 2022!"
    }
  }
  catch (e) {
    return res.status(400).render("pages/single/calendar",
      {
        title: "Calendar",
        error: e
      });;
  }

  try {

    date = data.birthday.split("-")
    date = date.map(e => validate.checkNumericTextInput(e, "date"))
    date_obj = {
      year: date[0],
      month: date[1],
      day: date[2]
    }

    date_num = date.map(e => validate.checkNumericTextInput(e, "date", true))



    mdy_format = `${date_obj["month"]}-${date_obj["day"]}-${date_obj["year"]}`

    let outfitItems = await outfitsData.getOutfitsOnDate(req.session.user.username, mdy_format)


    return res.render("pages/single/calendar",
      {
        title: "Calendar",
        outfitsPage: true,
        stylesheet: "/public/styles/outfit_card_styles.css",
        script: "/public/scripts/outfits.js",
        date: mdy_format,
        outfits: outfitItems
      });
  } catch (e) {
    return res.status(500).render("pages/single/calendar",
      {
        title: "Calendar",
        error: e
      });;
  }
});

router.route("/log").get(async (req, res) => {

  let noOutfits = false;
  let user, username;
  //check username
  try {
    username = account_validation.checkUsername(req.session.user.username);
  }
  catch (e) {
    return res.status(400).render("pages/error/error", { title: "Error", code: 400, error: e });
  }

  try {
    user = profileData.get(username);
    if(!user) throw "user not found "
  }
  catch (e) {
    return res.status(404).render("pages/error/error", { title: "Error", code: 404, error: e });
  }

  try {
    let outfitItems = await outfitsData.getUserOutfits(req.session.user.username);

    if(!outfitItems || outfitItems == null||outfitItems.length ==0){
      noOutfits =true;
    }
    let date = req.query.date
    if (!moment(date, "MM-DD-YYYY", true).isValid()) {
      throw `Cannot log invalid date ${date}`
    }
    return res.render("pages/medium/calendar_log", {
      title: "Log Outfits",
      outfitsPage: true,
      stylesheet: "/public/styles/outfit_card_styles.css",
      script: "/public/scripts/outfits.js",
      outfits: outfitItems,
      noOutfits: noOutfits,
      date: date
    });
  } catch (e) {
    return res.status(500).render("pages/medium/calendar_log", {
      title: "Log Outfits",
      error: e
    });;
  }
}).post(async (req, res) => {


  try {
    const log_info = req.body

    if (!log_info) throw "Could not get logging information";

    //validate log info
    if (!moment(log_info.log_date, "MM-DD-YYYY", true).isValid()) {
      throw `Cannot log invalid date ${log_info.log_date}`
    }

    if (!ObjectId.isValid(log_info.log_id)) throw "Error: Logged outfit id is not valid";

    let e = await outfitsData.addOutfitToCalendar(log_info.log_id, log_info.log_date)


    return res.redirect("/calendar");
  } catch (e) {
    return res.status(500).render("pages/medium/calendar_log", {
      title: "Log Outfits",
      error: e
    });
  }


});

module.exports = router;
