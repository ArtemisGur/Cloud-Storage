import React, { createContext, useContext, useEffect, useState } from 'react';
import { PageProvider } from './components/PageContext';
import Header from './components/Header'
import NavigateMenu from './components/NavigateMenu'
import { CreateStorage } from './components/mainFrame/CreatePage';
import { OwnerStorage } from './components/mainFrame/showOwnerStorages';
import { ShowInternalFiles } from './components/mainFrame/storageInternals';
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
          <div className='work-page-container'>
            <NavigateMenu />
            <CreateStorage />
            <OwnerStorage />
            <ShowInternalFiles />
          </div>
        </PageProvider>
    </div>
  )
}

export default App;