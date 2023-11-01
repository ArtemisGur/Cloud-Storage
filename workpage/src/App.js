import React, { createContext, useContext, useEffect, useState } from 'react';
import { PageProvider } from './components/PageContext';
import Header from './components/Header'
import NavigateMenu from './components/NavigateMenu'
import { CreateStorage } from './components/mainFrame/CreatePage';
import { OwnerStorage } from './components/mainFrame/showOwnerStorages';
import { ShowInternalFiles } from './components/mainFrame/storageInternals';
import { SearchStorageCont } from './components/mainFrame/searchPage'
import { Provider } from 'react-redux';
import store from '../src/components/store/store'
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
    <Provider store={store}>
      <div className='App'>
          <PageProvider>
            <Header />
            <div className='work-page-container'>
              <NavigateMenu />
              <CreateStorage />
              <OwnerStorage />
              <ShowInternalFiles />
            </div>
          </PageProvider>
      </div>
    </Provider>
  )
}

export default App;