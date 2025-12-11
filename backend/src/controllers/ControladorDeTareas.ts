import { Response } from 'express';
import { pool } from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

// OBTENER TAREAS DE UN PROYECTO
export const obtenerTareas = async (req: AuthRequest, res: Response) => {
    try {
        const { proyectoId } = req.params; 
        
        // Conversión a número entero
        const proyectoIdNum = parseInt(proyectoId, 10);
        
        if (isNaN(proyectoIdNum)) {
             return res.status(400).json({ message: 'ID de proyecto inválido en la URL' });
        }
        console.log(` Pidiendo tareas del proyecto ID (Num): ${proyectoIdNum}`); 

        const result = await pool.query(
            'SELECT * FROM Tareas WHERE proyecto_id = $1 ORDER BY fecha_creacion DESC', 
            [proyectoIdNum]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error(" Error al obtener tareas:", error);
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
};

// CREAR TAREA
export const crearTarea = async (req: AuthRequest, res: Response) => {
    try {
        console.log(" Intento de crear tarea. Datos recibidos (body):", req.body);
        
        const { proyectoId, titulo, descripcion } = req.body;

        if (!titulo || !proyectoId) {
            return res.status(400).json({ message: 'El título y el ID del proyecto son obligatorios' });
        }

        // CRÍTICO: Conversión a número entero
        const proyectoIdNum = parseInt(proyectoId, 10);
        if (isNaN(proyectoIdNum)) {
             return res.status(400).json({ message: 'ID del proyecto inválido (no es un número)' });
        }
        
        const result = await pool.query(
            'INSERT INTO Tareas (proyecto_id, titulo, descripcion) VALUES ($1, $2, $3) RETURNING *',
            [proyectoIdNum, titulo, descripcion]
        );

        console.log(" Tarea creada en DB:", result.rows[0]);
        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(" Error CRÍTICO SQL al crear tarea:", error);
        res.status(500).json({ message: 'Error interno del servidor al guardar la tarea' });
    }
};

// ACTUALIZAR ESTADO DE LA TAREA
export const actualizarTarea = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { estado, titulo, descripcion } = req.body; // Ahora aceptamos todo
        const userId = req.user.id;
        
        const tareaIdNum = parseInt(id, 10);
        if (isNaN(tareaIdNum)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const result = await pool.query(
            `
            UPDATE Tareas
            SET 
                estado = COALESCE($1, estado),
                titulo = COALESCE($2, titulo),
                descripcion = COALESCE($3, descripcion)
            WHERE tarea_id = $4
            AND proyecto_id IN (SELECT proyecto_id FROM Proyectos WHERE user_id = $5)
            RETURNING *;
            `,
            [estado || null, titulo || null, descripcion || null, tareaIdNum, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada o sin permisos' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al actualizar:", error);
        res.status(500).json({ message: 'Error interno' });
    }
};
export const eliminarTarea = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params; // ID de la tarea
        const userId = req.user.id;

        const tareaIdNum = parseInt(id, 10);
        if (isNaN(tareaIdNum)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const result = await pool.query(
            `DELETE FROM Tareas 
             WHERE tarea_id = $1 
             AND proyecto_id IN (SELECT proyecto_id FROM Proyectos WHERE user_id = $2)
             RETURNING *`,
            [tareaIdNum, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada o sin permisos' });
        }

        res.json({ message: 'Tarea eliminada correctamente', id: tareaIdNum });
    } catch (error) {
        console.error("Error al eliminar tarea:", error);
        res.status(500).json({ message: 'Error interno al eliminar' });
    }
};