import { useContext, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";
import { useNavigate } from "react-router";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context
    const [error, setError] = useState(null)
    const navigate = useNavigate()


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        setError(null)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return data.user
        } catch (err) {
            setError(err.message || "Login failed. Please try again.")
            throw err
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
            return data.user
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.")
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        setError(null)
        try {
            //  2-second delay before proceeding with logout
            await new Promise(resolve => setTimeout(resolve, 2000))
            await logout()
            setUser(null)
            navigate('/login', { state: { message: "User logged out successfully" } })
        } catch (err) {
            setError(err.message || "Logout failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }


    return { user, loading, error, handleRegister, handleLogin, handleLogout }
}