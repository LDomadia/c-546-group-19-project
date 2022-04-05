const express = require('express');
const router = express.Router();

router.route('/').get(async (req, res) => {
    res.render('pages/results/clothings', {title: 'My Clothes', clothesPage: true})
})

module.exports = router;