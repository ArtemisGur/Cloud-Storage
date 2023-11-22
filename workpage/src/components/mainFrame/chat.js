import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import 'firebase/compat/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { PageContext } from "../PageContext"
import { setUser } from "../store/userSlice";
import axios from "axios";

const Chat = () => {
    const dispatch = useDispatch()
    let username = useSelector((store) => store.user.data)

    useEffect(() => {
        axios.post('/getUser', {}, { withCredentials: true })
            .then((response) => {
                dispatch(setUser(response.data.user))
            })
    })

    const [value, setValue] = useState('')
    const { firestore, firebase } = useContext(PageContext)
    let storages = useSelector((store) => store.currentStorage.data)
    const [messages, loading] = useCollectionData(
        firestore.collection('messages').where('owner', '==', storages.owner).where('storage', '==', storages.name).orderBy('createdAt')
    )

    if (loading) {
        return (
            <div className="download-waiting">
                <span class="loader"></span>
            </div>
        )
    }

    const sendMessageByForm = async (event) => {
        event.preventDefault()
        if (value === ''){
            return -1
        }
        await firestore.collection('messages').add({
            user: username,
            text: value,
            storage: storages.name,
            owner: storages.owner,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        setValue('')
    }

    return (
        <form onSubmit={sendMessageByForm}>
            <div id="chat-container">
                <div className="header-chat">
                </div>
                <div className="cont-chat-2">
                    <div className="cont-chat">
                        {messages.map(message => (
                            <div class="message">
                                <div class="message__outer">
                                    <div class="message__inner">
                                        {username === message.user && <div class="message__actions">{message.user}</div>}
                                        {username === message.user && <div class="message__bubble">{message.text}</div>}
                                        {username != message.user && <div class="message__actions-2">{message.user}</div>}
                                        {username != message.user && <div class="message__bubble-2">{message.text}</div>}
                                        <div class="message__spacer"></div>
                                    </div>
                                    <div class="message__status"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="message-block">
                    <input className="message-field" value={value} onChange={e => setValue(e.target.value)} />
                    <button className="send-message">Отправить</button>
                </div>
            </div>
        </form>
    )
}

export default Chat