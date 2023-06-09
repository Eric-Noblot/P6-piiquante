const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); 
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId, 
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        if (req.file) {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {});
        }
          
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Objet modifié" }))
            .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé" });
            })
            .catch((error) => res.status(401).json({ error: error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

function incrementeLike(sauce, userId) {
  const isUserInArray = sauce.usersLiked.includes(userId);
  if (isUserInArray) {
    return false;
  }
  sauce.likes++;
  sauce.usersLiked.push(userId);
  return true;
}

function decrementeLike(sauce, userId) {
  const isUserInArray = sauce.usersDisliked.includes(userId);
  if (isUserInArray) {
    return false;
  }
  sauce.dislikes++;
  sauce.usersDisliked.push(userId);
  return true;
}

function searchLike(sauce, userId) {
  if (
    sauce.usersLiked.includes(userId) &&
    !sauce.usersDisliked.includes(userId)
  ) {
    sauce.likes--;
    sauce.usersLiked = sauce.usersLiked.filter((element) => {
      return element !== userId;
    });
  } else if (
    !sauce.usersLiked.includes(userId) &&
    sauce.usersDisliked.includes(userId)
  ) {
    sauce.dislikes--;
    sauce.usersDisliked = sauce.usersDisliked.filter((element) => {
      return element !== userId;
    });
  }
}

exports.createLike = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const userId = req.auth.userId;
      const userLike = req.body.like;

      switch (userLike) {
        case 1:
          if (incrementeLike(sauce, userId)) {
            sauce
              .save()
              .then(() => {
                res.status(201).json({ message: "Like positif enregistré !" });
              })
              .catch((error) => {
                res.status(400).json({ error });
              });
          } else {
            res.status(400).json({ error: "Opération non permise" });
          }
          break;

        case -1:
          if (decrementeLike(sauce, userId)) {
            sauce
              .save()
              .then(() => {
                res.status(201).json({ message: "Like négatif enregistré !" });
              })
              .catch((error) => {
                res.status(400).json({ error });
              });
          } else {
            res.status(400).json({ error: "Opération non permise" });
          }
          break;

        case 0:
          searchLike(sauce, userId);
          sauce
            .save()
            .then(() => {
              res.status(201).json({ message: "Annulation du like/dislike" });
            })
            .catch((error) => {
              res.status(400).json({ error });
            });
          break;

        default:
          res.status(400).json({ error: "mauvaise réponse du like" });
      }
    })
    .catch((error) => res.status(400).json({ message: error }));
};
