import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface InventoryRisk {
    product_id: number;
    producto_nombre: string;
    categoria: string;
    category_id: number;
    stock_actual: number;
    stock_minimo: number;
    porcentaje_riesgo: number;
    dias_stock_estimado: number;
    nivel_alerta: string;
    proveedor: string;
}

interface Category {
    category_id: number;
    name: string;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const categoryFilter = searchParams.get('category') || '';

        // Obtener categorías
        const categories = await query<Category>(
            `SELECT category_id, name FROM vw_categories ORDER BY name`
        );

        // Obtener datos de inventario
        const inventoryData = await query<InventoryRisk>(
            categoryFilter
                ? `SELECT * FROM vw_inventory_risk WHERE categoria = $1 ORDER BY stock_actual::DECIMAL / NULLIF(stock_minimo, 1) ASC`
                : `SELECT * FROM vw_inventory_risk ORDER BY stock_actual::DECIMAL / NULLIF(stock_minimo, 1) ASC`,
            categoryFilter ? [categoryFilter] : []
        );

        // Calcular métricas
        const criticalCount = inventoryData.filter(
            (p) => p.nivel_alerta.includes('CRÍTICO')
        ).length;

        const highRiskCount = inventoryData.filter(
            (p) => p.nivel_alerta === 'ALTO'
        ).length;

        const totalProducts = inventoryData.length;

        return NextResponse.json({
            success: true,
            data: {
                inventoryData,
                categories,
                summary: {
                    criticalCount,
                    highRiskCount,
                    totalProducts
                },
                filters: {
                    category: categoryFilter
                }
            }
        });

    } catch (error) {
        console.error('Error fetching inventory risk data:', error);
        return NextResponse.json(
            { success: false, error: 'Error al obtener datos de inventario en riesgo' },
            { status: 500 }
        );
    }
}