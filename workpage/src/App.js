import React, { useEffect, useState } from 'react';

function App() {
  
  const [state, setState] = useState([{}]);

  useEffect(() => {
      fetch("/test")
      .then(res => res.json())
      .then(
        data => {
            setState(data)
        },
        (error) => {}
      )
  }, [])
  
  return (
    <div className='App'></div>
  )
}

export default App;