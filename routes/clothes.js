const express = require('express');
const router = express.Router();

router.route('/').get(async (req, res) => {
    res.render('pages/results/clothings', {title: 'My Clothes', clothesPage: true})
})

router.route('/new').get(async (req, res) => {
    res.render('pages/medium/clothingNew', {title: 'Add New Clothing', clothesPage: true})
})

module.exports = router;