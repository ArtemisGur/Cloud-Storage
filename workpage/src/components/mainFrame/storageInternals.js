import axios from "axios"
import { PageContext } from "../PageContext"
import { path, creteObjInternalFiles } from "./showOwnerStorages"
import { useContext, useState } from "react"
import fileDownload from 'js-file-download'
import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { deleteData, addFile } from '../store/internalFilesSlice'
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

const ShowInternalFiles = () => {
    const dispatch = useDispatch()
    let internalFiles = useSelector((store) => store.internalFile.data)
    let storages = useSelector((store) => store.ownStorages.data)
    const { activePage, changePage } = useContext(PageContext)
    const [file, setFile] = useState('');
    const [progress, setProgess] = useState(0);
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
        formData.append('file', file)
        formData.append('path', path)
        axios.post('http://localhost:5000/uploadNewFiles', formData, {
            onUploadProgress: (ProgressEvent) => {
                let progress = Math.round(
                    ProgressEvent.loaded / ProgressEvent.total * 100
                ) + '%';
                setProgess(progress)
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

        axios.post('/deleteFile', { 'fullPath': fullName }, { responseType: 'blob' })
            .then(() => {
                dispatch(deleteData(key))
            })
    }

    const [showDelete, setShowDelete] = useState(false)

    const deleteStorage = () => {
        setShowDelete(!showDelete)
    }

    const deleteStorageConfirm = () => {
        axios.post('/deleteStorage', { 'owner' : storages.owner, 'name' : storages.name })
        .then((response) => {
            if(response){
                console.log(storages.key)
                setShowDelete(false)
                changePage(0)
            }
        })
    }

    const handlerSetType = (type) => {
        setShowType(type)
    }

    return activePage === 4 ? (
        <div className="show-file-cont">
            <div className="show-files-interior">
                <div className="upload_file">
                    <div id="block-interior-submenu">
                        <div className="block-top-files">
                            <h4 id="discription-block">
                                Хранилище: <span className="discription-storage">{storages.name}</span>
                                <br />
                                Владелец: <span className="discription-storage">Вы</span>
                            </h4>
                            <div className="file-upload">
                            {showDelete && (
                                    <div id="delete-confirmation">Вы уверены?<button id="storage-delete" onClick={() => { deleteStorageConfirm() }}>Да</button></div>
                                )}
                                <button id="storage-delete" onClick={() => deleteStorage()}>Удалить Хранилище</button>
                                
                            </div>

                        </div>

                        <hr id="break-line-2" />
                        <div className="interor-block-menu">
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
                            <div className="sec-interior-header">
                                <label id="choose-file-label">
                                    Выберите файл
                                    <input type="file" ref={el} onChange={handleChange} id="butt-choose" />
                                </label>
                                <span className="progessBar">
                                    {progress}
                                </span>
                                <button onClick={uploadFile} className="upbutton">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="interior-block-files">
                {showType === 1 && (
                    <div>
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
                                        <div id="file-interior" onMouseEnter={() => { setMenu(internalFiles.key); setShowMenu(true) }} onMouseLeave={() => { setShowMenu(false); setMenu(-1) }}>
                                            <div id="file-name" key={internalFiles.id}>{internalFiles.name}</div>
                                            <div id="file-type" key={internalFiles.id}>{internalFiles.type}</div>
                                            <div id="file-date" key={internalFiles.id}>{internalFiles.birthday}</div>
                                            <div id="file-size" key={internalFiles.id}>{internalFiles.size}</div>
                                            {menu === internalFiles.key && showMenu && (
                                                <div id="myDropdown" className="dropdown-content">
                                                    <div className="file-menu-block">
                                                        <button className="file-menu-but" onClick={() => { downloadFile(internalFiles.fullName, internalFiles.name) }}>Скачать</button>
                                                    </div>
                                                    <div className="file-menu-block">
                                                        <button className="file-menu-but" onClick={() => { deleteFile(internalFiles.fullName, internalFiles.name, internalFiles.key) }}>Удалить</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>)
                }
                {showType === 2 && (
                    <div id="file-interior-with-img">
                        {
                            internalFiles.map((internalFiles) => {
                                {
                                    return (
                                        <div className="file-block" onMouseEnter={() => { setMenu(internalFiles.key); setShowMenu(true) }} onMouseLeave={() => { setShowMenu(false); setMenu(-1) }} >
                                            <div className="test">
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
                                                <div className="file-name-2">{internalFiles.name}</div>
                                                <div className="dropdown-interior-2">
                                                </div>
                                                {menu === internalFiles.key && (
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
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>)
                }
            </div>
        </div>
    ) : null

}

export { ShowInternalFiles }