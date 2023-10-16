import logo from '../img/logo.jpg'
import SearchButton from './SearchField'

const Header = () => {
    return(
        <div className="header-container">
            <div className="logo-block">
                <a href="">
                    <img src={logo} id="logo-img"/>
                </a>
            </div>
            <SearchButton />
        </div>
    )
}

export default Header