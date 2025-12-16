import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexto/AuthContext';
import { Settings, LogOut, User, LogIn, ArrowRight, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  TrendingUp, 
  ArrowLeft, 
  AlertCircle, 
  Award, 
  Activity,
  BarChart2
} from 'lucide-react';

const HistorialDiagnostico = () => {
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/api/diagnostico/historial', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al cargar el historial');

        const data = await response.json();
        setHistorial(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [token]);

  // Función para formatear fechas de forma legible
  const formatearFecha = (fechaString) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
  };

  // Función para obtener color según la puntuación
  const getColorPuntuacion = (puntos) => {
    if (puntos >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (puntos >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-gray-500">Cargando tu historial...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header con botón de volver */}
        <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                          <img src="/svg/logo-orgamain-desktop.svg" className="flex items-center justify-center h-10"/>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Orgamain</span>
          </div>
          <button 
            onClick={() => navigate('/diagnostico')}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
          >
            Volver al Test
          </button>

        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-3" />
            {error}
          </div>
        )}

        {/* Resumen General (Solo si hay datos) */}
        {historial.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                      <h1 className="ml-5 text-2xl font-bold text-gray-800 flex items-center">
            Historial de Progreso
          </h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mr-4">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tests Realizados</p>
                <p className="text-2xl font-bold text-gray-800">{historial.length}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
              <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Última Puntuación</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(historial[0].puntuacion_diagnostico)}/100
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Resultados (Timeline) */}
        <div className="space-y-6">
          {historial.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Aún no hay resultados</h3>
              <p className="text-gray-500 mt-1 mb-6">Realiza tu primer diagnóstico para ver tu evolución aquí.</p>
              <button 
                onClick={() => navigate('/diagnostico')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Realizar Test Ahora
              </button>
            </div>
          ) : (
            historial.map((test) => (
              <div 
                key={test.resultado_id} 
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Fecha y Título */}
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-1">
                        {formatearFecha(test.fecha_test)}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Evaluación de Competencias
                      </h3>
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium mr-2">Foco detectado:</span>
                        {test.habilidad_nombre || 'General'}
                      </div>
                    </div>
                  </div>

                  {/* Puntuación */}
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <span className="block text-xs text-gray-400 uppercase tracking-wider font-semibold">Puntuación</span>
                      <div className={`px-4 py-1 rounded-full border text-sm font-bold flex items-center justify-center ${getColorPuntuacion(test.puntuacion_diagnostico)}`}>
                        <Award className="w-4 h-4 mr-1.5" />
                        {Math.round(test.puntuacion_diagnostico)} / 100
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default HistorialDiagnostico;