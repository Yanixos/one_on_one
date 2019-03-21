const SECRET = 'S3CR37';
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const compose = require('composable-middleware');

function sign(user) 
{
    return jwt.sign(
    {
        _id: user._id, // le token est unique pour chaque utilisateurs ( utilisateur l'identificateur par défaut )
    }, 
    SECRET,  // utilisation de clé secrete pour generer des JWT token  
    {      
        expiresIn: 60 * 60 // le token genéré est valide pendant 1h
    }               );
}

function sendUnauthorized(req, res) 
{
    console.log(req.headers.authorization); // garder trace des requetes non authorisé ( invalide token )
    console.log(req.user);
    res.status(401).json({ message: 'Unauthorized access' }); // mettre le status de la requete reponse en 401 et la renvoyer 
};

const validateJwt = expressJwt({
    secret: SECRET,
    fail: sendUnauthorized,  // cas d'erreur
    getToken(req) {          // recuperer le token
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { // le header contient le champs :
            return req.headers.authorization.split(' ')[1];                              // 'Authorization : Bearer [TOKEN]
        } else if (req.query && req.query.access_token) {                               // si le header contient le token
            return req.query.access_token;                                              // on le retourne
        }
        return null;                                                                // sinon NULL
    }
});

function isAuthenticated(User) {        // verification si un utilisateur est authentifier ou pas
    return compose()
        .use(validateJwt)               // vérifier l'existance d'un token
        .use((req, res, next) => 
        {
            const { _id } = req.user;   // recuperer l'id de l'utilisateur
            User.findById(_id, '-hashedPassword -salt', function(err, user) { // checher l'utilisateur par l'id
                if (err)    // cas d'erreur
                    return next(err);
                if (!user)   // cas pas trouvé 
                    return sendUnauthorized(req, res);
                req.user = user; // cas trouvé
                next();
            });
        });
};

module.exports = 
{
    sign,
    sendUnauthorized,
    isAuthenticated,
};
