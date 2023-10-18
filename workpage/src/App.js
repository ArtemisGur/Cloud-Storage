import React, { createContext, useContext, useEffect, useState } from 'react';
import { PageProvider } from './components/PageContext';
import Header from './components/Header'
import NavigateMenu from './components/NavigateMenu'
import { CreateStorage } from './components/CreatePage';
import './css/main.css'

function App() {
  
  // const [state, setState] = useState([{}]);
  // useEffect(() => {
  //     fetch("/test")
  //     .then(res => res.json())
  //     .then(
  //       data => {
  //           setState(data)
  //       },
  //       (error) => {}
  //     )
  // }, [])
  
  return (
    <div className='App'>
        <Header />
        <PageProvider>
          <NavigateMenu />
          <CreateStorage />
        </PageProvider>
    </div>
  )
}

export default App;