import { useState } from "react"

const SearchField = () => {

    let [click, setClick] = useState('Поиск хранилища')

    return(
        <div className="search-cont">
            <input id="search-field" placeholder={click} onBlur={() => setClick(click='Поиск хранилища')} onClick={() => setClick(click='')}></input>
        </div>
    )
}

export default SearchField