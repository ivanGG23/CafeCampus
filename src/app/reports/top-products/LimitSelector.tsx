'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface LimitSelectorProps {
    currentLimit: number;
    search: string;
}

export default function LimitSelector({ currentLimit, search }: LimitSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = e.target.value;
        router.push(`/reports/top-products?search=${search}&limit=${newLimit}&page=1`);
    };

    return (
        <div className="flex gap-2 items-center text-sm text-gray-600">
            <span>Mostrar:</span>
            <select
                value={currentLimit}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1"
            >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
            </select>
        </div>
    );
}