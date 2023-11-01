import { createContext, useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { PageContext } from "../PageContext"
import axios from 'axios';
import { setData } from "../store/storagesSlice"

const MyStorages = () => {
    const {activePage, changePage} = useContext(PageContext)
    const dispatch = useDispatch()

    const handlerClick = () => {
        axios.post('http://localhost:5000/getOwnerStorages', '', { withCredentials: true })
       .then((res) => {
            let data = createOwnStorageObject(res.data)
            dispatch(setData(data))
            console.log(data)
       })
       .then(() => {
            changePage(1)
       })
    }

    return(
        <button id="nav-field" onClick={handlerClick}>
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

