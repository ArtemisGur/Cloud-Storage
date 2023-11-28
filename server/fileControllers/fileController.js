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

const deleteStorage = (login, name) => {
    try {
        fs.rmSync(path.resolve(__dirname, '../') + `/files/${login}/Storage_${name}`, { recursive: true })
        return true
    }
    catch (err) {
        console.log(err)
    }
}

const showSelectedFiles = (dir, files, fileType) => {
    files = files || [];
    var  allFiles = fs.readdirSync(dir);
    for (var i = 0; i < allFiles.length; i++) {
        let fullName = dir + '/' + allFiles[i];
        let stat = fs.statSync(dir + '/' + allFiles[i])
        let size = stat.size
        let birthtime = stat.birthtime
        let name = allFiles[i];
        let type = name.slice(name.lastIndexOf('.') + 1)
        if (fs.statSync(fullName).isDirectory()) {
            showSelectedFiles(fullName, files, fileType);
        } 
        else if (type === fileType){
            let file = new File(fullName, name, type, size, birthtime)
            files.push(file);
        }
    }
    return files;
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
    let tempDir = []
    let tempFiles = []
    for (let i = 0; i < files.length; i++) {
        if (files[i].type === 'folder') {
            tempDir.push(files[i])
        }
        else {
            tempFiles.push(files[i])
        }
    }
    let all = [...tempDir, ...tempFiles]
    return all
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
    let tempDir = []
    let tempFiles = []
    for (let i = 0; i < files.length; i++) {
        if (files[i].type === 'folder') {
            tempDir.push(files[i])
        }
        else {
            tempFiles.push(files[i])
        }
    }
    let all = [...tempDir, ...tempFiles]
    return all
}

const getFile = (path) => {
    return fs.readFileSync(path)
}

const searchFiles = (path_, file) => {
    let dirPath = (path.resolve(__dirname, '../')) + `/files/${path_}`
    let files_ = fs.readdirSync(dirPath)
    subStr = file.toLowerCase()
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
                if (subStr === '') {
                    let type = 'folder'
                    let file = new File(fullName, name, type, size, birthtime)
                    files.push(file)
                }
                else {

                }
            }
            else {
                let type = name.slice(name.lastIndexOf('.') + 1)
                let file = new File(fullName, name, type, size, birthtime)
                files.push(file)
            }
        }
    }
    let tempDir = []
    let tempFiles = []
    for (let i = 0; i < files.length; i++) {
        if (files[i].type === 'folder') {
            tempDir.push(files[i])
        }
        else {
            tempFiles.push(files[i])
        }
    }
    let all = [...tempDir, ...tempFiles]
    return all

}

const createDir = (newPath) => {
    fs.readdir(path.resolve(__dirname, '../') + `/files/${newPath}`, function (err, dirs) {
        if (!err) {

        }
        else if (err.code === 'ENOENT') {
            fs.mkdirSync(path.resolve(__dirname, '../') + `/files/${newPath}`)
        }
    });
}

module.exports = { showFiles, showFiles_2, deleteStorage, getFile, searchFiles, createDir, showSelectedFiles }
