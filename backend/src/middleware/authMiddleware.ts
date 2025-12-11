import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mi_clave_secreta_super_segura';

// incluir los datos del usuario decodificado
export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    //Obtener el token del header
    // "x-auth-token" o "Authorization"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || token === 'undefined' || token === 'null') {
        res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token válido.' });
        return;
    }

    try {
        //verificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // guardar datos del usuario en la request para usarlos luego
        req.user = decoded;
        
        next(); // continuar con otra función
    } catch (error) {
        res.status(400).json({ message: 'Token inválido o expirado.' });
    }
};

export const verifyToken = authMiddleware;

export default authMiddleware;