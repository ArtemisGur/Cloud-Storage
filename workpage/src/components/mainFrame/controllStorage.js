import { useDispatch, useSelector } from "react-redux"
import cross from '../../img/cross.png'
import axios from "axios"
import { changeDataUser, changeAllRoles, deleteDataUser } from "../store/userListSlice"
import { setDataPasswordStorage } from "../store/changePasswordSlice"

const StorageControll = ({setPswd, pswd, changeState}) => {

    const dispatch = useDispatch()
    let usersList = useSelector((store) => store.userList.data)
    let passwordStorage = useSelector((store) => store.changePassword.data)
    let storages = useSelector((store) => store.ownStorages.data)
    
    const changePassword = () => {
        if (pswd === null || pswd === '') {
            return -1
        }
        axios.post('/changeStoragePassword', { 'owner': storages.owner, 'name': storages.name, 'password': pswd })
            .then(() => {
                dispatch(setDataPasswordStorage('Пароль успешно сменен'))
            })
    }

    const changeRole = (newRole, key, name) => {
        axios.post('/changeUserRole', { 'owner': storages.owner, 'name': storages.name, 'user': name, 'newRole': newRole })
            .then(() => {
                dispatch(changeDataUser({ 'key': key, 'role': newRole }))
            })
    }

    const changeRoleToAll = (newRole) => {
        axios.post('/changeAllRoles', { 'owner': storages.owner, 'name': storages.name, 'newRole': newRole })
            .then(() => {
                dispatch(changeAllRoles({ 'role': newRole }))
            })
    }

    const deleteUser = (name, key) => {
        axios.post('/excludeUser', { 'owner': storages.owner, 'name': storages.name, 'user': name })
            .then((res) => {
                if (res.data = 'OK') {
                    dispatch(deleteDataUser(key))
                }
            })
    }

    return <div id="popup">
        <div className="popup-content-controll">
            <div className="popup-header">
                <div className="popup-title-2">Управление хранилищем <b>{storages.name}</b></div>
                <button className="popup-close" onClick={() => { changeState(false) }}>X</button>
            </div>
            <div className="interior-controll">
                {storages.type != 'Open' && <div className="interior-controll-2">
                    <input className="popup-input-field" type="text" placeholder="Введите новый пароль хранилища..." onChange={(e) => { setPswd(e.target.value) }} />
                    <button className="popup-create-submit" onClick={() => { changePassword() }}>Сменить пароль</button>
                    <span className="success-change">{passwordStorage}</span>
                </div>}
                <div className="interior-controll-users-block">
                    <div className="interior-controll-users">
                        <div className="span-users-list">Список пользователей</div>
                        <div className="users-interior">
                            {
                                usersList.map((userList) => {
                                    return (
                                        <div className="user-in-list" key={userList.key}>
                                            <span>{userList.userName}</span>
                                            <div className="dropdown-role-block">
                                                <button className="change-role">{userList.role === 'default' && 'Только просмотр'}
                                                    {userList.role === 'full' && 'Редактирование'}</button>
                                                <div className="dropdown-role">
                                                    <div>
                                                        <button className="change-role-field-1" onClick={() => { changeRole('default', userList.key, userList.userName) }}>Только просмотр</button>
                                                    </div>
                                                    <div>
                                                        <button className="change-role-field-1" onClick={() => { changeRole('full', userList.key, userList.userName) }}>Редактирование</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <img className="cross-pic" src={cross} onClick={() => deleteUser(userList.userName, userList.key)} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="interior-controll-users">
                        <div className="span-users-list">Вы можете назначить роль сразу для всех пользователей</div>
                        <div><button className="button-change-role" onClick={() => changeRoleToAll('default')}>Только просмотр</button></div>
                        <div><button className="button-change-role" onClick={() => changeRoleToAll('full')}>Редактирование содержимого хранилища</button></div>
                    </div>
                </div>

            </div>

        </div>
    </div>

}

export default StorageControll