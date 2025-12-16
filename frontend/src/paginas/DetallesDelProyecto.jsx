import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle, Circle, Clock, Trash2, Pencil, X, Save, AlertTriangle } from 'lucide-react';
import { useProyectos } from '../contexto/ContextoDeProyectos';
import { useTareas } from '../contexto/ContextoDeTareas';

const DetallesDelProyecto = () => {
  const { id } = useParams(); 
  const { proyectos, obtenerProyectos, cargando: cargandoProyectos } = useProyectos(); 
  const { tareas, obtenerTareas, crearTarea, actualizarTarea, eliminarTarea, cargando: cargandoTareas } = useTareas();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaTarea, setNuevaTarea] = useState({ titulo: '', descripcion: '' });

  const [tareaEditando, setTareaEditando] = useState(null);
  const [textoEditado, setTextoEditado] = useState('');
  const [tareaAEliminar, setTareaAEliminar] = useState(null);

  useEffect(() => {
    if (id) {
      obtenerTareas(id);
    }
  }, [id, obtenerTareas]);

  useEffect(() => {
    if (proyectos.length === 0 && !cargandoProyectos) {
      obtenerProyectos();
    }
  }, [proyectos.length, cargandoProyectos, obtenerProyectos]);

  const proyectoActual = proyectos.find((p) => p.proyecto_id === parseInt(id));

  //  CREAR TAREA 
  const handleCrearTarea = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.titulo.trim()) return;

    const resultado = await crearTarea(parseInt(id), nuevaTarea.titulo, nuevaTarea.descripcion);
    
    if (resultado && resultado.success) {
      setNuevaTarea({ titulo: '', descripcion: '' });
      setMostrarFormulario(false);
    } else {
      alert('Error: ' + (resultado?.message || "Error desconocido"));
    }
  };

  //  CAMBIAR ESTADO 
  const toggleEstado = async (tarea) => {
    const nuevoEstado = tarea.estado === 'completada' ? 'pendiente' : 'completada';
    await actualizarTarea(tarea.tarea_id, { estado: nuevoEstado });
  };

  //  ELIMINAR TAREA 
  const solicitarEliminacion = (tareaId) => {
    setTareaAEliminar(tareaId);
  };

  const confirmarEliminacion = async () => {
    if (tareaAEliminar) {
      await eliminarTarea(tareaAEliminar);
      setTareaAEliminar(null);
    }
  };

  //  INICIAR EDICIÓN 
  const iniciarEdicion = (tarea) => {
    setTareaEditando(tarea.tarea_id);
    setTextoEditado(tarea.titulo);
  };

  //  GUARDAR EDICIÓN 
  const guardarEdicion = async (tareaId) => {
    if (!textoEditado.trim()) return;
    
    await actualizarTarea(tareaId, { titulo: textoEditado });
    setTareaEditando(null);
  };

  if (!proyectoActual) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-slide-in {
          animation: slideIn 0.4s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out forwards;
        }
        /* Definiciones de botones reutilizables */
        .btn-primary { @apply bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-95; }
        .btn-icon { @apply p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all; }
      `}</style>

      <div className="max-w-5xl mx-auto animate-fade-in">
        
        {/* CABECERA Y BOTÓN */}
        <div className="mb-8">
          <Link to="/pagina-principal" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 w-fit">
            <ArrowLeft size={18} className="mr-2" />
            <span className="font-medium">Volver a mis proyectos</span>
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{proyectoActual.nombre}</h1>
              <p className="text-gray-500 mt-1 text-lg">{proyectoActual.descripcion}</p>
            </div>
            <button 
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="btn-primary" // Uso de la nueva clase
            >
              <Plus size={20} className={`transition-transform duration-300 ${mostrarFormulario ? 'rotate-45' : ''}`} />
              {mostrarFormulario ? 'Cerrar Formulario' : 'Añadir Tarea'}
            </button>
          </div>
        </div>

        {/* FORMULARIO TAREA */}
        {mostrarFormulario && (
          <div className="mb-8 bg-white p-6 rounded-2xl shadow-xl border border-blue-100 animate-slide-in transform transition-all origin-top">
            <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Plus size={16} />
              </div>
              Nueva Tarea
            </h3>
            <form onSubmit={handleCrearTarea} className="flex flex-col gap-4">
              <input 
                autoFocus
                type="text" 
                placeholder="¿Qué hay que hacer?" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={nuevaTarea.titulo}
                onChange={(e) => setNuevaTarea({...nuevaTarea, titulo: e.target.value})}
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Descripción (opcional)" 
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={nuevaTarea.descripcion}
                  onChange={(e) => setNuevaTarea({...nuevaTarea, descripcion: e.target.value})}
                />
                <button type="submit" className="btn-primary px-8 py-3">
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        )}

        {/*¡¡¡¡¡ TAREAS */}
        <div className="space-y-4">
          {cargandoTareas ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-600"></div>
            </div>
          ) : tareas.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm animate-slide-in">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5 text-blue-500">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">¡Comienza tu trabajo!</h3>
              <p className="text-gray-500 max-w-xs mx-auto">No hay tareas pendientes. Crea la primera tarea para arrancar este proyecto.</p>
            </div>
          ) : (
            tareas.map((tarea, index) => {
              const completada = tarea.estado === 'completada';
              const esEditando = tareaEditando === tarea.tarea_id;
              
              const estiloAnimacion = { animationDelay: `${index * 0.05}s` };

              return (
                <div 
                  key={tarea.tarea_id} 
                  style={estiloAnimacion}
                  className={`relative p-5 rounded-2xl border transition-all duration-200 group animate-slide-in ${
                    completada 
                      ? 'bg-gray-50 border-gray-100' 
                      : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    
                    {/* ZONA IZQUIERDA: estado, contenido */}
                    <div className="flex items-start gap-4 flex-1">
                      
                      {/* boton estado */}
                      {!esEditando && (
                        <button 
                          onClick={() => toggleEstado(tarea)}
                          className={`mt-1 transition-all duration-300 transform active:scale-90 ${
                            completada ? 'text-green-500' : 'text-gray-300 hover:text-green-500'
                          }`}
                        >
                          {completada ? <CheckCircle size={26} className="fill-green-100" /> : <Circle size={26} />}
                        </button>
                      )}

                      <div className="flex-1 min-w-0">
                        {esEditando ? (
                          <div className="flex items-center gap-2 w-full animate-fade-in">
                            <input 
                              autoFocus
                              type="text" 
                              className="flex-1 px-3 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-800 font-medium"
                              value={textoEditado}
                              onChange={(e) => setTextoEditado(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && guardarEdicion(tarea.tarea_id)}
                            />
                            <button onClick={() => guardarEdicion(tarea.tarea_id)} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"><Save size={18} /></button>
                            <button onClick={() => setTareaEditando(null)} className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"><X size={18} /></button>
                          </div>
                        ) : (
                          <>
                            <h3 className={`font-semibold text-lg transition-all duration-300 truncate ${
                              completada ? 'text-gray-400 line-through decoration-2 decoration-gray-200' : 'text-gray-800'
                            }`}>
                              {tarea.titulo}
                            </h3>
                            
                            {tarea.descripcion && (
                              <p className={`text-sm mt-1 transition-colors ${completada ? 'text-gray-300' : 'text-gray-500'}`}>
                                {tarea.descripcion}
                              </p>
                            )}
                            
                            <div className={`flex items-center gap-2 mt-3 text-xs transition-colors ${completada ? 'text-gray-300' : 'text-gray-400'}`}>
                              <Clock size={12} />
                              <span>{new Date(tarea.fecha_creacion).toLocaleDateString()}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* ZONA DERECHA: accciones */}
                    {!esEditando && (
                      <div className="flex items-center gap-2 pl-2">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                          completada 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-50 text-blue-600'
                        }`}>
                          {tarea.estado || 'Pendiente'}
                        </span>

                        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={() => iniciarEdicion(tarea)}
                            className="btn-icon"
                            title="Editar tarea"
                          >
                            <Pencil size={18} />
                          </button>

                          <button 
                            onClick={() => solicitarEliminacion(tarea.tarea_id)}
                            className="btn-icon text-red-500 hover:bg-red-50 hover:text-red-600"
                            title="Eliminar tarea"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ALERTA DE ELIMINACION */}
        {tareaAEliminar && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center transform transition-all animate-scale-in">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">¿Eliminar tarea?</h3>
              <p className="text-gray-500 mb-6">Esta acción no se puede deshacer. ¿Estás seguro de que quieres borrarla?</p>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setTareaAEliminar(null)}
                  className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmarEliminacion}
                  className="bg-red-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DetallesDelProyecto;