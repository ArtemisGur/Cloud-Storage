const express = require('express')
const session = require('express-session')
const cors = require("cors");
const fs = require('fs')
const bcrypt = require('bcrypt')
const fileUpload = require('express-fileupload');
var path = require("path");

const fileController = require('./server/fileControllers/fileController')
const userController = require('./server/userConrol/userControl');
const { randomInt } = require('crypto');

const MongoClient = require('mongodb').MongoClient
const clientDB = new MongoClient("mongodb://127.0.0.1:27017/")
const db = clientDB.db("DBUsers")
const collectionUsers = db.collection("users")
const collectionStorages = db.collection("Storages")
const collectionEnabledStorages = db.collection("enabledStorages")

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
APP.use(express.static(__dirname + '/src/mainPage/'))
APP.use(express.static(__dirname + '/src/registrationPage/'))
APP.use(express.static(__dirname + '/src/autorizationPage/'))
//APP.use(express.static(__dirname + '/workpage/'))
APP.use(express.urlencoded({ extended: false }))
APP.use(fileUpload());

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

APP.post("/getNewStorage", (req, res) => {

    if (req.body.newStorage.nameStorage == '' || req.body.newStorage.typeStorage == null) {
        res.send({ 'stat': 202 })
        return -1
    }
    collectionStorages.findOne({ owner: req.session.login, name: req.body.newStorage.nameStorage })
        .then((response) => {
            if (response != null) {
                res.send({ 'isEmpty': false })
                return -1
            }
            else {
                let passwordTemp
                req.body.newStorage.password != undefined ? passwordTemp = req.body.newStorage.password : passwordTemp = null
                let storage = {
                    owner: req.session.login,
                    name: req.body.newStorage.nameStorage,
                    type: req.body.newStorage.typeStorage,
                    password: passwordTemp

                }
                collectionStorages.insertOne(storage)
                    .then(() => {
                        fs.mkdirSync(path.resolve(__dirname) + `/server/files/${req.session.login}/Storage_${req.body.newStorage.nameStorage}`)
                        res.send({ 'isEmpty': true })
                        return 0
                    })
            }
        })
})

APP.post('/getOwnerStorages', (req, res) => {
    collectionStorages.find({ owner: req.session.login }).toArray()
        .then((result) => {
            res.send(result)
        })
})

APP.post('/getEnableStorages', (req, res) => {
    collectionEnabledStorages.find({ 'user': req.session.login }).toArray()
        .then((response) => {
            res.send(response)
        })
})

APP.post('/changeStoragePassword', (req, res) => {
    collectionStorages.updateOne({ 'owner': req.body.owner, 'name': req.body.name }, { $set: { password: req.body.password } })
        .then((response) => {
            res.send("OK")
        })
})

APP.post('/changeUserRole', (req, res) => {
    collectionEnabledStorages.updateOne({ 'owner': req.body.owner, 'name': req.body.name, 'user': req.body.user }, { $set: { role: req.body.newRole } })
        .then((response) => {
            res.send("OK")
        })
})

APP.post('/changeAllRoles', (req, res) => {
    collectionEnabledStorages.updateMany({ 'owner': req.body.owner, 'name': req.body.name }, { $set: { role: req.body.newRole } })
        .then(() => {
            collectionEnabledStorages.find({ owner: req.body.owner, name: req.body.name }).toArray()
                .then((response) => {
                    console.log(response)
                    res.send(response)
                })
        })
})

APP.post('/excludeUser', (req, res) => {
    collectionEnabledStorages.deleteOne({ 'owner': req.body.owner, 'name': req.body.name, 'user': req.body.user })
        .then((response) => {
            res.send("OK")
        })
})


APP.post('/checkStorage', (req, res) => {
    collectionEnabledStorages.findOne({ "owner": req.body.owner, "name": req.body.name, "user": req.session.login })
        .then((response) => {
            if (response != null) {
                res.send({ "owner": response.user, "name": response.name, "role": response.role })
            }
            else {
                res.send({ "owner": "", "name": "", "role": 'default' })
            }
        })
})

APP.post('/uploadNewFiles', (req, res) => {
    const file = req.files.file
    numFiles = req.body.numFiles
    dirname = `${__dirname}/server/files/${req.body.path}/${req.body.fileName}`
    file.mv(`${__dirname}/server/files/${req.body.path}/${req.body.fileName}`,
        function (err) {
            if (err) {
                res.status(500).send({ msg: "Error occurred" })
            }
            let stat = fs.statSync(`${__dirname}/server/files/${req.body.path}/${req.body.fileName}`)
            let size_ = Math.floor(stat.size / 1024)
            let birthtime_ = stat.birthtime
            let type_ = req.body.fileName.slice(req.body.fileName.lastIndexOf('.') + 1)
            res.send({ key: randomInt(1000), fullName: dirname, name: req.body.fileName, type: type_, size: size_, birthday: birthtime_ })
        });
})

APP.post('/downloadFile', (req, res) => {
    const fileName = req.body.fullPath
    fs.readFile(fileName, (err, data) => {
        if (err) {
            return res.status(500).send({ msg: "Error occurred" })
        }
        res.send(data)
    })
})

APP.post('/createDir', (req, res) => {
    fileController.createDir(req.body.path)
    dirname = `${__dirname}/server/files/${req.body.path}/${req.body.name}`
    res.send({ key: randomInt(1000), fullName: dirname, name: req.body.name, type: 'folder' })
})

APP.post('/deleteFile', (req, res) => {
    const fileName = req.body.fullPath
    try {
        fs.unlinkSync(fileName)
        res.send('deleted')
    }
    catch (err) {
        console.log(err)
    }
})

APP.post('/deleteFolder', (req, res) => {
    const fileName = req.body.fullPath
    fs.rmSync(fileName, { recursive: true })
    res.send('deleted')
}
)

APP.post('/deleteStorage', (req, res) => {
    collectionEnabledStorages.deleteMany({ name: req.body.name, owner: req.body.owner })
    collectionStorages.deleteOne({ name: req.body.name, owner: req.body.owner })
        .then((response) => {
            if (fileController.deleteStorage(req.body.owner, req.body.name))
                res.send(true)
        })
})

APP.post("/showFiles", (req, res) => {
    let files = fileController.showFiles(req)
    res.send(files)

})

APP.post("/getUsersList", (req, res) => {
    collectionEnabledStorages.find({ owner: req.body.owner, name: req.body.name }).toArray()
        .then((response) => {
            res.send(response)
        })

})

APP.post('/searchStorages', (req, res) => {
    collectionStorages.find({ name: req.body.storageName, type: { $ne: 'Personality' }, owner: { $ne: req.session.login } }).toArray()
        .then((result) => {
            res.send(result)
        })
})

APP.post('/getFile', (req, res) => {
    const file = fileController.getFile(req.body.name)
    res.send(file)
})

APP.post('/searchFile', (req, res) => {
    let files = fileController.searchFiles(req.body.path, req.body.file)
    res.send(files)
})

APP.post('/subscribeToStorage', (req, res) => {
    collectionStorages.findOne({ owner: req.body.owner, name: req.body.name, type: req.body.type })
        .then((response) => {
            if (response === null) {
                res.sendStatus(202)
                return true
            }
            return false
        })
        .then((response) => {
            if (!response) {
                collectionEnabledStorages.insertOne({ 'user': req.session.login, 'role': 'default', 'name': req.body.name, 'owner': req.body.owner, 'type': req.body.type })
                    .then(() => {
                        res.send({ 'message': 'OK' })
                    })
            }
        })
})

APP.post('/unsubscribeToStorage', (req, res) => {
    collectionStorages.findOne({ owner: req.body.owner, name: req.body.name, type: req.body.type })
        .then((response) => {
            if (response === null) {
                res.sendStatus(202)
                return true
            }
            return false
        })
        .then((response) => {
            if (!response) {
                collectionEnabledStorages.deleteOne({ 'user': req.session.login, 'name': req.body.name, 'owner': req.body.owner, 'type': req.body.type })
                    .then(() => {
                        res.send({ 'message': 'OK' })
                    })
            }
        })
})

APP.post('/confirmPasswordStorage', (req, res) => {
    collectionStorages.findOne({ owner: req.body.owner, name: req.body.name })
        .then((storage) => {
            if (storage.password != req.body.password) {
                res.sendStatus(202)
            }
            else {
                let files = fileController.showFiles_2(req)
                res.send(files)
            }
        })
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
                fs.mkdirSync(`server/files/${req.body.login}`)
                res.redirect('/work')
            }
        })

})

// APP.get('/static/js/main.effe100f.js', (req, res) => {
//     res.sendFile(__dirname + '/workpage/build/static/js/main.effe100f.js')

// })

APP.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}`)
})
