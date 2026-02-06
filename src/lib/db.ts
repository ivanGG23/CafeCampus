import { Pool, QueryResultRow } from 'pg';

// Singleton pattern para la conexión
let pool: Pool | null = null;

export function getPool(): Pool {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        pool.on('connect', () => {
            console.log('Conectado a PostgreSQL');
        });

        pool.on('error', (err) => {
            console.error('Error inesperado en PostgreSQL:', err);
        });
    }

    return pool;
}

export async function query<T extends QueryResultRow = any>(
    text: string,
    params?: any[]
): Promise<T[]> {
    const pool = getPool();
    const start = Date.now();

    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;

        console.log('Query ejecutado', {
            duration: `${duration}ms`,
            rows: result.rowCount
        });

        return result.rows as T[];
    } catch (error) {
        console.error('Error en query:', error);
        throw error;
    }
}

export async function closePool(): Promise<void> {
    if (pool) {
        await pool.end();
        pool = null;
        console.log('🔌 Conexión a PostgreSQL cerrada');
    }
}
