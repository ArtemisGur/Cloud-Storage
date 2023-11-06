import { useContext, useState } from "react"
import { PageContext } from "../PageContext"
import { creteObjInternalFiles } from './showOwnerStorages'
import { useDispatch, useSelector } from "react-redux"
import { setDataFiles } from "../store/internalFilesSlice"
import { setData } from "../store/storagesSlice"
import axios from "axios"

const SearchStorageCont = () => {
    const { activePage, changePage } = useContext(PageContext)
    const dispatch = useDispatch()
    let searchedStorages = useSelector((store) => store.searchedStorages.data)
    
    const handlerClick = (num, type, owner, name) => {
        axios.post('http://localhost:5000/showFiles', {"owner" : searchedStorages[num].owner, "name" : searchedStorages[num].name})
        .then((res) => {
            let internalFile = creteObjInternalFiles(res.data)
            dispatch(setDataFiles(internalFile))
            dispatch(setData({'name' : name, 'type' : type, 'owner' : owner}))
        })
        .then(() => {
            changePage(6)
        })
    }

    return activePage === 5 ? (
        <div className="create-storage-cont">
        <div className="create-storage-interior">
            <h2 id="header-create-page">Найденные хранилища</h2>
            <div id="create-interior">
                {
                    searchedStorages.map((searchedStorages) => {
                        return (
                            <div className="button-storage-block" key={searchedStorages.id}>
                            <label key={searchedStorages.id}>
                                <button className="button-storage" key={searchedStorages.id} onClick={() => handlerClick(searchedStorages.key, searchedStorages.type, searchedStorages.owner, searchedStorages.name)}>
                                    <div className="button-storage-interior" key={searchedStorages.id}>
                                        <div className="but-storage-name" key={searchedStorages.id}>{searchedStorages.name}</div>
                                        <div className="but-storage-owner" key={searchedStorages.id}>Владелец: <b>{searchedStorages.owner}</b></div>
                                        <div className="but-storage-owner" key={searchedStorages.id}>Тип: {searchedStorages.type}</div>
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

export { SearchStorageCont }