const Sauce = require("../models/souces");
const fs = require("fs");

exports.getAllSouces = ("/", (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            })
        }
    )
});

exports.getOneSouce = ("/:id", (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    )
});

exports.createSouce = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    const souces = new Sauce({
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        imageUrl: url + '/images/' + req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
        heat: req.body.sauce.heat,
        likes: req.body.sauce.likes,
        dislikes: req.body.sauce.dislikes,
        usersLiked: req.body.sauce.usersLiked,
        usersDisliked: req.body.sauce.usersDisliked,
        userId: req.body.sauce.userId
    });
    souces.save().then(
        () => {
            res.status(201).json({
                message: "post send succesfully"
            })
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            })
        }
    )
}


exports.modifySouce = ("/:id", (req, res, next) => {
    let souces = new Sauce({ _id: req.params._id });

    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        if (!sauce) {
            return res.status(404).json({ error: 'Sauce not found' });
        }
        if (req.file) {
            // Eliminar la imagen anterior asociada al producto
            const previousImagePath = `images/${sauce.imageUrl.split('/images/')[1]}`;
            fs.unlink(previousImagePath, (err) => {
                if (err) {
                    console.error('Error deleting previous image:', err);
                }
            });


        const url = req.protocol + "://" + req.get("host");
        req.body.sauce = JSON.parse(req.body.sauce);

        souces = {
            _id: req.params.id,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            imageUrl: url + '/images/' + req.file.filename,
            mainPepper: req.body.sauce.mainPepper,
            heat: req.body.sauce.heat,
            likes: req.body.sauce.likes,
            dislikes: req.body.sauce.dislikes,
            usersLiked: req.body.sauce.usersLiked,
            usersDisliked: req.body.sauce.usersDisliked,
            userId: req.body.sauce.userId
        }
    } else {
        souces = {
            _id: req.params.id,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            mainPepper: req.body.mainPepper,
            heat: req.body.heat,
            likes: req.body.likes,
            dislikes: req.body.dislikes,
            usersLiked: req.body.usersLiked,
            usersDisliked: req.body.usersDisliked,
            userId: req.body.userId
        }
    };
    Sauce.updateOne({ _id: req.params.id }, souces).then(
        () => {
            res.status(201).json({
                message: "thing updated succesfully"
            })
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            })
        }
    )
})})

exports.deleteSauce = ("/:id", (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            if (!sauce) {
                return res.status(404).json({
                    error: new Error("no such thing")
                })
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(400).json({
                    error: new Error("Unauthorized request!")
                })
            }
            Sauce.findOne({ _id: req.params.id }).then(
                (sauce) => {
                    const filename = sauce.imageUrl.split("/images/")[1]
                    fs.unlink("images/" + filename, () => {
                        Sauce.deleteOne({ _id: req.params.id }).then(
                            () => {
                                res.status(200).json({
                                    message: "Deleted"
                                })
                            }

                        ).catch(
                            (error) => {
                                res.status(400).json({
                                    error: error
                                }
                                )
                            }
                        )
                    }
                    )

                })
        })
})


exports.updateLikes = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            if (!sauce) {
                return res.status(404).json({ error: 'Sauce not found' });
            }
            else {
                const userId = req.auth.userId;
                const likeStatus = req.body.like;
                const userLiked = sauce.usersLiked.includes(userId);
                const userDisliked = sauce.usersDisliked.includes(userId);
                if (likeStatus === 1 && !userLiked) {
                    sauce.likes += 1;
                    sauce.usersLiked.push(userId);
                } else if (likeStatus === -1 && !userDisliked) {
                    sauce.dislikes += 1;
                    sauce.usersDisliked.push(userId);
                } else if (likeStatus === 0) {
                    if (userLiked) {
                        sauce.likes -= 1;
                        sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
                    } else if (userDisliked) {
                        sauce.dislikes -= 1;
                        sauce.usersDisliked = sauce.usersDisliked.filter((id) => id !== userId);
                    }
                }

                Sauce.updateOne({ _id: req.params.id }, sauce).then(
                    () => {
                        res.status(201).json({
                            message: "post send succesfully"
                        })
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        })
                    }
                )
            }
        })
}










