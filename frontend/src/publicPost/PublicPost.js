import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TaskView from '../TaskView'; // Importa el componente TaskView
import './PublicPost.module.css';

const PublicPost = () => {
  const [posts, setPosts] = useState([]); // Lista de tareas públicas
  const [filteredPosts, setFilteredPosts] = useState([]); // Lista filtrada
  const [selectedTask, setSelectedTask] = useState(null); // Tarea seleccionada para mostrar detalles
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const [filterState, setFilterState] = useState('todas'); // Estado para el filtro
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!token) {
      alert('Por favor, inicia sesión para continuar.');
      navigate('/');
      return;
    }

    // Solicitar todas las tareas públicas
    axios
      .get('http://192.168.1.132:7000/api/tareas-publicas/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPosts(response.data);
        setFilteredPosts(response.data); // Mostrar todas inicialmente
      })
      .catch((error) => {
        console.error('Error al obtener tareas públicas:', error);
        setError('No autorizado. Inicia sesión nuevamente.');
        navigate('/');
      });
  }, [token, navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const misTareas = () => {
    navigate('/posts');
  };

  const crearTarea = () => {
    navigate('/UploadPost');
  };

  const getPriorityClass = (priority) => {
    if (priority === 'baja') return 'priority-low';
    if (priority === 'media') return 'priority-medium';
    if (priority === 'alta') return 'priority-high';
    return '';
  };

  const handleFilterChange = (e) => {
    const selectedState = e.target.value;
    setFilterState(selectedState);

    if (selectedState === 'todas') {
      setFilteredPosts(posts); // Mostrar todas las tareas
    } else {
      setFilteredPosts(posts.filter((post) => post.estado === selectedState)); // Filtrar por estado
    }
  };

  // Manejar clic en una tarea para mostrar detalles
  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  // Cerrar el modal de detalles
  const closeTaskView = () => {
    setSelectedTask(null);
  };

  return (
    <div className={`container ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className={`sidebar ${isMenuOpen ? 'show' : ''}`}>
        <div className="sidebar-links">
          <a href="#logout" onClick={misTareas}>
            Mis tareas
          </a>
          <a href="#logout" onClick={crearTarea}>
            Crear Tarea
          </a>
          <a href="#logout" onClick={handleLogout}>
            Log Out
          </a>
        </div>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        &#9776;
      </div>

      <div className="content">
        <div className="header">
          <h2>Tareas Públicas</h2>
          <div className="filter">
            <label htmlFor="filterState">Filtrar por estado:</label>
            <select
              id="filterState"
              value={filterState}
              onChange={handleFilterChange}
            >
              <option value="todas">Todas</option>
              <option value="pendiente">Pendientes</option>
              <option value="completada">Completadas</option>
            </select>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Fecha de Creación</th>
                <th>Creado por</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} onClick={() => handleTaskClick(post)}>
                    <td className={getPriorityClass(post.prioridad)}>
                      {post.titulo}
                    </td>
                    <td>{post.descripcion}</td>
                    <td>{post.estado}</td>
                    <td>{new Date(post.fecha_creacion).toLocaleString()}</td>
                    <td>
                      {post.usuario.nombre_completo || post.usuario.username}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    No hay publicaciones públicas disponibles para este estado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para ver detalles */}
      {selectedTask && (
        <TaskView task={selectedTask} onClose={closeTaskView} />
      )}
    </div>
  );
};

export default PublicPost;
