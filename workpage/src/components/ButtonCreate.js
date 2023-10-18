import { createContext, useContext, useEffect, useState } from "react"

import { PageContext } from "./PageContext"

const ButtonCreateStorage = () => {
    const {activePage, changePage} = useContext(PageContext)

    return(
        <div className="but-create-cont">
            <button id="but-create" onClick={() => changePage(0)}>
                <b>+</b> Создать хранилище
            </button>
        </div>
    )
}
export default ButtonCreateStorage