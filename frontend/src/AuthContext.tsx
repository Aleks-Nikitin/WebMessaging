import { createContext, useContext, useState, type ReactNode } from "react";

type AuthContextValue = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // Attach access token automatically; if it expired, get a new one from refresh cookie once.
    async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
        const headers = new Headers((init && init.headers) || {});
        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }

        let response = await fetch(input, {
            ...init,
            headers,
            credentials: "include",
        });

        if (response.status !== 401) {
            return response;
        }

        const refreshResponse = await fetch("http://localhost:3000/refresh", {
            method: "GET",
            credentials: "include",
        });

        if (!refreshResponse.ok) {
            return response;
        }

        const refreshData = await refreshResponse.json().catch(() => null);
        const newAccessToken = refreshData?.accessToken;
        if (!newAccessToken) {
            return response;
        }

        setAccessToken(newAccessToken);
        headers.set("Authorization", `Bearer ${newAccessToken}`);

        response = await fetch(input, {
            ...init,
            headers,
            credentials: "include",
        });

        return response;
    }

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, authFetch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
}