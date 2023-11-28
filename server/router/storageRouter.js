const express = require('express')
const MongoClient = require('mongodb').MongoClient
const clientDB = new MongoClient("mongodb://127.0.0.1:27017/")
const db = clientDB.db("DBUsers")

const storageRouter = express.Router()
const collectionEnabledStorages = db.collection("enabledStorages")
const collectionStorages = db.collection("Storages")
const fileController = require('../fileControllers/fileController')

var path = require("path");
const fs = require('fs')

storageRouter.post("/getUsersList", (req, res) => {
    collectionEnabledStorages.find({ owner: req.body.owner, name: req.body.name }).toArray()
        .then((response) => {
            res.send(response)
        })

})

storageRouter.post('/deleteStorage', (req, res) => {
    collectionEnabledStorages.deleteMany({ name: req.body.name, owner: req.body.owner })
    collectionStorages.deleteOne({ name: req.body.name, owner: req.body.owner })
        .then((response) => {
            if (fileController.deleteStorage(req.body.owner, req.body.name))
                res.send(true)
        })
})

storageRouter.post('/subscribeToStorage', (req, res) => {
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

storageRouter.post('/unsubscribeToStorage', (req, res) => {
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

storageRouter.post('/changeStoragePassword', (req, res) => {
    collectionStorages.updateOne({ 'owner': req.body.owner, 'name': req.body.name }, { $set: { password: req.body.password } })
        .then((response) => {
            res.send("OK")
        })
})

storageRouter.post('/changeUserRole', (req, res) => {
    collectionEnabledStorages.updateOne({ 'owner': req.body.owner, 'name': req.body.name, 'user': req.body.user }, { $set: { role: req.body.newRole } })
        .then((response) => {
            res.send("OK")
        })
})

storageRouter.post('/changeAllRoles', (req, res) => {
    collectionEnabledStorages.updateMany({ 'owner': req.body.owner, 'name': req.body.name }, { $set: { role: req.body.newRole } })
        .then(() => {
            collectionEnabledStorages.find({ owner: req.body.owner, name: req.body.name }).toArray()
                .then((response) => {
                    console.log(response)
                    res.send(response)
                })
        })
})

storageRouter.post('/excludeUser', (req, res) => {
    collectionEnabledStorages.deleteOne({ 'owner': req.body.owner, 'name': req.body.name, 'user': req.body.user })
        .then((response) => {
            res.send("OK")
        })
})

storageRouter.post("/getNewStorage", (req, res) => {

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
                        fs.mkdirSync(path.resolve(__dirname, '../') + `/files/${req.session.login}/Storage_${req.body.newStorage.nameStorage}`)
                        res.send({ 'isEmpty': true })
                        return 0
                    })
            }
        })
})

storageRouter.post('/checkStorage', (req, res) => {
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

storageRouter.post('/confirmPasswordStorage', (req, res) => {
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

storageRouter.post('/searchStorages', (req, res) => {
    collectionStorages.find({ name: req.body.storageName, type: { $ne: 'Personality' }, owner: { $ne: req.session.login } }).toArray()
        .then((result) => {
            res.send(result)
        })
})


storageRouter.post('/getEnableStorages', (req, res) => {
    collectionEnabledStorages.find({ 'user': req.session.login }).toArray()
        .then((response) => {
            res.send(response)
        })
})

storageRouter.post('/getOwnerStorages', (req, res) => {
    collectionStorages.find({ owner: req.session.login }).toArray()
        .then((result) => {
            res.send(result)
        })
})

module.exports = {
    storageRouter: storageRouter
}