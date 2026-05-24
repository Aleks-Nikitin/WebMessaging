import { useAuth } from "../AuthContext";

function UserProfile() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (!user) {
        return <h1>You are not authenticated. Please log in.</h1>;
    }

    return (
        <section>
            <h1 className="text-2xl text-amber-300">Profile page</h1>

            <div className="flex flex-col align-baseline text-xl text-blue-400">
                <div>First Name: {user.firstname}</div>
                <div>Surname: {user.lastname}</div>
                <div>Email: {user.email}</div>
            </div>
           
        </section>
    );
}

export default UserProfile;