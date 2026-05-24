import { Link, useNavigate } from "react-router";
import { useAuth } from "../AuthContext";

function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="flex justify-between p-4">
      <div className="flex flex-3 justify-end ">
        <Link to="/">
          <h1 className="text-3xl hover:font-bold">Messenger app</h1>
        </Link>
      </div>

      {(!user && !isLoading) ? (
        <div className="links flex flex-2 gap-3 justify-end text-2xl">
          <Link to="/signup">
            <h2 className="hover:font-bold">sign Up</h2>
          </Link>
          <Link to="/login">
            <h2 className="hover:font-bold">login</h2>
          </Link>
        </div>
      ) : (
        <div className="links flex flex-2 gap-3 justify-end text-2xl">
          <button className="hover:cursor-pointer hover:font-bold" onClick={handleLogout}>
            <h2>log out</h2>
          </button>
          <Link to="/profile">
            <h2 className="text-green-500 hover:font-bold">{user?.email}</h2>
          </Link>
        </div>
      )}

    </div>
  );
}

export default Navbar;
