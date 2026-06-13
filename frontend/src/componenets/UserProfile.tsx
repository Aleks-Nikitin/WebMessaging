import { useState, type FormEvent } from "react";
import { useAuth } from "../AuthContext";

type EditableField = "firstname" | "lastname" | "email" | null;

function UserProfile() {
    const { user, isLoading, authFetch, setUser } = useAuth();
    const [openField, setOpenField] = useState<EditableField>(null);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (!user) {
        return <h1>You are not authenticated. Please log in.</h1>;
    }

    function toggleField(field: Exclude<EditableField, null>) {
        setOpenField((current) => (current === field ? null : field));
    }

    async function submitUpdate(
        e: FormEvent<HTMLFormElement>,
        field: Exclude<EditableField, null>,
        value: string,
        path: string
    ) {
        e.preventDefault();

        if (!value.trim()) {
            return;
        }

        const response = await authFetch(`${import.meta.env.VITE_BACKEND}/users/update/${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ [field]: value }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update ${field}`);
        }

        const body = await response.json().catch(() => null);
        if (body?.user) {
            setUser(body.user);
        }

        setOpenField(null);
        setFirstname("");
        setLastname("");
        setEmail("");
    }

    return (
        <section className="p-4">
            <h1 className="mb-6 text-3xl text-amber-300">Profile page</h1>

            <div className="flex flex-col items-center gap-4 text-2xl text-blue-400 ">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-2xl">
                        <p>
                            First Name: <span className="text-green-300">{user.firstname}</span>
                        </p>
                        <button
                            className="text-xl text-white hover:cursor-pointer hover:font-bold"
                            type="button"
                            onClick={() => toggleField("firstname")}
                        >
                            Update
                        </button>
                    </div>

                    <form
                        hidden={openField !== "firstname"}
                        onSubmit={(e) => submitUpdate(e, "firstname", firstname, "firstname")}
                        className="flex flex-col gap-2"
                    >
                        <div className="flex gap-2">
                            <input
                                id="firstname-update"
                                type="text"
                                name="firstname"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                className="rounded bg-white px-2 py-1 text-black"
                            />
                            <button className="rounded border px-3 py-1 text-white hover:cursor-pointer hover:font-bold">
                                submit
                            </button>
                        </div>
                    </form>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <p>
                            Surname: <span className="text-green-300">{user.lastname}</span>
                        </p>
                        <button
                            className="text-xl text-white hover:cursor-pointer hover:font-bold"
                            type="button"
                            onClick={() => toggleField("lastname")}
                        >
                            Update
                        </button>
                    </div>

                    <form
                        hidden={openField !== "lastname"}
                        onSubmit={(e) => submitUpdate(e, "lastname", lastname, "lastname")}
                        className="flex flex-col gap-2"
                    >
                    
                        <div className="flex gap-2">
                            <input
                                id="lastname-update"
                                type="text"
                                name="lastname"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                className="rounded bg-white px-2 py-1 text-black"
                            />
                            <button className="rounded border px-3 py-1 text-white hover:cursor-pointer hover:font-bold">
                                submit
                            </button>
                        </div>
                    </form>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <p>
                            Email: <span className="text-green-300">{user.email}</span>
                        </p>
                        <button
                            className="text-xl text-white hover:cursor-pointer hover:font-bold"
                            type="button"
                            onClick={() => toggleField("email")}
                        >
                            Update
                        </button>
                    </div>

                    <form
                        hidden={openField !== "email"}
                        onSubmit={(e) => submitUpdate(e, "email", email, "email")}
                        className="flex flex-col gap-2"
                    >
                    
                        <div className="flex gap-2">
                            <input
                                id="email-update"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded bg-white px-2 py-1 text-black"
                            />
                            <button className="rounded border px-3 py-1 text-white hover:cursor-pointer hover:font-bold">
                                submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default UserProfile;