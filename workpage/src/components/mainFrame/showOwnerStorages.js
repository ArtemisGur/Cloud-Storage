import { useContext, useState } from "react"
import { PageContext } from "../PageContext"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setData } from '../store/internalFilesSlice'

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

const OwnerStorage = () => {
    const dispatch = useDispatch()
    let storages = useSelector((store) => store.storages.data)
    console.log(storages)
    const { activePage, changePage } = useContext(PageContext)
    const handlerClick = (num) => {
        axios.post('http://localhost:5000/showFiles', { "owner": storages[num].owner, "name": storages[num].name })
            .then((res) => {
                let internalFile = creteObjInternalFiles(res.data)
                path = `${storages[num].owner}/Storage_${storages[num].name}`
                dispatch(setData(internalFile))
            })
            .then(() => {
                changePage(4)
            })
    }

    return activePage === 1 ? (
        <div className="create-storage-cont">
        <div className="create-storage-interior">
            <h2 id="header-create-page">Ваши хранилища</h2>
            <div id="create-interior">
                {
                    storages.map((storages) => {
                        return (
                            <div className="button-storage-block" key={storages.id}>
                                <label>
                                    <button className="button-storage" onClick={() => handlerClick(storages.key)}>
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

export { OwnerStorage, path, creteObjInternalFiles }