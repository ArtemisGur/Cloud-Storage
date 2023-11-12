import { MyStorages, test } from "./buttonsNavigate/buttonMyStorages"
import EnabledStorages from "./buttonsNavigate/buttonEnabledStorages"

const NavList = () => {
    return(
        <div className="nav-menu-cont">
            <MyStorages />
            <EnabledStorages />
        </div>
    )
}

export default NavList
