import { useContext } from "react"
import { setDataHintIncorrect } from "../store/hintIncorrectSlice"
import { setDataHintEmpty } from "../store/hintEmptySlice"
import { setDataHintCorrect } from "../store/hintCorrectSlice"
import { PageContext } from "../PageContext"
import { useDispatch } from "react-redux"

const ButtonCreateStorage = () => {
    
    const {activePage, changePage} = useContext(PageContext)
    const dispatch = useDispatch()
    const clickHandler = () => {
        document.getElementById('nav-field-my').style.background = ""
        document.getElementById('nav-field-enable').style.background = ""
        dispatch(setDataHintIncorrect(""))
        dispatch(setDataHintEmpty(""))
        dispatch(setDataHintCorrect(""))
        changePage(0)
    }

    return(
        <div className="but-create-cont">
            <button id="but-create" onClick={() => clickHandler()}>
                <b>+</b> Создать хранилище
            </button>
        </div>
    )
}
export default ButtonCreateStorage