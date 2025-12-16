import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. Contextos
import { AuthProvider } from './contexto/AuthContext';
import { ProveedorDeProyectos } from './contexto/ContextoDeProyectos';
import { ProveedorDeTareas } from './contexto/ContextoDeTareas';

// 2. Componentes
import RutasProtegidas from './componentes/RutasProtegidas';

// 3. Páginas
import PaginaDeInicio from './paginas/PaginaDeInicio'; //
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import PaginaPrincipal from './paginas/PaginaPrincipal';
import DetallesDelProyecto from './paginas/DetallesDelProyecto';
import TestDeDiagnostico from './paginas/TestDeDiagnostico';
import HistorialDiagnostico from './paginas/HistorialDiagnostico';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProveedorDeProyectos>
          <ProveedorDeTareas>
            <Routes>
              {/*  RUTA RAÍZ */}
              <Route path="/" element={<PaginaDeInicio />} />
              
              {/* RUTAS PÚBLICAS */}
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              
              {/* RUTAS PRIVADAS */}
              <Route 
                path="/pagina-principal" 
                element={
                  <RutasProtegidas>
                    <PaginaPrincipal />
                  </RutasProtegidas>
                } 
              />
              
              <Route 
                path="/proyecto/:id" 
                element={
                  <RutasProtegidas>
                    <DetallesDelProyecto />
                  </RutasProtegidas>
                } 
              />
              <Route path="/diagnostico" element={<TestDeDiagnostico/>} />
              <Route path='/historial' element={<HistorialDiagnostico/>}/>
              {/* Ruta 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ProveedorDeTareas>
        </ProveedorDeProyectos>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;