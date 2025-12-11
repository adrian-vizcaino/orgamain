-- =================================================================================
-- ESQUEMA SQL PARA EL PROYECTO ORGAMAIN (PostgreSQL)
-- Basado en el modelado de la fase de Análisis.
-- Se asume que la base de datos 'orgamain_db' ya ha sido creada.
-- =================================================================================

-- 1. Tabla de Usuarios (Almacena la información de autenticación y perfil)
-- RNF-01: Almacenamiento seguro de credenciales (aunque aquí solo se define la estructura).
CREATE TABLE Usuarios (
    user_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Almacenará el hash de la contraseña (nunca la contraseña plana)
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Habilidades (Las métricas a diagnosticar)
-- RF-03: Contiene las habilidades y la métrica de impacto para el algoritmo de ponderación.
CREATE TABLE Habilidades (
    habilidad_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    -- Métrica usada por el Algoritmo de Cálculo Ponderado (RF-03).
    -- Un valor mayor indica que esta habilidad tiene más peso en el diagnóstico.
    metrica_impacto INTEGER NOT NULL
);

-- 3. Tabla de Rutas y Cursos (Recomendaciones personalizadas)
-- RF-05: Contiene los cursos o rutas de acción sugeridas.
CREATE TABLE Rutas (
    ruta_id SERIAL PRIMARY KEY,
    habilidad_id INTEGER REFERENCES Habilidades(habilidad_id) ON DELETE CASCADE, -- Clave foránea a la habilidad que esta ruta mejora
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    duracion_dias INTEGER,
    enlace_curso VARCHAR(255) -- Enlace a la herramienta o curso externo
);

-- 4. Tabla de Resultados del Test (Almacena el diagnóstico de cada usuario)
-- RF-02: Almacena el resultado final del test de diagnóstico.
CREATE TABLE Test_Resultados (
    resultado_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Usuarios(user_id) ON DELETE CASCADE,
    -- Puntuación normalizada de 0 a 100, indicando el nivel de carencia.
    puntuacion_diagnostico NUMERIC(5, 2) NOT NULL, 
    habilidad_carencia_id INTEGER REFERENCES Habilidades(habilidad_id) ON DELETE RESTRICT, -- La habilidad con la puntuación más baja (el foco)
    fecha_test TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Restricción para asegurar que un usuario solo tenga un resultado de test por habilidad/día (si se quiere re-testear).
    UNIQUE (user_id, habilidad_carencia_id, fecha_test)
);

-- =================================================================================
-- INSERCIÓN DE DATOS INICIALES (Datos Semilla)
-- =================================================================================

-- Datos iniciales para la tabla Habilidades (los pilares del diagnóstico)
INSERT INTO Habilidades (nombre, descripcion, metrica_impacto) VALUES
('Gestión del Tiempo', 'Habilidad para priorizar y cumplir plazos. Crítica para la eficiencia.', 9),
('Comunicación Efectiva', 'Capacidad para transmitir ideas de forma clara y concisa.', 8),
('Liderazgo de Proyectos', 'Destreza en la dirección y motivación de equipos.', 7),
('Pensamiento Crítico', 'Capacidad para analizar información objetivamente y tomar decisiones informadas.', 6),
('Resolución de Conflictos', 'Habilidad para negociar y mediar en situaciones de tensión.', 5);

-- Datos iniciales para la tabla Rutas (sugerencias basadas en las habilidades)
INSERT INTO Rutas (habilidad_id, titulo, descripcion, duracion_dias, enlace_curso) VALUES
((SELECT habilidad_id FROM Habilidades WHERE nombre = 'Gestión del Tiempo'), 'Curso Express: El Método Pomodoro Avanzado', 'Técnicas probadas para maximizar el foco.', 7, 'http://curso-pomodoro.link/'),
((SELECT habilidad_id FROM Habilidades WHERE nombre = 'Comunicación Efectiva'), 'Guía de 5 Minutos: Estructuración de un Email de Cliente', 'Plantilla para emails claros y profesionales.', 3, 'http://guia-email.link/'),
((SELECT habilidad_id FROM Habilidades WHERE nombre = 'Liderazgo de Proyectos'), 'Certificación PRINCE2: Fundamentos Ágiles', 'Introduce la metodología para liderar equipos distribuidos.', 30, 'http://cert-agile.link/');