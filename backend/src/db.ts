import { Pool } from 'pg';

/**
 * Configuración y Pool de Conexión a la Base de Datos PostgreSQL.
 * Todos los elementos se exportan con nombre para evitar el conflicto TS5097.
 */
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// Se exporta el pool de conexión para que las rutas puedan ejecutar consultas.
export const pool = new Pool(config);

/**
 * Función para probar y establecer la conexión inicial a la DB.
 * Se utiliza exportación con nombre.
 */
export async function connectDB() {
    try {
        // Intenta obtener un cliente del pool para verificar la conexión
        const client = await pool.connect();
        
        // Ejecuta una consulta simple para confirmar el estado de la DB
        const result = await client.query('SELECT NOW()');
        
        // Libera el cliente para que pueda ser reutilizado
        client.release(); 
        
        console.log(`[DB] 🟢 Conexión a PostgreSQL exitosa. Hora de DB: ${result.rows[0].now}`);
        return pool;
    } catch (error) {
        console.error('[DB] 🔴 Error al conectar a PostgreSQL:', error);
        // En un entorno real, podrías querer detener el servidor si falla la DB
        throw new Error('No se pudo conectar a la base de datos. Verifique sus credenciales.');
    }
}