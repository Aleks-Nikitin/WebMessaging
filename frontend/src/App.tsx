import  Navbar  from './componenets/Navbar.tsx'
import { Outlet } from 'react-router'

function App() {
  return (
    <>
    <Navbar></Navbar>
    <main className="flex-1 min-h-0 flex flex-col">
      <Outlet />
    </main>
    </>
  )
}

export default App
