const express = require('express');
const router = express.Router();

module.exports = (db, isAuthenticated) => {
    const User = require('../../schema/user')(db);      // importer le model utilisateur

    router.use('/me', isAuthenticated, (req, res) =>  // repondre  par les info perso d'user actuelle
    {
        res.json(req.user);
    });

    router.get('/:id', isAuthenticated, (req, res) => // repondre par les info perso d'user demandé par id si il existe
    {
        const { id } = req.params;
        User.findById(id, '-hashedPassword -salt').then(user =>
        {
            res.json(user);
        });
    });

    router.get('/:id/vote/like', isAuthenticated, (req, res) => // liker un utilisateur
    {
        const { user, params: { id } } = req;
        if (!user.likes)                      // si l'utilisateur n'a pas liké déja
        {
            user.likes = {};                // créer son dictionnaire de like
        }
        user.likes[id] = user.likes[id] ? (user.likes[id] + 1) : +1; // calculer le nombre de fois que l'user actuelle a liker l'utilisateur suggeré
        console.log(user.likes);        // garder trace
        user.save().then(res.json({ like: user.likes[id] }));
    });

    router.get('/:id/vote/dislike', isAuthenticated, (req, res) => // disliker un utilisateur, meme logique qu'avant
    {
        const { user, params: { id } } = req;
        if (!user.likes)
        {
            user.likes = {};
        }

        user.likes[id] = user.likes[id] ? (user.likes[id] - 1) : -1;

        user.save().then(res.json({ like: user.likes[id] }));
    });

    router.get('/', isAuthenticated, (req, res) => // l'algorithme est conditionné par avoir plus de likes
    {                                               // que de dislikes pour etre suggeré
        const { user } = req;
        const likedUsersIds =
            Object
                .keys(user.likes)               // le clé de la recherche est le dictionnaire likes
                .filter(id => user.likes[id] > 0);  // prendre que les utilisateur qu'on a liké

        User.find({ _id: { $in: likedUsersIds }}).then(likedUsers =>
        {
            const likedUsersPrime =
                likedUsers.reduce((acc, cur) =>
                {
                    if (!cur.likes)
                    {
                        return acc;
                    }

                    const likedUsersIds_ =
                        Object
                            .keys(cur.likes)
                            .filter(id => cur.likes[id] > 0);

                    return [].concat(likedUsersIds_, acc);            // liste de mes amis

                }, []);

            User.find({}).then(users =>
            {
                const usersPrime = users.filter(u =>
                {
                    if (!u.likes)
                    {
                        return false;
                    } else
                    {
                        const found = likedUsersPrime.reduce((acc, cur) =>
                        {
                            if (acc) {
                                return true;
                            } else {
                                if (u.likes[cur] >= 0) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }, false);
                        return found;
                    }
                });
                res.json(
                {
                    users: usersPrime,        // liste de mes amis et les amis de mes amis
                });
            }).catch(e =>
            {
                console.log(e);       // garder trace
            });
        });
    });

    return router;
};
