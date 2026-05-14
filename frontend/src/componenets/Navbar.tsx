import { Link } from "react-router"
function Navbar(){
    return(
        <div className="flex justify-between p-4">
        <div className="flex flex-3 justify-end ">
            <Link to="/">
                <h1 className="text-2xl" >Messenger app</h1>
            </Link>
        </div>
        <div className="links flex flex-2 gap-3 justify-end">
            <Link to="/signup"><h2>sign Up</h2></Link>
            <Link to="/login"><h2>login</h2></Link>
            <span className="rounded-full border-20"></span>
        </div>
        </div>
    )
}
export default Navbar