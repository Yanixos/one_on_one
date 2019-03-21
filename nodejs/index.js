const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const dbUri = 'mongodb://localhost/one-on-one';
const mongoose = require('mongoose');
const dbOptions = {  promiseLibrary: require('bluebird'), };
const db = mongoose.createConnection(dbUri, dbOptions);
const User = require('./schema/user')(db);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const auth = require('./auth.js');
const io = require('socket.io')(http);

app.use(require('cors')());
app.use(bodyParser.json());
app.use(passport.initialize());

const init_db = () =>                                       // fontion pour initialiser la base de donnée
{
    const users = [
    {
        email: 'yanis@domain.com',
        displayName: 'Yanis',
        password: '1',
        likes: {},
    },
    {
        email: 'ilies@domain.com',
        displayName: 'Ilies',
        password: '2',
        likes: {},
    },
    {
        email: 'yassine@domain.com',
        displayName: 'Yassine',
        password: '3',
        likes: {},
    },
    {
        email: 'nadha@domain.com',
        displayName: 'Nadha',
        password: '4',
        likes: {},
    },
    {
        email: 'yasmine@domain.com',
        displayName: 'Yasmine',
        password: '5',
        likes: {},
    },
    {
        email: 'dylan@domain.com',
        displayName: 'Dylan',
        password: '6',
        likes: {},
    },
    {
        email: 'john@domain.com',
        displayName: 'John',
        password: '7',
        likes: {},
    },
    {
        email: 'cena@domain.com',
        displayName: 'Cena',
        password: '8',
        likes: {},
    },
    {
        email: 'lidia@domain.com',
        displayName: 'Lidia',
        password: '9',
        likes: {},
    },
    {
        email: 'katia@domain.com',
        displayName: 'Katia',
        password: '10',
        likes: {},
    },
    {
        email: 'lounes@domain.com',
        displayName: 'Lounes',
        password: '11',
        likes: {},
    },
    {
        email: 'rafik@domain.com',
        displayName: 'Rafik',
        password: '12',
        likes: {},
    },
    {
        email: 'karim@domain.com',
        displayName: 'Karim',
        password: '13',
        likes: {},
    },
    {
        email: 'daniel@domain.com',
        displayName: 'Daniel',
        password: '14',
        likes: {},
    },
    {
        email: 'hongo@domain.com',
        displayName: 'Hongo',
        password: '15',
        likes: {},
    },
    {
        email: 'ralf@domain.com',
        displayName: 'Ralf',
        password: '16',
        likes: {},
    },
    {
        email: 'rafael@domain.com',
        displayName: 'Rafael',
        password: '17',
        likes: {},
    },
    {
        email: 'mia@domain.com',
        displayName: 'Mia',
        password: '18',
        likes: {},
    },
    {
        email: 'caroline@domain.com',
        displayName: 'Caroline',
        password: '19',
        likes: {},
    },
    {
        email: 'elissa@domain.com',
        displayName: 'Elissa',
        password: '20',
        likes: {},
    },
    {
        email: 'maya@domain.com',
        displayName: 'maya',
        password: '21',
        likes: {},
    },
    {
        email: 'lulu@domain.com',
        displayName: 'Lulu',
        password: '22',
        likes: {},
    },
    {
        email: 'nana@domain.com',
        displayName: 'Nana',
        password: '23',
        likes: {},
    },
    {
        email: 'kaissa@domain.com',
        displayName: 'Kaissa',
        password: '24',
        likes: {},
    }
    ];

    User.deleteMany({}).then(() => {
        User.create(users, (err, users_) => {
            console.log(`INIT MONGODB : ${users_.length} users created.`);

            const [ yanis, ilies, yassine, nadha, yasmine, dylan, john, cena, lydia, katia, lounes, rafik, karim, daniel, hongo, ralf, rafael, mia, caroline, elissa, maya, lulu, nana, kaissa ] = users_;

            yanis.likes = {                         // ajouter des relations entre les utilisateurs
                [ yasmine._id ]: 1,
            };

             yanis.likes = {
                [ katia._id ]: 1,
            };

             yanis.likes = {
                [ lydia._id ]: 1,
            };

            yanis.likes = {
               [ maya._id ]: 1,
           };

           yanis.likes = {
              [ lulu._id ]: 1,
           };

           ilies.likes = {
                [ john._id ]: 1,
            };

            ilies.likes = {
                [ caroline._id ]: 1,
            };

            ilies.likes = {
                [ rafael._id ]: 1,
            };

            ilies.likes = {
                [ cena._id ]: 1,
            };

            yassine.likes = {
                [ nadha._id ]: 1,
            };

            yassine.likes = {
                [ mia._id ]: 1,
            };

            yassine.likes = {
                [ rafik._id ]: 1,
            };

            nadha.likes = {
                [ yassine._id ]: 1,
            };

            nadha.likes = {
                [ ralf._id ]: 1,
            };

            yasmine.likes = {
                [ yanis._id ]: 1,
            };

            yasmine.likes = {
                [ lulu._id ]: 1,
            };

            yasmine.likes = {
                [ nana._id ]: 1,
            };

            dylan.likes = {
                [ ilies._id ]: 1,
            };

            dylan.likes = {
                [ kaissa._id ]: 1,
            };

            nadha.likes = {
                [ yassine._id ]: 1,
            };

            john.likes = {
                [ cena._id ]: 1,
            };

            cena.likes = {
                [ john._id ]: 1,
            };

            lydia.likes = {
                [ lounes._id ]: 1,
            };

            katia.likes = {
                [ yanis._id ]: 1,
            };

            lounes.likes = {
                [ ilies._id ]: 1,
            };

            rafik.likes = {
                [ nadha._id ]: 1,
            };

            karim.likes = {
                [ nadha._id ]: 1,
            };

            daniel.likes = {
                    [ ilies._id ]: 1,
            };

            hongo.likes = {
                [ nadha._id ]: 1,
            };

            ralf.likes = {
                    [ yassine._id ]: 1,
            };

            daniel.likes = {
                    [ ilies._id ]: 1,
            };

            mia.likes = {
                [ yanis._id ]: 1,
            };

            caroline.likes = {
                    [ ilies._id ]: 1,
            };

            elissa.likes = {
                [ rafik._id ]: 1,
            };

            maya.likes = {
                    [ lounes._id ]: 1,
            };

            lulu.likes = {
                [ yanis._id ]: 1,
            };

            nana.likes = {
                    [ ilies._id ]: 1,
            };

            kaissa.likes = {
                [ rafik._id ]: 1,
            };

            maya.likes = {
                    [ yassine._id ]: 1,
            };

            yanis.save();
            ilies.save();
            yassine.save();
            nadha.save();
            yasmine.save();
            dylan.save();
            john.save();
            cena.save();
            lydia.save();
            katia.save();
            lounes.save();
            rafik.save();
            karim.save();
            daniel.save();
            hongo.save();
            ralf.save();
            rafael.save();
            mia.save();
            caroline.save();
            elissa.save();
            maya.save();
            lulu.save();
            nana.save();
            kaissa.save();
        });
    });
};

db.on('open', () => {      // appel a la fonction une fois la base de donnée est créer
    init_db();
});


passport.use(
    new LocalStrategy({             // initialiser une strategie locale où l'email est définit comme l'identificateur unique
        usernameField: 'email'
    },
    function(email, password, done) {                       // fonction pour authentifier un utilisateur
        User.findOne({ email }, function(err, user) {       // chercher dans la bdd le mail
            console.log(user);           // garder le log
            if (err) {
                console.error('Error in auth : ' + err);    // catch error
                return done(err);
            }
            if (!user || !user.check(password)) {                                    // invalide mail ou password
                return done(null, false, { message: 'Invalid credentials.' });
            }
            return done(null, user);                                            // utilisateur valide
        });
    })
);

app.post('/auth/login',       // la requete POST d'authentification va etre envoyé a /auth/login
     passport.authenticate('local', { session: false }),
     ({ user }, res) => {                                       // si l'utilisateur est valide
         const access_token = auth.sign(user);                  // créer un JWT token
         res.json({ access_token });                            // alors, lui accorder un token
     }
);

app.post('/auth/register', (req, res) => { // la requete POST d'inscreption va etre envoyé a /auth/register
    const user = req.body;
    console.log(user);          // garder le log

    User.find({ email: user.email }).then(users => {    // chercher si l'email existe déja
        if (users.length === 0) {       // s'il n'existe pas
            User.create(user).then(user_ => {   // on crée l'utilisateur
                 const access_token = auth.sign(user_); // crée un token
                 res.json({ access_token });    // on l'affecte le token
            });
        } else {                            // s'il l'email existe
            res.json({
                status: 'error',
                message: 'email already exists', // renvoyer l'erreur
            });
        }
    });
});

const isAuthenticated = auth.isAuthenticated(User);     // checker si l'utilisateur est bien authentifier

app.get('/', function(req, res) {                   // l'acces a la racine est autorisé sans condition
    User.find({}, (err, users) => {
        res.json(users);
    });
});

app.use('/api', require('./api')(db, isAuthenticated)); //conditionner l'acces à l'api par l'authentification

app.use((err, req, res, next) =>     // handling errors
{
    res.status(err.status || 500);
    res.json({
        'error': {
            message: err.message,
            error: err
        }
    });
    next();
});

let messages = [];                          // la liste des messages de chaque utilisateur

io.on('connection', function(socket) {          // initialiser la socket du serveur

    socket.emit('getMsgs', messages);       // envoie d'un event
    socket.on('chatMsg', msg => {           // attendre l'event chatMsg ( l'envoie d'un msg de la part d'un des clients )
        messages = [].concat(messages, msg); // ajoute du msg a la liste des messages
        socket.broadcast.emit('newChatMsg', msg); // envoyer a tout le monde le msg envoyé
    });

});

http.listen(3000);
