import {  useContext, } from "react"
import { useDispatch, useSelector } from "react-redux"
import { PageContext } from "../PageContext"
import axios from 'axios';
import { createOwnStorageObject } from './buttonMyStorages'
import { setDataOwn } from '../store/ownStorageSlice'
import { setData } from "../store/storagesSlice"

const EnabledStorages = () => {

    const { activePage, changePage } = useContext(PageContext)
    const dispatch = useDispatch()

    const handlerClick = () => {
        document.getElementById('nav-field-enable').style.background = "#ddecf5"
        document.getElementById('nav-field-my').style.background = ""

        axios.post('http://localhost:5000/getEnableStorages', '', { withCredentials: true })
            .then((res) => {
                console.log(res)
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