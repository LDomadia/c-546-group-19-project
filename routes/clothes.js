const express = require("express");
const router = express.Router();
const clothesData = require('../data/clothes');
const multer = require('multer');
const { diskStorage } = require("multer");
const path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + Date.now() + path.extname(file.originalname));
  }
})

// const upload = multer({dest: 'uploads/'});
const upload = multer({storage: storage});

// const upload = multer(diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.originalname + Date.now() + path.extname(file.originalname));
//   }
// }))

//Middleware
router.use("/", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/account/login");
  }
  next();
});

router.route("/").get(async (req, res) => {
  if (!req.session.user)
    return res.render("pages/results/clothings", {
      title: "My Clothes",
      clothesPage: true,
      not_logged_in: true,
    });
  
  try {
    let clothingItems = await clothesData.getClothingItems(req.session.user.username);
    res.render("pages/results/clothings", {
      title: "My Clothes",
      clothesPage: true,
      clothingItems: clothingItems,
      stylesheet: "/public/styles/clothes_styles.css"
    });
  } catch (e) {
    res.status(500).render('pages/results/clothings', {
      title: 'My Clothes',
      clothesPage: true,
      error: e
    });
  }
});

router.route("/new").get(async (req, res) => {
  res.render("pages/medium/clothingNew", {
    title: "Add New Clothing",
    clothesPage: true,
    stylesheet: "/public/styles/clothes_styles.css",
    script: "/public/scripts/clothes_script.js",
  });
}).post(upload.single('img'), async (req, res) => {
  // const data = JSON.parse(JSON.stringify(req.body));
  const data = req.body;

  try {
    if (!data) throw 'Error: Nothing was entered';
    if (!data.name) throw 'Error: Clothing Name is Required';
    if (!data.type) throw 'Error: Type is Required';
    if (!data.name.trim()) throw 'Error: Clothing Name is Required';
    if (!data.type.trim() || data.type.trim() == 'null') throw 'Error: Type is Required';
    
  } catch (e) {
    return res.status(400).render('pages/medium/clothingNew', {
      title: "Add New Clothing",
      clothesPage: true,
      stylesheet: "/public/styles/clothes_styles.css",
      script: "/public/scripts/clothes_script.js",
      error: e
    });
  }

  try {
    console.log(`image id: ${JSON.stringify(req.file)}`)
    let result = await clothesData.addNewClothes(
      data.name,
      req.file.filename,
      data.type,
      data['colors-patterns'],
      data.season,
      data.styles,
      data.brand,
      req.session.user.username
    )
    if (result == 'success') {
      res.status(200).redirect('/clothes');
    }
    else {
      throw 'Error: Failed to add Clothing Item';
    }
  } catch (e) {
    return res.status(500).render('pages/medium/clothingNew', {
      title: "Add New Clothing",
      clothesPage: true,
      stylesheet: "/public/styles/clothes_styles.css",
      script: "/public/scripts/clothes_script.js",
      error: e
    });
  }
});

module.exports = router;
