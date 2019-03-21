const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const createHash = crypto.createHash;

const UserSchema = new Schema
({                                      //définir un schema pour un utilisateur ( classe )
    email: String,
    displayName: String,
    hashedPassword: String,
    salt : String,
    likes: {

        type: Object,
        default: {},
    },
});

UserSchema
    .virtual('password')
    .set(function(password)                     // setteur du mot de passe
    {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function()                             // getteur du mot de passe
    {
        return this._password;
    });

UserSchema.methods =            // les méthodes du schema utilisateur
{
    makeSalt: function() {              // créer un salt aléatoire de 16 octets
        return crypto.randomBytes(16).toString('base64');
    },

    check: function(plainText)          // vérifier si le mot de passe est correcte
    {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    encryptPassword: function(password)     // hasher le mot de passe
    {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
    }
};

module.exports = db => db.model('User', UserSchema);
