import { Router } from 'express';
// Asegúrate de que la ruta al controlador sea correcta
import { obtenerProyectos, crearProyecto } from '../controllers/ControladorDeProyecto';
// Importamos el middleware de seguridad
import { authMiddleware } from '../middleware/authMiddleware';

import { eliminarProyecto } from '../controllers/ControladorDeProyecto';

const router = Router();

// RUTA GET: http://localhost:3000/api/proyecto/
// El prefijo '/api/projects' ya viene del index.ts, aquí solo ponemos '/'
router.get('/', authMiddleware, obtenerProyectos);

// RUTA POST: http://localhost:3000/api/proyecto/
router.post('/', authMiddleware, crearProyecto);

router.delete('/proyectos/:id', authMiddleware, eliminarProyecto);

export default router;