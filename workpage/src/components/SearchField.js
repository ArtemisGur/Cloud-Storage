import { PageContext } from "../components/PageContext"
import { setData } from "./store/searchSlice"
import { useContext, useState } from "react"
import { createOwnStorageObject } from "./buttonsNavigate/buttonMyStorages"
import { useDispatch, useSelector } from "react-redux"
import { setDataStorageType } from "./store/storageTypePasswordSlice"
import axios from 'axios';

const SearchField = () => {
    const dispatch = useDispatch()
    let [click, setClick] = useState('Поиск хранилища')
    const { activePage, changePage } = useContext(PageContext)
    const handlerSearch = (e) => {
        dispatch(setDataStorageType({ 'show' : false }))
        document.getElementById('nav-field-my').style.background = ""
        document.getElementById('nav-field-enable').style.background = ""
        e.preventDefault()
        axios.post('/searchStorages', {'storageName' : e.target.storageName.value})
        .then((res) => {
            let data = createOwnStorageObject(res.data)
            dispatch(setData(data))
        })
        .then(() => {
            //document.getElementById("search-field").value = ''
            changePage(5)
        })
    }

    return(
        <div className="search-cont">
            <form onSubmit={handlerSearch} id="enter">
                <input id="search-field" name="storageName" placeholder={click} onBlur={() => setClick(click='Поиск хранилища')} onClick={() => setClick(click='')}></input>
            </form>
        </div>
    )
}

export default SearchField