import { createContext, useState } from "react";

const PageContext = createContext()

function PageProvider({children}){
    const [activePage, setActivePage] = useState()

    const changePage = (index) => {
        setActivePage(index)
    }

    return(
        <PageContext.Provider value={{ activePage, changePage }}>
            {children}
        </PageContext.Provider>
    )
}

export { PageProvider, PageContext }