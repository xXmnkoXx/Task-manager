import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './TaskCreator.module.css';

const CrearTarea = () => {
  // Estados para manejar los valores de los campos del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('media');
  const [estado, setEstado] = useState('pendiente');
  const [visibilidad, setVisibilidad] = useState('privado');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [etiquetas, setEtiquetas] = useState('');
  const [message, setMessage] = useState(''); // Mensaje de éxito o error
  const [loading, setLoading] = useState(false); // Estado de carga

  const navigate = useNavigate();

  // Función para redirigir al listado de tareas
  const crearTarea = () => {
    navigate('/posts');
  };

  // Función para manejar el envío del formulario y crear la tarea
  const handleSubmit = async (e) => {
    e.preventDefault();

    const nombre = localStorage.getItem('userName');
    const id = localStorage.getItem('userId');

    // Datos a enviar al backend
    const tareaData = {
      nombre,
      id,
      titulo,
      descripcion,
      prioridad,
      estado,
      visibilidad,
      fecha_vencimiento: fechaVencimiento || null,
      etiquetas: etiquetas.split(',').map((etiqueta) => etiqueta.trim()),
    };

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        'http://localhost:7000/api/tareas/crear/',
        tareaData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        setMessage('Tarea creada con éxito!');
        setTimeout(() => {
          navigate('/posts');
        }, 1000);
      } else {
        setMessage('Error al crear la tarea. Verifica los campos.');
      }
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      setMessage('Tarea agregada con exito');
    } finally {
      setLoading(false);
    }
  };

  // Renderiza el formulario para crear una tarea
  return (
    <div className={styles.scrollWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Crear Nueva Tarea</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Campo para el título */}
          <div className={styles.formGroup}>
            <label htmlFor="titulo" className={styles.label}>
              Título
            </label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          {/* Campo para la descripción */}
          <div className={styles.formGroup}>
            <label htmlFor="descripcion" className={styles.label}>
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className={styles.textarea}
            />
          </div>

          {/* Campo para la prioridad */}
          <div className={styles.formGroup}>
            <label htmlFor="prioridad" className={styles.label}>
              Prioridad
            </label>
            <select
              id="prioridad"
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
              className={styles.select}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          {/* Campo para el estado */}
          <div className={styles.formGroup}>
            <label htmlFor="estado" className={styles.label}>
              Estado
            </label>
            <select
              id="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className={styles.select}
            >
              <option value="pendiente">Pendiente</option>
              <option value="pendiente">En Progreso</option>
              <option value="completada">Completada</option>
            </select>
          </div>

          {/* Campo para la visibilidad */}
          <div className={styles.formGroup}>
            <label htmlFor="visibilidad" className={styles.label}>
              Visibilidad
            </label>
            <select
              id="visibilidad"
              value={visibilidad}
              onChange={(e) => setVisibilidad(e.target.value)}
              className={styles.select}
            >
              <option value="publico">Público</option>
              <option value="privado">Privado</option>
            </select>
          </div>

          {/* Campo para la fecha de vencimiento */}
          <div className={styles.formGroup}>
            <label htmlFor="fecha-vencimiento" className={styles.label}>
              Fecha de Vencimiento
            </label>
            <input
              type="datetime-local"
              id="fecha-vencimiento"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Campo para las etiquetas */}
          <div className={styles.formGroup}>
            <label htmlFor="etiquetas" className={styles.label}>
              Etiquetas (separadas por coma)
            </label>
            <input
              type="text"
              id="etiquetas"
              value={etiquetas}
              onChange={(e) => setEtiquetas(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Botón para enviar */}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Creando...' : 'Crear Tarea'}
          </button>

          {/* Enlace para volver al menú */}
          <a href="#logout" onClick={crearTarea} className={styles.linkButton}>
            Volver al menú
          </a>
        </form>

        {/* Mensaje de éxito o error */}
        {message && <div className={styles.message}>{message}</div>}
      </div>
    </div>
  );
};

export default CrearTarea;
