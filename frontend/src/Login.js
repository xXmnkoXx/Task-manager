import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post('http://192.168.1.132:7000/login/', {
        username,
        password,
      });

      const { access, refresh, userId } = response.data;

      // Guarda el nombre de usuario y el ID del usuario en localStorage
      localStorage.setItem('userName', username);
      localStorage.setItem('userId', userId);  // Guarda el ID del usuario

      // Guarda los tokens en localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Este codigo solo existe para realizar pruebas de funcionamiento
      setAccessToken(access); 
      console.log('El nombre de usuario es: ', username);
      console.log('ID del usuario:', userId);  
      console.log('Token de acceso obtenido:', access);

      // Actualiza el estado global con el token
      setToken(access);


      navigate('/posts');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Credenciales incorrectas o sesión no válida.'); 
    }
  };

  // Función para decodificar el JWT y extraer el payload
  const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload); // Devuelve el objeto con la información del token
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      {/* Muestra el token si está disponible */}
      {accessToken && (
        <div className="token-display">
          <h3>Tu Token:</h3>
          <p>{accessToken}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
