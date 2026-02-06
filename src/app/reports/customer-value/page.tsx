import { query } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface CustomerValue {
    customer_id: number;
    cliente_nombre: string;
    email: string;
    num_ordenes: number;
    total_gastado: number;
    gasto_promedio: number;
    ultima_compra: string;
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

    // Query con paginación
    const customersData = await query<CustomerValue>(
        `SELECT 
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
    LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    // Total de clientes
    const totalCount = await query<{ count: number }>(
        `SELECT COUNT(*) as count FROM vw_customer_value`
    );

    const totalPages = Math.ceil((totalCount[0]?.count || 0) / limit);

    // KPIs por segmento
    const vipCount = customersData.filter((c) => c.segmento === 'VIP').length;
    const frecuenteCount = customersData.filter(
        (c) => c.segmento === 'Frecuente'
    ).length;
    const totalRevenue = customersData.reduce(
        (sum, c) => sum + Number(c.total_gastado),
        0
    );

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
                                👥 Valor de Clientes
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Segmentación y análisis de clientes por valor
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">👑</span>
                            <div>
                                <p className="text-sm text-purple-100 mb-1">Clientes VIP</p>
                                <p className="text-3xl font-bold">{vipCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">⭐</span>
                            <div>
                                <p className="text-sm text-blue-100 mb-1">Frecuentes</p>
                                <p className="text-3xl font-bold">{frecuenteCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">💰</span>
                            <div>
                                <p className="text-sm text-green-100 mb-1">
                                    Revenue (esta página)
                                </p>
                                <p className="text-2xl font-bold">
                                    ${totalRevenue.toLocaleString('es-MX', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Clientes ({totalCount[0]?.count || 0} total)
                        </h2>
                        <div className="flex gap-2 items-center text-sm text-gray-600">
                            <span>Por página:</span>
                            <select
                                name="limit"
                                defaultValue={limit}
                                onChange={(e) => {
                                    const newLimit = e.target.value;
                                    window.location.href = `/reports/customer-value?limit=${newLimit}&page=1`;
                                }}
                                className="border border-gray-300 rounded px-2 py-1"
                            >
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Órdenes
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Total Gastado
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Gasto Promedio
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Última Compra
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Segmento
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customersData.map((customer) => (
                                    <tr key={customer.customer_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {customer.cliente_nombre}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {customer.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                            {customer.num_ordenes}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                            ${Number(customer.total_gastado).toLocaleString('es-MX', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                            ${Number(customer.gasto_promedio).toLocaleString(
                                                'es-MX',
                                                { minimumFractionDigits: 2 }
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(customer.ultima_compra).toLocaleDateString(
                                                'es-MX'
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${customer.segmento === 'VIP'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : customer.segmento === 'Frecuente'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : customer.segmento === 'Regular'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {customer.segmento}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Página {page} de {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={`/reports/customer-value?limit=${limit}&page=${page - 1}`}
                                className={`px-4 py-2 rounded-md font-medium ${page <= 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Anterior
                            </Link>
                            <Link
                                href={`/reports/customer-value?limit=${limit}&page=${page + 1}`}
                                className={`px-4 py-2 rounded-md font-medium ${page >= totalPages
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Siguiente
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}