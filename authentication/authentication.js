const { User } = require("../model");
const safe = require('../safe');
const token = require('../token');

class authenticationClass {
    async login(req, res) {
        try {
            const { email, password } = req.body
            const query = {
                email,
                password: safe.encrypt(password)
            }
            User.findOne(query, async(error, result) => {
                if (error) throw error
                var response = {}
                if (result === null) {
                     response = {
                        valid: false,
                        comment: "user not found"
                    }
                } else {
                    response = {
                        valid: true,
                        token: await token.generate(email, password), 
                        result
                    }
                }
                res.json(response)
            })
        } catch(e) {
            console.log(e)
        }
    }
    
    // async logout(req, res) { }

    async registration(req, res) {
        try {
            const { id, email, password } = req.body
            const query = { $or: [
                { email },
                { id }
            ]}
            User.findOne(query, async(error, result) => {
                if (error) throw error
                if (result) {
                    // email o identificativo già usato
                    res.json({
                        valid: false,
                        comment: "utente già presente"
                    })
                } else {
                    // crea nuova utenza
                    const payload = { 
                        id,
                        email,
                        password: await safe.encrypt(password) //genero l'hash della password
                    }
                    User.create(payload, async(error, result) => {
                        if (error) throw error
                        res.json(result)
                    })
                }
            })
        } catch (e) {
            console.log(e)
        }
    }     
}

var auth = new authenticationClass()
module.exports = Object.freeze(auth)