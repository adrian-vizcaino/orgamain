import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db'; 

const JWT_SECRET = 'mi_clave_secreta_super_segura';

// registro a 'Usuarios' de init.sql
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Recibiendo datos de registro:', req.body); // Log para depurar

        const { username, password, email, nombre } = req.body;

        const userEmail = email || username;
        const userName = nombre || username || email;
        
        // Validación básica
        if (!userEmail || !password) {
            res.status(400).json({ message: 'Faltan datos: se requiere email/username y contraseña.' });
            return;
        }

        // verificación
        const userCheck = await pool.query(
            'SELECT * FROM Usuarios WHERE email = $1 OR nombre = $2', 
            [userEmail, userName]
        );
        
        if (userCheck.rows.length > 0) {
            res.status(400).json({ message: 'El usuario ya existe (email o nombre en uso)' });
            return;
        }

 // Insertar en PostgreSQL
        const newUserResult = await pool.query(
            'INSERT INTO Usuarios (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [userName, userEmail, password] 
        );
        
        const user = newUserResult.rows[0];
        console.log('Usuario registrado:', user);

        // solución ERROR 401
        const token = jwt.sign(
            { 
                id: user.user_id,
                userId: user.user_id,
                username: user.nombre,
                email: user.email 
            }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(201).json({ 
            message: 'Usuario registrado exitosamente', 
            token: token, // ¡Importante! Enviamos el token
            user: { 
                id: user.user_id, 
                username: user.nombre,
                nombre: user.nombre, 
                email: user.email
            } 
        });
    } catch (error: any) {
        console.error(' Error en register:', error);
        res.status(500).json({ message: 'Error SQL al registrar: ' + error.message });
    }
};

// Login para 'Usuarios'
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(' Intento de login:', req.body);

        // Aceptamos username o email como identificador
        const { username, password, email } = req.body;
        const loginIdentifier = email || username;

        if (!loginIdentifier || !password) {
            res.status(400).json({ message: 'Faltan credenciales' });
            return;
        }

        // 1. Buscar usuario por email O por nombre
        const result = await pool.query(
            'SELECT * FROM Usuarios WHERE email = $1 OR nombre = $1', 
            [loginIdentifier]
        );

        if (result.rows.length === 0) {
             console.log(' Usuario no encontrado en DB para:', loginIdentifier);
             res.status(400).json({ message: 'Usuario no encontrado' });
             return;
        }

        const user = result.rows[0];

        // 2. Verificar contraseña
        if (user.password_hash !== password) {
            console.log(' Contraseña incorrecta');
            res.status(400).json({ message: 'Contraseña incorrecta' });
            return;
        }

        // 3. Generar token
        const userId = user.user_id;

        const payload = { 
            id: userId,
            userId: userId,
            username: user.nombre,
            email: user.email 
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: 'Login exitoso', 
            token: token,
            user: {
                id: userId,
                username: user.nombre,
                nombre: user.nombre,
                email: user.email
            }
        });
    } catch (error: any) {
        console.error(' Error en login:', error);
        res.status(500).json({ message: 'Error en el login: ' + error.message });
    }
};