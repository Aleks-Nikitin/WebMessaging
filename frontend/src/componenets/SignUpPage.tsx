import { useState } from 'react'
import { useNavigate } from 'react-router'

function SignUpPage(){


  const [firstname, setFirstname] = useState<string>('')
  const [lastname, setLastname] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState('')
  const [errors,setErrors]= useState<string[]>([]);
  const [confpassword, setConfpassword] = useState<string>('')
  const navigate =useNavigate();

  async function onSubmit(e: any) {
    e.preventDefault()
    try {
           const response = await fetch(`${import.meta.env.VITE_BACKEND}/users/`,{
    method: "POST",
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({firstname,lastname,email,password,confpassword})
   });
    const data = await response.json().catch(()=>null);
   if(!response.ok){
        throw new Error(`${response.status} ${response.statusText}`);
        
   }

      if (data?.msg) {
        navigate('/login')
      } else {
        const errArr = data?.errors ?? []
        setErrors(errArr.map((obj: any) => obj.msg))
        throw new Error('signup failed')
      }
    } catch (err) {
      console.error(err)
    }
    
  }

  return (
    <section className="max-w-md mx-auto p-6">

      <h1 className="text-2xl font-semibold mb-4">Sign up</h1>
     

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm">First name</span>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm">Last name</span>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </label>
        </div>

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

        <label className="block">
          <span className="text-sm">Confirm password</span>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            type="password"
            value={confpassword}
            onChange={(e) => setConfpassword(e.target.value)}
            required
          />
        </label>

     {errors.length > 0 && (
      
           <ul className='text-l text-red-500 text-start '>
             {errors.map((element, idx) => (
               <li key={idx}>{element}</li>
             ))}
           </ul>
       
     )}
        <button
          type="submit"
          
          className="w-full bg-indigo-600 text-white rounded px-3 py-2 disabled:opacity-60 hover:font-bold cursor-pointer"
        >
          Create account
        </button>
      </form>
    </section>
  )


    
}
export default SignUpPage;