import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [inputs, setInputs] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch('http://localhost:8800/user');
            const data = await response.json()
            console.log(data);

            // Search for matching username and password
            const user = data.find(user => 
                user.username === inputs.username && user.password === inputs.password
            );
            
            if (user) {
                if(user.username === 'admin' && user.password === 'admin')
                    {
                        navigate('/addelete');
                    }
                    else
                    {
                        navigate('/menu'); // Redirect to menu page upon successful login
                    }
                
            } else {
                
                alert('Username or password is incorrect.');
            }
        } catch (error) {
            console.error('Error:', error.message);
            alert('An error occurred while trying to log in.');
        }
            
        
    };

    return (
        <div className="login-box">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="user-box">
                    <input 
                    type="text" 
                    name="username" 
                    value={inputs.username} 
                    required onChange={handleChange} />
                    <label>Username</label>
                </div>
                <div className="user-box">
                    <input 
                    type="password" 
                    name="password" 
                    value={inputs.password} 
                    required 
                    onChange={handleChange} />
                    <label>Password</label>

                </div>
               
               
                <button type="submit" >Login</button>
               
                <a
                href="/register">
                Don't have an account?
                </a>
               
                <a
                href="/update">
                Update Password
                </a>
               
            </form>
        </div>
    );
}

export default Login;
