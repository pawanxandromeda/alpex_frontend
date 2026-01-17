import React, { useState, useMemo, useEffect } from 'react'
import {
    AiOutlineCalendar,
    AiOutlineClockCircle,
    AiOutlineSortAscending,
    AiOutlineSortDescending,
    AiOutlineFilter,
    AiOutlineClear,
} from 'react-icons/ai'

const SortableTable = ({
    records,
    authorization,
    activeTab,
    onEdit,
    onDelete,
    onApprove,
}) => {
    const [sortConfig, setSortConfig] = useState({
        key: 'poNo',
        direction: 'ascending',
    })

    // Add date filtering state
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: '',
    })

    const [showDateFilter, setShowDateFilter] = useState(false)
    const [totalOrderAmount, setTotalOrderAmount] = useState(0)
    const [totalAdvance, setTotalAdvance] = useState(0)
    const [remainingPayment, setRemainingPayment] = useState(0)

    // Handle sorting logic
    const requestSort = (key) => {
        let direction = 'ascending'
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key, direction })
    }

    // Get the sort icon for the column
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return (
                <span className="ml-1 text-gray-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <AiOutlineSortAscending />
                </span>
            )
        }

        return sortConfig.direction === 'ascending' ? (
            <span className="ml-1 text-blue-500">
                <AiOutlineSortAscending />
            </span>
        ) : (
            <span className="ml-1 text-blue-500">
                <AiOutlineSortDescending />
            </span>
        )
    }

    // Handle date range changes
    const handleDateChange = (e) => {
        const { name, value } = e.target
        setDateRange((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Reset date filters
    const clearDateFilters = () => {
        setDateRange({
            startDate: '',
            endDate: '',
        })
    }

    // Filter and sort the data
    const filteredAndSortedData = useMemo(() => {
        if (!records || records.length === 0) return []

        // First filter by date range if applied
        let filteredItems = [...records]

        if (dateRange.startDate) {
            const startDate = new Date(dateRange.startDate)
            filteredItems = filteredItems.filter((item) => {
                const itemDate = new Date(item.poDate)
                return itemDate >= startDate
            })
        }

        if (dateRange.endDate) {
            const endDate = new Date(dateRange.endDate)
            // Set time to end of day for inclusive filtering
            endDate.setHours(23, 59, 59, 999)
            filteredItems = filteredItems.filter((item) => {
                const itemDate = new Date(item.poDate)
                return itemDate <= endDate
            })
        }

        // Then sort the filtered data
        filteredItems.sort((a, b) => {
            let aValue, bValue

            // Define custom sorting logic based on the column
            switch (sortConfig.key) {
                case 'gstNo':
                    aValue = a.gstNo
                    bValue = b.gstNo
                    break
                case 'poNo':
                    aValue = a.poNo
                    bValue = b.poNo
                    break
                case 'brandName':
                    aValue = a.brandName
                    bValue = b.brandName
                    break
                case 'partyName':
                    aValue = a.partyName
                    bValue = b.partyName
                    break
                case 'poQty':
                    aValue = a.poQty
                    bValue = b.poQty
                    break
                case 'poRate':
                    aValue = a.poRate
                    bValue = b.poRate
                    break
                case 'amount':
                    aValue = a.amount
                    bValue = b.amount
                    break
                case 'mrp':
                    aValue = a.mrp
                    bValue = b.mrp
                    break
                case 'poDate':
                    aValue = new Date(a.poDate).getTime()
                    bValue = new Date(b.poDate).getTime()
                    break
                case 'overallStatus':
                    aValue = a.overallStatus
                    bValue = b.overallStatus
                    break
                default:
                    aValue = a.poNo
                    bValue = b.poNo
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1
            }
            return 0
        })

        return filteredItems
    }, [records, sortConfig, dateRange])

    // Calculate total amount from filtered data whenever it changes
    useEffect(() => {
        const calculatedTotal = filteredAndSortedData.reduce((sum, data) => {
            return sum + (Number(data.amount) || 0)
        }, 0)

        const calculatedAdvance = filteredAndSortedData.reduce((sum, data) => {
            return sum + (Number(data.advance) || 0)
        }, 0)

        const calculatedRemaining = calculatedTotal - calculatedAdvance

        setTotalOrderAmount(calculatedTotal)
        setTotalAdvance(calculatedAdvance)
        setRemainingPayment(calculatedRemaining)
    }, [filteredAndSortedData])

    // Format the current UTC date time in YYYY-MM-DD HH:MM:SS format
    const getCurrentUTCDateTime = () => {
        const now = new Date()
        const year = now.getUTCFullYear()
        const month = String(now.getUTCMonth() + 1).padStart(2, '0')
        const day = String(now.getUTCDate()).padStart(2, '0')
        const hours = String(now.getUTCHours()).padStart(2, '0')
        const minutes = String(now.getUTCMinutes()).padStart(2, '0')
        const seconds = String(now.getUTCSeconds()).padStart(2, '0')

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    // No early return before hooks are called
    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 transition-all duration-300">
            {/* Date Filter Controls */}
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-gray-50 to-white px-6 py-4">
                <div className="flex items-center space-x-4">
                    <span className="mr-3 text-sm font-medium">Created: </span>
                    <span className="mr-3 text-xs text-gray-600">
                        User: arpitgoswami
                    </span>
                    <span className="text-xs text-gray-600">
                        Current Date/Time (UTC): {getCurrentUTCDateTime()}
                    </span>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={() => setShowDateFilter(!showDateFilter)}
                        className="mr-4 flex items-center space-x-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 transition-all duration-200 hover:bg-indigo-100"
                    >
                        <AiOutlineFilter className="mr-1" />
                        {showDateFilter ? 'Hide Date Filter' : 'Filter by Date'}
                    </button>

                    {dateRange.startDate || dateRange.endDate ? (
                        <button
                            onClick={clearDateFilters}
                            className="flex items-center space-x-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-100"
                        >
                            <AiOutlineClear className="mr-1 h-4 w-4" />
                            Clear Filters
                        </button>
                    ) : null}
                </div>
            </div>
            {/* Date Range Picker */}
            {showDateFilter && (
                <div className="flex items-center justify-between space-x-6 border-b border-gray-200 bg-gray-50/50 px-8 py-4">
                    <div className="flex items-center space-x-6">
                        <label
                            htmlFor="startDate"
                            className="mr-2 text-sm font-medium"
                        >
                            From:
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={dateRange.startDate}
                            onChange={handleDateChange}
                            className="rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                    <div className="flex items-center">
                        <label
                            htmlFor="endDate"
                            className="mr-2 text-sm font-medium"
                        >
                            To:
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={dateRange.endDate}
                            onChange={handleDateChange}
                            min={dateRange.startDate}
                            className="rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <div className="rounded-lg bg-indigo-50 px-4 py-2">
                        <span className="text-sm font-medium text-indigo-600">
                            {filteredAndSortedData.length} of{' '}
                            {records?.length || 0} records shown
                        </span>
                    </div>
                </div>
            )}

            {/* Total Order Amount Display */}
            <div className="grid grid-cols-3 gap-6 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 px-8 py-6">
                <div className="rounded-xl bg-white/50 p-4 text-right shadow-sm">
                    <span className="text-sm font-semibold text-gray-700">
                        Total Order Amount:{' '}
                    </span>
                    <span className="text-lg font-bold text-blue-700">
                        ₹
                        {totalOrderAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                </div>
                <div className="rounded-xl bg-white/50 p-4 text-right shadow-sm">
                    <span className="text-sm font-semibold text-emerald-600">
                        Total Advance:{' '}
                    </span>
                    <span className="text-lg font-bold text-emerald-700">
                        ₹{' '}
                        {totalAdvance.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                </div>
                <div className="rounded-xl bg-white/50 p-4 text-right shadow-sm">
                    <span className="text-sm font-semibold text-rose-600">
                        Remaining Payment:{' '}
                    </span>
                    <span className="text-lg font-bold text-rose-700">
                        ₹{' '}
                        {remainingPayment.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                </div>
            </div>

            {/* Conditionally render the main content or no records message */}
            {!records || records.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg bg-white text-gray-500 shadow-md transition-shadow">
                    <p className="animate-pulse text-lg">
                        No records to show...
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-gradient-to-r from-white to-gray-50">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                                <th
                                    className="group cursor-pointer px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors hover:text-gray-900"
                                    onClick={() => requestSort('gstNo')}
                                >
                                    <div className="flex items-center">
                                        GST & PO Details
                                        {getSortIcon('gstNo')}
                                    </div>
                                </th>
                                <th
                                    className="group cursor-pointer px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors hover:text-gray-900"
                                    onClick={() => requestSort('brandName')}
                                >
                                    <div className="flex items-center">
                                        Brand & Party
                                        {getSortIcon('brandName')}
                                    </div>
                                </th>
                                <th
                                    className="group cursor-pointer px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors hover:text-gray-900"
                                    onClick={() => requestSort('poQty')}
                                >
                                    <div className="flex items-center">
                                        Quantity & Rate
                                        {getSortIcon('poQty')}
                                    </div>
                                </th>
                                <th
                                    className="group cursor-pointer px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors hover:text-gray-900"
                                    onClick={() => requestSort('amount')}
                                >
                                    <div className="flex items-center">
                                        Amount & MRP
                                        {getSortIcon('amount')}
                                    </div>
                                </th>
                                <th
                                    className="group cursor-pointer px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors hover:text-gray-900"
                                    onClick={() => requestSort('poDate')}
                                >
                                    <div className="flex items-center">
                                        Status & Date
                                        {getSortIcon('poDate')}
                                    </div>
                                </th>
                                {(authorization.includes('admin') ||
                                    activeTab === 'Pending') && (
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredAndSortedData.length > 0 ? (
                                filteredAndSortedData.map((data, index) => (
                                    <tr
                                        key={index}
                                        className="transition-all duration-200 hover:bg-gray-50/80"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="transition-transform duration-200 hover:translate-x-1">
                                                <div className="mb-1 text-sm font-bold tracking-wide text-gray-900">
                                                    {data.gstNo}
                                                </div>
                                                <div className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                                                    PO #{data.poNo}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="transition-transform duration-200 hover:translate-x-1">
                                                <div className="mb-1 text-sm font-medium text-gray-900">
                                                    {data.brandName}
                                                </div>
                                                <div className="text-sm font-medium text-gray-500">
                                                    {data.partyName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="transition-transform duration-200 hover:translate-x-1">
                                                <div className="text-sm font-medium text-gray-800">
                                                    {data.poQty.toLocaleString()}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    ₹
                                                    {data.poRate.toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="transition-transform duration-200 hover:translate-x-1">
                                                <div className="mb-1 text-sm font-bold text-indigo-600">
                                                    ₹{' '}
                                                    {data.amount.toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </div>
                                                <div className="text-sm font-medium text-gray-500">
                                                    ₹{' '}
                                                    {data.mrp.toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </div>
                                                {data.advance !== null && (
                                                    <div className="mt-1.5 text-xs font-semibold text-emerald-600">
                                                        Advance: ₹{' '}
                                                        {data.advance.toLocaleString(
                                                            undefined,
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="transition-transform duration-200 hover:translate-x-1">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <AiOutlineCalendar className="mr-2 h-4 w-4 text-blue-500" />
                                                    {new Date(
                                                        data.poDate
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        }
                                                    )}
                                                </div>
                                                <div className="mt-1 flex items-center">
                                                    <AiOutlineClockCircle className="mr-2 h-4 w-4 text-blue-500" />
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${
                                                            data.overallStatus ===
                                                            'Completed'
                                                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 hover:bg-emerald-100'
                                                                : 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 hover:bg-amber-100'
                                                        }`}
                                                    >
                                                        {data.overallStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        {(authorization.includes('admin') ||
                                            activeTab === 'Pending') && (
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="inline-flex items-center justify-center rounded-lg bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-700/10 transition-all duration-200 hover:bg-indigo-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onEdit(data)
                                                        }}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        className="inline-flex items-center justify-center rounded-lg bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-700/10 transition-all duration-200 hover:bg-rose-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onDelete(data)
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                    {authorization.includes(
                                                        'admin'
                                                    ) && (
                                                        <button
                                                            className="inline-flex items-center justify-center rounded-lg bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-700/10 transition-all duration-200 hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                onApprove(data)
                                                            }}
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={
                                            authorization.includes('admin') ||
                                            activeTab === 'Pending'
                                                ? 6
                                                : 5
                                        }
                                        className="px-6 py-12 text-center"
                                    >
                                        <p className="text-sm font-medium text-gray-500">
                                            No records match the selected date
                                            range
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default SortableTable
