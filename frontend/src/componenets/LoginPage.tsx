import { useState} from 'react'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router'

function LoginPage(){

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setAccessToken } = useAuth();
  const navigate =useNavigate();

  async function onSubmit(e:any) {
    e.preventDefault()
    try {
        const response= await fetch("http://localhost:3000/users/login",{
            method:"POST",
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            credentials:"include",
            body: new URLSearchParams({email,password})
        })
        if(!response.ok){
            if(response.status == 401){
                // return await sendRefreshToken();
            }
           throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if(!data.accessToken){
            throw new Error("login failed")
        }
        setAccessToken(data.accessToken);
        navigate('/')
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