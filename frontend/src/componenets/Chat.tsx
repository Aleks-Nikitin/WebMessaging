import { useAuth } from "../AuthContext";
export default function Chat(){

     const { user, isLoading } = useAuth();

     if (isLoading) {
        return <h1>Loading...</h1>;
     }

     if (!user) {
        return <h1>You are not authenticated. Please log in.</h1>;
     }

    return(
         <h1 className="text-2xl font-semibold mb-4">Chat for authorized users</h1>
    )
}