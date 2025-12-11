import { Router } from 'express';
// Aseguramos importar las funciones que acabamos de definir
import { obtenerOpcionesTest, procesarTest, obtenerHistorial } from '../controllers/ControladorDeDiagnostico';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Definición de endpoints
router.get('/opciones', authMiddleware, obtenerOpcionesTest);
router.post('/submit', authMiddleware, procesarTest);
router.get('/historial', authMiddleware, obtenerHistorial);

export default router;