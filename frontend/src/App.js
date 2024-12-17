// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthSelector from './AuthSelector'; //autenticación (login/registro)
import PostList from './Postlist'; 
import UploadPost from './UploadPost/CrearTarea'; 
import Profile from './publicPost/PublicPost';  

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página de autenticación */}
        <Route path="/" element={<AuthSelector />} /> {/* Página inicial de login/registro */}

        {/* Ruta para ver los posts */}
        <Route path="/posts" element={<PostList />} />

        {/* Ruta para subir un nuevo post */}
        <Route path="/UploadPost" element={<UploadPost />} />

        {/* Ruta para ver el perfil del usuario */}
        <Route path="/profile" element={<Profile />} /> {/* Usa 'Profile' directamente */}
      </Routes>
    </Router>
  );
};

export default App;
