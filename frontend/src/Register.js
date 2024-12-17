import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Datos que se envían al backend
        const data = {
            username,
            email,
            password,
            nombre_completo: nombreCompleto,
        };

        console.log('Datos enviados al backend:', data);

        try {
            const response = await axios.post('http://192.168.1.132:7000/register/', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                setSuccess('User registered successfully');
                setUsername('');
                setEmail('');
                setPassword('');
                setNombreCompleto('');
            }
        } catch (err) {
            console.error('Error en la solicitud:', err);
            setError('Error registering user: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Full Name"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
