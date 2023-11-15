import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { PageContext } from "../PageContext"
import { setDataHintIncorrect } from "../store/hintIncorrectSlice"
import { setDataHintEmpty } from "../store/hintEmptySlice"
import { setDataHintCorrect } from "../store/hintCorrectSlice"
import axios from 'axios';

const CreateStorage = () => {

    const [checked, setChecked] = useState(false)
    const [type, setType] = useState(null)
    const [password, setPassword] = useState(false)
    const [hint, setHint] = useState(false)
    const [hintEmpty, setHintEmpty] = useState(false)
    const { activePage, changePage } = useContext(PageContext)
    const dispatch = useDispatch()

    let hint_1 = useSelector((store) => store.hintEmpty.data)
    let hint_2 = useSelector((store) => store.hintIncorrect.data)
    let hint_3 = useSelector((store) => store.hintCorrect.data)
    console.log(hint_1, hint_2)

    let passwordForStorage = null
    let hintName = null
    let hintNameEmpty = null

    const hintHandler_2 = () => {
        setHintEmpty(true)
    }

    const hintHandler = () => {
        setHint(true)
    }

    const clickHandler = () => {
        setChecked(!checked)
    }

    if (hint) {
        hintName = (
            <div id="hint-storage-create">
                <div>Не было указано имя хранилища или его тип</div>
            </div>
        )
    }

    if (hintEmpty) {
        hintNameEmpty = (
            <div id="hint-storage-create">
                <div>Вы уже создали хранилище с таким названием</div>
            </div>
        )
    }

    if (checked) {
        passwordForStorage = (
            <div id="closed-storage-block">
                <br />
                <div id="password-header-hint">Пароль для хранилища</div>
                <input id="password-for-storage-hint" name="passwordStorage" type="password" />
            </div>
        )
    }

    const handlerSubmit = (event) => {
        let data
        event.preventDefault()
        if (password) {
            data = {
                "nameStorage": event.target.nameStorage.value,
                "typeStorage": type,
                "password": event.target.passwordStorage.value
            }
        }
        else {
            data = {
                "nameStorage": event.target.nameStorage.value,
                "typeStorage": type
            }
        }
        axios.post('http://localhost:5000/getNewStorage', { "newStorage": data }, { withCredentials: true })
            .then((response) => {
                console.log(response.data.isEmpty)
                if (response.data.stat === 202) {
                    dispatch(setDataHintIncorrect("Не было указано имя хранилища или его тип"))
                }
                if (response.data.isEmpty === false) {
                    dispatch(setDataHintEmpty("Вы уже создали хранилище с таким названием"))
                }
                else if (response.data.isEmpty === true) {
                    dispatch(setDataHintCorrect("Хранилище успешно создано"))
                }

            })

    }

    let CreateStorageBlock = (
        <div className="create-storage-cont">
            <div className="create-storage-interior">
                <h2 id="header-create-page">Создание хранилища</h2>
                <div id="create-interior">
                    <form onSubmit={handlerSubmit}>
                        <div className="header-span">
                            <span>Название хранилища</span>
                            <br />
                            <input id="name-storage-create" name="nameStorage" />
                        </div>
                        <br />
                        <div className="header-span">
                            <span>Тип хранилища</span>
                        </div>
                        <div id="type-storage-cont">
                            <div className="checkbox-type-storage">
                                <label className="label-type">
                                    <span className="span-type-storage">Открытое</span>
                                    <input type="checkbox" className="checkbox-type" id="first-checkbox"
                                        onClick={() => {
                                            if (checked) { clickHandler() }; document.getElementById('second-checkbox').checked = false; document.getElementById('third-checkbox').checked = false;
                                            setType('Open'); setPassword(false)
                                        }}
                                    />
                                    <span className="type-storage-promt">Любой пользователь MyStorage сможет просматривать содержимое хранилища</span>
                                </label>
                            </div>
                            <div className="checkbox-type-storage">
                                <label className="label-type">
                                    <span className="span-type-storage">Закрытое</span>
                                    <input type="checkbox" className="checkbox-type" id="second-checkbox"
                                        onClick={() => {
                                            clickHandler(); document.getElementById('first-checkbox').checked = false; document.getElementById('third-checkbox').checked = false;
                                            setType('Closed'); setPassword(true)
                                        }} />
                                    <span className="type-storage-promt">Для входа в хранилище другим пользователям потребуется пароль</span>
                                    {passwordForStorage}
                                </label>
                            </div>
                            <div className="checkbox-type-storage">
                                <label className="label-type">
                                    <span className="span-type-storage">Личное</span>
                                    <input type="checkbox" className="checkbox-type" id="third-checkbox"
                                        onClick={() => {
                                            if (checked) { clickHandler() }; document.getElementById('first-checkbox').checked = false; document.getElementById('second-checkbox').checked = false;
                                            setType('Personality'); setPassword(false)
                                        }}
                                    />
                                    <span className="type-storage-promt"> Содержимое хранилища доступно только его создателю</span>
                                </label>
                            </div>
                        </div>
                        <div id="hint-storage-create">
                            {hint_1}
                        </div>
                        <div id="hint-storage-create">
                            {hint_2}
                        </div>
                        <div id="hint-storage-create-right">
                            {hint_3}
                        </div>
                        <button id="button-create-storage-interior" type="submit">Создать</button>
                    </form>
                </div>
            </div>
        </div>
    )

    return activePage === 0 ? CreateStorageBlock : null

}

export { CreateStorage }