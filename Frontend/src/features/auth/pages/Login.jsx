import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { user, loading, handleLogin, error } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message)
            // Clear the state so the message doesn't persist on refresh
            window.history.replaceState({}, document.title)
        }
    }, [location])

    //  Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            navigate('/')
        }
    }, [user, loading, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await handleLogin({ email, password })
            navigate('/')
        } catch (err) {
            // Error is handled in useAuth and exposed via 'error'
        }
    }

    if (loading) {
        return (<main><h1>Loading.......</h1></main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>

                {/* show success message (e.g. after logout) */}
                {successMessage && <p className="success-message" style={{ color: '#4ade80', marginBottom: '1rem', textAlign: 'center' }}>{successMessage}</p>}

                {/* show error message to user if login fails */}
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit}>
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
                    <button className='button primary-button' type='submit'>Login</button>
                </form>
                <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
            </div>
        </main>
    )
}

export default Login