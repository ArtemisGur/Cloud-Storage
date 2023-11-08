import { useContext, useState } from "react"
import { PageContext } from "../PageContext"
import { creteObjInternalFiles } from './showOwnerStorages'
import { useDispatch, useSelector } from "react-redux"
import { setDataFiles } from "../store/internalFilesSlice"
import { setData } from "../store/storagesSlice"
import { setDataOwn } from "../store/ownStorageSlice"
import { setDataSubscribed } from "../store/subscribedStorageSlice"
import axios from "axios"

const SearchStorageCont = () => {
    const { activePage, changePage } = useContext(PageContext)
    const [storage, setStorage] = useState(-1)
    const [showStorage, setShowStorage] = useState(false)
    const [hint, setHint] = useState(false)
    const dispatch = useDispatch()
    let searchedStorages = useSelector((store) => store.searchedStorages.data)
    const handlerClick = (num, type, owner, name) => {
        axios.post('http://localhost:5000/checkStorage', { "owner": owner, "name": name }, {withCredentials: true})
        .then((res) => {
            dispatch(setDataSubscribed({ "owner" : res.data.owner, "name" : res.data.name}))
        })

        setHint(false)
        if (type === 'Closed') {
            setShowStorage(!showStorage)
            return -1
        }
        axios.post('http://localhost:5000/showFiles', { "owner": searchedStorages[num].owner, "name": searchedStorages[num].name })
            .then((res) => {
                let internalFile = creteObjInternalFiles(res.data)
                dispatch(setDataFiles(internalFile))
                dispatch(setDataOwn({ "name" : name, "type": type, "owner": owner }))
            })
            .then(() => {
                changePage(6)
            })
    }

    const submitPassword = (e) => {
        e.preventDefault()

        axios.post('http://localhost:5000/checkStorage', { "owner": e.target.owner.value, "name": e.target.name.value }, {withCredentials: true})
        .then((res) => {
            dispatch(setDataSubscribed({ "owner" : res.data.owner, "name" : res.data.name}))
        })

        axios.post('http://localhost:5000/confirmPasswordStorage', { "owner": e.target.owner.value, "name": e.target.name.value, "password" : e.target.passwordStorage.value })
        .then((res) => {
            if (res.status === 202){
                setHint(true)             
                return -1
            }
            else{
                let internalFile = creteObjInternalFiles(res.data)
                dispatch(setDataFiles(internalFile))
                dispatch(setDataOwn({ "name" : e.target.name.value, "type": e.target.type.value, "owner": e.target.owner.value }))
            }
        })
        .then((res) => {
            if(res === -1){
                return 0
            }
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
                                        <button className="button-storage" key={searchedStorages.id} onClick={() => { handlerClick(searchedStorages.key, searchedStorages.type, searchedStorages.owner, searchedStorages.name); setStorage(searchedStorages.key) }} >
                                            <div className="button-storage-interior" key={searchedStorages.id}>
                                                <div className="but-storage-name" key={searchedStorages.id}>{searchedStorages.name}</div>
                                                <div className="but-storage-owner" key={searchedStorages.id}>Владелец: <b>{searchedStorages.owner}</b></div>
                                                <div className="but-storage-owner" key={searchedStorages.id}>Тип: {searchedStorages.type}</div>
                                            </div>
                                        </button>
                                    </label>
                                    {storage === searchedStorages.key && showStorage && (
                                        <form onSubmit={submitPassword}>
                                            <div>
                                                <br />
                                                <div id="password-header-hint">Пароль для хранилища</div>
                                                <input id="password-for-storage-hint" name="passwordStorage" type="password" />
                                                <input className="hidden-data" name="owner" value={searchedStorages.owner}/>
                                                <input className="hidden-data" name="name" value={searchedStorages.name}/>
                                                <input className="hidden-data" name="type" value={searchedStorages.type}/>
                                                <button id="button-input-password-storage">Войти</button>
                                                {hint && (
                                                    <div id="hint-password-message">
                                                        Введен неправильный пароль
                                                    </div>
                                                )}
                                            </div>
                                        </form>
                                    )}
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