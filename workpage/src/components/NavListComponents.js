import { MyStorages, test } from "./buttonsNavigate/buttonMyStorages"
import EnabledStorages from "./buttonsNavigate/buttonEnabledStorages"
import DeletedStorages from "./buttonsNavigate/buttonDeletedStorages"

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
