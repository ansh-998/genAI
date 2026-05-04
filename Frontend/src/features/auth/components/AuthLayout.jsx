import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router";
import React from 'react'

const AuthLayout = () => {
    const { loading, user } = useAuth()

    if (loading) {
        return (<main><h1>Loading...</h1></main>)
    }

    if (!user) {
        return <Navigate to={'/login'} replace />
    }

    return <Outlet />
}

export default AuthLayout