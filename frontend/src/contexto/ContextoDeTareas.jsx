import { createContext, useContext, useState, useCallback, useEffect } from 'react';

// inicia el contexto
const ContextoDeTareas = createContext({
  tareas: [],
  cargando: false,
  obtenerTareas: async () => {},
  crearTarea: async () => ({ success: false }),
  actualizarTarea: async () => ({ success: false })
});

export const useTareas = () => {
  const context = useContext(ContextoDeTareas);
  if (!context) {
    console.error(" Error Crítico: useTareas invocado sin ProveedorDeTareas.");
  }
  return context;
};

export const ProveedorDeTareas = ({ children }) => {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Helper
  const getToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (e) {
      return null;
    }
  };

  // OBTENER TAREAS
  const obtenerTareas = useCallback(async (proyectoId) => {
    const token = getToken();
    if (!token) return; 
    
    setCargando(true);
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/tasks/${proyectoId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTareas(data);
      }
    } catch (error) {
      console.error("Error obteniendo tareas:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  // CREAR TAREA
  const crearTarea = async (proyectoId, titulo, descripcion) => {
    const token = getToken();
    if (!token) return { success: false, message: "No hay sesión" };

    try {
      const idNumerico = parseInt(proyectoId, 10);
      const response = await fetch('http://127.0.0.1:3000/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ proyectoId: idNumerico, titulo, descripcion }),
      });

      const data = await response.json();

      if (response.ok) {
        setTareas((prev) => [data, ...prev]);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  //ACTUALIZAR TAREA
  const actualizarTarea = async (tareaId, datos) => {
    const token = getToken();
    if (!token) return { success: false };

    try {
      setTareas(prev => prev.map(t => 
        t.tarea_id === tareaId ? { ...t, ...datos } : t
      ));

      const response = await fetch(`http://127.0.0.1:3000/api/tasks/${tareaId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos), // Enviamos el objeto completo
      });

      if (!response.ok) {
        console.error("Error al guardar cambios en DB");
        return { success: false };
      }
      
      return { success: true };

    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  const eliminarTarea = async (tareaId) => {
    const token = getToken();
    if (!token) return { success: false, message: "No hay sesión" };

    try {
      setTareas(prev => prev.filter(t => t.tarea_id !== tareaId));

      const response = await fetch(`http://127.0.0.1:3000/api/tasks/${tareaId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        console.error("Error al borrar en servidor");
        return { success: false };
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <ContextoDeTareas.Provider value={{ tareas, cargando, obtenerTareas, crearTarea, actualizarTarea, eliminarTarea, }}>
      {children}
    </ContextoDeTareas.Provider>
  );
  
};
