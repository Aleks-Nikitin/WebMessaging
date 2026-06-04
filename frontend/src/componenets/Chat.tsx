import { useEffect,useState } from "react";
import { useAuth } from "../AuthContext";

type UserOption = {
    id: number;
    firstname: string;
    lastname: string;
};

export default function Chat(){

    const { user, isLoading, authFetch } = useAuth();
    const [userList, setUserList] = useState<UserOption[]>([]);
     useEffect(()=>{
        async function getUsersList() {
            try {
                const users = await authFetch("http://localhost:3000/users", {
                    method: "GET",
                });

                if (!users.ok) {
                    console.log("not okey");
                    return;
                }
                const body = await users.json().catch(() => null);
                setUserList(body || []);
            } catch (error) {
               //
            }
           
        }
        getUsersList();
     },[authFetch])

     if (isLoading) {
        return <h1>Loading...</h1>;
     }

     if (!user) {
        return <h1>You are not authenticated. Please log in.</h1>;
     }

    return(
        <>
         <h1 className="text-2xl font-semibold mb-4">Chat with users!</h1>
         <div className="grid grid-rows-5 grid-cols-5 border-2 p-8 mt-15">
            <div className="sidebar row-span-5 col-span-1">
                Chats:
            </div>
               <div className="search row-span-1 col-span-4">
            <p>Search by username:</p>
            <form action="" method="post">
                <input list="users" name="user-selected" className="bg-white text-black"/>
                <datalist id="users" className="bg-red-500">
                    {userList.map(user => (
                        <option key={user.id} value={user.firstname + " " + user.lastname} />
                    ))}
                    
                </datalist>
            </form>
         </div>
         <div className="chat row-span-4 col-span-4">
             Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum maiores, accusantium sapiente earum corrupti officiis veniam? Optio, explicabo consectetur laudantium accusantium vel consequatur ea mollitia exercitationem beatae quisquam, corporis doloribus.
             Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere sequi asperiores, a, neque quia voluptatibus, veniam nostrum nulla laborum quisquam eos optio sunt unde quibusdam eum officia fuga impedit velit?
         </div>
         </div>
      
        </>
    )
}