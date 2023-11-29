import axios from "axios"
import { PageContext } from "../PageContext"
import { creteObjInternalFiles } from "./showOwnerStorages"
import { useContext, useState } from "react"
import fileDownload from 'js-file-download'
import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { deleteData, addFile } from '../store/internalFilesSlice'
import { setDataSubscribed } from "../store/subscribedStorageSlice"
import mimeFileType from "../store/mimeFileType"
import { setDataFolder, navFolder, setDataFolderFirst } from "../store/foldersSlice"
import { setDataCurrentFolder, setDataCurrentFolder_2 } from "../store/currentFolderSlice"
import { setDataFiles } from '../store/internalFilesSlice'
import Chat from "./chat"
import folderIcon from '../../img/folder.png'
import jpeg from '../../img/jpeg.png'
import zip from '../../img/zip.png'
import doc from '../../img/doc.png'
import gif from '../../img/gif.png'
import jpg from '../../img/jpg.png'
import pdf from '../../img/pdf.png'
import png from '../../img/png.png'
import txt from '../../img/txt.png'
import html from '../../img/html.png'
import xml from '../../img/xml.png'
import mp4 from '../../img/mp4.png'

const ShowInternalFilesOthers = () => {
    const dispatch = useDispatch()
    let internalFiles = useSelector((store) => store.internalFile.data)
    let storages = useSelector((store) => store.ownStorages.data)
    let subscribedStorages = useSelector((store) => store.subscribedStorage.data)
    let currentFolder = useSelector((store) => store.currentFolder.data)
    let role = useSelector((store) => store.role.data)
    let folder = useSelector((store) => store.folder.data)
    const { activePage, changePage } = useContext(PageContext)
    const [file, setFile] = useState('');
    const [progress, setProgess] = useState('');
    const [menu, setMenu] = useState(-1)
    const [showMenu, setShowMenu] = useState(false)
    const [showType, setShowType] = useState(2)
    const [typeFile, setTypeFile] = useState('Тип')
    const [showCross, setShowCross] = useState(false)
    const [chatStatus, setChatStatus] = useState(false)
    const el = useRef();

    const handleChange = async (e) => {
        setProgess(0)
        const file = e.target.files[0];
        setFile(file)
        uploadFile(file)
    }

    const uploadFile = (file_) => {
        const formData = new FormData()
        let str = file_.name
        formData.append('file', file_)
        formData.append('path', folder)
        formData.append('fileName', str)
        axios.post('/fileRouter/uploadNewFiles', formData, {
            onUploadProgress: (ProgressEvent) => {
                let progress = Math.round(
                    ProgressEvent.loaded / ProgressEvent.total * 100
                ) + '%';
                setProgess(`Прогресс загрузки файла: ${progress}`)
            }
        })
            .then(res => {
                res.data.birthday = res.data.birthday.slice(0, 10)
                dispatch(addFile(res.data))
            }).catch(err => console.log(err))
    }

    const downloadFile = (fullName, fileName) => {

        axios.post('/fileRouter/downloadFile', { 'fullPath': fullName }, { responseType: 'blob' })
            .then((res) => {
                fileDownload(res.data, fileName)
            })

    }

    const handlerSetType = (type) => {
        setShowType(type)
    }

    const subscribe = () => {
        axios.post('/storageRouter/subscribeToStorage', { 'owner': storages.owner, 'name': storages.name, 'type': storages.type })
            .then((res) => {
                if (res.status === 202) {
                    console.log('gg!')
                }
                if (res.data.message === 'OK') {
                    dispatch(setDataSubscribed({ "owner": storages.owner, "name": storages.name }))
                }
            })
    }

    const unsubscribe = () => {
        axios.post('/storageRouter/unsubscribeToStorage', { 'owner': storages.owner, 'name': storages.name, 'type': storages.type })
            .then((res) => {
                if (res.status === 202) {
                    console.log('gg!')
                }
                if (res.data.message === 'OK') {
                    dispatch(setDataSubscribed({ "owner": '', "name": '' }))
                }
            })
    }

    const [drag, setDrag] = useState(false)

    const dragStartHandler = (e) => {
        e.preventDefault()
        setDrag(true)
    }

    const dragLeaveHandler = (e) => {
        e.preventDefault()
        setDrag(false)
    }

    const onDropHandler = (e) => {
        e.preventDefault()
        let files = [...e.dataTransfer.files]

        for (let i = 0; i < files.length; i++) {
            createFormData(files[i], i)
                .then((res) => {
                    axios.post('/fileRouter/uploadNewFiles', res)
                        .then((response) => {
                            dispatch(addFile(response.data))
                        })
                })
        }


        setDrag(false)
    }

    async function createFormData(files, i) {
        return new Promise((resolve, reject) => {
            const formData = new FormData()
            formData.append('file', files)
            formData.append('path', folder)
            formData.append('fileName', files.name)
            resolve(formData)
        })
    }

    const viewFile = (fullName, type, name) => {
        const fileType = mimeFileType.get(type)
        axios.post('/fileRouter/getFile', { 'name': fullName }, { responseType: 'blob' })
            .then((response) => {
                return response.data.arrayBuffer()
            })
            .then(arrayBuffer => {
                if (fileType === undefined) {
                    fileDownload(arrayBuffer, name)
                    return 0
                }
                else {
                    const blob = new Blob([arrayBuffer], { type: fileType })
                    const fileUrl = URL.createObjectURL(blob)
                    window.open(fileUrl, '_blank')
                }
            })
    }

    const deleteFile = (fullName, fileName, key) => {

        axios.post('/fileRouter/deleteFile', { 'fullPath': fullName })
            .then(() => {
                dispatch(deleteData(key))
            })
    }


    const searchFile = (e) => {
        axios.post('/fileRouter/searchFile', { path: folder, file: e.target.value })
            .then(res => {
                let internalFile = creteObjInternalFiles(res.data)
                dispatch(setDataFiles(internalFile))
            })
    }

    const changeDir = (name) => {
        axios.post('/fileRouter/showFiles', { "path": folder + '/' + name })
            .then((res) => {
                let internalFile = creteObjInternalFiles(res.data)
                dispatch(setDataFiles(internalFile))
            })
            .then(() => {
                dispatch(setDataFolder(name))
                dispatch(setDataCurrentFolder(name))
            })
    }

    const navigateBack = async () => {
        if (folder === storages.owner + '/' + 'Storage_' + storages.name) {
            return -1
        }
        dispatch(navFolder(currentFolder))
        const tempData = folder.slice(0, folder.length - currentFolder.length - 1)
        console.log(tempData)
        axios.post('/fileRouter/showFiles', { "path": tempData })
            .then((res) => {
                let internalFile = creteObjInternalFiles(res.data)
                dispatch(setDataFiles(internalFile))
            })
            .then(() => {
                dispatch(setDataCurrentFolder_2(tempData))
            })
    }

    const [dirName, setDirName] = useState()
    const [modalWin, setModalWin] = useState(false)

    const createDir = () => {
        if (dirName === '') {
            return -1
        }
        axios.post('fileRouter/createDir', { path: folder + '/' + dirName, name: dirName })
            .then(() => {
                axios.post('/fileRouter/showFiles', { "path": folder })
                    .then((res) => {
                        let internalFile = creteObjInternalFiles(res.data)
                        dispatch(setDataFiles(internalFile))
                    })
            })
            .then(() => {
                setModalWin(false)
            })
    }

    const handlerClick = () => {
        setChatStatus(!chatStatus)
    }

    const showSelectedFiles = (type) => {
        axios.post('/fileRouter/showSelectedFiles', { owner: storages.owner, name: storages.name, fileType: type })
            .then((res) => {
                let internalFile = creteObjInternalFiles(res.data)
                dispatch(setDataFiles(internalFile))
            })
    }

    const handlerChangeType = () => {
        axios.post('/fileRouter/showFiles', { "path": storages.owner + '/Storage_' + storages.name })
            .then((res) => {
                let internalFile = creteObjInternalFiles(res.data)
                dispatch(setDataFiles(internalFile))
            })
            .then(() => {
                dispatch(setDataFolderFirst(storages.owner + '/Storage_' + storages.name))
                setShowCross(false)
                setTypeFile('Тип')
            })
    }

    return activePage === 6 ? (
        <div className="show-file-cont">
            {modalWin && (<div id="popup">
                <div className="popup-content">
                    <div className="popup-header">
                        <div className="popup-title">Создать новый каталог</div>
                        <button className="popup-close" onClick={() => { setModalWin(false) }}>X</button>
                    </div>
                    <input className="popup-input" type="text" placeholder="Введите название папки..." onChange={(e) => { setDirName(e.target.value) }} />
                    <button className="popup-create" onClick={() => { createDir() }}>Создать</button>
                </div>
            </div>)}
            <div className="show-files-interior">
                <div className="upload_file">
                    <div id="block-interior-submenu">
                        <div className="block-top-files">
                            <h4 id="discription-block">
                                Хранилище: <span className="discription-storage">{storages.name}</span>
                                <br />
                                Владелец: <span className="discription-storage">{storages.owner}</span>
                            </h4>
                            <form id="search-file-form" >
                                <input name="file" onChange={(e) => searchFile(e)} placeholder="Поиск файла" id="search-file" />
                            </form>
                            {subscribedStorages.owner === '' && subscribedStorages.name === '' && (<div className="file-upload">
                                <button id="subscribe-storage-2" onClick={() => subscribe()}>Подписаться на изменения</button>
                            </div>)}
                            {subscribedStorages.owner != "" && subscribedStorages.name != "" && <div className="file-upload">
                                <button id="subscribe-storage-2" onClick={() => unsubscribe()}>Отписаться</button>
                            </div>}
                        </div>
                        <div className="interor-block-menu">

                        </div>
                    </div>
                </div>
            </div>
            {drag && !modalWin && role === 'full' && (
                <div className="drop-area" onDragStart={e => dragStartHandler(e)} onDragLeave={e => dragLeaveHandler(e)} onDragOver={e => dragStartHandler(e)} onDrop={e => onDropHandler(e)}>Отпустите файлы, чтобы загрузить их</div>
            )}
            {!drag && !modalWin && role === 'full' && <div id="interior-block-files" onDragStart={e => dragStartHandler(e)} onDragLeave={e => dragLeaveHandler(e)} onDragOver={e => dragStartHandler(e)}>
                <div className="block-nav-but">
                    <button className="but-nav-storage-2" onClick={() => navigateBack()}>↶</button>
                    <button className="but-nav-storage" onClick={() => { setModalWin(true); setDirName('') }}>Создать каталог</button>
                    <label id="choose-file-label">
                        <input type="file" ref={el} onChange={handleChange} id="butt-choose" />+
                    </label>
                    <span className="progessBar">
                        {progress}
                    </span>
                    <div className="dropdown-role-block-2">
                        <div className="but-block-type">
                            <button className = {showCross ? 'change-type-1' : 'change-type'} >{typeFile} &#129083;</button>
                            {showCross && <button className="default-type" onClick={() => handlerChangeType()}>X</button>}
                        </div>
                        <div className="dropdown-role-type">
                            <div className="change-role-block" onClick={() => { showSelectedFiles('doc'); setTypeFile('Документы'); setShowCross(true) }}>
                                <img className="picture-type" src={doc}></img>
                                <span className="change-role-field" >Документы</span>
                            </div>
                            <div className="change-role-block" onClick={() => { showSelectedFiles('pdf'); setTypeFile('PDF'); setShowCross(true) }}>
                                <img className="picture-type" src={pdf}></img>
                                <span className="change-role-field" >Файлы PDF</span>
                            </div>
                            <div className="change-role-block" onClick={() => { showSelectedFiles('mp4'); setTypeFile('Видео'); setShowCross(true) }}>
                                <img className="picture-type" src={mp4}></img>
                                <span className="change-role-field" >Видео</span>
                            </div>
                            <div className="change-role-block" onClick={() => { showSelectedFiles('zip'); setTypeFile('Архивы'); setShowCross(true) }}>
                                <img className="picture-type" src={zip}></img>
                                <span className="change-role-field" >Архивы (ZIP)</span>
                            </div>
                            <div className="change-role-block" onClick={() => { showSelectedFiles(['png', 'jpeg', 'jpg']); setTypeFile('Картинки'); setShowCross(true) }}>
                                <img className="picture-type" src={png}></img>
                                <span className="change-role-field" >Картинки (PNG, JPG)</span>
                            </div>
                        </div>
                    </div>
                    <span id="path-navigation">{folder}</span>
                </div>
                {showType === 1 && (
                    <div id="interior-block-files-2">
                        <div className="test">
                            <div className="file-params">
                                <div id="file-prop-name">Название</div>
                                <div id="file-prop-type">Тип</div>
                                <div id="file-prop-date">Дата создания</div>
                                <div id="file-prop-size">Размер(Кб)</div>
                            </div>

                            {
                                internalFiles.map((internalFiles) => {
                                    {
                                        return (
                                            <div id="file-interior" onDoubleClick={() => { internalFiles.type !== 'folder' && viewFile(internalFiles.fullName, internalFiles.type, internalFiles.name); internalFiles.type === 'folder' && changeDir(internalFiles.name) }} onMouseEnter={() => { setMenu(internalFiles.key); setShowMenu(true) }} onMouseLeave={() => { setShowMenu(false); setMenu(-1) }} >
                                                <div id="file-name" key={internalFiles.id}>{internalFiles.name}</div>
                                                <div id="file-type" key={internalFiles.id}>{internalFiles.type}</div>
                                                <div id="file-date" key={internalFiles.id}>{internalFiles.birthday}</div>
                                                <div id="file-size" key={internalFiles.id}>{internalFiles.size}</div>
                                                {menu === internalFiles.key && showMenu && (
                                                    <div className="dropdown-content">
                                                        {internalFiles.type != 'folder' && (
                                                            <div className="file-menu-block">
                                                                <button className="file-menu-but" onClick={() => { downloadFile(internalFiles.fullName, internalFiles.name) }}>Скачать</button>
                                                            </div>
                                                        )}
                                                        {internalFiles.type != 'folder' && (
                                                            <div className="file-menu-block">
                                                                <button className="file-menu-but" onClick={() => { deleteFile(internalFiles.fullName, internalFiles.name, internalFiles.key) }}>Удалить</button>
                                                            </div>
                                                        )}
                                                        {internalFiles.type != 'folder' && (
                                                            <div className="file-menu-block">
                                                                <button className="file-menu-but" onClick={() => { viewFile(internalFiles.fullName, internalFiles.type, internalFiles.name) }}>Открыть</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    }
                                })
                            }

                        </div>
                    </div>)
                }
                {showType === 2 && (
                    <div id="file-interior-with-img">
                        {
                            internalFiles.map((internalFiles) => {
                                {
                                    return (
                                        <div className="file-block" onDoubleClick={() => { internalFiles.type !== 'folder' && viewFile(internalFiles.fullName, internalFiles.type, internalFiles.name); internalFiles.type === 'folder' && changeDir(internalFiles.name) }} onMouseEnter={() => { setMenu(internalFiles.key); setShowMenu(true) }} onMouseLeave={() => { setShowMenu(false); setMenu(-1) }} >
                                            <div>
                                                {internalFiles.type === 'folder' && (
                                                    <div>
                                                        <img className="img-type" src={folderIcon} />
                                                        <div className="file-name-2">{internalFiles.name}</div>
                                                    </div>
                                                )}
                                            </div>
                                            {internalFiles.type != 'folder' && (<div className="test">
                                                {internalFiles.type === 'jpeg' &&
                                                    <img className="img-type" src={jpeg} />
                                                }
                                                {internalFiles.type === 'docx' &&
                                                    <img className="img-type" src={doc} />
                                                }
                                                {internalFiles.type === 'gif' &&
                                                    <img className="img-type" src={gif} />
                                                }
                                                {internalFiles.type === 'jpg' &&
                                                    <img className="img-type" src={jpg} />
                                                }
                                                {internalFiles.type === 'pdf' &&
                                                    <img className="img-type" src={pdf} />
                                                }
                                                {internalFiles.type === 'png' &&
                                                    <img className="img-type" src={png} />
                                                }
                                                {internalFiles.type === 'txt' &&
                                                    <img className="img-type" src={txt} />
                                                }
                                                {internalFiles.type === 'zip' &&
                                                    <img className="img-type" src={zip} />
                                                }
                                                {internalFiles.type === 'html' &&
                                                    <img className="img-type" src={html} />
                                                }
                                                {internalFiles.type === 'xml' &&
                                                    <img className="img-type" src={xml} />
                                                }
                                                {internalFiles.type === 'mp4' &&
                                                    <img className="img-type" src={mp4} />
                                                }
                                                <div className="file-name-2">{internalFiles.name}</div>
                                                <div className="dropdown-interior-2">
                                                </div>
                                                {menu === internalFiles.key && internalFiles.type !== 'folder' && (
                                                    <div className="dropdown-content-2">
                                                        <div className="disctiption-block">
                                                            <div className="discripion-file">Тип файла: {internalFiles.type}</div>
                                                            <div className="discripion-file">Размер {internalFiles.size}Кб</div>
                                                            <div className="discripion-file">Дата создания {internalFiles.birthday}</div>
                                                        </div>
                                                        <div className="file-menu-block">
                                                            <button className="file-menu-but" onClick={() => { downloadFile(internalFiles.fullName, internalFiles.name) }}>Скачать</button>
                                                        </div>
                                                        <div className="file-menu-block">
                                                            <button className="file-menu-but" onClick={() => { deleteFile(internalFiles.fullName, internalFiles.name, internalFiles.key) }}>Удалить</button>
                                                        </div>
                                                        <div className="file-menu-block">
                                                            <button className="file-menu-but" onClick={() => { viewFile(internalFiles.fullName, internalFiles.type, internalFiles.name) }}>Открыть</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>)}
                                        </div>
                                    )
                                }
                            })
                        }

                    </div>)
                }
            </div>}

            {role === 'default' && <div id="interior-block-files">
                <div className="block-nav-but">
                    <button className="but-nav-storage-2" onClick={() => navigateBack()}>↶</button>
                    <div className="dropdown-role-block-2">
                        <div className="but-block-type-default">
                            <button className="change-type">{typeFile} &#129083;</button>
                            {showCross && <button className="default-type" onClick={() => handlerChangeType()}>X</button>}
                        </div>
                        <div className="dropdown-role-type">
                            <div className="change-role-block" onClick={() => { showSelectedFiles('doc'); setTypeFile('Документы'); setShowCross(true) }}>
                                <img className="picture-type" src={doc}></img>
                                <span className="change-role-field" >Документы</span>
                            </div>
                            <div className="change-role-block" onClick={() => { showSelectedFiles('pdf'); setTypeFile('PDF'); setShowCross(true) }}>
                                <img className="picture-type" src={pdf}></img>
                                <span className="change-role-field" >Файлы PDF</span>
                            </div>
                            <div className="change-role-block" onClick={() => { showSelectedFiles('mp4'); setTypeFile('Видео'); setShowCross(true) }}>
                                <img className="picture-type" src={mp4}></img>
                                <span className="change-role-field" >Видео</span>
                            </div>
                            <div className="change-role-block" onClick={() => { showSelectedFiles('zip'); setTypeFile('Архивы'); setShowCross(true) }}>
                                <img className="picture-type" src={zip}></img>
                                <span className="change-role-field" >Архивы (ZIP)</span>
                            </div>
                            <div className="change-role-block" onClick={() => { showSelectedFiles('png'); setTypeFile('PNG'); setShowCross(true) }}>
                                <img className="picture-type" src={png}></img>
                                <span className="change-role-field" >Картинки (PNG)</span>
                            </div>
                            <div className="change-role-block" onClick={() => { showSelectedFiles('jpeg'); setTypeFile('JPEG'); setShowCross(true) }}>
                                <img className="picture-type" src={jpeg}></img>
                                <span className="change-role-field" >Картинки (JPEG)</span>
                            </div>
                            <div className="change-role-block" onClick={() => { showSelectedFiles('jpg'); setTypeFile('JPG'); setShowCross(true) }}>
                                <img className="picture-type" src={jpg}></img>
                                <span className="change-role-field" >Картинки (JPG)</span>
                            </div>
                        </div>
                    </div>
                    <span id="path-navigation-default">{folder}</span>
                </div>
                {showType === 1 && (
                    <div id="interior-block-files-2">
                        <div className="test">
                            <div className="file-params">
                                <div id="file-prop-name">Название</div>
                                <div id="file-prop-type">Тип</div>
                                <div id="file-prop-date">Дата создания</div>
                                <div id="file-prop-size">Размер(Кб)</div>
                            </div>
                            <div className="files-block">
                                {
                                    internalFiles.map((internalFiles) => {
                                        {
                                            return (
                                                <div id="file-interior" onDoubleClick={() => { internalFiles.type !== 'folder' && viewFile(internalFiles.fullName, internalFiles.type, internalFiles.name); internalFiles.type === 'folder' && changeDir(internalFiles.name) }} onMouseEnter={() => { setMenu(internalFiles.key); setShowMenu(true) }} onMouseLeave={() => { setShowMenu(false); setMenu(-1) }} >
                                                    <div id="file-name" key={internalFiles.id}>{internalFiles.name}</div>
                                                    <div id="file-type" key={internalFiles.id}>{internalFiles.type}</div>
                                                    <div id="file-date" key={internalFiles.id}>{internalFiles.birthday}</div>
                                                    <div id="file-size" key={internalFiles.id}>{internalFiles.size}</div>
                                                    {menu === internalFiles.key && showMenu && (
                                                        <div className="dropdown-content">
                                                            <div className="file-menu-block">
                                                                <button className="file-menu-but" onClick={() => { downloadFile(internalFiles.fullName, internalFiles.name) }}>Скачать</button>
                                                            </div>
                                                            <div className="file-menu-block">
                                                                <button className="file-menu-but" onClick={() => { viewFile(internalFiles.fullName, internalFiles.type, internalFiles.name) }}>Открыть</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>

                        </div>
                    </div>)
                }
                {showType === 2 && (
                    <div id="file-interior-with-img">
                        {
                            internalFiles.map((internalFiles) => {
                                {
                                    return (
                                        <div className="file-block" onDoubleClick={() => { internalFiles.type !== 'folder' && viewFile(internalFiles.fullName, internalFiles.type, internalFiles.name); internalFiles.type === 'folder' && changeDir(internalFiles.name) }} onMouseEnter={() => { setMenu(internalFiles.key); setShowMenu(true) }} onMouseLeave={() => { setShowMenu(false); setMenu(-1) }} >
                                            <div>
                                                {internalFiles.type === 'folder' && (
                                                    <div>
                                                        <img className="img-type" src={folderIcon} />
                                                        <div className="file-name-2">{internalFiles.name}</div>
                                                    </div>
                                                )}
                                            </div>
                                            {internalFiles.type != 'folder' && (<div className="test">
                                                {internalFiles.type === 'jpeg' &&
                                                    <img className="img-type" src={jpeg} />
                                                }
                                                {internalFiles.type === 'docx' &&
                                                    <img className="img-type" src={doc} />
                                                }
                                                {internalFiles.type === 'gif' &&
                                                    <img className="img-type" src={gif} />
                                                }
                                                {internalFiles.type === 'jpg' &&
                                                    <img className="img-type" src={jpg} />
                                                }
                                                {internalFiles.type === 'pdf' &&
                                                    <img className="img-type" src={pdf} />
                                                }
                                                {internalFiles.type === 'png' &&
                                                    <img className="img-type" src={png} />
                                                }
                                                {internalFiles.type === 'txt' &&
                                                    <img className="img-type" src={txt} />
                                                }
                                                {internalFiles.type === 'zip' &&
                                                    <img className="img-type" src={zip} />
                                                }
                                                {internalFiles.type === 'html' &&
                                                    <img className="img-type" src={html} />
                                                }
                                                {internalFiles.type === 'xml' &&
                                                    <img className="img-type" src={xml} />
                                                }
                                                {internalFiles.type === 'mp4' &&
                                                    <img className="img-type" src={mp4} />
                                                }
                                                <div className="file-name-2">{internalFiles.name}</div>
                                                <div className="dropdown-interior-2">
                                                </div>
                                                {menu === internalFiles.key && internalFiles.type !== 'folder' && (
                                                    <div className="dropdown-content-2">
                                                        <div className="disctiption-block">
                                                            <div className="discripion-file">Тип файла: {internalFiles.type}</div>
                                                            <div className="discripion-file">Размер {internalFiles.size}Кб</div>
                                                            <div className="discripion-file">Дата создания {internalFiles.birthday}</div>
                                                        </div>
                                                        <div className="file-menu-block">
                                                            <button className="file-menu-but" onClick={() => { downloadFile(internalFiles.fullName, internalFiles.name) }}>Скачать</button>
                                                        </div>
                                                        <div className="file-menu-block">
                                                            <button className="file-menu-but" onClick={() => { viewFile(internalFiles.fullName, internalFiles.type, internalFiles.name) }}>Открыть</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>)}
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>)

                }
            </div>}
            <div className="open-chat">
                {chatStatus && <Chat />}
                <div className="convert" onClick={() => handlerClick()}>&#9993;</div>
            </div>
        </div>
    ) : null

}

export { ShowInternalFilesOthers }