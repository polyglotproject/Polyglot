//js
const express = require('express');
const router = express.Router();

const {homeView} = require('../controllers/indexController');
router.get('/home', homeView);

const {connectionView} = require('../controllers/indexController');
router.get('/connection', connectionView);


const {inscriptionView} = require('../controllers/indexController');
router.get('/inscription', inscriptionView);

const {accountView} = require('../controllers/indexController');
router.get('/account', accountView);

const {settingsView} = require('../controllers/indexController');
router.get('/settings', settingsView);

module.exports = router;