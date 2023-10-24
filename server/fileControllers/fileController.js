const fs = require('fs')
var path = require("path");
const MongoClient = require('mongodb').MongoClient
const clientDB = new MongoClient("mongodb://127.0.0.1:27017/")
const db = clientDB.db("DBUsers")
const collectionStorages = db.collection("Storages")

const createStorageDir = (req, login) => {
    try{
        fs.mkdirSync(path.resolve(__dirname, '../') + `/files/${login}/Storage_${req.body.newStorage.nameStorage}`)
        let passwordTemp
        req.body.newStorage.password != undefined ? passwordTemp = req.body.newStorage.password : passwordTemp = null
        let storage = {
            owner: login,
            name: req.body.newStorage.nameStorage,
            type: req.body.newStorage.typeStorage,
            password: passwordTemp
    
        }
        collectionStorages.insertOne(storage)   
    }
    catch(err){
        console.log(err)
    }
    
}

module.exports = { createStorageDir }
