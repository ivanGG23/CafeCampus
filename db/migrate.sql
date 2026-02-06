\echo '==========================================';
\echo 'INICIANDO MIGRACIÓN DE BASE DE DATOS';
\echo '==========================================';

-- 1. SCHEMA - Crear tablas
-- ============================================
\echo '';
\echo '1/5 Creando schema (tablas)...';
\i /docker-entrypoint-initdb.d/schema.sql

-- 2. SEED - Insertar datos
-- ============================================
\echo '';
\echo '2/5 Insertando datos (seed)...';
\i /docker-entrypoint-initdb.d/seed.sql

-- 3. VIEWS - Crear reportes
-- ============================================
\echo '';
\echo '3/5 Creando views de reportes...';
\i /docker-entrypoint-initdb.d/reports_vw.sql

-- 4. INDEXES - Crear índices
-- ============================================
\echo '';
\echo '4/5 Creando índices...';
\i /docker-entrypoint-initdb.d/indexes.sql

-- 5. ROLES - Configurar seguridad
-- ============================================
\echo '';
\echo '5/5 Configurando roles y permisos...';
\i /docker-entrypoint-initdb.d/roles.sql

-- VERIFICACIÓN FINAL
-- ============================================
\echo '';
\echo '==========================================';
\echo 'MIGRACIÓN COMPLETADA';
\echo '==========================================';
\echo '';
\echo 'Verificando instalación...';

SELECT 'Tablas creadas:' as estado, COUNT(*) as total
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

SELECT 'Views creadas:' as estado, COUNT(*) as total
FROM pg_views 
WHERE schemaname = 'public' AND viewname LIKE 'vw_%';

SELECT 'Índices creados:' as estado, COUNT(*) as total
FROM pg_indexes 
WHERE schemaname = 'public' AND indexname LIKE 'idx_%';

SELECT 'Roles configurados:' as estado, COUNT(*) as total
FROM pg_roles 
WHERE rolname = 'app_user';

\echo '';
\echo '==========================================';
\echo 'BASE DE DATOS LISTA PARA USO';
\echo '==========================================';