import { PageContext } from "../components/PageContext"
import { useContext, useState } from "react"
import { createOwnStorageObject } from "./buttonsNavigate/buttonMyStorages"
import axios from 'axios';

const SearchField = () => {

    let [click, setClick] = useState('Поиск хранилища')
    const { activePage, changePage } = useContext(PageContext)

    const handlerSearch = (e) => {
        e.preventDefault()
        console.log(e.target.storageName.value)
        axios.post('/searchStorages', {'storageName' : e.target.storageName.value})
        .then((res) => {
            createOwnStorageObject(res.data)
        })
        .then(() => {
            changePage(1)
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