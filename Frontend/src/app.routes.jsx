import { createBrowserRouter, Navigate } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import AuthLayout from "./features/auth/components/AuthLayout";
import PublicLayout from "./features/auth/components/PublicLayout";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "interview/:interviewId",
                element: <Interview />
            }
        ]
    },
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
])