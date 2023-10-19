import { useContext, useState } from "react"
import { PageContext } from "./PageContext"

const CreateStorage = () => {

    const [checked, setChecked] = useState(false)

    let passwordForStorage = null

    const clickHandler = () => {
        setChecked(!checked)
    }

    if (checked){
        passwordForStorage = (
            <div id="closed-storage-block">
                <br />
                <div id="password-header-hint">Пароль для хранилища</div>
                <input id="password-for-storage-hint" type="password"/>
            </div>
        )
    }

    let CreateStorageBlock = (
        <div className="create-storage-cont">
            <div className="create-storage-interior">
                <h2 id="header-create-page">Создание хранилища</h2>
                <div id="create-interior">
                    <form method="post">
                        <div className="header-span">
                            <span>Название хранилища</span>
                            <br />
                            <input id="name-storage-create"/>
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
                                    onClick={() => {if(checked){clickHandler()};document.getElementById('second-checkbox').checked = false; document.getElementById('third-checkbox').checked = false;}}
                                />
                                <span className="type-storage-promt">Любой пользователь MyStorage сможет просматривать содержимое хранилища</span>
                                </label>
                            </div>  
                            <div className="checkbox-type-storage">
                            <label className="label-type">  
                                <span className="span-type-storage">Закрытое</span>
                                <input type="checkbox" className="checkbox-type" id="second-checkbox" 
                                    onClick={() => {clickHandler(); document.getElementById('first-checkbox').checked = false; document.getElementById('third-checkbox').checked = false;}}/>
                                <span className="type-storage-promt">Для входа в хранилище другим пользователям потребуется пароль</span>
                                {passwordForStorage}
                            </label>
                            </div>
                            <div className="checkbox-type-storage">
                            <label className="label-type">            
                                <span className="span-type-storage">Личное</span>
                                <input type="checkbox" className="checkbox-type" id="third-checkbox" 
                                    onClick={() => {if(checked){clickHandler()};document.getElementById('first-checkbox').checked = false; document.getElementById('second-checkbox').checked = false;}}
                                />
                                <span className="type-storage-promt"> Содержимое хранилища доступно только его создателю</span>              
                            </label>
                            </div>
                        </div>
                        <button id="button-create-storage-interior">Создать</button>
                    </form>  
                </div> 
            </div>
        </div>
    )
    
    const { activePage } = useContext(PageContext)

    return activePage === 0 ? CreateStorageBlock : null
    
}

export { CreateStorage }