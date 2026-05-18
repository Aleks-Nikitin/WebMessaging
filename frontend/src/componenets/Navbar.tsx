import { useDebugValue, useEffect,useState } from "react";
import { Link,useNavigate } from "react-router"
import { useAuth } from "../AuthContext"
import type {User} from "./UserProfile";
function Navbar(){
    const {authFetch,setAccessToken} = useAuth();
    const [user, setUser] = useState<User>();
    const [error, setError] = useState(true);
    const navigatge = useNavigate();
    useEffect(()=>{
         async function loadUser() {
            const response = await authFetch("http://localhost:3000/users/me", {
                method: "GET",
            });

            if (!response.ok) {
                return;
            }
            setError(false);
            const {user} = await response.json().catch(() => null);
            console.log(user)

            setUser(user);
        }

        void loadUser();
    },[authFetch])
    async function handleLogout(){
         const header = new Headers();
            header.append("Content-Type","application/json");
            header.set("authorization","");
         const response = await authFetch("http://localhost:3000/logout", {
                method: "GET",
                headers:header
            });
            if (!response.ok) {
                throw new Error("unsuccessfull logout");
                
            }
            setAccessToken(null)
            setError(true);
            setUser(undefined);
            navigatge("/");
    }
    return(
        <div className="flex justify-between p-4">
        <div className="flex flex-3 justify-end ">
            <Link to="/">
                <h1 className="text-2xl" >Messenger app</h1>
            </Link>
        </div>

       { error ? <div className="links flex flex-2 gap-3 justify-end">
            <Link to="/signup"><h2>sign Up</h2></Link>
            <Link to="/login"><h2>login</h2></Link>
        </div> : <div className="links flex flex-2 gap-3 justify-end">
            <button className="hover:cursor-pointer" onClick={handleLogout}><h2>log out</h2></button>
             <Link to="/profile"><h2>{user?.email}</h2></Link>
        </div>}

        </div>
    )
}
export default Navbar