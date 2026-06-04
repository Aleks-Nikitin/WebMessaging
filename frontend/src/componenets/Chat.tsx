import { useEffect,useState } from "react";
import { useAuth } from "../AuthContext";

type UserOption = {
    id: number;
    firstname: string;
    lastname: string;
};

export default function Chat(){
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState("");
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
      const currentUser = user;

      function handleUserSearchChange(e) {
        const value = e.target.value;
        setSearchValue(value);

        const matchedUser = userList.find(
            (candidate) => `${candidate.firstname} ${candidate.lastname}` === value
        );

        setSelectedUserId(matchedUser ? matchedUser.id : null);
      }

      async function handleChatCreation(e: any) {
        e.preventDefault();

        if (!selectedUserId) {
            console.log("Please select a user from the list");
            return;
        }

        try {
            const response = await authFetch("http://localhost:3000/chats",{
                method:"POST",
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                    body: new URLSearchParams({
                        userId: String(currentUser.id),
                        selectedUser: String(selectedUserId),
                    })

            })
            const result = await response.json().catch(()=>null);
            if(result){
                console.log("success");
            }
        } catch (error) {
            
        }
     }

    return(
        <>
         <h1 className="text-2xl font-semibold mb-4">Chat with users!</h1>
         <div className="grid grid-rows-5 grid-cols-5 border-2 p-8 mt-15">
            <div className="sidebar row-span-5 col-span-1">
                Chats:
            </div>
               <div className="row-span-1 col-span-4 ">
            <p>Search by username:</p>
            <form onSubmit={handleChatCreation} className="flex justify-center p-3">
                <div className="flex gap-2">
                    <input
                        list="users"
                        name="user-selected"
                        className="bg-white text-black"
                        value={searchValue}
                        onChange={handleUserSearchChange}
                    />
                    <button type="submit" className="px-3 py-1 border rounded hover:cursor-pointer">
                        Create Chat
                    </button>
                </div> 
                <datalist id="users" className="bg-red-500">
                    {userList.map((candidate) => (
                        <option
                            key={candidate.id}
                            value={`${candidate.firstname} ${candidate.lastname}`}
                        />
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