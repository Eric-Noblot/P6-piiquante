const express = require("express")
const auth = require("../middleware/auth")

const router = express.Router()
const multer = require("../middleware/multer-config")
const saucesController = require ("../controllers/sauces")

router.get('/', auth, saucesController.getAllThings );
router.post('/', auth, multer, saucesController.createThing);
router.get('/:id', auth, saucesController.getOneThing);
router.put('/:id', auth, multer, saucesController.modifyThing);
router.delete('/:id', auth, saucesController.deleteThing);

module.exports = router