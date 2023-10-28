import { PageContext } from "../PageContext"
import { internalFiles } from "./showOwnerStorages"
import { useContext, useState } from "react"

const ShowInternalFiles = () => {

    const { activePage, changePage } = useContext(PageContext)

    let CreateFileBlock = (
        <div className="show-file-cont">
            <div className="show-files-interior">
                <div className="back-to-storages">      
                    <label className="upload-file-label">Назад</label>
                    <input type="action" className="file-upload-input"/>
                </div>
                <div className="upload_file">      
                    <label htmlFor="file-upload-input" className="upload-file-label">Загрузить файл</label>
                    <input type="file" id="file-upload-input" className="file-upload-input"/>
                </div>
                
            </div>
            <div className="file-params">
                    <div id="file-prop-name">Название</div>
                    <div id="file-prop-type">Тип</div>
                    <div id="file-prop-date">Дата создания</div>
                    <div id="file-prop-size">Размер(Кб)</div>
            </div>
            <div id="interior-block-files">
                    {
                        internalFiles.map((internalFiles) => {
                            {
                                return (
                                    <div id="file-interior">
                                        <div id="file-name" key={internalFiles.id}>{internalFiles.name}</div>
                                        <div id="file-type" key={internalFiles.id}>{internalFiles.type}</div>
                                        <div id="file-date" key={internalFiles.id}>{internalFiles.birthday}</div>
                                        <div id="file-size" key={internalFiles.id}>{internalFiles.size}</div>
                                    </div>
                                )
                            }
                        })
                    }       
             </div>
        </div>
    )

    if(activePage === 4){
        return CreateFileBlock
    }
    else
        return null

}

export { ShowInternalFiles }