import { Router } from 'express';
// Importamos todas las funciones del controlador
import { obtenerTareas, crearTarea, actualizarTarea, eliminarTarea } from '../controllers/ControladorDeTareas';
import { verifyToken } from '../middleware/authMiddleware';


const router = Router();

// Todas las rutas de tareas están protegidas

// GET /api/tasks/:proyectoId -> Obtener tareas de un proyecto
router.get('/:proyectoId', verifyToken, obtenerTareas);

// POST /api/tasks -> Crear una tarea nueva
router.post('/', verifyToken, crearTarea);

// PUT /api/tasks/:id -> Actualizar una tarea específica (usando el ID de la tarea)
router.put('/:id', verifyToken, actualizarTarea);

router.delete('/:id', verifyToken, eliminarTarea);

export default router;