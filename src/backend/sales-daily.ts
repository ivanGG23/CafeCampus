import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface SalesDaily {
    fecha: string;
    tickets: number;
    total_ventas: number;
    ticket_promedio: number;
    productos_vendidos: number;
    nivel_actividad: string;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        
        const dateFrom = searchParams.get('date_from') ||
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const dateTo = searchParams.get('date_to') ||
            new Date().toISOString().split('T')[0];

        const salesData = await query<SalesDaily>(
            `SELECT 
                fecha::text,
                tickets,
                total_ventas,
                ticket_promedio,
                productos_vendidos,
                nivel_actividad
            FROM vw_sales_daily
            WHERE fecha >= $1 AND fecha <= $2
            ORDER BY fecha DESC`,
            [dateFrom, dateTo]
        );

        const totalVentas = salesData.reduce((sum, row) => sum + Number(row.total_ventas), 0);
        const totalTickets = salesData.reduce((sum, row) => sum + Number(row.tickets), 0);
        const promedioGeneral = totalTickets > 0 ? totalVentas / totalTickets : 0;

        return NextResponse.json({
            success: true,
            data: {
                salesData,
                summary: {
                    totalVentas,
                    totalTickets,
                    promedioGeneral
                },
                filters: {
                    dateFrom,
                    dateTo
                }
            }
        });

    } catch (error) {
        console.error('Error fetching sales data:', error);
        return NextResponse.json(
            { success: false, error: 'Error al obtener datos de ventas' },
            { status: 500 }
        );
    }
}