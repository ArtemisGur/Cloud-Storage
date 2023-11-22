import { createContext, useState } from "react";
import firebase from 'firebase/compat/app';

const PageContext = createContext()

function PageProvider({ children }) {

    firebase.initializeApp({
        apiKey: "AIzaSyBE6tgwcK5EqOlAAa2UIi5F4uhLiMMd_BA",
        authDomain: "chat-mystorage.firebaseapp.com",
        projectId: "chat-mystorage",
        storageBucket: "chat-mystorage.appspot.com",
        messagingSenderId: "839581633688",
        appId: "1:839581633688:web:f772e7334b13f25108d4ed",
        measurementId: "G-6NTF59E7V0"
    }
    )
    const firestore = firebase.firestore()

    const [activePage, setActivePage] = useState(0)

    const changePage = (index) => {
        setActivePage(index)
    }

    return (
        <PageContext.Provider value={{ activePage, changePage, firebase, firestore }}>
            {children}
        </PageContext.Provider>
    )
}

export { PageProvider, PageContext }