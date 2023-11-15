const { json } = require('express');
const fs = require('fs')
var path = require("path");
const MongoClient = require('mongodb').MongoClient
const clientDB = new MongoClient("mongodb://127.0.0.1:27017/")
const db = clientDB.db("DBUsers")
const collectionStorages = db.collection("Storages")

function File(fullName, name, type, size, createDate) {
    this.fullName = fullName
    this.name = name
    this.type = type
    this.size = size
    this.createDate = createDate
}

const createStorageDir = (req, login) => {
    console.log({ owner: login, name: req.body.newStorage.nameStorage })
   

}

const deleteStorage = (login, name) => {
    try {
        fs.rmSync(path.resolve(__dirname, '../') + `/files/${login}/Storage_${name}`, { recursive: true })
        return true
    }
    catch (err) {
        console.log(err)
    }
}

const showFiles = (req) => {

    let dirPath = (path.resolve(__dirname, '../')) + `/files/${req.body.path}`
    let files_ = fs.readdirSync(dirPath)
    let files = []

    for (let i in files_) {
        let fullName = dirPath + '/' + files_[i]
        let name = files_[i]
        let stat = fs.statSync(dirPath + '/' + files_[i])
        let size = stat.size
        let birthtime = stat.birthtime
        if (fs.statSync(fullName).isDirectory()) {
            let type = 'folder'
            let file = new File(fullName, name, type, size, birthtime)
            files.push(file)
        }
        else {
            let type = name.slice(name.lastIndexOf('.') + 1)
            let file = new File(fullName, name, type, size, birthtime)
            files.push(file)
        }
    }
    return files
}

const showFiles_2 = (req) => {

    let dirPath = (path.resolve(__dirname, '../')) + `/files/${req.body.owner}/Storage_${req.body.name}`
    let files_ = fs.readdirSync(dirPath)
    let files = []

    for (let i in files_) {
        let fullName = dirPath + '/' + files_[i]
        let name = files_[i]
        let stat = fs.statSync(dirPath + '/' + files_[i])
        let size = stat.size
        let birthtime = stat.birthtime
        if (fs.statSync(fullName).isDirectory()) {
            let type = 'folder'
            let file = new File(fullName, name, type, size, birthtime)
            files.push(file)
        }
        else {
            let type = name.slice(name.lastIndexOf('.') + 1)
            let file = new File(fullName, name, type, size, birthtime)
            files.push(file)
        }
    }
    return files
}

const getFile = (path) => {
    return fs.readFileSync(path)
}

const searchFiles = (path_, file) => {
    let dirPath = (path.resolve(__dirname, '../')) + `/files/${path_}`
    let files_ = fs.readdirSync(dirPath)
    subStr = file.toLowerCase()
    if (subStr === '') {
        let files = []
        for (let i in files_) {
            let str = files_[i]
            str = str.toLowerCase()
            let res = str.indexOf(subStr)

            if (res != -1) {
                let fullName = dirPath + '/' + files_[i]
                let name = files_[i]
                let stat = fs.statSync(dirPath + '/' + files_[i])
                let size = stat.size
                let birthtime = stat.birthtime
                if (fs.statSync(fullName).isDirectory()) {
                    let type = 'folder'
                    let file = new File(fullName, name, type, size, birthtime)
                    files.push(file)
                }
                else {
                    let type = name.slice(name.lastIndexOf('.') + 1)
                    let file = new File(fullName, name, type, size, birthtime)
                    files.push(file)
                }
            }
        }
        return files
    }
    else {
        let files = []
        for (let i in files_) {
            let str = files_[i]
            str = str.toLowerCase()
            let res = str.indexOf(subStr)

            if (res != -1) {
                let fullName = dirPath + '/' + files_[i]
                let name = files_[i]
                let stat = fs.statSync(dirPath + '/' + files_[i])
                let size = stat.size
                let birthtime = stat.birthtime
                if (fs.statSync(fullName).isDirectory()) {
                }
                else {
                    let type = name.slice(name.lastIndexOf('.') + 1)
                    let file = new File(fullName, name, type, size, birthtime)
                    files.push(file)
                }
            }
        }
        return files
    }

}

const createDir = (newPath) => {
    fs.mkdirSync(path.resolve(__dirname, '../') + `/files/${newPath}`)
}

module.exports = { createStorageDir, showFiles, showFiles_2, deleteStorage, getFile, searchFiles, createDir }
