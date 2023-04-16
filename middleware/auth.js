const jwt = require("jsonwebtoken")

module.exports = (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET') //La méthode verify() du package jsonwebtoken permet de vérifier la validité d'un token
        const userId = decodedToken.userId

        req.auth = {
            userId: userId
        }
        console.log(userId)
        next()
    }catch(error){
        res.status(401).json({ error })
    }
}