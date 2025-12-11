-- Este archivo se ejecuta automáticamente al iniciar Docker por primera vez

-- 1. Tabla de USUARIOS
CREATE TABLE IF NOT EXISTS Usuarios (
    user_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de PROYECTOS
CREATE TABLE IF NOT EXISTS Proyectos (
    proyecto_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES Usuarios(user_id) ON DELETE CASCADE
);

-- 3. Tabla de TAREAS
CREATE TABLE IF NOT EXISTS Tareas (
    tarea_id SERIAL PRIMARY KEY,
    proyecto_id INTEGER REFERENCES Proyectos(proyecto_id) ON DELETE CASCADE,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. PERMISOS AUTOMÁTICOS
-- Esto evita los errores de "permission denied" que sufriste antes
GRANT ALL ON ALL TABLES IN SCHEMA public TO orgamain_dev;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO orgamain_dev;