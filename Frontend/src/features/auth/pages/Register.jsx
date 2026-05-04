import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"   // ✅ Fixed: was missing scss import
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { user, loading, handleRegister, error } = useAuth()  // ✅ Added: get error from useAuth

    //  Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            navigate('/')
        }
    }, [user, loading, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await handleRegister({ username, email, password })
            navigate("/")
        } catch (err) {
            // Error is handled in useAuth
        }
    }

    if (loading) {
        return (<main><h1>Loading.......</h1></main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>

                {/* ✅ Added: show error message to user if registration fails */}
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            type="text"
                            id="username"
                            name='username'
                            placeholder='Enter username'
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            id="email"
                            name='email'
                            placeholder='Enter email address'
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            id="password"
                            name='password'
                            placeholder='Enter password'
                        />
                    </div>
                    <button className='button primary-button' type='submit'>Register</button>  {/* ✅ Added: type='submit' */}
                </form>

                <p>Already have an account? <Link to={"/login"}>Login</Link></p>
            </div>
        </main>
    )
}

export default Register