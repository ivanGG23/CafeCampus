'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

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

function CustomerValueContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');

    const [customersData, setCustomersData] = useState<CustomerValue[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/customer-value?page=${page}&limit=${limit}`
                );
                const data = await response.json();
                
                setCustomersData(data.customers || []);
                setTotalPages(data.totalPages || 1);
                setTotalCount(data.total || 0);
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [page, limit]);

    const vipCount = customersData.filter(c => c.segmento === 'VIP').length;
    const frecuenteCount = customersData.filter(c => c.segmento === 'Frecuente').length;
    const totalRevenue = customersData.reduce(
        (sum, c) => sum + Number(c.total_gastado),
        0
    );

    const getSegmentBadge = (segmento: string) => {
        switch (segmento) {
            case 'VIP':
                return 'bg-purple-100 text-purple-800';
            case 'Frecuente':
                return 'bg-blue-100 text-blue-800';
            case 'Regular':
                return 'bg-green-100 text-green-800';
            case 'Nuevo':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleLimitChange = (newLimit: number) => {
        router.push(`/reports/customer-value?limit=${newLimit}&page=1`);
    };

    const handlePageChange = (newPage: number) => {
        router.push(`/reports/customer-value?page=${newPage}&limit=${limit}`);
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
                                Valor de Clientes
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Segmentación de clientes por valor y frecuencia
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
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium opacity-90">Clientes VIP</p>
                                </div>
                                <p className="text-4xl font-bold">{vipCount}</p>
                                <p className="text-xs opacity-75 mt-1">
                                    {totalCount > 0 ? ((vipCount / totalCount) * 100).toFixed(1) : 0}% del total
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium opacity-90">Frecuentes</p>
                                </div>
                                <p className="text-4xl font-bold">{frecuenteCount}</p>
                                <p className="text-xs opacity-75 mt-1">
                                    {totalCount > 0 ? ((frecuenteCount / totalCount) * 100).toFixed(1) : 0}% del total
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium opacity-90">Revenue Total</p>
                                </div>
                                <p className="text-3xl font-bold">
                                    ${totalRevenue.toLocaleString('es-MX', {
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                                <p className="text-xs opacity-75 mt-1">Página actual</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="px-6 py-4 border-b flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-blue-600">
                                    Clientes ({totalCount} total)
                                </h2>
                                <div className="flex gap-2 items-center text-sm text-gray-600">
                                    <span>Mostrar:</span>
                                    <select
                                        value={limit}
                                        onChange={(e) => handleLimitChange(Number(e.target.value))}
                                        className="border border-gray-300 rounded px-2 py-1"
                                    >
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                            </div>

                            {customersData.length === 0 ? (
                                <div className="px-6 py-12 text-center text-gray-500">
                                    No hay clientes para mostrar
                                </div>
                            ) : (
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
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-600">
                                                            {customer.email}
                                                        </div>
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
                                                        ${Number(customer.gasto_promedio).toLocaleString('es-MX', {
                                                            minimumFractionDigits: 2,
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {customer.ultima_compra
                                                            ? new Date(customer.ultima_compra).toLocaleDateString('es-MX', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getSegmentBadge(
                                                                customer.segmento
                                                            )}`}
                                                        >
                                                            {customer.segmento}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Página {page} de {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page <= 1}
                                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                            page <= 1
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page >= totalPages}
                                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                            page >= totalPages
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default function CustomerValuePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Cargando...</div>
            </div>
        }>
            <CustomerValueContent />
        </Suspense>
    );
}