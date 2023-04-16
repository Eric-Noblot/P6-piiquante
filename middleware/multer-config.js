const multer = require("multer")

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
}

const storage = multer.diskStorage({//fonction qui explique à multer dans quel dossier enregistrer les fichiers
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    filename: (req, file, callback) => {//explique à multer quel nom de fichier utilisé (on ne peut pas se servir du nom d'origine au cas ou 2 fichiers auraient le meme nom
        const name = file.originalname.split(" ").join("_") //name recupere son nom (avant l'extension). originalname permet de recuperer le nom du fichier d'origine. split/join pour remplacer les white space par des underscore
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + "." + extension)
    }
})  
// la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. Elle utilise ensuite
//  la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
module.exports = multer({ storage }).single("image")
// methode single pour dire qu'il s'agit d'un fichier unique et pas multiples
// méthode single()  crée un middleware qui capture les fichiers d'un certain type
//  (passé en argument), et les enregistre au système de fichiers du serveur à l'aide du storage configuré.