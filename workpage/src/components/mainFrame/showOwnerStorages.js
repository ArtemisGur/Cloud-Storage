import { useContext, useState } from "react"
import { PageContext } from "../PageContext"
import { OwnerStorages } from '../buttonsNavigate/buttonMyStorages'
import axios from "axios"

let internalFiles = [ ]
let path

const OwnerStorage = () => {
    const { activePage, changePage } = useContext(PageContext)
    const handlerClick = (num) => {
        axios.post('http://localhost:5000/showFiles', {"owner" : OwnerStorages[num].owner, "name" : OwnerStorages[num].name})
        .then((res) => {
            creteObjInternalFiles(res.data)
            path = `${OwnerStorages[num].owner}/Storage_${OwnerStorages[num].name}`
        })
        .then(() => {
            changePage(4)
        })
    }

    let CreateStorageBlock = (
        <div className="create-storage-cont">
            <div className="create-storage-interior">
                <h2 id="header-create-page">Ваши хранилища</h2>
                <div id="create-interior">
                    {
                        OwnerStorages.map((OwnerStorages) => {
                            return (
                                <div className="button-storage-block" key={OwnerStorages.id}>
                                <label key={OwnerStorages.id}>
                                    <button className="button-storage" key={OwnerStorages.id} onClick={() => {handlerClick(OwnerStorages.key)}}>
                                        <div className="button-storage-interior" key={OwnerStorages.id}>
                                            <div className="but-storage-name" key={OwnerStorages.id}>{OwnerStorages.name}</div>
                                            <div className="but-storage-owner" key={OwnerStorages.id}>Владелец: <b>{OwnerStorages.owner}</b></div>
                                            <div className="but-storage-owner" key={OwnerStorages.id}>Тип: {OwnerStorages.type}</div>
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
    )

    if(activePage === 1){
        return CreateStorageBlock
    }
    else
        return null

    //return activePage === 1 ? CreateStorageBlock : null
}

const creteObjInternalFiles = (data, name) =>{
    internalFiles.length = 0
    for (let i = 0; i < data.length; i++){
        const date = data[i].createDate
        const slicedDate = date.slice(0, 10)
        const size = Math.floor(data[i].size / (1024))
        internalFiles.push({key: i, fullName: data[i].fullName, name: data[i].name, type: data[i].type, size: size, birthday: slicedDate})
    }
}

export { OwnerStorage, internalFiles, path }