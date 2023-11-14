import axios from "axios"
import { PageContext } from "../PageContext"
import { path, creteObjInternalFiles } from "./showOwnerStorages"
import { useContext, useState } from "react"
import fileDownload from 'js-file-download'
import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { deleteData, addFile } from '../store/internalFilesSlice'
import { setDataSubscribed } from "../store/subscribedStorageSlice"
import mimeFileType from "../store/mimeFileType"
import { setDataFolder, getDataFolder, setDataFolderFirst, navFolder } from "../store/foldersSlice"
import { setDataCurrentFolder, setDataCurrentFolder_2 } from "../store/currentFolderSlice"
import { setDataFiles } from '../store/internalFilesSlice'
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
import list from '../../img/list.png'
import icons from '../../img/icons.png'
import mp4 from '../../img/mp4.png'

const ShowInternalFilesOthers = () => {
    const dispatch = useDispatch()
    let internalFiles = useSelector((store) => store.internalFile.data)
    let storages = useSelector((store) => store.ownStorages.data)
    let subscribedStorages = useSelector((store) => store.subscribedStorage.data)
    let currentFolder = useSelector((store) => store.currentFolder.data)
    let folder = useSelector((store) => store.folder.data)
    const { activePage, changePage } = useContext(PageContext)
    const [file, setFile] = useState('');
    const [progress, setProgess] = useState('Прогресс загрузки файла: 0');
    const [menu, setMenu] = useState(-1)
    const [showMenu, setShowMenu] = useState(false)
    const [showType, setShowType] = useState(2)
    const el = useRef();

    const handleChange = (e) => {
        setProgess(0)
        const file = e.target.files[0];
        setFile(file);
    }

    const uploadFile = () => {
        const formData = new FormData()
        let str = file.name
        console.log(folder)
        formData.append('file', file)
        formData.append('path', folder)
        formData.append('fileName', str)
        axios.post('http://localhost:5000/uploadNewFiles', formData, {
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

        axios.post('/downloadFile', { 'fullPath': fullName }, { responseType: 'blob' })
            .then((res) => {
                fileDownload(res.data, fileName)
            })

    }

    const handlerSetType = (type) => {
        setShowType(type)
    }

    const subscribe = () => {
        axios.post('/subscribeToStorage', { 'owner': storages.owner, 'name': storages.name, 'type': storages.type })
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
        axios.post('/unsubscribeToStorage', { 'owner': storages.owner, 'name': storages.name, 'type': storages.type })
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
                    axios.post('/uploadNewFiles', res)
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
        console.log('aaaaa')
        const fileType = mimeFileType.get(type)
        //console.log(fileType)
        axios.post('/getFile', { 'name': fullName }, { responseType: 'blob' })
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

    const searchFile = (e) => {
        axios.post('/searchFile', { path: folder, file: e.target.value })
            .then(res => {
                let internalFile = creteObjInternalFiles(res.data)
                dispatch(setDataFiles(internalFile))
            })
    }

    const changeDir = (name) => {
        dispatch(setDataFolder(name))
        dispatch(setDataCurrentFolder(name))
        axios.post('http://localhost:5000/showFiles', { "path": folder + '/' + name })
            .then((res) => {
                let internalFile = creteObjInternalFiles(res.data)
                dispatch(setDataFiles(internalFile))
            })
    }

    const navigateBack = async () => {
        console.log(folder, storages.owner + '/' + 'Storage_' + storages.name)
        console.log('cur', currentFolder)
        if (folder === storages.owner + '/' + 'Storage_' + storages.name) {
            return -1
        }
        dispatch(navFolder(currentFolder))
        const tempData = folder.slice(0, folder.length - currentFolder.length - 1)
        console.log(tempData)
        axios.post('http://localhost:5000/showFiles', { "path": tempData })
            .then((res) => {
                let internalFile = creteObjInternalFiles(res.data)
                dispatch(setDataCurrentFolder_2(tempData))
                dispatch(setDataFiles(internalFile))
            })
    }

    const createDir = () => {
        changePage(7)
    }

    return activePage === 6 ? (
        <div className="show-file-cont">
            <div className="show-files-interior">
                <div className="upload_file">
                    <div id="block-interior-submenu">
                        <div className="block-top-files">
                            <h4 id="discription-block">
                                Хранилище: <span className="discription-storage">{storages.name}</span>
                                <br />
                                Владелец: <span className="discription-storage">{storages.owner}</span>
                            </h4>
                            {subscribedStorages.owner === '' && subscribedStorages.name === '' && (<div className="file-upload">
                                <button id="subscribe-storage-2" onClick={() => subscribe()}>Подписаться на изменения</button>
                            </div>)}
                            {subscribedStorages.owner != "" && subscribedStorages.name != "" && <div className="file-upload">
                                <button id="subscribe-storage-2" onClick={() => unsubscribe()}>Отписаться</button>
                            </div>}
                        </div>
                        <hr id="break-line-2" />
                        <div className="interor-block-menu">

                            {storages.type === 'Closed' && (
                                <div className="sec-interior-header">
                                    <label id="choose-file-label">
                                        Выберите файл
                                        <input type="file" ref={el} onChange={handleChange} id="butt-choose" />
                                    </label>
                                    <span id="hint-move-file">Или перетащите файлы в рабочую область</span>
                                    <button onClick={uploadFile} className="upbutton">
                                        Загрузить
                                    </button>
                                    <span className="progessBar">
                                        {progress}
                                    </span>
                                </div>)}
                            <div className="button-change-view">
                                <button className="icon-1" id="icon" onClick={() => handlerSetType(1)}>
                                    <img src={list}>

                                    </img>
                                </button>
                                <button id="icon" onClick={() => handlerSetType(2)}>
                                    <img src={icons}>

                                    </img>
                                </button>
                            </div>
                            <form id="search-file-form" >
                                <input name="file" onChange={(e) => searchFile(e)} placeholder="Поиск файла" id="search-file" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {drag && storages.type === 'Closed' && (
                <div className="drop-area" onDragStart={e => dragStartHandler(e)} onDragLeave={e => dragLeaveHandler(e)} onDragOver={e => dragStartHandler(e)} onDrop={e => onDropHandler(e)}>Отпустите файлы, чтобы загрузить их</div>
            )}
            {!drag && storages.type === 'Closed' && <div id="interior-block-files" onDragStart={e => dragStartHandler(e)} onDragLeave={e => dragLeaveHandler(e)} onDragOver={e => dragStartHandler(e)}>
                <div className="block-nav-but">
                    <button className="but-nav-storage" onClick={() => createDir()}>Создать каталог</button>
                    <button className="but-nav-storage-2" onClick={() => navigateBack()}>Назад</button>
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
            {storages.type === 'Open' && <div id="interior-block-files">
                <div className="block-nav-but">
                    <button className="but-nav-storage-2" onClick={() => navigateBack()}>Назад</button>
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
        </div>
    ) : null

}

export { ShowInternalFilesOthers }