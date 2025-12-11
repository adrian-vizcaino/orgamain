import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
// Asegúrate de que los nombres de archivo coincidan con los tuyos (projectRoutes, RutasDeProyecto, etc.)
import RutasDeProyecto from './routes/RutasDeProyecto'; 
import RutasDeTareas from './routes/RutasDeTareas';
// IMPORTANTE: Importamos las rutas de diagnóstico
import RutasDeDiagnostico from './routes/RutasDeDiagnostico';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- REGISTRO DE RUTAS ---

// Rutas de Autenticación
app.use('/api/auth', authRoutes);

// Rutas de Proyectos
app.use('/api/proyecto', RutasDeProyecto);

// Rutas de Tareas
app.use('/api/tasks', RutasDeTareas);

// Rutas de DIAGNÓSTICO (Esta es la que faltaba y causaba el 404)
app.use('/api/diagnostico', RutasDeDiagnostico);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('API OrgaMain funcionando correctamente 🚀');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`   ➜ Auth:       http://localhost:${PORT}/api/auth`);
  console.log(`   ➜ Proyecto:   http://localhost:${PORT}/api/proyecto`);
  console.log(`   ➜ Diagnostico: http://localhost:${PORT}/api/diagnostico`);
});