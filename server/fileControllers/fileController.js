const { json } = require('express');
const fs = require('fs')
var path = require("path");
const MongoClient = require('mongodb').MongoClient
const clientDB = new MongoClient("mongodb://127.0.0.1:27017/")
const db = clientDB.db("DBUsers")
const collectionStorages = db.collection("Storages")

function File(fullName, name, type, size, createDate){
    this.fullName = fullName
    this.name = name
    this.type = type
    this.size = size
    this.createDate = createDate
}

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

const showFiles = (req) => {
    
    let dirPath = (path.resolve(__dirname, '../')) + `/files/${req.body.owner}/Storage_${req.body.name}`
    let files_ = fs.readdirSync(dirPath)
    
    let files = []

    for (let i in files_){
        let fullName = dirPath + '/' + files_[i]
        let name = files_[i]
        let stat = fs.statSync(dirPath + '/' +files_[i])
        let size = stat.size
        let birthtime = stat.birthtime  
        if (fs.statSync(fullName).isDirectory()){
            let type = ''
            let file = new File(fullName, name, type, size, birthtime)
            files.push(file)
        }
        else{
            let type = name.slice(name.lastIndexOf('.') + 1)
            let file = new File(fullName, name, type, size, birthtime)
            files.push(file)
        }
        //console.log(files)
    }
    return files
}

module.exports = { createStorageDir, showFiles }
