import { useContext, useState } from "react"
import { PageContext } from "../PageContext"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setDataFiles } from '../store/internalFilesSlice'
import { setDataOwn } from "../store/ownStorageSlice"
import { setDataSubscribed } from "../store/subscribedStorageSlice"
import { setDataFolderFirst } from "../store/foldersSlice"
import { setDataCurrentFolder } from "../store/currentFolderSlice"
import { setUserRole } from "../store/roleSlice"
import { setDataCurrentStorage } from "../store/currentStoragesSlice"

let path

const creteObjInternalFiles = (data, name) => {
    let internalFiles = []
    for (let i = 0; i < data.length; i++) {
        const date = data[i].createDate
        const slicedDate = date.slice(0, 10)
        const size = Math.floor(data[i].size / (1024))
        internalFiles.push({ key: i, fullName: data[i].fullName, name: data[i].name, type: data[i].type, size: size, birthday: slicedDate })
    }
    return internalFiles
}

const EnableStorages = () => {
    const dispatch = useDispatch()

    let storages = useSelector((store) => store.storages.data)
    const { activePage, changePage } = useContext(PageContext)

    const handlerClick = (num, type, owner, name) => {

        axios.post('/storageRouter/checkStorage', { "owner": storages[num].owner, "name": storages[num].name }, {withCredentials: true})
        .then((res) => {
            dispatch(setDataSubscribed({ "owner" : res.data.owner, "name" : res.data.name}))
            console.log(res.data.role)
            dispatch(setUserRole(res.data.role))
        })
        .then(() => {
            axios.post('/fileRouter/showFiles', { "path": owner + '/Storage_' + name })
            .then((res) => {
                let internalFile = creteObjInternalFiles(res.data)
                path = `${storages[num].owner}/Storage_${storages[num].name}`
                dispatch(setDataFiles(internalFile))
            })
            .then(() => {
                dispatch(setDataCurrentStorage({'owner' : owner, 'name' : name}))
                dispatch(setDataFolderFirst(owner + '/' + 'Storage_' + name))
                dispatch(setDataCurrentFolder('Storage_' + name + '/'))
                dispatch(setDataOwn({ 'name': name, 'type': type, 'owner': owner }))
            })
            .then(() => {
                changePage(6)
            })
        })
        
    }

    return activePage === 2 ? (
        <div className="create-storage-cont">
            <div className="create-storage-interior">
                <h2 id="header-create-page">Доступные хранилища</h2>
                <div id="create-interior">
                    {
                        storages.map((storages) => {
                            return (
                                <div className="button-storage-block" key={storages.id}>
                                    <label>
                                        <button className="button-storage" onClick={() => handlerClick(storages.key, storages.type, storages.owner, storages.name)}>
                                            <div className="button-storage-interior">
                                                <div className="but-storage-name">{storages.name}</div>
                                                <div className="but-storage-owner">Владелец: <b>{storages.owner}</b></div>
                                                <div className="but-storage-owner">Тип: {storages.type}</div>
                                            </div>
                                        </button>
                                    </label>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    ) : null
}

export { EnableStorages, path, creteObjInternalFiles }