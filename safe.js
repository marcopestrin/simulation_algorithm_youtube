const crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = 'dJh3ZKc5GYOAe2AbcqF7EPuCYuB6s5HnXi1LD1Y2I04=';

class Safe {
    constructor(){}

    encrypt(text){
        var cipher = crypto.createCipher(algorithm,password)
        var crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
    }
    decrypt(text){
        var decipher = crypto.createDecipher(algorithm,password)
        var dec = decipher.update(text,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
    }
}

var safe = new Safe()
module.exports = Object.freeze(safe)