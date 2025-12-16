import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ContextoDeProyectos = createContext({
  proyectos: [],
  cargando: false,
  error: null,
  obtenerProyectos: async () => {},
  crearProyecto: async () => ({ success: false, message: "Contexto no listo" })
});

export const useProyectos = () => {
  const context = useContext(ContextoDeProyectos);
  if (!context) {
    console.error("Error: useProyectos usado sin Proveedor");
  }
  return context;
};

export const ProveedorDeProyectos = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  
  const { logout } = useAuth(); 

  const getToken = () => localStorage.getItem('token');

  const obtenerProyectos = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setCargando(true);
    try {
      const response = await fetch('http://127.0.0.1:3000/api/proyecto', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProyectos(data);
      } else {
        if (response.status === 401) {
            console.error(" Token rechazado al leer proyectos. Logout automático.");
            logout(); 
        }
      }
    } catch (err) {
      console.error("Error de red proyectos:", err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [logout]);

  const crearProyecto = async (nombre, descripcion) => {
    const token = getToken();
    
    // LOG
    console.log(" Intentando crear proyecto...");
    console.log(" Token usado:", token ? token.substring(0, 10) + "..." : "NINGUNO");

    if (!token) {
        return { success: false, message: "No hay sesión activa. Recarga la página." };
    }

    try {
      const response = await fetch('http://127.0.0.1:3000/api/proyecto', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, descripcion }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(" Proyecto creado!");
        setProyectos((prev) => [data, ...prev]);
        return { success: true };
      } else {
        console.error(" Error del servidor:", response.status, data);
        
        if (response.status === 401) {
            alert("Tu sesión ha caducado o el token es inválido. Vamos a cerrar sesión para arreglarlo.");
            logout();
            return { success: false, message: "Sesión expirada" };
        }
        return { success: false, message: data.message || 'Error al crear' };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

const eliminarProyecto = async (id) => {
    try {
      const token = localStorage.getItem('token'); 

      if (!token) {
         return { success: false, message: 'No hay sesión activa (token no encontrado)' };
      }

const response = await fetch(`http://localhost:3000/api/proyecto/${id}`, {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

      if (response.ok) {
          // Actualiza el estado eliminando el proyecto de la lista visual
          setProyectos(prev => prev.filter(p => p.proyecto_id !== id));
          return { success: true };
      } else {
          return { success: false, message: 'No se pudo eliminar el proyecto en el servidor' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };
const actualizarProyecto = async (id, datosActualizados) => {
    const token = getToken();
    if (!token) return { success: false, message: "No token" };

    try {
        const response = await fetch(`${API_BASE_URL}/api/proyecto/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados) // { nombre: 'Nuevo nombre', ... }
        });

        const data = await response.json();

        if (response.ok) {
            // Actualizamos el proyecto en el estado local sin recargar
            setProyectos(prev => prev.map(p => 
                p.proyecto_id === id ? { ...p, ...data } : p
            ));
            return { success: true };
        }
        return { success: false, message: data.message || "Error al actualizar" };
    } catch (error) {
        return { success: false, message: error.message };
    }
  };

  return (
    <ContextoDeProyectos.Provider value={{ proyectos, cargando, error, obtenerProyectos, crearProyecto,eliminarProyecto, actualizarProyecto }}>
      {children}
    </ContextoDeProyectos.Provider>
  );
};