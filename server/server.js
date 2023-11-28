const express = require('express')
const session = require('express-session')
const cors = require("cors");
const fs = require('fs')
const bcrypt = require('bcrypt')
const fileUpload = require('express-fileupload');
var path = require("path");

const { fileRouter } = require("./router/fileRouter.js")
const { storageRouter } = require("./router/storageRouter.js")
const userController = require('./userConrol/userControl');

const MongoClient = require('mongodb').MongoClient
const clientDB = new MongoClient("mongodb://127.0.0.1:27017/")
const db = clientDB.db("DBUsers")
const collectionUsers = db.collection("users")

const APP = express()
const PORT = 5000

let isUserExist = false
let isEmailExist = false
let userChecked = false

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

clientDB.connect().then(mongoClient => {
    console.log(`Data base "${mongoClient.options.dbName}" has been connected`)
    listDatabases(clientDB)
})

APP.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
APP.set('view engine', 'ejs')
APP.use(express.json())
APP.use(session({
    secret: 'thisSecretKey',
    cookie: {
        sameSite: 'strict'
    },
    maxAge: '10'
}))
APP.use(express.static(path.resolve(__dirname, '../') + '/startPage/mainPage/'))
APP.use(express.static(path.resolve(__dirname, '../') + '/startPage/registrationPage/'))
APP.use(express.static(path.resolve(__dirname, '../') + '/startPage/autorizationPage/'))
//APP.use(express.static(__dirname + '/workpage/'))
APP.use(express.urlencoded({ extended: false }))
APP.use(fileUpload());
APP.use('/fileRouter', fileRouter)
APP.use('/storageRouter', storageRouter)

// APP.get('/static/js/main.effe100f.js', (req, res) => {
//     res.sendFile(__dirname + '/workpage/build/static/js/main.effe100f.js')

// })

APP.post('/getUser', (req, res) => {
    res.send({ 'user': req.session.login })
})

APP.get('/', (req, res) => {
    res.render('mainPage')
})

APP.get('/registration', (req, res) => {
    if (isUserExist) {
        if (isEmailExist) {
            res.render('registrationPage', { errorAlertLogin: "Логин занят", errorAlertEmail: "Email занят" })
            isEmailExist = false
            isUserExist = false
            return 0
        }
        res.render('registrationPage', { errorAlertLogin: "Логин занят", errorAlertEmail: "" })
        isUserExist = false
    }

    if (isEmailExist) {
        if (isUserExist) {
            res.render('registrationPage', { errorAlertLogin: "Логин занят", errorAlertEmail: "Email занят" })
            isUserExist = false
            isEmailExist = false
            return 0
        }
        res.render('registrationPage', { errorAlertLogin: "", errorAlertEmail: "Email занят" })
        isEmailExist = false
    }

    else {
        res.render('registrationPage', { errorAlertLogin: "", errorAlertEmail: "" })
    }
})

APP.get('/auth', (req, res) => {
    if (userChecked) {
        res.render('autorizationPage', { errorAuth: "Неверный логин или пароль" })
        userChecked = false
    }
    else {
        res.render('autorizationPage', { errorAuth: "" })
    }
})

APP.get('/work', (req, res) => {
    if (!req.session.authorized) {
        res.redirect('/auth')
    }
    else {
        res.redirect("http://localhost:3000/")
    }

})

APP.post('/auth-user', (req, res) => {
    collectionUsers.findOne({ login: req.body.login })
        .then((user) => {
            const validPassword = bcrypt.compareSync(req.body.password, user.password)
            if (user == 0) {
                userChecked = true
            }
            if (!validPassword) {
                userChecked = true
            }
        })
        .then((user) => {
            if (userChecked) {
                res.redirect('/auth')
            }
            else {
                res.cookie('login', req.body.login, { secure: true })
                req.session.user = user
                req.session.login = req.body.login
                req.session.authorized = true
                res.redirect('/work')
            }
        })
})

APP.post('/reg-user', (req, res) => {
    if (!req.body) {
        return res.sendStatus(400)
    }

    //Is user or email reserved
    collectionUsers.countDocuments({ login: req.body.login })
        .then(function (numItems) {
            if (numItems > 0) {
                isUserExist = true
            }
        })
        .then(() => collectionUsers.countDocuments({ email: req.body.email }))
        .then((numItems) => {
            if (numItems > 0) {
                isEmailExist = true
            }
        })
        .then(() => {
            if (isEmailExist || isUserExist) {
                res.redirect('/registration')
            }
            else {
                let user = userController.regUser(req.body)
                collectionUsers.insertOne(user)
                res.cookie('login', req.body.login, { secure: true })
                req.session.login = req.body.login
                req.session.authorized = true
                fs.mkdirSync(`files/${req.body.login}`)
                res.redirect('/work')
            }
        })

})

APP.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}`)
})
