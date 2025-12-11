import { Response } from 'express';
import { pool } from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

// Helper
const getUserIdFromToken = (userObj: any) => {
    if (!userObj) return null;
    return userObj.id || userObj.userId || userObj.user_id;
};

//OBTENER PROYECTOS
export const obtenerProyectos = async (req: AuthRequest, res: Response) => {
    try {
        const userId = getUserIdFromToken(req.user);
        
        console.log(` Solicitud de proyectos. Token decodificado:`, req.user);

        if (!userId) {
            return res.status(401).json({ message: 'Token válido pero sin ID de usuario legible' });
        }
        
        const result = await pool.query(
            'SELECT * FROM Proyectos WHERE user_id = $1 ORDER BY fecha_creacion DESC', 
            [userId]
        );
        
        console.log(` Encontrados ${result.rows.length} proyectos para el usuario ${userId}`);
        res.json(result.rows);
    } catch (error: any) { 
        console.error(' Error al obtener proyectos:', error.message);
        res.status(500).json({ message: 'Error al obtener tus proyectos' });
    }
};

// 2. CREAR UN NUEVO PROYECTO
export const crearProyecto = async (req: AuthRequest, res: Response) => {
    try {
        const { nombre, descripcion } = req.body;
        
        const userId = getUserIdFromToken(req.user);

        console.log(` Intento de crear proyecto. Datos Token:`, req.user);

        if (!userId) {
            console.error(" Error Crítico: No se ha encontrado un ID válido en req.user");
            return res.status(401).json({ message: 'Usuario no identificado (Token inválido)' });
        }

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre del proyecto es obligatorio' });
        }

        const result = await pool.query(
            'INSERT INTO Proyectos (nombre, descripcion, user_id) VALUES ($1, $2, $3) RETURNING *',
            [nombre, descripcion, userId]
        );

        console.log(" Proyecto creado con éxito. ID:", result.rows[0].proyecto_id);
        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error(' Error CRÍTICO SQL al crear proyecto:');
        console.error('   -> Mensaje:', error.message);
        res.status(500).json({ message: 'Error interno al crear el proyecto' });
    }
};
// 3. ELIMINAR PROYECTO (Añade esto a tu controlador)
export const eliminarProyecto = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params; // El ID viene en la URL
        const userId = getUserIdFromToken(req.user);

        console.log(`Solicitud de eliminación para proyecto ${id} por usuario ${userId}`);

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no identificado' });
        }

        // Ejecutamos el DELETE verificando también el user_id para seguridad (que solo borre sus propios proyectos)
        const result = await pool.query(
            'DELETE FROM Proyectos WHERE proyecto_id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Proyecto no encontrado o no tienes permiso para eliminarlo' });
        }

        console.log("Proyecto eliminado con éxito.");
        res.json({ message: 'Proyecto eliminado correctamente', id_eliminado: id });

    } catch (error: any) {
        console.error('Error SQL al eliminar:', error.message);
        res.status(500).json({ message: 'Error interno al eliminar el proyecto' });
    }
};