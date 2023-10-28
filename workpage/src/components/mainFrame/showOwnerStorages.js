import { useContext, useState } from "react"
import { PageContext } from "../PageContext"
import { OwnerStorages } from '../buttonsNavigate/buttonMyStorages'
import axios from "axios"

const OwnerStorage = () => {
    const { activePage } = useContext(PageContext)
    const [ showInterior, setShowInterior ] = useState(false)

    const handlerClick = (num) => {
        console.log(OwnerStorages[num].owner, OwnerStorages[num].name)
        axios.post('http://localhost:5000/showFiles', {"owner" : OwnerStorages[num].owner, "name" : OwnerStorages[num].name})
        .then((res) => {
            console.log(res)
        })
        //setShowInterior(!showInterior)
    }


    let CreateStorageBlock = (
        <div className="create-storage-cont">
            <div className="create-storage-interior">
                <h2 id="header-create-page">Ваши хранилища</h2>
                <div id="create-interior">
                    {
                        OwnerStorages.map((OwnerStorages) => {
                            return (
                                <div className="button-storage-block" key={OwnerStorages.id}>
                                <label key={OwnerStorages.id}>
                                    <button className="button-storage" key={OwnerStorages.id} onClick={() => {handlerClick(OwnerStorages.key);}}>
                                        <div className="button-storage-interior" key={OwnerStorages.id}>
                                            <div className="but-storage-name" key={OwnerStorages.id}>{OwnerStorages.name}</div>
                                            <div className="but-storage-owner" key={OwnerStorages.id}>Владелец: <b>{OwnerStorages.owner}</b></div>
                                            <div className="but-storage-owner" key={OwnerStorages.id}>Тип: {OwnerStorages.type}</div>
                                        </div>
                                    </button>
                                    </label>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )

    if(activePage === 1 && showInterior === false){
        return CreateStorageBlock
    }
    else
        return null

    //return activePage === 1 ? CreateStorageBlock : null
}

export { OwnerStorage }