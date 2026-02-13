'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface SalesDaily {
    fecha: string;
    tickets: number;
    total_ventas: number;
    ticket_promedio: number;
    productos_vendidos: number;
    nivel_actividad: string;
}

interface SalesDataResponse {
    success: boolean;
    data: {
        salesData: SalesDaily[];
        summary: {
            totalVentas: number;
            totalTickets: number;
            promedioGeneral: number;
        };
        filters: {
            dateFrom: string;
            dateTo: string;
        };
    };
}

export default function SalesDailyPage() {
    const [salesData, setSalesData] = useState<SalesDaily[]>([]);
    const [summary, setSummary] = useState({
        totalVentas: 0,
        totalTickets: 0,
        promedioGeneral: 0
    });
    const [loading, setLoading] = useState(true);
    const [dateFrom, setDateFrom] = useState(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    const [dateTo, setDateTo] = useState(
        new Date().toISOString().split('T')[0]
    );

    const fetchSalesData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/sales-daily?date_from=${dateFrom}&date_to=${dateTo}`
            );
            const result: SalesDataResponse = await response.json();

            if (result.success) {
                setSalesData(result.data.salesData);
                setSummary(result.data.summary);
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesData();
    }, [dateFrom, dateTo]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchSalesData();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
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
                                    Ventas Diarias
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Análisis de ventas por día con métricas clave
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4 text-blue-600">Filtros de Fecha</h2>
                    <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Desde
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hasta
                            </label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                            Aplicar
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-gray-500">Cargando datos...</div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-gray-500">Total Ventas</p>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">
                                    ${summary.totalVentas.toLocaleString('es-MX', {
                                        minimumFractionDigits: 2
                                    })}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-gray-500">Total Tickets</p>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">
                                    {summary.totalTickets.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-gray-500">Ticket Promedio</p>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">
                                    ${summary.promedioGeneral.toLocaleString('es-MX', {
                                        minimumFractionDigits: 2
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-lg font-semibold text-blue-600">
                                    Detalle por Día ({salesData.length} registros)
                                </h2>
                            </div>

                            {salesData.length === 0 ? (
                                <div className="px-6 py-12 text-center text-gray-500">
                                    No hay datos para el rango de fechas seleccionado
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fecha
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tickets
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total Ventas
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ticket Promedio
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Productos
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nivel
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {salesData.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {new Date(row.fecha).toLocaleDateString('es-MX', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                                        {row.tickets}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                                        ${Number(row.total_ventas).toLocaleString('es-MX', {
                                                            minimumFractionDigits: 2
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                                        ${Number(row.ticket_promedio).toLocaleString('es-MX', {
                                                            minimumFractionDigits: 2
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                                        {row.productos_vendidos}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${row.nivel_actividad === 'Alto'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : row.nivel_actividad === 'Medio'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}
                                                        >
                                                            {row.nivel_actividad}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}