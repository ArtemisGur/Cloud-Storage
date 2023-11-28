const express = require('express')
const fileRouter = express.Router()

const fileController = require('../fileControllers/fileController')
var path = require("path");
const fs = require('fs')
const { randomInt } = require('crypto');

fileRouter.post('/deleteFile', (req, res) => {
    const fileName = req.body.fullPath
    try {
        fs.unlinkSync(fileName)
        res.send('deleted')
    }
    catch (err) {
        console.log(err)
    }
})

fileRouter.post('/uploadNewFiles', (req, res) => {
    const file = req.files.file
    numFiles = req.body.numFiles
    dirname = path.resolve(__dirname, '../') + `/files/${req.body.path}/${req.body.fileName}`
    file.mv(path.resolve(__dirname, '../') + `/files/${req.body.path}/${req.body.fileName}`,
        function (err) {
            if (err) {
                res.status(500).send({ msg: "Error occurred" })
            }
            let stat = fs.statSync(path.resolve(__dirname, '../') + `/files/${req.body.path}/${req.body.fileName}`)
            let size_ = Math.floor(stat.size / 1024)
            let birthtime_ = stat.birthtime
            let type_ = req.body.fileName.slice(req.body.fileName.lastIndexOf('.') + 1)
            res.send({ key: randomInt(1000), fullName: dirname, name: req.body.fileName, type: type_, size: size_, birthday: birthtime_ })
        });
})

fileRouter.post('/downloadFile', (req, res) => {
    const fileName = req.body.fullPath
    fs.readFile(fileName, (err, data) => {
        if (err) {
            return res.status(500).send({ msg: "Error occurred" })
        }
        res.send(data)
    })
})

fileRouter.post('/deleteFolder', (req, res) => {
    const fileName = req.body.fullPath
    fs.rmSync(fileName, { recursive: true })
    res.send('deleted')
})

fileRouter.post('/createDir', (req, res) => {
    fileController.createDir(req.body.path)
    dirname = path.resolve(__dirname, '../') + `/files/${req.body.path}/${req.body.name}`
    res.send({ key: randomInt(1000), fullName: dirname, name: req.body.name, type: 'folder' })
})

fileRouter.post('/getFile', (req, res) => {
    const file = fileController.getFile(req.body.name)
    res.send(file)
})

fileRouter.post('/searchFile', (req, res) => {
    let files = fileController.searchFiles(req.body.path, req.body.file)
    res.send(files)
})

fileRouter.post("/showFiles", (req, res) => {
    let files = fileController.showFiles(req)
    res.send(files)
})

fileRouter.post("/showSelectedFiles", (req, res) => {
    let dirPath = path.resolve(__dirname, '../') + `/files/${req.body.owner}` + `/Storage_${req.body.name}`
    let files = fileController.showSelectedFiles(dirPath, undefined, req.body.fileType)
    res.send(files)
})


module.exports = {
    fileRouter: fileRouter
}