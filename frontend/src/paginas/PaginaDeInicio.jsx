import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexto/AuthContext';
import { Settings, LogOut, User, LogIn, ArrowRight, Briefcase, GraduationCap, Building2 } from 'lucide-react';

const PaginaDeInicio = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToDetails = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* BARRA DE NAVEGACIÓN */}
      <nav className="navbar-base">
        {/* Usamos la nueva clase limpia que define el flexbox row */}
        <div className="max-w-7xl mx-auto navbar-content-layout"> 
          
          {/* GRUPO 1: LOGO */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                          <img src="/svg/logo-orgamain-desktop.svg" className="flex items-center justify-center h-10"/>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Orgamain</span>
          </div>

          {/*ENLACES + ZONA USUARIO */}
          <div className="flex items-center gap-12"> 

            {/* Zona de Usuario (Login/Config) */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/pagina-principal" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-blue-600">
                    Ir al Panel
                  </Link>
                  <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
                  <div className="flex items-center gap-3">
                    <button title="Configuración" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                      <Settings size={20} />
                    </button>
                    <button 
                      onClick={handleLogout}
                      title="Cerrar Sesión" 
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <LogOut size={20} />
                    </button>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                      {user?.nombre ? user.nombre[0].toUpperCase() : <User size={16} />}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" className="flex items-center text-font-bold text-gray-600 hover:text-blue-600 transition-colors">
                    Entrar
                  </Link>
                <Link to="/registro" className="registro-boton2">
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="pt-20 pb-20 px-6 max-w-7xl mx-auto my-5">
        
        <div className="text-center mb-16 my-10">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Organiza tu vida, <span className="text-blue-600">domina tu tiempo</span>.</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Date la oportunidad de quitarte los límites en tu vida diaria.</p>
        </div>

        {/* TRES CAJONES HORIZONTALES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group text-center">
            <h3 className="text-s text-gray-800 mb-2">Si eres <span className="text-blue-600 font-bold">estudiante</span>...</h3>
            <div className="mt-10 w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
              <img src="/svg/profesora.svg"/>
            </div>
            <p className="text-gray-500 pt-5 m-5">Mejoramos tu rendimiento académico. Secundaria o universidad, no importa.</p>
            <button onClick={() => scrollToDetails('estudiante')} className="pt-auto bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-sm">
              Saber más
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group text-center">
            <h3 className="text-s text-gray-800 mb-2">Si eres <span className="text-blue-600 font-bold">trabajador</span>...</h3>
            <div className="mt-10 w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
              <img src="/svg/oficinista.svg"/>
            </div>
            <p className="text-gray-500 pt-5 m-5">Te ayudamos a perder la frustación diaria. Estés o no trabajando actualmente.</p>
            <button onClick={() => scrollToDetails('trabajador')} className="pt-auto bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-sm">
              Saber más
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group text-center">
            <h3 className="text-s text-gray-800 mb-2">Si eres <span className="text-blue-600 font-bold">empresario o autonomo</span>...</h3>
            <div className="mt-10 w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
              <img src="/svg/economia.svg" className='pb-4'/>
            </div>
            <p className="text-gray-500 mt-10 mb-6">Ampliamos tus capacidades, económico o empresarial. Tengas tu propia compañia o a cuenta propia</p>
            <button onClick={() => scrollToDetails('empresario')} className=" justify-end bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-sm">
              Saber más
            </button>
          </div>
        </div>

        {/* --- 3. CTA CENTRAL --- */}
        <div className="text-center mb-24 py-10 bg-gray-50 rounded-[3rem]">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">¡Únete a Orgamain ahora!</h2>
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 inline-flex items-center gap-4">
            {isAuthenticated ? (
               <Link to="/pagina-principal" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                 Ir a mi Panel
               </Link>
            ) : (
              <>
                <Link to="/login" className="iniciar-sesion">
                  Iniciar Sesión
                </Link>
                <span className="hidden md:flex md:text-gray-300 md:font-medium">o</span>
                <Link to="/registro" className="registro-boton">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>

        {/* SECCIONES DETALLADAS */}
        <div className="space-y-24">
          
          <div id="estudiante" className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 order-2 md:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Para el Estudiante Organizado</h2>
              <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                Con nuestras herramientas, cursos y tests, puedes encontrar una mejora en tu forma de estudio, organización y aprender nuevos habitos y conocimientos para que nunca falles en sacar sobresalientes.
              </p>
              <div className="flex items-center gap-4">
                <Link to={isAuthenticated ? "/pagina-principal" : "/login"} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                  Accede a panel
                </Link>
                <span className="text-gray-400">o</span>
                <Link to="/registro" className="text-blue-600 font-bold hover:underline">empieza ahora</Link>
              </div>
            </div>
            <div className="flex-1 bg-orange-50 h-80 rounded-3xl order-1 md:order-2 flex items-center justify-center">
              <img src='/svg/estudiando-grande.jpg'className="w-80 rounded-3xl"/>
            </div>
          </div>

          <div id="trabajador" className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 bg-blue-50 h-60 rounded-3xl flex items-center justify-center">
              <img src='/svg/trabajando-grande.jpg'className="w-80 rounded-3xl"/>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Productividad Profesional</h2>
              <p className="text-gray-500 text-lg mb-6 leading-relaxed">
            Tenemos lo que necesitas con nuestras herramientas para darte gestion personal, cursos para conocer las necesidades que igual no tenemos en cuenta normalmente y lo verás con nuestro diagnóstico para ir al grano.              
                </p>
              <div className="flex items-center gap-4">
                <Link to={isAuthenticated ? "/pagina-principal" : "/login"} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                  Accede a panel
                </Link>
                <span className="text-gray-400">o</span>
                <Link to="/registro" className="text-blue-600 font-bold hover:underline">empieza ahora</Link>
              </div>
            </div>
          </div>

          <div id="empresario" className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 order-2 md:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Visión Global de Empresa</h2>
              <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                 Gestiona tus gastos con nuestras herramientas, recuerda tus puntos para las reuniones y aprende a gestionar emociones de tu equipo o de tus clientes para mejorar tu ambiente y tus ventas. Empezaremos diagnosticandote y a partir todo va fluyendo.
              </p>
              <div className="flex items-center gap-4">
                <Link to={isAuthenticated ? "/pagina-principal" : "/login"} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                  Accede a panel
                </Link>
                <span className="text-gray-400">o</span>
                <Link to="/registro" className="text-blue-600 font-bold hover:underline">empieza ahora</Link>
              </div>
            </div>
            <div className="flex-1 bg-purple-50 h-60 rounded-3xl order-1 md:order-2 flex items-center justify-center">
              <img src='/svg/empresario-grande.avif'className="w-80 rounded-3xl"/>
            </div>
          </div>

        </div>

        <footer className="mt-32 border-t border-gray-100 pt-8 text-center text-gray-400 text-sm">
          <p>© 2025 Orgamain. Todos los derechos reservados.</p>
        </footer>

      </div>
    </div>
  );
};

export default PaginaDeInicio;