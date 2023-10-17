
const MyStorages = () => {
    return(
        <div id="nav-field-cont">
            <span id="nav-field">Мои хранилища</span>
        </div>
    )
}

const EnabledStorages = () => {
    return(
        <div id="nav-field-cont">
            <span id="nav-field">Доступные мне</span>
        </div>
    )
}

const DeletedStorages = () => {
    return(
        <div id="nav-field-cont">
            <span id="nav-field">Удаленные</span>
        </div>
    )
}

const NavList = () => {
    return(
        <div className="nav-menu-cont">
            <MyStorages />
            <EnabledStorages />
            <DeletedStorages />
        </div>
    )
}

export default NavList