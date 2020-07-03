module.exports = {
    generate: async function(user, password) {
        const jwt = require('jsonwebtoken')
        const global = require('./const')
        const cred = {
            "user": user,
            "password": password
        }
        const options = {
            algorithm: "HS256",
            expiresIn: "2 days"
        }
        return jwt.sign(cred, global.SECRET_KEY_TOKEN, options).toString()
    }
}