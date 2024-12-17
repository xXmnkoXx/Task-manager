import React from 'react';
import './TaskView.css'; 

function TaskView({ task, onClose }) {
  return (
    <div className="task-view-modal">
      <div className="task-view-content">
        <h2>Detalles de la Tarea</h2>
        <p>
          <strong>Título:</strong> {task.titulo}
        </p>
        <p>
          <strong>Descripción:</strong> {task.descripcion}
        </p>
        <p>
          <strong>Estado:</strong> {task.estado}
        </p>
        <p>
          <strong>Prioridad:</strong> {task.prioridad}
        </p>
        <p>
          <strong>Visibilidad:</strong> {task.visibilidad}
        </p>
        <p>
          <strong>Etiquetas:</strong> {task.etiquetas.join(', ')}
        </p>
        <p>
          <strong>Creado por:</strong> {task.usuario.nombre_completo || task.usuario.username}
        </p>
        <p>
          <strong>Fecha de Creación:</strong>{' '}
          {new Date(task.fecha_creacion).toLocaleString()}
        </p>
        <p>
          <strong>Última Edición:</strong>{' '}
          {new Date(task.ultima_edicion).toLocaleString()}
        </p>
        <button onClick={onClose} className="close-button">
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default TaskView;
