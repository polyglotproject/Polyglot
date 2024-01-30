//js
const express = require('express');
const router = express.Router();

const {homeView} = require('../controllers/indexController');
router.get('/home', homeView);



const {signUpView} = require('../controllers/indexController');
router.get('/signUp', signUpView);

const {signInView} = require('../controllers/indexController');
router.get('/signIn', signInView);

const {adminSignUp} = require('../controllers/indexController');
router.get('/adminSignUp', adminSignUp);

const {aboutView} = require('../controllers/indexController');
router.get('/about', aboutView);

const {FAQView} = require('../controllers/indexController');
router.get('/FAQ', FAQView);

const {accountView, settingsView, profileView, Logout, friendsView,gestionView,searchView} = require('../controllers/accountController');
router.get('/account', accountView);
router.get('/settings', settingsView);
router.get('/profile', profileView);
router.get('/friends', friendsView);
router.get('/gestion', gestionView);
router.get('/search', searchView);
router.get('/logout', Logout);

const {generalView} = require('../controllers/indexController');
router.get('/general', homeView);


module.exports = router;