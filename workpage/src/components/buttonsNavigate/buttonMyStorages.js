import { createContext, useContext, useEffect, useState } from "react"
import { PageContext } from "../PageContext"
import axios from 'axios';
let test 

const MyStorages = () => {
    const {activePage, changePage} = useContext(PageContext)
    useEffect(() => {
       axios.post('http://localhost:5000/getOwnerStorages', '', { withCredentials: true })
       .then((res) => {
        test = res.data.username
       })
    })

    return(
        <button id="nav-field" onClick={() => changePage(1)}>
            <div id="nav-field-cont">Мои хранилища</div>
        </button>
    )
}

export { MyStorages , test } 