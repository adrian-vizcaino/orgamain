-- =================================================================================
-- ESQUEMA SQL PARA EL MÓDULO DE DIAGNÓSTICO (ORGAMAIN)
-- =================================================================================

-- 1. Tabla de Habilidades (Los pilares del diagnóstico)
CREATE TABLE IF NOT EXISTS Habilidades (
    habilidad_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    metrica_impacto INTEGER NOT NULL -- Peso (1-10) para el algoritmo
);

-- 2. Tabla de Rutas y Cursos (Recomendaciones)
CREATE TABLE IF NOT EXISTS Rutas (
    ruta_id SERIAL PRIMARY KEY,
    habilidad_id INTEGER REFERENCES Habilidades(habilidad_id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    duracion_dias INTEGER,
    enlace_curso VARCHAR(255)
);

-- 3. Tabla de Resultados del Test
CREATE TABLE IF NOT EXISTS Test_Resultados (
    resultado_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Usuarios(user_id) ON DELETE CASCADE,
    puntuacion_diagnostico NUMERIC(5, 2) NOT NULL, -- Promedio general (0-100)
    habilidad_carencia_id INTEGER REFERENCES Habilidades(habilidad_id) ON DELETE RESTRICT, -- Lo que debe mejorar
    fecha_test TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================================
-- DATOS SEMILLA (Seed Data)
-- =================================================================================

-- Insertamos las habilidades base si no existen
INSERT INTO Habilidades (nombre, descripcion, metrica_impacto) VALUES
('Gestión del Tiempo', 'Priorización y cumplimiento de plazos.', 9),
('Comunicación Efectiva', 'Transmisión clara de ideas.', 8),
('Liderazgo', 'Dirección y motivación de equipos.', 7),
('Pensamiento Crítico', 'Análisis objetivo y toma de decisiones.', 6),
('Resolución de Conflictos', 'Negociación y mediación.', 5)
ON CONFLICT (nombre) DO NOTHING;

-- Insertamos Rutas de ejemplo
INSERT INTO Rutas (habilidad_id, titulo, descripcion, duracion_dias, enlace_curso) VALUES
((SELECT habilidad_id FROM Habilidades WHERE nombre = 'Gestión del Tiempo'), 'Método Pomodoro Avanzado', 'Técnicas de foco extremo.', 7, 'https://example.com/pomodoro'),
((SELECT habilidad_id FROM Habilidades WHERE nombre = 'Gestión del Tiempo'), 'Time Blocking Mastery', 'Domina tu agenda bloqueando tiempo.', 5, 'https://example.com/timeblocking'),
((SELECT habilidad_id FROM Habilidades WHERE nombre = 'Comunicación Efectiva'), 'Emails Profesionales', 'Escribe correos que la gente sí lea.', 3, 'https://example.com/email'),
((SELECT habilidad_id FROM Habilidades WHERE nombre = 'Liderazgo'), 'Liderazgo Ágil (Scrum)', 'Gestiona equipos en entornos cambiantes.', 15, 'https://example.com/agile');