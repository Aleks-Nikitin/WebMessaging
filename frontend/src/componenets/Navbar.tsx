export function Navbar(){
    return(
        <div className="flex justify-between p-4">
        <div className="flex flex-3 justify-end ">
            <h1 className="text-2xl" >Web messaging app</h1>
        </div>
        <div className="links flex flex-2 gap-3 justify-end">
            <h2>Sign up</h2>
            <h2>Log in</h2>
            <span className="rounded-full border-20"></span>
        </div>
        </div>
    )
}