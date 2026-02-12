import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export interface TopProduct {
    product_id: number;
    producto_nombre: string;
    categoria: string;
    revenue: number;
    unidades_vendidas: number;
    num_ordenes: number;
    precio_promedio: number;
    ranking_revenue: number;
    ranking_unidades: number;
    clasificacion: string;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    try {
        const products = await query<TopProduct>(
            `SELECT 
        product_id,
        producto_nombre,
        categoria,
        revenue,
        unidades_vendidas,
        num_ordenes,
        precio_promedio,
        ranking_revenue,
        ranking_unidades,
        clasificacion
       FROM vw_top_products_ranked
       WHERE producto_nombre ILIKE $1
       ORDER BY revenue DESC
       LIMIT $2 OFFSET $3`,
            [`%${search}%`, limit, offset]
        );

        const totalCount = await query<{ count: number }>(
            `SELECT COUNT(*) as count 
       FROM vw_top_products_ranked 
       WHERE producto_nombre ILIKE $1`,
            [`%${search}%`]
        );

        const total = Number(totalCount[0]?.count || 0);
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            products,
            total,
            totalPages,
            page,
            limit,
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Error obteniendo productos' },
            { status: 500 }
        );
    }
}
