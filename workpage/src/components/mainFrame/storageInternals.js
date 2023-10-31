import axios from "axios"
import { PageContext } from "../PageContext"
import { internalFiles, path } from "./showOwnerStorages"
import { useContext, useState } from "react"
import fileDownload from 'js-file-download'
import React, { useRef } from 'react';

const ShowInternalFiles = () => {

    const { activePage, changePage } = useContext(PageContext)
    const [file, setFile] = useState('');
    const [progress, setProgess] = useState(0);
    const el = useRef();
    const [menu, setMenu] = useState(-1)
    const [showMenu, setShowMenu] = useState(false)

    const handleChange = (e) => {
        setProgess(0)
        const file = e.target.files[0];
        console.log(file);
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
        }).then(res => {
            console.log(res)
        }).catch(err => console.log(err))
    }

    function download(fullName, fileName) {

        axios.post('/downloadFile', {'fullPath' : fullName}, { responseType: 'blob'} )
        .then((res) => {
            fileDownload(res.data, fileName)
        })
        
      }

    let CreateFileBlock = (
        <div className="show-file-cont">
            <div className="show-files-interior">
                <div className="back-to-storages">
                    <label className="upload-file-label">Назад</label>
                    <input type="action" className="file-upload-input" />
                </div>
                <div className="upload_file">
                    <div id="block-interior-submenu">
                        <div className="file-upload">
                        
                            <button onClick={uploadFile} className="upbutton">
                                Загрузить в хранилище
                            </button>
                            <div className="progessBar">
                                {progress}
                            </div>
                            <input type="file" ref={el} onChange={handleChange} id="butt-choose" />
                            
                        </div>
                    </div>
                </div>

            </div>
            <div className="file-params">
                <div id="file-prop-name">Название</div>
                <div id="file-prop-type">Тип</div>
                <div id="file-prop-date">Дата создания</div>
                <div id="file-prop-size">Размер(Кб)</div>
            </div>
            <div id="interior-block-files">
                {
                    internalFiles.map((internalFiles) => {
                        {
                            return (
                                <div id="file-interior" onClick={() => {setMenu(internalFiles.key)}}>
                                    <div id="file-name" key={internalFiles.id}>{internalFiles.name}</div>
                                    <div id="file-type" key={internalFiles.id}>{internalFiles.type}</div>
                                    <div id="file-date" key={internalFiles.id}>{internalFiles.birthday}</div>
                                    <div id="file-size" key={internalFiles.id}>{internalFiles.size}</div>
                                    {menu === internalFiles.key && (
                                        <div id="myDropdown" class="dropdown-content">
                                            <div className="file-menu-block">
                                                <button className="file-menu-but" onClick={() => {download(internalFiles.fullName, internalFiles.name)}}>Скачать</button>
                                            </div>
                                            <div className="file-menu-block">
                                                <button className="file-menu-but">Предосмотр</button>
                                            </div>
                                            <div className="file-menu-block">
                                                <button className="file-menu-but">Удалить</button>
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
    )

    if (activePage === 4) {
        return CreateFileBlock
    }
    else
        return null

}

export { ShowInternalFiles }