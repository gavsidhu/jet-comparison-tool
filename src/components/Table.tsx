'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Jet } from '@prisma/client';
import Loader from './Loader';

type Props = {
    initialJets: Jet[];
};

type SortBy = 'name' | 'wingspan' | 'engines' | 'year';
type SortOrder = 'asc' | 'desc';

export default function Table({ initialJets }: Props) {
    const [jets, setJets] = useState<Jet[]>(initialJets);
    const [sortConfig, setSortConfig] = useState<{ sortBy: SortBy; sortOrder: SortOrder } | null>(null);
    const [selectedJets, setSelectedJets] = useState<Jet[]>([])
    const [criteria, setCriteria] = useState<Criteria>('topSpeed');
    const [comparisonData, setComparisonData] = useState<JetComparisonResult[] | null>(null)
    const [loading, setLoading] = useState(false)
    const comparisonResultRef = useRef<null | HTMLTableElement>(null)

    const sortJets = (sortBy: SortBy) => {
        const sortOrder = sortConfig?.sortBy === sortBy && sortConfig.sortOrder === 'asc' ? 'desc' : 'asc';
        const sortedJets = [...jets].sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setJets(sortedJets);
        setSortConfig({ sortBy, sortOrder });
    };

    const handleCriteriaChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setCriteria(e.target.value as Criteria);
    };


    const compareJets = async () => {
        setLoading(true)
        setComparisonData(null)
        const body = {
            criteria,
            jets: selectedJets
        }

        try {
            const res = await fetch("api/compare", {
                method: "POST",
                body: JSON.stringify(body)
            })

            const data = await res.json()
            setLoading(false)
            setComparisonData(data)
        } catch (err) {
            setLoading(false)
        }
    }

    // Scroll to results table when it renders
    useEffect(() => {
        comparisonResultRef.current?.scrollIntoView({ behavior: "smooth" })

    }, [comparisonData])

    return (
        <div>
            <div className='py-3'>
                <h2 className='font-semibold text-xl text-black'>Top 10 Jets</h2>
            </div>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className='divide-y divide-gray-300 w-full'>
                    <thead className='bg-gray-900 text-white'>
                        <tr>
                            <th scope="col" className="min-w-[12rem] py-3.5 px-2.5 text-left text-sm font-semibold">
                                Select
                            </th>
                            <th scope="col" className="min-w-[12rem] py-3.5 px-2.5 text-left text-sm font-semibold">
                                <div className="flex items-center">
                                    Name
                                    <button onClick={() => sortJets('name')}>
                                        <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                        </svg>
                                    </button>
                                </div>
                            </th>
                            <th scope="col" className="px-2.5 py-3.5 text-left text-sm font-semibold">
                                <div className="flex items-center">
                                    Wingspan (ft)
                                    <button onClick={() => sortJets("wingspan")}>
                                        <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                        </svg>
                                    </button>
                                </div>

                            </th>
                            <th scope="col" className="px-2.5 py-3.5 text-left text-sm font-semibold">
                                <div className="flex items-center">
                                    Number of Engines
                                    <button onClick={() => sortJets("engines")}>
                                        <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                        </svg>
                                    </button>
                                </div>

                            </th>
                            <th scope="col" className="px-2.5 py-3.5 text-left text-sm font-semibold">
                                <div className="flex items-center">
                                    Manufacturing Year
                                    <button onClick={() => sortJets("year")}>
                                        <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                        </svg>
                                    </button>
                                </div>

                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 bg-white'>
                        {jets.map(jet => (
                            <tr key={jet.id}>
                                <td className="relative px-7 sm:w-12 sm:px-6">
                                    <input
                                        type="checkbox"
                                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        checked={selectedJets?.includes(jet)}
                                        onChange={(e) =>
                                            setSelectedJets(
                                                e.target.checked
                                                    ? [...selectedJets, jet]
                                                    : selectedJets?.filter((j) => j !== jet)
                                            )
                                        }

                                    />
                                </td>
                                <td className="whitespace-nowrap text-left px-2.5 py-3.5 text-sm text-gray-500">{jet.name}</td>
                                <td className="whitespace-nowrap text-left px-2.5 py-3.5 text-sm text-gray-500">{jet.wingspan}</td>
                                <td className="whitespace-nowrap text-left px-2.5 py-3.5 text-sm text-gray-500">{jet.engines}</td>
                                <td className="whitespace-nowrap text-left px-2.5 py-3.5 text-sm text-gray-500">{jet.year}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedJets.length > 1 && (
                <div className='flex items-center w-full pt-4 space-x-4 mx-auto'>
                    <div className='whitespace-nowrap'>
                        <p>Compare jets by: </p>
                    </div>
                    <select
                        id="compare"
                        name="Compare"
                        className="sm:max-w-72 rounded-md border-gray-300 bg-white py-1.5 pl-3 pr-10 text-base text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={criteria}
                        onChange={handleCriteriaChange}
                    >
                        <option value="topSpeed">Top Speed (mph)</option>
                        <option value="fuelEfficiency">Fuel Efficiency (nm/gal)</option>
                        <option value="maxSeating">Maximum Seats</option>
                    </select>
                    <button onClick={compareJets} className="sm:w-auto bg-black hover:bg-gray-800 text-white font-semibold py-1.5 px-4 rounded-md">
                        Compare
                    </button>
                </div>
            )}


            {/* Comparison results table */}
            <div className="pt-8">
                {loading && (
                    <div className='w-40 mx-auto'>
                        <Loader />
                    </div>
                )}
                {comparisonData && (
                    <div>
                        <div className='py-3'>
                            <h2 className='font-semibold text-xl text-black'>Comparison Results</h2>
                        </div>
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                            <table ref={comparisonResultRef} className='divide-y divide-gray-300 w-full'>
                                <thead className='bg-gray-900 text-white'>
                                    <tr>
                                        <th scope="col" className="px-2.5 py-3.5 text-left text-sm font-semibold">
                                            Rank
                                        </th>
                                        <th scope="col" className="px-2.5 py-3.5 text-left text-sm font-semibold">
                                            Name
                                        </th>
                                        <th scope="col" className="px-2.5 py-3.5 text-left text-sm font-semibold">
                                            Value
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200 bg-white'>
                                    {comparisonData.map((data, idx) => (
                                        <tr key={idx}>
                                            <td className="whitespace-nowrap text-left px-2.5 py-3.5 text-sm text-gray-500">{idx + 1}</td>
                                            <td className="whitespace-nowrap text-left px-2.5 py-3.5 text-sm text-gray-500">{data.name}</td>
                                            <td className="whitespace-nowrap text-left px-2.5 py-3.5 text-sm text-gray-500">{data.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
