import { useContext } from "react"
import { PageContext } from "./PageContext"

const CreateStorage = () => {
        
    const { activePage } = useContext(PageContext)

    return activePage === 0 ? <h1>победа</h1> : null
    
}

export { CreateStorage }