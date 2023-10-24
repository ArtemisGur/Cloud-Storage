import axios from 'axios'
import logo from '../img/logo.jpg'
import profileLogo from '../img/profile-logo.png'
import SearchField from './SearchField'

const Header = () => {

    return(
        <div className="header-container">
            <div className="logo-block">
                <a href="">
                    <img src={logo} id="logo-img"/>
                </a>
            </div>
            <SearchField />
            <div className='logo-profile'>
                <img src={profileLogo}/>
            </div>
            <button id='button-exit'>Выйти</button>
        </div>
    )
}

export default Header