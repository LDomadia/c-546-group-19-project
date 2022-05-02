const express = require("express");
const router = express.Router();
const clothesData = require('../data/clothes');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const validate = require('../validation/clothes_validation');

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
  const data = req.body;

  try {
    if (!data) throw 'Error: Nothing was entered';
    data.name = validate.checkTextInput(data.name, 'Clothing Name');
    req.file.filename = validate.checkFileInput(req.file.filename, 'Image');
    data.type = validate.checkSelectInput(data.type, 'Type', ['top', 'bottom', 'dress', 'shoes', 'accessory', 'outerwear', 'socks']);
    if (data.size) data.size = validate.checkTextInput(data.size, 'Size');
    if (!data['colors-patterns']) data['colors-patterns'] = [];
    data['colors-patterns'] = validate.checkListInput(data['colors-patterns'], 'Colors/Patterns');
    if (!data.seasons) data.seasons = [];
    data.seasons = validate.checkCheckboxInput(data.seasons, 'seasons', ['winter', 'spring', 'summer', 'fall']);
    if (!data.styles) data.styles = [];
    data.styles = validate.checkListInput(data.styles, 'Styles');
    if (data.brand) data.brand = validate.checkTextInput(data.brand, 'Brand');
    
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
    let result = await clothesData.addNewClothingItem(
      data.name,
      req.file.filename,
      data.type,
      data.size,
      data['colors-patterns'],
      data.seasons,
      data.styles,
      data.brand,
      req.session.user.username
    )
    if (result.result == 'success') {
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

router.route('/edit/:id').get(async (req, res) => {
  try {
    const clothingItem = await clothesData.getClothingItemById(req.params.id);
    if (clothingItem) {
      return res.status(200).render('pages/single/clothingEdit', {
        title: 'Edit Clothing Item',
        clothingItem: clothingItem,
        clothesPage: true,
        stylesheet: "/public/styles/clothes_styles.css",
        script: "/public/scripts/clothes_script.js",
      });
    }
    else {
      throw 'Error: Failed to find Clothing Item';
    }
  } catch (e) {
    return res.status(404).render('pages/error/error', {
      title: 'Page Not Found',
      errorCode: 404,
      error: e
    })
  }
}).post(upload.single('img'), async (req, res) => {
  const data = req.body;

  try {
    if (!data) throw 'Error: Nothing was entered';
    data.name = validate.checkTextInput(data.name, 'Clothing Name');
    if (req.file) req.file.filename = validate.checkFileInput(req.file.filename, 'Image');
    data.type = validate.checkSelectInput(data.type, 'Type', ['top', 'bottom', 'dress', 'shoes', 'accessory', 'outerwear', 'socks']);
    if (data.size) data.size = validate.checkTextInput(data.size, 'Size');
    if (!data['colors-patterns']) data['colors-patterns'] = [];
    data['colors-patterns'] = validate.checkListInput(data['colors-patterns'], 'Colors/Patterns');
    if (!data.seasons) data.seasons = [];
    data.seasons = validate.checkCheckboxInput(data.seasons, 'seasons', ['winter', 'spring', 'summer', 'fall']);
    if (!data.styles) data.styles = [];
    data.styles = validate.checkListInput(data.styles, 'Styles');
    if (data.brand) data.brand = validate.checkTextInput(data.brand, 'Brand');
  } catch (e) {
    const clothingItem = await clothesData.getClothingItemById(req.params.id);
    if (clothingItem) {
      return res.status(400).render('pages/single/clothingEdit', {
        title: "Edit Clothing Item",
        clothesPage: true,
        clothingItem: clothingItem,
        stylesheet: "/public/styles/clothes_styles.css",
        script: "/public/scripts/clothes_script.js",
        error: e
      });
    }
    else {
      return res.status(404).render('pages/error/error', {
        title: 'Page Not Found',
        errorCode: 404,
        error: e
      })
    }  
  }

  try {
    let result;
    if (req.file) {
      result = await clothesData.updateClothingItem(
        req.params.id,
        data.name,
        req.file.filename,
        data.type,
        data.size,
        data['colors-patterns'],
        data.seasons,
        data.styles,
        data.brand,
        req.session.user.username
      )
    }
    else {
      result = await clothesData.updateClothingItem(
        req.params.id,
        data.name,
        null,
        data.type,
        data.size,
        data['colors-patterns'],
        data.seasons,
        data.styles,
        data.brand,
        req.session.user.username
      )
    }

    if (result.result == 'success') {
      res.status(200).redirect('/clothes');
    }
    else {
      throw 'Error: Failed to add Clothing Item';
    }
  } catch (e) {
    const clothingItem = await clothesData.getClothingItemById(req.params.id);
    if (clothingItem) {
      return res.status(500).render('pages/single/clothingEdit', {
        title: "Edit Clothing Item",
        clothesPage: true,
        clothingItem: clothingItem,
        stylesheet: "/public/styles/clothes_styles.css",
        script: "/public/scripts/clothes_script.js",
        error: e
      });
    }
    else {
      return res.status(404).render('pages/error/error', {
        title: 'Page Not Found',
        errorCode: 404,
        error: e
      })
    }  
  }
});

router.route('/view/:id').get(async (req, res) => {
  try {
    const clothingItem = await clothesData.getClothingItemById(req.params.id);
    if (clothingItem) {
      return res.status(200).render('pages/single/clothingDetails', {
        title: 'Clothing Details',
        clothesPage: true,
        clothingItem: clothingItem,
        stylesheet: '/public/styles/clothes_styles.css'
      })
    }
    else {
      throw 'Error: Clothing Item cannot be found';
    }
  } catch (e) {
    return res.status(404).render('pages/error/error', {
      title: 'Page Not Found',
      errorCode: 404,
      error: e
    })
  }
})

module.exports = router;
