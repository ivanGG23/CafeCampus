'use client';

import Link from 'next/link';

interface Category {
    category_id: number;
    name: string;
}

interface CategoryFilterProps {
    categories: Category[];
    currentCategory: string;
}

export default function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Filtrar por Categoría</h2>
            <div className="flex gap-2 flex-wrap">
                <Link
                    href="/reports/inventory-risk"
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                        !currentCategory
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
                            currentCategory === cat.name
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {cat.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}