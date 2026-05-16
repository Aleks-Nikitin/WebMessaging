import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

type User = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
};

function UserProfile() {
    const { authFetch } = useAuth();
    const [user, setUser] = useState<User>();
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadUser() {
            const response = await authFetch("http://localhost:3000/users/me", {
                method: "GET",
            });

            if (!response.ok) {
                setError("You are not authenticated. Please log in.");
                return;
            }

            const {user} = await response.json().catch(() => null);
            console.log(user)

            setUser(user);
        }

        void loadUser();
    }, [authFetch]);

    if (error) {
        return <h1>{error}</h1>;
    }

    return (
        <section>
            <h1>user profile page</h1>
            <ul>
                {user && (
                    <li >{user.firstname} {user.lastname} ({user.email})</li>
                )}
            </ul>
        </section>
    );
}

export default UserProfile;