import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router'

function LoginPage(){

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors,setErrors]= useState<string>();
  const { setAccessToken, setUser } = useAuth();
  const navigate =useNavigate();

  async function onSubmit(e:any) {
    e.preventDefault()
    try {
        const response= await fetch(`${import.meta.env.VITE_BACKEND}/users/login`,{
            method:"POST",
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            credentials:"include",
            body: new URLSearchParams({email,password})
        })
        if (!response.ok) {
          if (response.status === 401) {
            setErrors("Invalid email or password");
            throw new Error("Invalid email or password");
          }

          throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if(!data.accessToken){
            throw new Error("login failed")
        }
        setAccessToken(data.accessToken);
        // fetch current user immediately using returned token
        try {
            const meRes = await fetch(`${import.meta.env.VITE_BACKEND}/users/me`, {
            method: "GET",
            headers: { Authorization: `Bearer ${data.accessToken}` },
            credentials: "include",
          });
          if (meRes.ok) {
            const body = await meRes.json().catch(() => null);
            const user = body ? body.user : null;
            setUser(user || null);
          }
        } catch (e) {
          // ignore user bootstrap errors here
        }
        navigate('/');
    } catch (error) {
        console.error(error);
    }


  }

  return (
    <section className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Log in</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm">Email</span>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm">Password</span>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

     {errors && (
      
           <ul className='text-l text-red-500 text-start '>
               <li >{errors}</li>
           </ul>
       
     )}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded px-3 py-2 disabled:opacity-60 hover:font-bold cursor-pointer"
        >
          Login
        </button>
      </form>
    </section>
  )
}


    

export default LoginPage;