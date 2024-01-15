//js
const express = require('express');
const {homeView} = require('../controllers/indexController');
const router = express.Router();
router.get('/home', homeView);
module.exports = router;