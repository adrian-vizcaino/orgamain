import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle, 
  CheckCircle, 
  BarChart2, 
  Star, 
  Shield, 
  Home, 
  Wrench, 
  Lightbulb,
  User,
  Menu,
  Clock
} from 'lucide-react';

const TestDeDiagnostico = () => {
  const navigate = useNavigate();

  // ESTADOS
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [habilidades, setHabilidades] = useState([]);
  
  // del flujo
  const [fase, setFase] = useState('inicio'); // 'inicio' | 'test' | 'resultados'
  const [pasoActual, setPasoActual] = useState(0);
  
  // de datos
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);
  
  // de Términos
  const [terminosAceptados, setTerminosAceptados] = useState(false);
  const [mostrarDetallesTerminos, setMostrarDetallesTerminos] = useState(false);

  const token = localStorage.getItem('token');


  //carga de datos
  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/api/diagnostico/opciones', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error al conectar con el servidor de diagnóstico.');
        
        const data = await response.json();
        setHabilidades(data);
        
        // Inicializar en 5
        const initialRespuestas = {};
        data.forEach(hab => initialRespuestas[hab.habilidad_id] = 5);
        setRespuestas(initialRespuestas);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpciones();
  }, [token]);

// ¡¡¡ HANDLERS

  const handleSliderChange = (id, valor) => {
    setRespuestas(prev => ({
      ...prev,
      [id]: parseInt(valor)
    }));
  };

  const handleSiguiente = () => {
    if (pasoActual < habilidades.length - 1) {
      setPasoActual(prev => prev + 1);
    } else {
      enviarTest();
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(prev => prev - 1);
    }
  };

  const iniciarTest = () => {
    if (terminosAceptados) {
      setFase('test');
    }
  };

  const enviarTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:3000/api/diagnostico/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ respuestas })
      });

      if (!response.ok) throw new Error('Error al procesar resultados');

      const data = await response.json();
      setResultado(data);
      setFase('resultados');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // COMPONENTES VISUALES

  //Navbar
  const NavbarSimulado = () => (
    <div className="w-full bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center mb-6">
      <div className="flex items-center space-x-2">
          <div className="flex items-center gap-2 cursor-pointer" 
            onClick={() => { navigate('/'); }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
            <img src='/svg/logo-orgamain-desktop.svg'/>
            </div>
            <span className="text-xl font-bold text-gray-800">Orgamain</span>
          </div>
        </div>
    </div>
  );

  //Footer
  const FooterOpciones = () => (
    <div className="mt-12 w-full max-w-4xl mx-auto">
      <h3 className="text-center text-gray-500 font-medium mb-6 uppercase tracking-wider text-sm">
        ¿Buscas otras opciones?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> {/* Grid cambiado a 4 columnas */}
        <button 
          onClick={() => navigate('/panel')}
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all group"
        >
          <div className="p-3 bg-gray-100 rounded-full mb-3 group-hover:bg-indigo-100 transition-colors">
            <Home className="w-6 h-6 text-gray-600 group-hover:text-indigo-600" />
          </div>
          <span className="font-semibold text-gray-700">Volver al Panel</span>
        </button>

        <button 
          onClick={() => navigate('/historial')}
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all group"
        >
          <div className="p-3 bg-gray-100 rounded-full mb-3 group-hover:bg-purple-100 transition-colors">
            <Clock className="w-6 h-6 text-gray-600 group-hover:text-purple-600" />
          </div>
          <span className="font-semibold text-gray-700">Ver Historial</span>
        </button>

        <button 
          onClick={() => navigate({ pathname: '/pagina-principal', hash: '#herramientas' })} 
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all group"
        >
          <div className="p-3 bg-gray-100 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
            <Wrench className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
          </div>
          <span className="font-semibold text-gray-700">Herramientas</span>
        </button>

        <button 
          onClick={() => navigate('/cursos')}
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all group"
        >
          <div className="p-3 bg-gray-100 rounded-full mb-3 group-hover:bg-amber-100 transition-colors">
            <Lightbulb className="w-6 h-6 text-gray-600 group-hover:text-amber-600" />
          </div>
          <span className="font-semibold text-gray-700">Cursos</span>
        </button>
      </div>
    </div>
  );

//¡¡¡¡ PRINCIPAL

  if (loading && fase !== 'resultados') return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-gray-600">Cargando sistema de diagnóstico...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="p-8 max-w-lg w-full bg-white rounded-xl shadow-lg border-l-4 border-red-500 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800">Error de Conexión</h3>
        <p className="text-gray-600 mt-2 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <NavbarSimulado />

      <div className="flex-grow flex flex-col items-center justify-start p-4 md:p-8">
        
        {/*TERMINOS */}
        {fase === 'inicio' && (
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-indigo-600 p-8 text-white text-center relative">

              <button 
                onClick={() => navigate('/historial')}
                className="absolute top-4 right-4 p-2 bg-indigo-500 rounded-full hover:bg-indigo-400 transition-colors text-white text-xs flex items-center"
                title="Ver resultados anteriores"
              >
                <Clock className="w-4 h-4" />
              </button>

              <Shield className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h1 className="text-3xl font-bold mb-2">Test de Diagnóstico Profesional</h1>
              <p className="text-indigo-100">Evalúa tus competencias y recibe un plan de mejora personalizado.</p>
            </div>
            
            <div className="p-8">
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Este test utiliza un algoritmo de ponderación para identificar tus áreas de mejora prioritarias. Tus resultados son privados.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <label className="flex items-center space-x-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={terminosAceptados}
                    onChange={(e) => setTerminosAceptados(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="text-gray-700 font-medium">Acepto los términos y condiciones de privacidad</span>
                </label>
                
                <button 
                  onClick={() => setMostrarDetallesTerminos(!mostrarDetallesTerminos)}
                  className="text-xs text-indigo-600 hover:underline mt-2 ml-1"
                >
                  {mostrarDetallesTerminos ? 'Ocultar detalles' : 'Consultar términos completos'}
                </button>

                {mostrarDetallesTerminos && (
                  <div className="mt-3 text-xs text-gray-500 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="mb-2"><strong>1. Uso de datos:</strong> Sus respuestas se utilizarán únicamente para generar recomendaciones de aprendizaje.</p>
                    <p className="mb-2"><strong>2. Privacidad:</strong> No compartimos sus resultados con terceros.</p>
                    <p><strong>3. Almacenamiento:</strong> Los resultados se guardan en su perfil para mostrar su historial de progreso.</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={iniciarTest}
                  disabled={!terminosAceptados}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                    terminosAceptados 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Comenzar Diagnóstico
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
                
                <button
                    onClick={() => navigate('/historial')}
                    className="w-full py-3 text-indigo-600 font-medium hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-center"
                >
                    <Clock className="w-4 h-4 mr-2" />
                    Consultar Historial de Resultados
                </button>
              </div>
            </div>
          </div>
        )}

        {/*PREGUNTAS */}
        {fase === 'test' && habilidades.length > 0 && (
          <div className="w-full max-w-3xl">

            <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
                <span>Progreso</span>
                <span>{Math.round(((pasoActual + 1) / habilidades.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${((pasoActual + 1) / habilidades.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Pregunta {pasoActual + 1} de {habilidades.length}
                </span>
                <BarChart2 className="w-5 h-5 text-indigo-300" />
              </div>

              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  {habilidades[pasoActual].nombre}
                </h2>
                <p className="text-lg text-gray-500 text-center mb-12 max-w-lg mx-auto">
                  {habilidades[pasoActual].descripcion || "Evalúa tu nivel de competencia actual en esta habilidad."}
                </p>

                <div className="space-y-10 max-w-xl mx-auto">
                  <div className="flex justify-between text-sm font-bold text-gray-400 uppercase tracking-wider">
                    <span>Principiante (1)</span>
                    <span>Experto (10)</span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={respuestas[habilidades[pasoActual].habilidad_id] || 5}
                      onChange={(e) => handleSliderChange(habilidades[pasoActual].habilidad_id, e.target.value)}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <div 
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-lg font-bold text-lg shadow-md"
                        style={{ left: `${((respuestas[habilidades[pasoActual].habilidad_id] - 1) / 9) * 100}%` }}
                    >
                        {respuestas[habilidades[pasoActual].habilidad_id]}
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                     <p className="text-sm text-gray-400">Desliza para seleccionar tu nivel</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={handleAnterior}
                  disabled={pasoActual === 0}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
                    pasoActual === 0 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Anterior
                </button>

                <button
                  onClick={handleSiguiente}
                  className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-transform active:scale-95"
                >
                  {pasoActual === habilidades.length - 1 ? 'Finalizar Test' : 'Siguiente'}
                  {pasoActual < habilidades.length - 1 && <ChevronRight className="w-5 h-5 ml-2" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/*RESULTADOS */}
        {fase === 'resultados' && resultado && (
          <div className="w-full max-w-4xl space-y-8 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-sm p-8 border-l-4 border-indigo-500 flex flex-col md:flex-row items-center md:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Diagnóstico Completado</h2>
                <p className="text-gray-600">Hemos generado tu perfil de competencias y detectado oportunidades.</p>
              </div>
              <div className="flex flex-col items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="text-sm text-gray-500 uppercase tracking-wide font-bold mb-1">Puntuación Global</span>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-black text-indigo-600">{Math.round(resultado.resultado_global)}</span>
                    <span className="text-gray-400 text-lg ml-1">/ 100</span>
                  </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

               <div className="lg:col-span-3 bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-100 flex flex-col md:flex-row items-center gap-6">
                  <div className="p-4 bg-white rounded-full shadow-sm text-amber-500">
                    <Star className="w-8 h-8" />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-lg font-semibold text-amber-900 mb-1">Área Prioritaria de Mejora</h3>
                    <h4 className="text-3xl font-bold text-gray-800">
                      {habilidades.find(h => h.habilidad_id === resultado.habilidad_a_mejorar_id)?.nombre || 'General'}
                    </h4>
                    <p className="text-amber-700 mt-2">
                      Esta habilidad presentó la puntuación más baja. Enfocarte aquí te dará el mayor retorno de inversión en tu desarrollo.
                    </p>
                  </div>
               </div>
            </div>

            {/* RUTAS */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-indigo-600" />
                  Plan de Acción Recomendado
                </h3>
              </div>
              
              <div className="divide-y divide-gray-100">
                {resultado.recomendaciones && resultado.recomendaciones.length > 0 ? (
                  resultado.recomendaciones.map((ruta) => (
                    <div key={ruta.ruta_id} className="p-6 hover:bg-gray-50 transition-colors group">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                            {ruta.titulo}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">{ruta.descripcion}</p>
                          <div className="flex items-center text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md w-max">
                            <Activity className="w-3 h-3 mr-1" />
                            {ruta.duracion_dias} días estimados
                          </div>
                        </div>
                        <a 
                          href={ruta.enlace_curso} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-600 hover:text-white transition-all font-medium flex-shrink-0 flex items-center shadow-sm"
                        >
                          Ir al recurso
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <p className="text-lg font-medium">¡Excelente nivel! Sigue explorando nuestros cursos generales.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center pt-4 space-x-4">
              <button 
                onClick={() => { setFase('inicio'); setPasoActual(0); setResultado(null); setTerminosAceptados(false); }}
                className="text-gray-500 hover:text-indigo-600 font-medium transition-colors"
              >
                ↻ Realizar nuevo diagnóstico
              </button>
              
              <button
                onClick={() => navigate('/historial')}
                className="text-indigo-600 font-medium hover:underline"
              >
                Ver historial completo
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <FooterOpciones />

      </div>
    </div>
  );
};

export default TestDeDiagnostico;