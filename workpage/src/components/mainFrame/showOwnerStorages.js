import { useContext, useState } from "react"
import { PageContext } from "../PageContext"
import { MyStorages , test } from '../buttonsNavigate/buttonMyStorages'

const OwnerStorage = () => {
    console.log(test)
    const { activePage } = useContext(PageContext)
    
        let CreateStorageBlock = (
            <div className="create-storage-cont">
                <div className="create-storage-interior">
                    <h2 id="header-create-page">Ваши хранилища</h2>
                    <div id="create-interior">
                    {test}
                    </div>
                </div>
            </div>
        )
   
        return activePage === 1 ? CreateStorageBlock : null
    }

export { OwnerStorage }