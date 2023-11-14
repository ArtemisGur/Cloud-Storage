import { useContext, useState } from "react"
import { PageContext } from "../PageContext"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"

const CreateDirPopup = () => {
    const { activePage, changePage } = useContext(PageContext)
    const [ dirName, setDirName ] = useState()
    let folder = useSelector((store) => store.folder.data)

    const close = () => {
        changePage(4)
    }

    const createDir = () => {
        axios.post('/createDir', {path : folder + '/' + dirName})
        changePage(4)
    }

    return activePage === 7 ? (
        <div id="popup">
            <div className="popup-content">
                <div className="popup-header">
                    <div className="popup-title">Создать новый каталог</div>
                    <button className="popup-close" onClick={() => {close()}}>X</button>
                </div>
                <input className="popup-input" type="text" placeholder="Введите название папки..." onChange={(e) => {setDirName(e.target.value)}}/>
                <button className="popup-create" onClick={() => {createDir()}}>Создать</button>
            </div>
        </div>
    ) : null
} 

export { CreateDirPopup }