import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export interface CustomerValue {
    customer_id: number;
    cliente_nombre: string;
    email: string;
    num_ordenes: number;
    total_gastado: number;
    gasto_promedio: number;
    ultima_compra: string | null;
    segmento: string;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const offset = (page - 1) * limit;

    try {
        const customers = await query<CustomerValue>(
            `
      SELECT 
        customer_id,
        cliente_nombre,
        email,
        num_ordenes,
        total_gastado,
        gasto_promedio,
        ultima_compra::text,
        segmento
      FROM vw_customer_value
      ORDER BY total_gastado DESC
      LIMIT $1 OFFSET $2
      `,
            [limit, offset]
        );

        const totalCount = await query<{ count: number }>(
            `SELECT COUNT(*) as count FROM vw_customer_value`
        );

        const total = Number(totalCount[0]?.count || 0);
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            customers,
            total,
            totalPages,
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Error obteniendo clientes' },
            { status: 500 }
        );
    }
}
