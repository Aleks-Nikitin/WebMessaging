import { useEffect, useState, type ChangeEvent } from "react";
import { useAuth } from "../AuthContext";

type UserOption = {
    id: number;
    firstname: string;
    lastname: string;
    email:string;
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
    const hasActiveChat = activeChatId !== null;

    function handleUserSearchChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setSearchValue(value);

        const matchedUser = userList.find(
            (candidate) => `${candidate.email}` === value
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
        <div className="chat-page flex min-h-0 flex-1 flex-col p-4">
         <h1 className="text-2xl font-semibold mb-4">Chat with users!</h1>
         <div className="chat-shell grid flex-1 min-h-0 grid-cols-[16rem_minmax(0,1fr)] gap-4 rounded-lg p-4">
            <aside className="chat-sidebar min-h-0 overflow-y-auto border-r pr-4 text-left">
                <h2 className="mb-3 font-semibold">Chats:</h2>
                <ul className="space-y-2">
                    {chatArr.map((chat)=>{
                        let chatter = userList.find((user)=> user.id == chat.chatter);
                        const isSelected = chatter?.id === selectedUserId;
                        return (
                            <li
                                className={`cursor-pointer rounded px-2 py-1 hover:font-semibold wrap-break-word ${
                                    isSelected ? "bg-green-600 text-white font-semibold" : ""
                                }`}
                                onClick={() => handleChatSelect(chat)}
                                key={chat.chatId}
                            >
                                {`${chatter?.email}`}
                            </li>
                        )
                    })}
                </ul>
            </aside>

            <section
                className={`chat-main grid min-h-0 gap-4 ${
                    hasActiveChat ? "grid-rows-[auto_minmax(0,1fr)]" : "grid-rows-[auto]"
                }`}
            >
                <div className="chat-search shrink-0 text-left">
                    <p>Search by username:</p>
                    <form onSubmit={handleChatCreation} className="search-form mt-2 flex items-center gap-2">
                        <input
                            list="users"
                            name="user-selected"
                            className="w-full max-w-md rounded border bg-white px-3 py-2 text-black"
                            value={searchValue}
                            onChange={handleUserSearchChange}
                        />
                        <button type="submit" className="shrink-0 rounded border px-3 py-2 hover:cursor-pointer hover:font-bold">
                            Create Chat
                        </button>
                        <datalist id="users">
                            {userList.map((candidate) => (
                                <option
                                    key={candidate.id}
                                    value={`${candidate.email}`}
                                />
                            ))}
                        </datalist>
                    </form>
                </div>

                {activeChatId && (
                    <div className="chat-panel flex min-h-0 max-h-[65vh] flex-col overflow-hidden rounded-xl border bg-slate-50 text-slate-800 shadow-sm">
                        <div className="chat-message-list min-h-0 flex-1 overflow-y-auto p-4">
                            <div className="space-y-3 flex flex-col">
                                {messages.map((msg)=>{
                                    let text = msg.text;
                                    let userLabel = msg.userId == currentUser.id ? "me" : "them";
                                    let userColor =msg.userId == currentUser.id  ? true : false;
                                    return (
                                        <div className={`chat-bubble rounded-lg p-2 shadow-sm ${userColor ? "bg-blue-200 self-start" : "bg-gray-200 self-end"}`} key={msg.id}>
                                            <h4 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-800">{userLabel}</h4>
                                            <p className="break-words whitespace-pre-wrap">{text}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <form onSubmit={handleMsgCreate} className="shrink-0 border-t bg-blue-900 p-3 text-white">
                            <div className="flex gap-2">
                                <textarea
                                    onChange={(e)=> setText(e.target.value)}
                                    placeholder="Write a message"
                                    value={text}
                                    className="min-h-16 flex-1 rounded border p-2"
                                />
                                <button className="rounded border p-2 hover:cursor-pointer hover:font-bold" >Send</button>
                            </div>
                        </form>
                    </div>
                )}
            </section>
         </div>
        </div>
    )
}