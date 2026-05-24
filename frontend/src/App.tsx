import  Navbar  from './componenets/Navbar.tsx'
import { Outlet } from 'react-router'

function App() {
  return (
    <>
    <Navbar></Navbar>
    <Outlet>

    </Outlet>
    </>
  )
}

export default App
