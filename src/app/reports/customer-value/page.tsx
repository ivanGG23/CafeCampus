'use client';

import { useEffect, useState } from 'react';
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

export default function CustomerValuePage({
    searchParams,
}: {
    searchParams: { page?: string; limit?: string };
}) {
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '15');

    const [customersData, setCustomersData] = useState<CustomerValue[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetch(`/api/customer-value?page=${page}&limit=${limit}`)
            .then(res => res.json())
            .then(data => {
                setCustomersData(data.customers);
                setTotalPages(data.totalPages);
                setTotalCount(data.total);
            });
    }, [page, limit]);

    const vipCount = customersData.filter(c => c.segmento === 'VIP').length;
    const frecuenteCount = customersData.filter(c => c.segmento === 'Frecuente').length;
    const totalRevenue = customersData.reduce(
        (sum, c) => sum + Number(c.total_gastado),
        0
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/" className="font-medium">
                        ← Volver
                    </Link>
                    <h1 className="text-2xl font-bold">
                        Valor de Clientes
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <KPI title="Clientes VIP" value={vipCount} />
                    <KPI title="Frecuentes" value={frecuenteCount} />
                    <KPI
                        title="Revenue (página)"
                        value={`$${totalRevenue.toLocaleString('es-MX')}`}
                    />
                </div>

                <div className="bg-white rounded-lg shadow border overflow-hidden">
                    <div className="px-6 py-4 border-b flex justify-between items-center">
                        <h2 className="font-semibold">
                            Clientes ({totalCount})
                        </h2>
                        
                    </div>

                    <table className="w-full">
                        <tbody>
                            {customersData.map(c => (
                                <tr key={c.customer_id} className="border-t">
                                    <td className="px-6 py-4">{c.cliente_nombre}</td>
                                    <td className="px-6 py-4">{c.email}</td>
                                    <td className="px-6 py-4 text-right">{c.num_ordenes}</td>
                                    <td className="px-6 py-4 text-right">
                                        ${Number(c.total_gastado).toLocaleString('es-MX')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="px-6 py-4 border-t flex justify-between">
                        <span>
                            Página {page} de {totalPages}
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );
}

function KPI({
    title,
    value,
}: {
    title: string;
    value: string | number;
}) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}
