import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// ACTUALIZADO: Ruta a 'contexto'
import { useAuth } from '../contexto/AuthContext';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const result = await register(formData.nombre, formData.email, formData.password);

    if (result.success) {
      navigate('/pagina-principal'); 
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="flex justify-center mb-6 rounded-lg">
          <img src="/svg/logo-orgamain-desktop.svg" className="flex items-center justify-center"/>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Crear Cuenta</h2>
        <p className="text-gray-500 text-center mb-6">Únete a Orgamain hoy mismo</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Nombre Completo</label>
            <input 
              type="text" 
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Tu nombre"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="ejemplo@orgamain.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg 
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Entra aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;