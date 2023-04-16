const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;

//le segment de route indiqué ici est uniquement le segment final,
// car le reste de l'adresse de la route sera déclaré dans notre application Express.