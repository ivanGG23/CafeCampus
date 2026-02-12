'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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

interface InventoryRiskResponse {
    success: boolean;
    data: {
        inventoryData: InventoryRisk[];
        categories: Category[];
        summary: {
            criticalCount: number;
            highRiskCount: number;
            totalProducts: number;
        };
        filters: {
            category: string;
        };
    };
}

export default function InventoryRiskPage() {
    const [inventoryData, setInventoryData] = useState<InventoryRisk[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [summary, setSummary] = useState({
        criticalCount: 0,
        highRiskCount: 0,
        totalProducts: 0
    });
    const [categoryFilter, setCategoryFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category') || '';
        setCategoryFilter(category);
    }, []);

    useEffect(() => {
        const fetchInventoryData = async () => {
            setLoading(true);
            try {
                const url = categoryFilter 
                    ? `/api/inventory-risk?category=${encodeURIComponent(categoryFilter)}`
                    : '/api/inventory-risk';
                    
                const response = await fetch(url);
                const result: InventoryRiskResponse = await response.json();
                
                if (result.success) {
                    setInventoryData(result.data.inventoryData);
                    setCategories(result.data.categories);
                    setSummary(result.data.summary);
                }
            } catch (error) {
                console.error('Error fetching inventory data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInventoryData();
    }, [categoryFilter]);

    useEffect(() => {
        const handleUrlChange = () => {
            const params = new URLSearchParams(window.location.search);
            const category = params.get('category') || '';
            setCategoryFilter(category);
        };

        window.addEventListener('popstate', handleUrlChange);
        return () => window.removeEventListener('popstate', handleUrlChange);
    }, []);

    const getRiskColor = (porcentaje: number) => {
        if (porcentaje > 70) return 'text-red-600';
        if (porcentaje > 50) return 'text-orange-600';
        return 'text-yellow-600';
    };

    const getAlertBadgeColor = (nivel: string) => {
        if (nivel.includes('CRÍTICO')) return 'bg-red-100 text-red-800';
        if (nivel === 'ALTO') return 'bg-orange-100 text-orange-800';
        if (nivel === 'MEDIO') return 'bg-yellow-100 text-yellow-800';
        return 'bg-blue-100 text-blue-800';
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
                                Inventario en Riesgo
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Productos con stock bajo que requieren atención
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
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">🔴</span>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Nivel Crítico</p>
                                        <p className="text-3xl font-bold text-red-600">
                                            {summary.criticalCount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">🟠</span>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Riesgo Alto</p>
                                        <p className="text-3xl font-bold text-orange-600">
                                            {summary.highRiskCount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">📦</span>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total en Riesgo</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {summary.totalProducts}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CategoryFilter integrado */}
                        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-4">Filtrar por Categoría</h2>
                            <div className="flex gap-2 flex-wrap">
                                <Link
                                    href="/reports/inventory-risk"
                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                        !categoryFilter
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Todas
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.category_id}
                                        href={`/reports/inventory-risk?category=${encodeURIComponent(cat.name)}`}
                                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                            categoryFilter === cat.name
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-lg font-semibold">
                                    Productos en Riesgo ({inventoryData.length})
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Producto
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Categoría
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Stock Actual
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Stock Mínimo
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                % Riesgo
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Días Restantes
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Nivel Alerta
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Proveedor
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {inventoryData.map((product) => (
                                            <tr key={product.product_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.producto_nombre}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {product.categoria}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                                    {product.stock_actual}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                                    {product.stock_minimo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                    <span className={`font-medium ${getRiskColor(Number(product.porcentaje_riesgo))}`}>
                                                        {Number(product.porcentaje_riesgo).toFixed(1)}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                                    {product.dias_stock_estimado === 999
                                                        ? 'N/A'
                                                        : `${product.dias_stock_estimado} días`}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAlertBadgeColor(product.nivel_alerta)}`}>
                                                        {product.nivel_alerta}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {product.proveedor || 'Sin proveedor'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}