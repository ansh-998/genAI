// Shows loading state and user info to the rest of the app
import { createContext, useState } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) // ✅ MUST be true — prevents Protected from rendering before getMe() completes

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}