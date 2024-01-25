//js
const express = require('express');
const router = express.Router();

const {homeView} = require('../controllers/indexController');
router.get('/home', homeView);

const {connectionView} = require('../controllers/indexController');
router.get('/connection', connectionView);

const {inscriptionView} = require('../controllers/indexController');
router.get('/inscription', inscriptionView);

const {aboutView} = require('../controllers/indexController');
router.get('/about', aboutView);

const {accountView, settingsView, profileView} = require('../controllers/accountController');
router.get('/account', accountView);
router.get('/settings', settingsView);
router.get('/profile', profileView);

module.exports = router;