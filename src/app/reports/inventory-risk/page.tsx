import { query } from '@/lib/db';
import Link from 'next/link';
import CategoryFilter from './CategoryFilter';

export const dynamic = 'force-dynamic';

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

export default async function InventoryRiskPage(props: {
    searchParams: Promise<{ category?: string }>;
}) {
    const searchParams = await props.searchParams;
    const categoryFilter = searchParams.category || '';

    const categories = await query<Category>(
        `SELECT category_id, name FROM vw_categories ORDER BY name`
    );

    const inventoryData = await query<InventoryRisk>(
        categoryFilter
            ? `SELECT * FROM vw_inventory_risk WHERE categoria = $1 ORDER BY stock_actual::DECIMAL / NULLIF(stock_minimo, 1) ASC`
            : `SELECT * FROM vw_inventory_risk ORDER BY stock_actual::DECIMAL / NULLIF(stock_minimo, 1) ASC`,
        categoryFilter ? [categoryFilter] : []
    );

    const criticalCount = inventoryData.filter(
        (p) => p.nivel_alerta.includes('CRÍTICO')
    ).length;
    const highRiskCount = inventoryData.filter((p) => p.nivel_alerta === 'ALTO')
        .length;
    const totalProducts = inventoryData.length;

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl"></span>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Nivel Crítico</p>
                                <p className="text-3xl font-bold text-red-600">
                                    {criticalCount}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl"></span>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Riesgo Alto</p>
                                <p className="text-3xl font-bold text-orange-600">
                                    {highRiskCount}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl"></span>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total en Riesgo</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {totalProducts}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <CategoryFilter categories={categories} currentCategory={categoryFilter} />

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
                                            <span
                                                className={`font-medium ${Number(product.porcentaje_riesgo) > 70
                                                        ? 'text-red-600'
                                                        : Number(product.porcentaje_riesgo) > 50
                                                            ? 'text-orange-600'
                                                            : 'text-yellow-600'
                                                    }`}
                                            >
                                                {Number(product.porcentaje_riesgo).toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                            {product.dias_stock_estimado === 999
                                                ? 'N/A'
                                                : `${product.dias_stock_estimado} días`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${product.nivel_alerta.includes('CRÍTICO')
                                                        ? 'bg-red-100 text-red-800'
                                                        : product.nivel_alerta === 'ALTO'
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : product.nivel_alerta === 'MEDIO'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                    }`}
                                            >
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
            </main>
        </div>
    );
}