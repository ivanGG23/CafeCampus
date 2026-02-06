'use client';

import { useRouter } from 'next/navigation';

export default function LimitSelector({ limit }: { limit: number }) {
    const router = useRouter();

    return (
        <select
            defaultValue={limit}
            onChange={(e) => {
                router.push(
                    `/reports/customer-value?limit=${e.target.value}&page=1`
                );
            }}
            className="border border-gray-300 rounded px-2 py-1"
        >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
        </select>
    );
}
