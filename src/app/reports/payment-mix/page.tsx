'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface PaymentMix {
    metodo_pago: string;
    total_transacciones: number;
    monto_total: number;
    porcentaje: number;
    ticket_promedio: number;
    tipo_metodo: string;
}

interface PaymentMixResponse {
    success: boolean;
    data: {
        paymentsData: PaymentMix[];
        summary: {
            totalMonto: number;
            totalTransacciones: number;
            metodoMasUsado: PaymentMix | null;
            ticketPromedioGeneral: number;
            totalMetodos: number;
        };
    };
}

export default function PaymentMixPage() {
    const [paymentsData, setPaymentsData] = useState<PaymentMix[]>([]);
    const [summary, setSummary] = useState({
        totalMonto: 0,
        totalTransacciones: 0,
        metodoMasUsado: null as PaymentMix | null,
        ticketPromedioGeneral: 0,
        totalMetodos: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaymentData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/payment-mix');
                const result: PaymentMixResponse = await response.json();
                
                if (result.success) {
                    setPaymentsData(result.data.paymentsData);
                    setSummary(result.data.summary);
                }
            } catch (error) {
                console.error('Error fetching payment data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, []);

    const getPaymentIcon = (metodo: string) => {
        switch (metodo) {
            case 'efectivo': return '💵';
            case 'tarjeta': return '💳';
            case 'transferencia': return '🏦';
            default: return '💰';
        }
    };

    const getPaymentColor = (metodo: string) => {
        switch (metodo) {
            case 'efectivo': return 'bg-green-500';
            case 'tarjeta': return 'bg-blue-500';
            case 'transferencia': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            ← Volver
                        </Link>
                        <div className="h-8 w-px bg-gray-300" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Mix de Pagos
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Distribución de métodos de pago y tendencias
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-gray-500">Cargando datos...</div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <p className="text-sm text-gray-500 mb-1">Total Procesado</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ${summary.totalMonto.toLocaleString('es-MX', {
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <p className="text-sm text-gray-500 mb-1">Total Transacciones</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {summary.totalTransacciones.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <p className="text-sm text-gray-500 mb-1">Método Preferido</p>
                                <p className="text-2xl font-bold text-gray-900 capitalize">
                                    {summary.metodoMasUsado?.metodo_pago || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {summary.metodoMasUsado?.porcentaje
                                        ? `${Number(summary.metodoMasUsado.porcentaje).toFixed(1)}%`
                                        : ''}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-6">
                                Distribución por Método de Pago
                            </h2>
                            <div className="space-y-4">
                                {paymentsData.map((payment) => (
                                    <div key={payment.metodo_pago}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-900 capitalize flex items-center gap-2">
                                                <span className="text-xl">{getPaymentIcon(payment.metodo_pago)}</span>
                                                {payment.metodo_pago}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {Number(payment.porcentaje).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                                            <div
                                                className={`h-6 rounded-full flex items-center px-3 text-xs font-medium text-white ${getPaymentColor(payment.metodo_pago)}`}
                                                style={{ width: `${payment.porcentaje}%` }}
                                            >
                                                ${Number(payment.monto_total).toLocaleString('es-MX', {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-lg font-semibold">Detalle por Método</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Método de Pago
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Tipo
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Transacciones
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Monto Total
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Ticket Promedio
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                % del Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paymentsData.map((payment) => (
                                            <tr key={payment.metodo_pago} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl">
                                                            {getPaymentIcon(payment.metodo_pago)}
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-900 capitalize">
                                                            {payment.metodo_pago}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            payment.tipo_metodo === 'Tradicional'
                                                                ? 'bg-gray-100 text-gray-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}
                                                    >
                                                        {payment.tipo_metodo}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                                    {payment.total_transacciones.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                                    ${Number(payment.monto_total).toLocaleString('es-MX', {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                                    ${Number(payment.ticket_promedio).toLocaleString(
                                                        'es-MX',
                                                        { minimumFractionDigits: 2 }
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                    <span className="font-semibold text-gray-900">
                                                        {Number(payment.porcentaje).toFixed(1)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-sm font-semibold text-blue-900 mb-2">
                                💡 Insights
                            </h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>
                                    • El método más utilizado es{' '}
                                    <strong className="capitalize">
                                        {summary.metodoMasUsado?.metodo_pago || 'N/A'}
                                    </strong>{' '}
                                    con {summary.metodoMasUsado ? Number(summary.metodoMasUsado.porcentaje).toFixed(1) : 0}% del total
                                </li>
                                <li>
                                    • Total de métodos de pago disponibles: {summary.totalMetodos}
                                </li>
                                <li>
                                    • Ticket promedio general: $
                                    {summary.ticketPromedioGeneral.toLocaleString('es-MX', {
                                        minimumFractionDigits: 2,
                                    })}
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}