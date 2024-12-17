import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TaskDetails from './TaskDetails'; // Importa el nuevo componente
import './PostList.css';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null); // Nueva tarea seleccionada
  const [filterState, setFilterState] = useState('todas'); // Filtro por estado
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!token) {
      alert('Por favor, inicia sesión para continuar.');
      navigate('/');
      return;
    }

    axios
      .get('http://192.168.1.132:7000/api/tareas/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTasks(response.data);
        setFilteredTasks(response.data); // Inicializa las tareas filtradas
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setError('No autorizado. Inicia sesión nuevamente.');
          navigate('/');
        } else {
          setError('Ocurrió un error al cargar las tareas. Inténtalo de nuevo.');
        }
      });
  }, [token, navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const tareasGenerales = () => {
    navigate('/profile');
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

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    applyFilter(filterState); // Actualiza la vista filtrada
  };

  const handleFilterChange = (e) => {
    const selectedState = e.target.value;
    setFilterState(selectedState);
    applyFilter(selectedState);
  };

  const applyFilter = (filter) => {
    if (filter === 'todas') {
      setFilteredTasks(tasks); // Mostrar todas las tareas
    } else {
      setFilteredTasks(tasks.filter((task) => task.estado === filter)); // Filtrar por estado
    }
  };

  return (
    <div className={`container ${isMenuOpen ? 'menu-open' : ''}`}>
      {/* Barra lateral */}
      <div className={`sidebar ${isMenuOpen ? 'show' : ''}`}>
        <div className="sidebar-links">
          <a href="#tareas" onClick={tareasGenerales}>
            Tareas Generales
          </a>
          <a href="#crear" onClick={crearTarea}>
            Crear Tarea
          </a>
          <a href="#logout" onClick={handleLogout}>
            Cerrar Sesión
          </a>
        </div>
      </div>

      {/* Icono de hamburguesa */}
      <div className="hamburger" onClick={toggleMenu}>
        &#9776;
      </div>

      {/* Contenido principal */}
      <div className="content">
        <div className="header">
          <h2>Mis Tareas</h2>
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
                {/* Columna Estado oculta en pantallas pequeñas */}
                <th className="hide-on-small">Estado</th>
                <th>Fecha de Creación</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="task-row"
                    onClick={() => handleTaskClick(task)} // Abrir ventana al hacer clic
                  >
                    <td className={getPriorityClass(task.prioridad)}>
                      {task.titulo}
                    </td>
                    <td>{task.descripcion}</td>
                    <td className="hide-on-small">{task.estado}</td>
                    <td>{new Date(task.fecha_creacion).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay tareas disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ventana de detalles */}
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
}

export default TaskList;
