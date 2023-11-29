import { useEffect } from 'react'
import axios from "axios"
import logo from '../img/logoSite.png'
import SearchField from "./SearchField"
import { setUser } from './store/userSlice'
import { useDispatch, useSelector } from 'react-redux'

const Header = () => {

    let user = useSelector((store) => store.user.data)

    const dispatch = useDispatch()
    useEffect(() => {
        axios.post('/getUser', { withCredentials: true })
            .then((response) => {
                dispatch(setUser(response.data.user))
            })
    })

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
                Привет, <b>{user}</b>!
            </div>
            <button id='button-exit'>Выйти</button>
        </div>
    )
}

export default Header