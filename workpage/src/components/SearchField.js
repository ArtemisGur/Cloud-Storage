import { useState } from "react"

const SearchButton = () => {

    let [click, setClick] = useState('Поиск по хранилищу')

    return(
        <div className="search-cont">
            <input id="search-field" placeholder={click} onBlur={() => setClick(click='Поиск по хранилищу')} onClick={() => setClick(click='')}></input>
        </div>
    )
    
}

export default SearchButton