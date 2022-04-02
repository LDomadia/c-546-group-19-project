const express = require('express');
const router = express.Router();

// GET /
router.get('/', async (req, res) => {
    try {
  
      res.render('closet/index', {title: "Digital Closet"});
    } catch (e) {
      res.sendStatus(500);
    }
});

module.exports = router;