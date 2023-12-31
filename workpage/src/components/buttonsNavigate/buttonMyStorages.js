import { useContext} from "react"
import { useDispatch } from "react-redux"
import { PageContext } from "../PageContext"
import axios from 'axios';
import { setData } from "../store/storagesSlice"

const MyStorages = () => {
    const {activePage, changePage} = useContext(PageContext)
    const dispatch = useDispatch()

    const handlerClick = () => {
        document.getElementById('nav-field-my').style.background = "#E6D1FF"
        document.getElementById('nav-field-enable').style.background = ""
        axios.post('/storageRouter/getOwnerStorages', '', { withCredentials: true })
       .then((res) => {
            let data = createOwnStorageObject(res.data)
            dispatch(setData(data))
       })
       .then(() => {
            changePage(1)
       })
    }

    return(
        <button id="nav-field-my" onClick={handlerClick}>
            <div id="nav-field-cont">Мои хранилища</div>
        </button>
    )
}

const createOwnStorageObject = (data) => {
    let OwnerStorages = []
    for (let i = 0; i < data.length; i++){
        OwnerStorages.push({key: i, owner: data[i].owner, name: data[i].name, type: data[i].type})
    }
    return OwnerStorages
}

export { MyStorages, createOwnStorageObject } 

