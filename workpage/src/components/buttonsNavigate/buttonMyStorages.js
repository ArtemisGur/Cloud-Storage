import { createContext, useContext, useEffect, useState } from "react"
import { PageContext } from "../PageContext"
import axios from 'axios';

let OwnerStorages = [ ]

const MyStorages = () => {
    const {activePage, changePage} = useContext(PageContext)
    useEffect(() => {
       axios.post('http://localhost:5000/getOwnerStorages', '', { withCredentials: true })
       .then((res) => {
        createOwnStorageObject(res.data)
       })
    })

    return(
        <button id="nav-field" onClick={() => changePage(1)}>
            <div id="nav-field-cont">Мои хранилища</div>
        </button>
    )
}

const createOwnStorageObject = (data) => {
    OwnerStorages.length = 0
    for (let i = 0; i < data.length; i++){
        OwnerStorages.push({key: i, owner: data[i].owner, name: data[i].name, type: data[i].type})
    }
}

export { MyStorages, OwnerStorages } 

