import { useState } from 'react'
import  Navbar  from './componenets/Navbar'
import './App.css'
import { Outlet } from 'react-router'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar></Navbar>
    <Outlet>

    </Outlet>
    </>
  )
}

export default App
