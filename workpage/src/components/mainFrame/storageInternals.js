import axios from "axios"
import { PageContext } from "../PageContext"
import { path, creteObjInternalFiles } from "./showOwnerStorages"
import { useContext, useState } from "react"
import fileDownload from 'js-file-download'
import { setDataFolder, getDataFolder, setDataFolderFirst, navFolder, } from "../store/foldersSlice"
import { setDataCurrentFolder, setDataCurrentFolder_2 } from "../store/currentFolderSlice"
import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { deleteData, addFile } from '../store/internalFilesSlice'
import mimeFileType from "../store/mimeFileType"
import { setDataFiles } from '../store/internalFilesSlice'
import folderIcon from '../../img/folder.png'
import { changeDataUser, changeAllRoles, deleteDataUser } from "../store/userListSlice"
import { setDataUsers } from "../store/userListSlice"
import { setDataPasswordStorage } from "../store/changePasswordSlice"
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
import cross from '../../img/cross.png'

const creteObjUsers = (data) => {
    let userList = []
    for (let i = 0; i < data.length; i++) {
        userList.push({ key: i, userName: data[i].user, role: data[i].role })
    }
    return userList
}

const ShowInternalFiles = () => {
    const dispatch = useDispatch()
    let internalFiles = useSelector((store) => store.internalFile.data)
    let storages = useSelector((store) => store.ownStorages.data)
    let currentFolder = useSelector((store) => store.currentFolder.data)
    let folder = useSelector((store) => store.folder.data)
    let usersList = useSelector((store) => store.userList.data)
    let passwordStorage = useSelector((store) => store.changePassword.data)

    const { activePage, changePage } = useContext(PageContext)
    const [file, setFile] = useState('');
    const [progress, setProgess] = useState('Прогресс загрузки файла: 0');
    const [menu, setMenu] = useState(-1)
    const [showMenu, setShowMenu] = useState(false)
    const [showType, setShowType] = useState(2)
    const [modalWin, setModalWin] = useState(false)
    const [modalWinControll, setModalWinControll] = useState(false)
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

    const deleteFile = (fullName, fileName, key) => {

        axios.post('/deleteFile', { 'fullPath': fullName })
            .then(() => {
                dispatch(deleteData(key))
            })
    }

    const deleteFolder = (fullName, key) => {
        console.log(key)
        axios.post('/deleteFolder', { 'fullPath': fullName })
            .then(() => {
                dispatch(deleteData(key))
            })
    }

    const [showDelete, setShowDelete] = useState(false)

    const deleteStorage = () => {
        setShowDelete(!showDelete)
    }

    const deleteStorageConfirm = () => {
        axios.post('/deleteStorage', { 'owner': storages.owner, 'name': storages.name })
            .then((response) => {
                if (response) {
                    setShowDelete(false)
                    changePage(0)
                }
            })
    }

    const handlerSetType = (type) => {
        setShowType(type)
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

    const getUserList = () => {
        axios.post('http://localhost:5000/getUsersList', { "owner": storages.owner, "name": storages.name })
            .then((res) => {
                let userList = creteObjUsers(res.data)
                console.log(userList)
                dispatch(setDataUsers(userList))
                dispatch(setDataPasswordStorage(null))
            })
            .then(() => {
                setModalWinControll(true); 
                setNewPassword(null);
            })
    }

    async function createFormData(files, i) {
        return new Promise((resolve, reject) => {
            const formData = new FormData()
            formData.append('file', files)
            formData.append('path', folder)
            formData.append('fileName', files.name)
            formData.append('numFiles', internalFiles.length + i)
            resolve(formData)
        })

    }

    const viewFile = (fullName, type, name) => {
        const fileType = mimeFileType.get(type)
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
        if (folder === storages.owner + '/' + 'Storage_' + storages.name) {
            return -1
        }
        dispatch(navFolder(currentFolder))
        const tempData = folder.slice(0, folder.length - currentFolder.length - 1)
        axios.post('http://localhost:5000/showFiles', { "path": tempData })
            .then((res) => {
                let internalFile = creteObjInternalFiles(res.data)
                dispatch(setDataCurrentFolder_2(tempData))
                dispatch(setDataFiles(internalFile))
            })
    }

    const [dirName, setDirName] = useState()
    const [newPassword, setNewPassword] = useState()

    const createDir = () => {
        if (dirName === '') {
            return -1
        }
        axios.post('/createDir', { path: folder + '/' + dirName, name: dirName })
            .then(() => {
                axios.post('http://localhost:5000/showFiles', { "path": folder })
                    .then((res) => {
                        let internalFile = creteObjInternalFiles(res.data)
                        dispatch(setDataFiles(internalFile))
                    })
            })
            .then(() => {
                setModalWin(false)
            })
    }

    const changePassword = () => {
        if (newPassword === null || newPassword === '') {
            return -1
        }
        axios.post('/changeStoragePassword', { 'owner': storages.owner, 'name': storages.name, 'password': newPassword })
            .then(() => {
                dispatch(setDataPasswordStorage('Пароль успешно сменен'))
            })
    }

    const changeRole = (newRole, key, name) => {
        axios.post('/changeUserRole', { 'owner': storages.owner, 'name': storages.name, 'user': name, 'newRole': newRole })
            .then(() => {
                dispatch(changeDataUser({ 'key': key, 'role': newRole }))
            })
    }

    const changeRoleToAll = (newRole) => {
        axios.post('/changeAllRoles', { 'owner': storages.owner, 'name': storages.name, 'newRole': newRole })
        .then(() => {
            dispatch(changeAllRoles({ 'role': newRole }))
        })
    }

    const deleteUser = (name, key) => {
        axios.post('/excludeUser', { 'owner': storages.owner, 'name': storages.name, 'user': name })
        .then((res) => {
            if (res.data = 'OK'){
                dispatch(deleteDataUser(key))
            }
        })
    }

    return activePage === 4 ? (
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
            {modalWinControll && (<div id="popup">
                <div className="popup-content-controll">
                    <div className="popup-header">
                        <div className="popup-title-2">Управление хранилищем <b>{storages.name}</b></div>
                        <button className="popup-close" onClick={() => { setModalWinControll(false) }}>X</button>
                    </div>
                    <div className="interior-controll">
                        {storages.type != 'Open' && <div className="interior-controll-2">
                            <input className="popup-input-field" type="text" placeholder="Введите новый пароль хранилища..." onChange={(e) => { setNewPassword(e.target.value) }} />
                            <button className="popup-create-submit" onClick={() => { changePassword() }}>Сменить пароль</button>
                            <span className="success-change">{passwordStorage}</span>
                        </div>}
                        <div className="interior-controll-users-block">
                            <div className="interior-controll-users">
                                <div className="span-users-list">Список пользователей</div>
                                <div className="users-interior">
                                    {
                                        usersList.map((userList) => {
                                            return (
                                                <div className="user-in-list" key={userList.key}>
                                                    <span>{userList.userName}</span>
                                                    <div className="dropdown-role-block">
                                                        <button className="change-role">{userList.role === 'default' && 'Только просмотр'}
                                                            {userList.role === 'full' && 'Редактирование'}</button>
                                                        <div className="dropdown-role">
                                                            <div>
                                                                <button className="change-role-field" onClick={() => { changeRole('default', userList.key, userList.userName) }}>Только просмотр</button>
                                                            </div>
                                                            <div>
                                                                <button className="change-role-field" onClick={() => { changeRole('full', userList.key, userList.userName) }}>Редактирование</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <img className="cross-pic" src={cross} onClick={() => deleteUser(userList.userName, userList.key)}/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="interior-controll-users">
                                <div className="span-users-list">Вы можете назначить роль сразу для всех пользователей</div>
                                <div><button className="button-change-role" onClick={() => changeRoleToAll('default')}>Только просмотр</button></div>
                                <div><button className="button-change-role" onClick={() => changeRoleToAll('full')}>Редактирование содержимого хранилища</button></div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>)}
            {!modalWinControll && <div className="show-files-interior">
                <div className="upload_file">
                    <div id="block-interior-submenu">
                        <div className="block-top-files">
                            <h4 id="discription-block">
                                Хранилище: <span className="discription-storage">{storages.name}</span>
                                <br />
                                Владелец: <span className="discription-storage">Вы</span>
                            </h4>
                            <div className="file-upload">
                                {storages.type != 'Personality' && <div id="hrefSetting" onClick={() => { getUserList() }}>&#9881;</div>}
                                {showDelete && (
                                    <div id="delete-confirmation">Вы уверены?<button id="storage-delete-2" onClick={() => { deleteStorageConfirm() }}>✓</button></div>
                                )}
                                <button id="storage-delete" onClick={() => deleteStorage()}>🗑️</button>
                            </div>
                        </div>
                        <hr id="break-line-2" />
                        <div className="interor-block-menu">
                            <form id="search-file-form">
                                <input name="file" onChange={(e) => searchFile(e)} placeholder="Поиск файла" id="search-file" />
                            </form>

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

                        </div>

                    </div>

                </div>
            </div>}

            {drag && !modalWin && (
                <div className="drop-area" onDragStart={e => dragStartHandler(e)} onDragLeave={e => dragLeaveHandler(e)} onDragOver={e => dragStartHandler(e)} onDrop={e => onDropHandler(e)}>Отпустите файлы, чтобы загрузить их</div>
            )}
            {!drag && !modalWin && !modalWinControll && <div id="interior-block-files" onDragStart={e => dragStartHandler(e)} onDragLeave={e => dragLeaveHandler(e)} onDragOver={e => dragStartHandler(e)}>
                <div className="block-nav-but">
                    <button className="but-nav-storage-2" onClick={() => navigateBack()}>↶</button>
                    <button className="but-nav-storage" onClick={() => { setModalWin(true); setDirName('') }}>Создать каталог</button>
                    <label id="choose-file-label">
                        <input type="file" ref={el} onChange={handleChange} id="butt-choose" />+
                    </label>
                    <span className="progessBar">
                        {progress}
                    </span>
                    <span id="path-navigation">{folder}</span>
                </div>

                {showType === 1 && (
                    <div id="interior-block-files-2">
                        <div className="test_2">
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
                                            <div id="file-interior" onDoubleClick={() => { internalFiles.type !== 'folder' && viewFile(internalFiles.fullName, internalFiles.type, internalFiles.name); internalFiles.type === 'folder' && changeDir(internalFiles.name) }} onMouseEnter={() => { setMenu(internalFiles.key); setShowMenu(true) }} onMouseLeave={() => { setShowMenu(false); setMenu(-1) }}>
                                                <div id="file-name" key={internalFiles.id}>{internalFiles.name}</div>
                                                <div id="file-type" key={internalFiles.id}>{internalFiles.type}</div>
                                                <div id="file-date" key={internalFiles.id}>{internalFiles.birthday}</div>
                                                <div id="file-size" key={internalFiles.id}>{internalFiles.size}</div>
                                                {menu === internalFiles.key && showMenu && internalFiles.type !== 'folder' && (
                                                    <div id="myDropdown" className="dropdown-content">
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
                                                {menu === internalFiles.key && internalFiles.type === 'folder' && (
                                                    <div id="myDropdown" className="dropdown-content">
                                                        <div className="file-menu-block">
                                                            <button className="file-menu-but" onClick={() => { deleteFolder(internalFiles.fullName, internalFiles.key) }}>Удалить</button>
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
                                                    </div>
                                                )}
                                            </div>
                                            {(<div className="test">
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
                                                {menu === internalFiles.key && internalFiles.type === 'folder' && (
                                                    <div className="dropdown-content-2">
                                                        <div className="disctiption-block">
                                                            <div className="discripion-file">Тип файла: {internalFiles.type}</div>
                                                            <div className="discripion-file">Дата создания {internalFiles.birthday}</div>
                                                        </div>
                                                        <div className="file-menu-block">
                                                            <button className="file-menu-but" onClick={() => { deleteFolder(internalFiles.fullName, internalFiles.key) }}>Удалить</button>
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

export { ShowInternalFiles }