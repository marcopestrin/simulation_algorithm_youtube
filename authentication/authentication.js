const { User } = require("../model");
const safe = require('../safe');
const token = require('../token');

class authenticationClass {
    async login(req, res) {
        try {
            let idUser = 0
            const { email, password } = req.body
            let response = {}
            const query = {
                email,
                password: safe.encrypt(password)
            }
            new Promise((resolve, reject) => {
                // controllo che le credenziali siano corrette
                User.findOne(query, async(error, result) => {
                    if (error) throw error
                    if (result === null) reject(true)
                    idUser = result.id
                    if (result) resolve(result)
                })
            }).then(async() => {
                // aggiorno il token
                const _token = await token.generate(email, password)
                var updateToken = new Promise((resolve, reject) => {
                    var query = { email: email }
                    var set = { $set: { token: _token }}
                    User.updateOne(query, set, async(error, result) => {
                        if (error) throw error
                        resolve(result)
                    })
                })
                await updateToken

                response = {
                    valid: true,
                    result: {
                        email,
                        idUser,
                        token: _token,
                    }
                }
            }).catch((reason) =>{
                response = {
                    valid: false,
                    email
                }
            }).finally(()=> {
                res.json(response)
            })
        } catch (e) {
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
                        res.json({
                            valid: true,
                            result
                        })
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