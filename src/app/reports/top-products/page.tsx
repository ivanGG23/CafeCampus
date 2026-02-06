import { query } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface TopProduct {
    product_id: number;
    producto_nombre: string;
    categoria: string;
    revenue: number;
    unidades_vendidas: number;
    num_ordenes: number;
    precio_promedio: number;
    ranking_revenue: number;
    ranking_unidades: number;
    clasificacion: string;
}

export default async function TopProductsPage(props: {
    searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) {
    const searchParams = await props.searchParams;

    const search = searchParams.search || '';
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '10');
    const offset = (page - 1) * limit;

    // Query con búsqueda y paginación
    const productsData = await query<TopProduct>(
        `SELECT 
      product_id,
      producto_nombre,
      categoria,
      revenue,
      unidades_vendidas,
      num_ordenes,
      precio_promedio,
      ranking_revenue,
      ranking_unidades,
      clasificacion
    FROM vw_top_products_ranked
    WHERE producto_nombre ILIKE $1
    ORDER BY revenue DESC
    LIMIT $2 OFFSET $3`,
        [`%${search}%`, limit, offset]
    );

    // Total de productos (para paginación)
    const totalCount = await query<{ count: number }>(
        `SELECT COUNT(*) as count 
     FROM vw_top_products_ranked 
     WHERE producto_nombre ILIKE $1`,
        [`%${search}%`]
    );

    const totalPages = Math.ceil((totalCount[0]?.count || 0) / limit);

    // Top 3 KPIs
    const top3 = productsData.slice(0, 3);

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
                                🏆 Top Productos
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Ranking de productos más vendidos por revenue
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top 3 Productos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {top3.map((product, idx) => (
                        <div
                            key={product.product_id}
                            className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm border p-6"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-4xl">
                                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                                </span>
                                <span className="text-sm font-medium text-gray-500">
                                    #{product.ranking_revenue}
                                </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                                {product.producto_nombre}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">{product.categoria}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${Number(product.revenue).toLocaleString('es-MX', {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                {product.unidades_vendidas} unidades vendidas
                            </p>
                        </div>
                    ))}
                </div>

                {/* Búsqueda */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Buscar Producto</h2>
                    <form className="flex gap-4">
                        <input
                            type="text"
                            name="search"
                            placeholder="Nombre del producto..."
                            defaultValue={search}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                            Buscar
                        </button>
                        {search && (
                            <Link
                                href="/reports/top-products"
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                            >
                                Limpiar
                            </Link>
                        )}
                    </form>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Productos ({totalCount[0]?.count || 0} total)
                        </h2>
                        <div className="flex gap-2 items-center text-sm text-gray-600">
                            <span>Mostrar:</span>
                            <select
                                name="limit"
                                defaultValue={limit}
                                onChange={(e) => {
                                    const newLimit = e.target.value;
                                    window.location.href = `/reports/top-products?search=${search}&limit=${newLimit}&page=1`;
                                }}
                                className="border border-gray-300 rounded px-2 py-1"
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Ranking
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Categoría
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Revenue
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Unidades
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Precio Prom.
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Clasificación
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {productsData.map((product) => (
                                    <tr key={product.product_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{product.ranking_revenue}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.producto_nombre}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {product.categoria}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                            ${Number(product.revenue).toLocaleString('es-MX', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                            {product.unidades_vendidas}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                            ${Number(product.precio_promedio).toLocaleString('es-MX', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${product.clasificacion === 'Estrella'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : product.clasificacion === 'Popular'
                                                            ? 'bg-green-100 text-green-800'
                                                            : product.clasificacion === 'Regular'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {product.clasificacion}
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
                                href={`/reports/top-products?search=${search}&limit=${limit}&page=${page - 1
                                    }`}
                                className={`px-4 py-2 rounded-md font-medium ${page <= 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Anterior
                            </Link>
                            <Link
                                href={`/reports/top-products?search=${search}&limit=${limit}&page=${page + 1
                                    }`}
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