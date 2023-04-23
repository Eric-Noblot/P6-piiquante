const Sauce = require("../models/Sauce")
const fs = require("fs")    
//fs  signifie « file system ». Il nous 
// donne accès aux fonctions qui nous permettent de modifier le système de fichiers, 
// y compris aux fonctions permettant de supprimer les fichiers images dans notre dossier images en interne

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); //l'objet qui nous est maintenant envoyé dans la requete est en JSNO chaine de caractere, on doit donc le parser
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId, //grace au middleware on extrait le user id de notre requete
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      //multer ne passe que les noms de fichier, on doit generer l'ULR par nous meme. Pour ca on fait appel à des propriétés de l'objet
  });
        
  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

//  function saveSauce (sauce) {
//     sauce.save()
//     .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
//     .catch(error => { res.status(400).json( { error })})
// }

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

delete sauceObject._userId;
Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        } else {
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error: error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

exports.getOneSauce = (req, res, next) => {
Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

exports.getAllSauces = (req, res, next) => {
Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

function incrementeLike(sauce, userId){
const isUserInArray = sauce.usersLiked.includes(userId)
    if (isUserInArray) { return }
    sauce.likes ++
    sauce.usersLiked.push(userId)
}

function decrementeLike(sauce, userId){
const isUserInArray = sauce.usersDisliked.includes(userId)
    if (isUserInArray) { return }
    sauce.dislikes ++
    sauce.usersDisliked.push(userId)
}

function searchLike(sauce, userId){

    if (sauce.usersLiked.includes(userId) && (!sauce.usersDisliked.includes(userId))){ 
        sauce.likes --
        // console.log("usersLiked avant", sauce.usersLiked)
        // let newArrayUserLiked = sauce.usersLiked.filter (element => {
        //     element !== userId
        // })
        //return newArrayUserLiked
    }
    if (!sauce.usersLiked.includes(userId) && (sauce.usersDisliked.includes(userId))){ 
        sauce.dislikes --
        console.log("usersdisliked avant", sauce.usersDisliked)
        console.log("sauce dans le dislike", sauce)
        // let newUsersDisliked = sauce.usersLiked.filter (element => {
        //     element !== userId
        // })
    } 
}


exports.createLike = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        console.log("sauce:", sauce)
        const userId = req.auth.userId
        const userLike = req.body.like 

        switch (userLike) {
            case 1:
                incrementeLike(sauce, userId)
                sauce.save()
                .then(() => { res.status(201).json({message: 'Like positif enregistré !'})})
                .catch(error => { res.status(400).json( { error })})
                break;

            case -1:
                decrementeLike(sauce, userId)
                sauce.save()
                .then(() => { res.status(201).json({message: 'Like négatif enregistré !'})})
                .catch(error => { res.status(400).json( { error })})
                break;

            case 0:
                searchLike(sauce, userId)
                sauce.save()
                .then(() => { res.status(201).json({message: 'Annulation du like/dislike'})})
                .catch(error => { res.status(400).json( { error })})
                break;

            default:
                console.log('Le contenu de "likes" ne correspond pas au résultat attendu')
                return    // est ce que c'est bien return?
            }
            console.log("En dehors du switch!")
        // }
        })
    .catch(error => res.status(400).json({message : error}))
}



    // const sauceObject = req.file ? {
    // ...JSON.parse(req.body.sauce),
    // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    // } : { ...req.body };

    // Sauce.findOne({_id: req.params.id})
    // .then((sauce) => {
    //     console.log("sauce" , sauce)
    //     let sauceLike = sauce.likes += req.body.like
    //     sauce.likes = sauceLike

    //     console.log("sauce.like" , sauce.likes)
    //     if (sauce.userId != req.auth.userId) {
    //         res.status(401).json({ message : 'Not authorized'});
    //     } else {
    //         Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
    //         .then(() => res.status(200).json({message : 'Objet modifié!'}), console.log("sauceUpdate", sauce))
    //         .catch(error => res.status(401).json({ error }));
            
    //     }
    // })
 //};