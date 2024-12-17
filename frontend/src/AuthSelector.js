// frontend/src/AuthSelector.js
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './App.css'; 

const AuthSelector = () => {
    const [isLogin, setIsLogin] = useState(true);  // Controla si se muestra el formulario de login o registro

    return (
        <div>
            {isLogin ? (
                <Login setToken={() => {}} />  // El componente de Login
            ) : (
                <Register />  // El componente de Register
            )}
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Registro' : 'inicio de sesion'}
            </button>
        </div>
    );
};

export default AuthSelector;
