import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TaskDetails.css'; 

function TaskDetails({ task, onClose, onTaskUpdated }) {
  const [titulo, setTitulo] = useState(task.titulo);
  const [descripcion, setDescripcion] = useState(task.descripcion);
  const [estado, setEstado] = useState(task.estado);
  const [prioridad, setPrioridad] = useState(task.prioridad);
  const [visibilidad, setVisibilidad] = useState(task.visibilidad);
  const [etiquetas, setEtiquetas] = useState(task.etiquetas.map((etiqueta) => etiqueta.nombre));
  const [availableEtiquetas, setAvailableEtiquetas] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  // Cargar etiquetas disponibles al montar el componente
  React.useEffect(() => {
    axios
      .get(`http://192.168.1.132:7000/api/etiquetas/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAvailableEtiquetas(response.data);
      })
      .catch((error) => console.error('Error al cargar etiquetas:', error));
  }, [token]);

  const handleUpdate = () => {
    const updatedData = {
      titulo,
      descripcion,
      estado,
      prioridad,
      visibilidad,
      etiquetas, 
    };

    axios
      .put(`http://192.168.1.132:7000/api/tareas/${task.id}/`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        alert('Tarea actualizada con éxito.');
        onTaskUpdated(response.data);
        onClose();
      })
      .catch((error) => {
        alert('Error al actualizar la tarea.');
        console.error(error);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`http://192.168.1.132:7000/api/tareas/${task.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert('Tarea eliminada con éxito.');
        onClose();
        navigate('/profile'); // Redirige a la lista de tareas
      })
      .catch((error) => {
        alert('Error al eliminar la tarea.');
        console.error(error);
      });
  };

  return (
    <div className="task-details-modal">
      <div className="task-details-content">
        <h2>Detalles de la Tarea</h2>
        <label>
          Título:
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </label>
        <label>
          Descripción:
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </label>
        <label>
          Estado:
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>
        </label>
        <label>
          Prioridad:
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </label>
        <label>
          Visibilidad:
          <select
            value={visibilidad}
            onChange={(e) => setVisibilidad(e.target.value)}
          >
            <option value="publico">Público</option>
            <option value="privado">Privado</option>
          </select>
        </label>
        <label>
          Etiquetas:
          <select
            multiple
            value={etiquetas}
            onChange={(e) =>
              setEtiquetas(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {availableEtiquetas.map((etiqueta) => (
              <option key={etiqueta.id} value={etiqueta.nombre}>
                {etiqueta.nombre}
              </option>
            ))}
          </select>
        </label>
        <div className="task-details-actions">
          <button onClick={handleUpdate}>Guardar Cambios</button>
          <button onClick={handleDelete} className="delete-button">
            Eliminar
          </button>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
