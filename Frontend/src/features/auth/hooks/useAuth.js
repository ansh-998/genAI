import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context
    const [error, setError] = useState(null)


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        setError(null)
        try {
            const data = await login({ email, password })
            setUser(data.user)
        } catch (err) {
            setError(err.message || "Login failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        setError(null)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        setError(null)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            setError(err.message || "Logout failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Runs on mount — checks if user is already logged in via cookie
    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                setUser(null) // token invalid/expired — treat as logged out
            } finally {
                setLoading(false) // ✅ MUST run — releases the loading lock in Protected
            }
        }

        getAndSetUser()
    }, [])

    return { user, loading, error, handleRegister, handleLogin, handleLogout }
}