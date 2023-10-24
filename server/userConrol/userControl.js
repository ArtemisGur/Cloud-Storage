const bcrypt = require('bcrypt')

function regUser(req){
    console.log(req)
    try{
        const hashPassword = bcrypt.hashSync(req.password, 6)
        let user = {
            login: req.login,
            email: req.email,
            password: hashPassword
        }
        return user
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {
    regUser
}