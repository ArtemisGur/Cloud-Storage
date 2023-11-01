// import { useContext, useState } from "react"
// import { PageContext } from "../PageContext"
// import { OwnerStorages } from '../buttonsNavigate/buttonMyStorages'
// import { creteObjInternalFiles } from './showOwnerStorages'
// import axios from "axios"

// let path

// const SearchStorageCont = () => {
//     const { activePage, changePage } = useContext(PageContext)
//     const handlerClick = (num) => {
//         axios.post('http://localhost:5000/showFiles', {"owner" : OwnerStorages[num].owner, "name" : OwnerStorages[num].name})
//         .then((res) => {
//             creteObjInternalFiles(res.data)
//             path = `${OwnerStorages[num].owner}/Storage_${OwnerStorages[num].name}`
//         })
//         .then(() => {
//             //changePage(4)
//         })
//     }

//     let SearchStorageBlock = (
//         <div className="create-storage-cont">
//             <div className="create-storage-interior">
//                 <h2 id="header-create-page">Найденные хранилища</h2>
//                 <div id="create-interior">
//                     {
//                         OwnerStorages.map((OwnerStorages) => {
//                             return (
//                                 <div className="button-storage-block" key={OwnerStorages.id}>
//                                 <label key={OwnerStorages.id}>
//                                     <button className="button-storage" key={OwnerStorages.id} onClick={() => {handlerClick(OwnerStorages.key)}}>
//                                         <div className="button-storage-interior" key={OwnerStorages.id}>
//                                             <div className="but-storage-name" key={OwnerStorages.id}>{OwnerStorages.name}</div>
//                                             <div className="but-storage-owner" key={OwnerStorages.id}>Владелец: <b>{OwnerStorages.owner}</b></div>
//                                             <div className="but-storage-owner" key={OwnerStorages.id}>Тип: {OwnerStorages.type}</div>
//                                         </div>
//                                     </button>
//                                     </label>
//                                 </div>
//                             )
//                         })
//                     }
//                 </div>
//             </div>
//         </div>
//     )

//     if(activePage === 5){
//         return SearchStorageBlock
//     }
//     else
//         return null
// }

// export { SearchStorageCont }