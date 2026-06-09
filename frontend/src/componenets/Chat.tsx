import { useEffect, useState, type ChangeEvent } from "react";
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
    type MessageItem = {
        id: number;
        text: string;
        userId: number;
    };

    type ChatItem = {
        chatId: number;
        chatter: number;
        messages?: MessageItem[];
        msg?: string;
    };
    const [chatArr, setChatArr] = useState<ChatItem[]>([]);
    const [text,setText]= useState<string>();
    const [activeChatId,setActiveChatId]=useState<number | null>(null);
    const [messages, setMessages] = useState<MessageItem[]>([]);
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

    function handleUserSearchChange(e: ChangeEvent<HTMLInputElement>) {
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
                setChatArr((prev) => {
                    if (prev.some((chat) => chat.chatId === result.chatId)) {
                        return prev;
                    }
                    return [result, ...prev];
                });
            }
        } catch (error) {
            
        }
     }

    function handleChatSelect(chat: ChatItem) {
        setActiveChatId(chat.chatId);
        setSelectedUserId(chat.chatter);
        setMessages(chat.messages ?? []);
    }

    async function handleMsgCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!text ) {
            console.log("type a message");
            return;
        }

        try {
            const response = await authFetch("http://localhost:3000/messages",{
                method:"POST",
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                    body: new URLSearchParams({
                        senderId: String(currentUser.id),
                        chatId: String(activeChatId),
                        text: String(text),
                    })

            })
            const result = await response.json().catch(()=>null);
            if(result){
                console.log("success");
                setMessages((prev) => [...prev, result]);
                setChatArr((prev) =>
                    prev.map((chat) =>
                        chat.chatId === activeChatId
                            ? {
                                  ...chat,
                                  messages: [...(chat.messages ? chat.messages : []), result],
                              }
                            : chat
                    )
                );
                setText("")
            }
        } catch (error) {
            
        }
        
     }
    return(
        <div className="h-full flex-1 flex flex-col">
         <h1 className="text-2xl font-semibold mb-4">Chat with users!</h1>
         <div className="grid grid-rows-5 grid-cols-5 border-2 p-8 mt-2 h-full flex-1">
            <div className="sidebar row-span-5 col-span-1">
                <h2>Chats:</h2>
                <ul>
                    {chatArr.map((chat)=>{
                        let chatter =userList.find((user)=> user.id == chat.chatter);
                        return (
                    <li className="hover:font-bold hover:cursor-pointer" onClick={() => handleChatSelect(chat)} key={chat.chatId}>{`${chatter?.firstname} ${chatter?.lastname} `}</li>
                        )
                })}
                </ul>
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
                    <button type="submit" className="px-3 py-1 border rounded hover:cursor-pointer hover:font-bold">
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
         { activeChatId && <div className="grid row-span-4 col-span-4 grid-rows-5 w-[75%] my-0 mx-auto">
            <div className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm p-4 text-slate-800 row-span-4 overflow-y-auto">
                {messages && messages.map((msg)=>{

                    let text = msg.text;
                    let user = msg.userId == currentUser.id ? "me" : false;
                    return (
                        <div className="grid " key={msg.id}>
                            <h4>{user}</h4>
                            <p>{text}</p>
                        </div>
                    )
                })}
            </div>
           <form onSubmit={handleMsgCreate} className="bg-blue-900 flex  justify-center">
                    <textarea onChange={(e)=> setText(e.target.value)} placeholder="Write a message" value={text} className="p-2 border rounded"/>
                    <button className="p-1 border rounded hover:font-bold hover:cursor-pointer" >Send</button>
           </form>
         </div>}
         </div>
      
        </div>
    )
}