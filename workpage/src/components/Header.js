import logo from '../img/logoSite.png'
import profileLogo from '../img/profile-logo.png'
import SearchField from "./SearchField"

const Header = () => {

    return (
        <div className="header-container">
                    <img src={logo} id="logo-img" />
            <div className="logo-block">
                <a id='logoName' href="">
                    <span id='logo_2'>MyStorage</span>
                </a>
            </div>
            <SearchField />
            <div className='logo-profile'>
                <img src={profileLogo} />
            </div>
                <button id='button-exit'>Выйти</button>
        </div>
    )
}

export default Header