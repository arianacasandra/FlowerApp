import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputs.email)) {
            setError('Invalid email format');
            return;
        }

        if (inputs.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (inputs.password !== inputs.confirmpassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8800/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: inputs.email,
                    username: inputs.username,
                    password: inputs.password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Registration successful');
                alert('Registration successful');
                navigate('/login');
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error:', error.message);
            setError('An error occurred while trying to register.');
        }
    };

    return (
        <div className="login-box">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="user-box">
                    <input
                        type="text"
                        name="email"
                        value={inputs.email || ''}
                        required
                        onChange={handleChange}
                    />
                    <label>Email</label>
                </div>
                <div className="user-box">
                    <input
                        type="text"
                        name="username"
                        value={inputs.username || ''}
                        required
                        onChange={handleChange}
                    />
                    <label>Username</label>
                </div>
                <div className="user-box">
                    <input
                        type="password"
                        name="password"
                        value={inputs.password || ''}
                        required
                        onChange={handleChange}
                    />
                    <label>Password</label>
                </div>
                <div className="user-box">
                    <input
                        type="password"
                        name="confirmpassword"
                        value={inputs.confirmpassword || ''}
                        required
                        onChange={handleChange}
                    />
                    <label>Confirm Password</label>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
