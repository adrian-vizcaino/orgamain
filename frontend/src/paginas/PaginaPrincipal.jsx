import { useState, useEffect } from 'react';
import { useAuth } from '../contexto/AuthContext';
import { useProyectos } from '../contexto/ContextoDeProyectos';
import { useNavigate } from 'react-router-dom';
// Se añade Trash2 a los imports existentes para el botón de borrar
import { Plus, Folder, LogOut, Wrench, ClipboardList, GraduationCap, ArrowLeft, CheckCircle, Trash2, Pencil } from 'lucide-react';

const PaginaPrincipal = () => {
  const { user, logout } = useAuth();
  // Incluimos actualizarProyecto del contexto
  const { proyectos, obtenerProyectos, crearProyecto, actualizarProyecto, cargando } = useProyectos();
  const navigate = useNavigate();

  // Estado para el modal de CREAR
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [nuevoProyecto, setNuevoProyecto] = useState({ nombre: '', descripcion: '' });

  // Estado para el modal de EDITAR
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState(null); // Guarda el proyecto completo que se está editando
  const [datosEdicion, setDatosEdicion] = useState({ nombre: '', descripcion: '' }); // Guarda los datos del formulario de edición
  
  // Estado para controlar la navegación interna del panel
  const [seccionActiva, setSeccionActiva] = useState('menu');

  useEffect(() => {
    if (seccionActiva === 'herramientas') {
      obtenerProyectos();
    }
  }, [obtenerProyectos, seccionActiva]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- LÓGICA DE CREACIÓN ---
  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nuevoProyecto.nombre.trim()) return;

    const resultado = await crearProyecto(nuevoProyecto.nombre, nuevoProyecto.descripcion);
    if (resultado.success) {
      setMostrarModalCrear(false);
      setNuevoProyecto({ nombre: '', descripcion: '' });
      obtenerProyectos();
    } else {
      alert(resultado.message);
    }
  };

  // --- LÓGICA DE EDICIÓN ---
  const abrirModalEditar = (proyecto, e) => {
    e.stopPropagation(); // Evita navegar al detalle
    setProyectoEditando(proyecto);
    setDatosEdicion({ 
      nombre: proyecto.nombre, 
      descripcion: proyecto.descripcion || '' 
    });
    setMostrarModalEditar(true);
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    if (!datosEdicion.nombre.trim()) return;

    // Llamamos a la función actualizarProyecto del contexto
    const resultado = await actualizarProyecto(proyectoEditando.proyecto_id, datosEdicion);
    
    if (resultado.success) {
      setMostrarModalEditar(false);
      setProyectoEditando(null);
      setDatosEdicion({ nombre: '', descripcion: '' });
      // obtenerProyectos(); // No es estrictamente necesario si el contexto actualiza el estado local, pero es seguro.
    } else {
      alert(resultado.message);
    }
  };

  // --- LÓGICA DE ELIMINACIÓN ---
  const handleEliminar = async (id, e) => {
    e.stopPropagation(); 
    
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.");
    if (!confirmar) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Sesión no válida. Por favor, sal y vuelve a entrar.");
            return;
        }

        const response = await fetch(`http://localhost:3000/api/proyecto/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            await obtenerProyectos();
        } else {
            const errorData = await response.json().catch(() => ({})); 
            console.error("Error del servidor al eliminar:", errorData);
            alert(`No se pudo eliminar: ${errorData.message || 'Error en el servidor'}`);
        }

    } catch (error) {
        console.error("Error de red al intentar eliminar:", error);
        alert("Hubo un error de conexión al intentar eliminar el proyecto.");
    }
  };

  // VISTA 1: MENÚ PRINCIPAL
  const renderMenuPrincipal = () => (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 animate-fade-in">
      <header className="mb-12 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Hola, <span className="text-blue-600">{user?.nombre || user?.email}</span>
        </h1>
        <p className="text-gray-500 mt-3 text-lg">¿Qué te gustaría hacer hoy?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cajón 1: Herramientas (Proyectos) */}
        <div 
          onClick={() => setSeccionActiva('herramientas')}
          className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group h-80 flex flex-col justify-between"
        >
          <div>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <Wrench size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">Herramientas</h3>
            <p className="text-gray-500 leading-relaxed">
              Accede a tu espacio de trabajo. Gestiona tus <strong>proyectos</strong> y tareas activas desde aquí.
            </p>
          </div>
          <div className="flex items-center text-blue-600 font-semibold mt-4 group-hover:translate-x-2 transition-transform">
            Entrar <ArrowLeft size={18} className="ml-2 rotate-180" />
          </div>
        </div>

        {/* Cajón 2: Test de Diagnóstico */}
        <div 
          onClick={() => navigate('/diagnostico')}
          className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:border-purple-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group h-80 flex flex-col justify-between"
        >
          <div>
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <ClipboardList size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">Test de Diagnóstico</h3>
            <p className="text-gray-500 leading-relaxed">
              Evalúa tu productividad y descubre áreas de mejora con nuestros tests personalizados.
            </p>
          </div>
          <div className="flex items-center text-purple-600 font-semibold mt-4 group-hover:translate-x-2 transition-transform">
            Realizar Test <ArrowLeft size={18} className="ml-2 rotate-180" />
          </div>
        </div>

        {/* Cajón 3: Cursos y Consejos */}
        <div 
          onClick={() => setSeccionActiva('cursos')}
          className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:border-orange-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group h-80 flex flex-col justify-between"
        >
          <div>
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <GraduationCap size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">Cursos y Consejos</h3>
            <p className="text-gray-500 leading-relaxed">
              Aprende nuevas metodologías de organización y accede a recursos educativos.
            </p>
          </div>
          <div className="flex items-center text-orange-600 font-semibold mt-4 group-hover:translate-x-2 transition-transform">
            Explorar <ArrowLeft size={18} className="ml-2 rotate-180" />
          </div>
        </div>
      </div>
    </div>
  );

  // VISTA 2: HERRAMIENTAS (PROYECTOS)
  const renderHerramientas = () => (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 animate-fade-in">
      
      {/* Navegación Interna */}
      <div className="flex items-center gap-2 mb-8 text-sm text-gray-500">
        <button 
          onClick={() => setSeccionActiva('menu')}
          className="hover:text-blue-600 hover:underline flex items-center transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> Panel Principal
        </button>
        <span>/</span>
        <span className="font-semibold text-gray-800">Herramientas</span>
      </div>

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Wrench className="text-blue-600" size={32} />
            Mis Proyectos
          </h1>
          <p className="text-gray-500 mt-2">
            {cargando ? 'Cargando...' : `Tienes ${proyectos.length} proyectos activos en tu taller.`}
          </p>
        </div>
        
        <button 
          onClick={() => setMostrarModalCrear(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
        >
          <Plus size={20} />
          Nuevo Proyecto
        </button>
      </header>

      {/* Grid de Proyectos */}
      {cargando ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Tarjeta Crear */}
          <div 
            onClick={() => setMostrarModalCrear(true)}
            className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 cursor-pointer transition-all min-h-[220px] group"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
              <Plus size={24} />
            </div>
            <span className="font-medium">Crear proyecto nuevo</span>
          </div>

          {/* Listado de Proyectos */}
          {proyectos.map((proyecto) => (
            <div 
              key={proyecto.proyecto_id} 
              onClick={() => navigate(`/proyecto/${proyecto.proyecto_id}`)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between min-h-[220px] group cursor-pointer"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <Folder size={20} />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${proyecto.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {proyecto.estado || 'Activo'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{proyecto.nombre}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {proyecto.descripcion || 'Sin descripción'}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-400">
                <span>{new Date(proyecto.fecha_creacion).toLocaleDateString()}</span>
                
                <div className="flex gap-2">
                  {/* Botón EDITAR */}
                  <button 
                    onClick={(e) => abrirModalEditar(proyecto, e)}
                    className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors z-10"
                    title="Editar proyecto"
                  >
                    <Pencil size={18} />
                  </button>

                  {/* Botón ELIMINAR */}
                  <button 
                    onClick={(e) => handleEliminar(proyecto.proyecto_id, e)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors z-10"
                    title="Eliminar proyecto"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    className="text-blue-600 font-semibold hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                  >
                    Abrir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // VISTAS PLACEHOLDER
  const renderPlaceholder = (titulo, Icono, color) => (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 animate-fade-in h-[80vh] flex flex-col items-center justify-center text-center">
      <div className={`w-20 h-20 ${color} rounded-full flex items-center justify-center mb-6`}>
        <Icono size={40} className="text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{titulo}</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Estamos trabajando en esta sección para traerte las mejores herramientas. ¡Pronto estará disponible!
      </p>
      <button 
        onClick={() => setSeccionActiva('menu')}
        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
      >
        <ArrowLeft size={18} /> Volver al Menú
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* NAVBAR SUPERIOR */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => { setSeccionActiva('menu'); navigate('/'); }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
              <img src='/svg/logo-orgamain-desktop.svg' alt="Logo" />
            </div>
            <span className="text-xl font-bold text-gray-800">Orgamain</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-500 hidden sm:block">
              {user?.nombre || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </div>
      </nav>

      {/* GESTOR DE VISTAS */}
      {seccionActiva === 'menu' && renderMenuPrincipal()}
      {seccionActiva === 'herramientas' && renderHerramientas()}
      {seccionActiva === 'test' && renderPlaceholder('Test de Diagnóstico', ClipboardList, 'bg-purple-500')}
      {seccionActiva === 'cursos' && renderPlaceholder('Cursos y Consejos', GraduationCap, 'bg-orange-500')}

      {/* MODAL CREAR PROYECTO */}
      {mostrarModalCrear && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Nuevo Proyecto</h3>
              <button onClick={() => setMostrarModalCrear(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input 
                  autoFocus
                  type="text" 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: Web Corporativa"
                  value={nuevoProyecto.nombre}
                  onChange={(e) => setNuevoProyecto({...nuevoProyecto, nombre: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                  placeholder="¿De qué trata?"
                  value={nuevoProyecto.descripcion}
                  onChange={(e) => setNuevoProyecto({...nuevoProyecto, descripcion: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setMostrarModalCrear(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-colors"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR PROYECTO */}
      {mostrarModalEditar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Editar Proyecto</h3>
              <button onClick={() => setMostrarModalEditar(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleGuardarEdicion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input 
                  autoFocus
                  type="text" 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={datosEdicion.nombre}
                  onChange={(e) => setDatosEdicion({...datosEdicion, nombre: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                  value={datosEdicion.descripcion}
                  onChange={(e) => setDatosEdicion({...datosEdicion, descripcion: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setMostrarModalEditar(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaginaPrincipal;