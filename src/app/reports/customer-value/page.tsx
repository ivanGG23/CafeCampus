import { query } from '@/lib/db';
import Link from 'next/link';
import LimitSelector from './limitSelector';

export const dynamic = 'force-dynamic';

interface CustomerValue {
    customer_id: number;
    cliente_nombre: string;
    email: string;
    num_ordenes: number;
    total_gastado: number;
    gasto_promedio: number;
    ultima_compra: string | null;
    segmento: string;
}

export default async function CustomerValuePage({
    searchParams,
}: {
    searchParams: { page?: string; limit?: string };
}) {
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '15');
    const offset = (page - 1) * limit;

    const customersData = await query<CustomerValue>(
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

    const totalPages = Math.ceil((totalCount[0]?.count || 0) / limit);

    const vipCount = customersData.filter(c => c.segmento === 'VIP').length;
    const frecuenteCount = customersData.filter(c => c.segmento === 'Frecuente').length;
    const totalRevenue = customersData.reduce(
        (sum, c) => sum + Number(c.total_gastado),
        0
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-gray-800 hover:text-black font-medium"
                    >
                        ← Volver
                    </Link>
                    <div className="h-8 w-px bg-gray-300" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Valor de Clientes
                        </h1>
                        <p className="text-sm text-gray-700">
                            Segmentación y análisis de clientes
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <KPI title="Clientes VIP" value={vipCount} icon="" />
                    <KPI title="Frecuentes" value={frecuenteCount} icon="" />
                    <KPI
                        title="Revenue (página)"
                        value={`$${totalRevenue.toLocaleString('es-MX')}`}
                        icon=""
                    />
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-lg shadow border overflow-hidden">
                    <div className="px-6 py-4 border-b flex justify-between items-center">
                        <h2 className="font-semibold text-gray-900">
                            Clientes ({totalCount[0]?.count || 0})
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-800">
                            <span>Por página:</span>
                            <LimitSelector limit={limit} />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b">
                                <tr className="text-gray-700">
                                    <th className="px-6 py-3 text-left text-xs font-semibold">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold">
                                        Órdenes
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold">
                                        Promedio
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold">
                                        Última compra
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold">
                                        Segmento
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {customersData.map(c => (
                                    <tr key={c.customer_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-900 font-medium">
                                            {c.cliente_nombre}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {c.email}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-900">
                                            {c.num_ordenes}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                                            ${Number(c.total_gastado).toLocaleString('es-MX')}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-900">
                                            ${Number(c.gasto_promedio).toLocaleString('es-MX')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {c.ultima_compra
                                                ? new Date(c.ultima_compra).toLocaleDateString('es-MX')
                                                : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-900">
                                                {c.segmento}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <div className="px-6 py-4 border-t flex justify-between items-center">
                        <span className="text-sm text-gray-800">
                            Página {page} de {totalPages}
                        </span>
                        <div className="flex gap-2">
                            {page > 1 && (
                                <Link
                                    href={`/reports/customer-value?page=${page - 1}&limit=${limit}`}
                                    className="px-4 py-2 border rounded text-gray-900 hover:bg-gray-100"
                                >
                                    Anterior
                                </Link>
                            )}
                            {page < totalPages && (
                                <Link
                                    href={`/reports/customer-value?page=${page + 1}&limit=${limit}`}
                                    className="px-4 py-2 border rounded text-gray-900 hover:bg-gray-100"
                                >
                                    Siguiente
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function KPI({
    title,
    value,
    icon,
}: {
    title: string;
    value: string | number;
    icon: string;
}) {
    return (
        <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
            <span className="text-3xl">{icon}</span>
            <div>
                <p className="text-sm text-gray-700 font-medium">
                    {title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                    {value}
                </p>
            </div>
        </div>
    );
}
