import React, { useEffect, useState } from 'react';
import Header from './components/Header'
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
    </div>
  )
}

export default App;