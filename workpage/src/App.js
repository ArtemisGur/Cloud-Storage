import React, { useEffect, useState } from 'react';
import Header from './components/Header'
import NavigateMenu from './components/NavigateMenu'
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
      <NavigateMenu />
    </div>
  )
}

export default App;