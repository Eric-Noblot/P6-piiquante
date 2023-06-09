const express = require("express")
const auth = require("../middleware/auth")

const router = express.Router()
const multer = require("../middleware/multer-config")
const saucesController = require ("../controllers/sauces")

router.get('/', auth, saucesController.getAllSauces );
router.post('/', auth, multer, saucesController.createSauce);
router.get('/:id', auth, saucesController.getOneSauce);
router.put('/:id', auth, multer, saucesController.modifySauce);
router.delete('/:id', auth, saucesController.deleteSauce);
router.post('/:id/like', auth, saucesController.createLike)

module.exports = router 