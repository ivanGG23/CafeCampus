import { query } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PaymentMix {
    metodo_pago: string;
    total_transacciones: number;
    monto_total: number;
    porcentaje: number;
    ticket_promedio: number;
    tipo_metodo: string;
}

export default async function PaymentMixPage() {
    // Query a la VIEW
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

    // KPIs
    const totalMonto = paymentsData.reduce(
        (sum, p) => sum + Number(p.monto_total),
        0
    );
    const totalTransacciones = paymentsData.reduce(
        (sum, p) => sum + Number(p.total_transacciones),
        0
    );

    // Método más usado
    const metodoMasUsado = paymentsData[0];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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
                                💳 Mix de Pagos
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Distribución de métodos de pago y tendencias
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <p className="text-sm text-gray-500 mb-1">Total Procesado</p>
                        <p className="text-3xl font-bold text-gray-900">
                            ${totalMonto.toLocaleString('es-MX', {
                                minimumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <p className="text-sm text-gray-500 mb-1">Total Transacciones</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {totalTransacciones.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <p className="text-sm text-gray-500 mb-1">Método Preferido</p>
                        <p className="text-2xl font-bold text-gray-900 capitalize">
                            {metodoMasUsado?.metodo_pago || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            {metodoMasUsado?.porcentaje
                                ? `${Number(metodoMasUsado.porcentaje).toFixed(1)}%`
                                : ''}
                        </p>
                    </div>
                </div>

                {/* Gráfico de Barras Visual */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-6">
                        Distribución por Método de Pago
                    </h2>
                    <div className="space-y-4">
                        {paymentsData.map((payment) => (
                            <div key={payment.metodo_pago}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-900 capitalize">
                                        {payment.metodo_pago === 'efectivo' && '💵 '}
                                        {payment.metodo_pago === 'tarjeta' && '💳 '}
                                        {payment.metodo_pago === 'transferencia' && '🏦 '}
                                        {payment.metodo_pago}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {Number(payment.porcentaje).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                                    <div
                                        className={`h-6 rounded-full flex items-center px-3 text-xs font-medium text-white ${payment.metodo_pago === 'efectivo'
                                                ? 'bg-green-500'
                                                : payment.metodo_pago === 'tarjeta'
                                                    ? 'bg-blue-500'
                                                    : 'bg-purple-500'
                                            }`}
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

                {/* Tabla Detallada */}
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
                                                    {payment.metodo_pago === 'efectivo' && '💵'}
                                                    {payment.metodo_pago === 'tarjeta' && '💳'}
                                                    {payment.metodo_pago === 'transferencia' && '🏦'}
                                                </span>
                                                <span className="text-sm font-medium text-gray-900 capitalize">
                                                    {payment.metodo_pago}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${payment.tipo_metodo === 'Tradicional'
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

                {/* Insights */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                        💡 Insights
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>
                            • El método más utilizado es{' '}
                            <strong className="capitalize">
                                {metodoMasUsado?.metodo_pago}
                            </strong>{' '}
                            con {Number(metodoMasUsado?.porcentaje).toFixed(1)}% del total
                        </li>
                        <li>
                            • Total de métodos de pago disponibles: {paymentsData.length}
                        </li>
                        <li>
                            • Ticket promedio general: $
                            {(totalMonto / totalTransacciones).toLocaleString('es-MX', {
                                minimumFractionDigits: 2,
                            })}
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}