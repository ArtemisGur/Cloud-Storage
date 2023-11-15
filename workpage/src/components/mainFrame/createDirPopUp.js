import { useContext, useState } from "react"
import { PageContext } from "../PageContext"
import { useDispatch, useSelector } from "react-redux"
import { addFile } from '../store/internalFilesSlice'
import axios from "axios"

const CreateDirPopup = () => {
    const { activePage, changePage } = useContext(PageContext)
    const [ dirName, setDirName ] = useState()
    let folder = useSelector((store) => store.folder.data)
    const dispatch = useDispatch()
    const close = () => {
        changePage(4)
    }

    const createDir = () => {
        axios.post('/createDir', {path : folder + '/' + dirName, name: dirName})
        .then((res) => {
            dispatch(addFile(res))
            return res
        })
        .then((res) => {
            console.log({path : folder + '/' + dirName})
            //changePage(4)
        })
    }

    // return activePage === 7 ? (
        
    // ) : null
} 

export { CreateDirPopup }