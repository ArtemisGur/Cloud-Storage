import { useContext, useState } from "react"
import { PageContext } from "../PageContext"
import { MyStorages, OwnerStorages } from '../buttonsNavigate/buttonMyStorages'

const OwnerStorage = () => {
    const { activePage } = useContext(PageContext)
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
                                    <button className="button-storage" key={OwnerStorages.id}>
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

    return activePage === 1 ? CreateStorageBlock : null
}

export { OwnerStorage }