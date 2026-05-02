import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

// ✅ Added: interceptor to extract real error messages from backend responses
// Without this, errors like "Account already exists" are lost and
// useAuth's catch block would receive a generic axios error instead
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || "Something went wrong."
        return Promise.reject(new Error(message))
    }
)


export async function register({ username, email, password }) {
    // ✅ Fixed: removed try/catch — let errors bubble up to useAuth's catch block
    // which sets the error state and shows it to the user
    const response = await api.post('/api/auth/register', {
        username, email, password
    })
    return response.data
}


export async function login({ email, password }) {
    // ✅ Fixed: removed try/catch — let errors bubble up to useAuth's catch block
    const response = await api.post("/api/auth/login", {
        email, password
    })
    return response.data
}


export async function logout() {
    // ✅ Fixed: removed try/catch — let errors bubble up to useAuth's catch block
    const response = await api.get("/api/auth/logout")
    return response.data
}


export async function getMe() {
    // ✅ Fixed: removed try/catch — if token is invalid/expired this will throw
    // and useAuth's catch block will set user to null, redirecting to login
    const response = await api.get("/api/auth/get-me")
    return response.data
}