import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface PaymentMix {
    metodo_pago: string;
    total_transacciones: number;
    monto_total: number;
    porcentaje: number;
    ticket_promedio: number;
    tipo_metodo: string;
}

export async function GET(request: NextRequest) {
    try {
        const paymentsData = await query<PaymentMix>(
            `SELECT 
                metodo_pago,
                total_transacciones,
                monto_total,
                porcentaje,
                ticket_promedio,
                tipo_metodo
            FROM vw_payment_mix
            ORDER BY monto_total DESC`
        );

        const totalMonto = paymentsData.reduce(
            (sum, p) => sum + Number(p.monto_total),
            0
        );
        
        const totalTransacciones = paymentsData.reduce(
            (sum, p) => sum + Number(p.total_transacciones),
            0
        );

        const metodoMasUsado = paymentsData[0] || null;
        const ticketPromedioGeneral = totalTransacciones > 0 
            ? totalMonto / totalTransacciones 
            : 0;

        return NextResponse.json({
            success: true,
            data: {
                paymentsData,
                summary: {
                    totalMonto,
                    totalTransacciones,
                    metodoMasUsado,
                    ticketPromedioGeneral,
                    totalMetodos: paymentsData.length
                }
            }
        });

    } catch (error) {
        console.error('Error fetching payment mix data:', error);
        return NextResponse.json(
            { success: false, error: 'Error al obtener datos de métodos de pago' },
            { status: 500 }
        );
    }
}