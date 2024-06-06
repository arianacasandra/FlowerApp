import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UpdatePassword() {
    const [inputs, setInputs] = useState({ username: '', oldPassword: '', newPassword: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        const { username, oldPassword, newPassword } = inputs;

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            const response = await fetch('http://localhost:8800/update-password', { // Updated URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, oldPassword, newPassword }),
            });

            if (response.ok) {
                // Password updated successfully
                alert('Password updated successfully');
                navigate('/login'); // Redirect to login or another appropriate page
            } else {
                // Handle errors
                const errorData = await response.json();
                setError(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setError('An error occurred while updating the password. Please try again later.');
        }
    };

    return (
        <div className="login-box">
            <h2>Update Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="user-box">
                    <input
                        type="text"
                        name="username"
                        value={inputs.username}
                        required
                        onChange={handleChange}
                    />
                    <label>Username</label>
                </div>
                <div className="user-box">
                    <input
                        type="password"
                        name="oldPassword"
                        value={inputs.oldPassword}
                        required
                        onChange={handleChange}
                    />
                    <label>Old Password</label>
                </div>
                <div className="user-box">
                    <input
                        type="password"
                        name="newPassword"
                        value={inputs.newPassword}
                        required
                        onChange={handleChange}
                    />
                    <label>New Password</label>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Save</button>
            </form>
        </div>
    );
}

export default UpdatePassword;
