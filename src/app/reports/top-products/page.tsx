'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

export default function TopProductsPage() {
    const [products, setProducts] = useState<TopProduct[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        fetch(
            `/api/top-products?search=${search}&page=${page}&limit=${limit}`
        )
            .then(res => res.json())
            .then(data => {
                setProducts(data.products);
                setTotal(data.total);
                setTotalPages(data.totalPages);
            });
    }, [search, page, limit]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <Link href="/">← Volver</Link>

            <h1 className="text-2xl font-bold mb-4">
                Top Productos ({total})
            </h1>

            

            <table className="w-full mt-6 border">
                <thead>
                    <tr className="bg-gray-100">
                        <th>Ranking</th>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Revenue</th>
                        <th>Unidades</th>
                        <th>Clasificación</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.product_id}>
                            <td>#{p.ranking_revenue}</td>
                            <td>{p.producto_nombre}</td>
                            <td>{p.categoria}</td>
                            <td>
                                ${Number(p.revenue).toLocaleString('es-MX')}
                            </td>
                            <td>{p.unidades_vendidas}</td>
                            <td>{p.clasificacion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4">
                Página {page} de {totalPages}
            </div>
        </div>
    );
}
