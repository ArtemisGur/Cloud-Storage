import {  useContext, } from "react"
import { useDispatch } from "react-redux"
import { PageContext } from "../PageContext"
import axios from 'axios';
import { createOwnStorageObject } from './buttonMyStorages'
import { setDataOwn } from '../store/ownStorageSlice'
import { setData } from "../store/storagesSlice"

const EnabledStorages = () => {

    const { activePage, changePage } = useContext(PageContext)
    const dispatch = useDispatch()

    const handlerClick = () => {
        document.getElementById('nav-field-enable').style.background = "#E6D1FF"
        document.getElementById('nav-field-my').style.background = ""

        axios.post('/storageRouter/getEnableStorages', '', { withCredentials: true })
            .then((res) => {
                let data = createOwnStorageObject(res.data)
                dispatch(setData(data))
                dispatch(setDataOwn({ user : data.user}))
            })
            .then(() => {
                changePage(2)
            })

    }
    return (
        <button id="nav-field-enable" onClick={handlerClick}>
            <div id="nav-field-cont">Доступные мне</div>
        </button>
    )
}

export default EnabledStorages