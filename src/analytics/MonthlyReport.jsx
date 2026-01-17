import React, { useMemo, useState } from 'react'
import DataGridTable from '@components/DataGridTable'
import Header from '@components/Header'
import DialogBox from '@components/DialogBox'
import CustomDeleteDialog from '@components/CustomDeleteDialog'
import { FaArrowLeft } from 'react-icons/fa'

// --- Sample Data (Salesperson vs. Month) ---
const salesByPersonData = [
    {
        salesperson: 'Alice Smith',
        Jan: 15000,
        Feb: 18200,
        Mar: 22000,
        Apr: 19500,
        May: 25000,
        Jun: 21000,
        Jul: 23000,
        Aug: 24500,
        Sep: 26000,
        Oct: 27500,
        Nov: 29000,
        Dec: 31000,
    },
    {
        salesperson: 'Bob Johnson',
        Jan: 12000,
        Feb: 14500,
        Mar: 16000,
        Apr: 17500,
        May: 19000,
        Jun: 20500,
        Jul: 22000,
        Aug: 23500,
        Sep: 25000,
        Oct: 26500,
        Nov: 28000,
        Dec: 29500,
    },
    {
        salesperson: 'Charlie Brown',
        Jan: 9000,
        Feb: 11000,
        Mar: 13000,
        Apr: 15000,
        May: 17000,
        Jun: 19000,
        Jul: 21000,
        Aug: 23000,
        Sep: 24000,
        Oct: 25000,
        Nov: 26000,
        Dec: 27000,
    },
    {
        salesperson: 'Diana Prince',
        Jan: 18000,
        Feb: 21000,
        Mar: 24000,
        Apr: 27000,
        May: 30000,
        Jun: 33000,
        Jul: 36000,
        Aug: 39000,
        Sep: 42000,
        Oct: 45000,
        Nov: 48000,
        Dec: 51000,
    },
    {
        salesperson: 'Ethan Hunt',
        Jan: 16500,
        Feb: 19500,
        Mar: 22500,
        Apr: 25500,
        May: 28500,
        Jun: 31500,
        Jul: 34500,
        Aug: 37500,
        Sep: 40500,
        Oct: 43500,
        Nov: 46500,
        Dec: 49500,
    },
]

// --- Column Definitions ---
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

const monthlySalesColumns = [
    {
        field: 'salesperson',
        header: 'Salesperson',
        sortable: true,
        searchable: true,
        cellClassName:
            'font-semibold sticky left-0 bg-white dark:bg-gray-800 z-10', // Sticky first column
        headerClassName: 'sticky left-0 bg-blue-500 z-20', // Sticky header for first column
    },
    ...months.map((month) => ({
        field: month,
        header: month,
        sortable: true,
        searchable: false,
        cellClassName: 'text-right',
        renderCell: (value) => (value ? `₹${value.toLocaleString()}` : '₹0'),
    })),
    {
        field: 'total',
        header: 'Year Total',
        sortable: true,
        searchable: false,
        cellClassName: 'text-right font-bold',
        renderCell: (value) => `₹${value.toLocaleString()}`,
    },
    {
        field: 'average',
        header: 'Monthly Avg',
        sortable: true,
        searchable: false,
        cellClassName: 'text-right',
        renderCell: (value) =>
            `₹${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    },
    {
        field: 'last6MonthAvg',
        header: 'Last 6m Avg',
        sortable: true,
        searchable: false,
        cellClassName:
            'text-right font-bold sticky right-0 bg-white dark:bg-gray-800 z-10',
        headerClassName: 'sticky right-0 bg-blue-500 z-20',
        renderCell: (value) =>
            `₹${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    },
]

// --- Component ---
const MonthlyReport = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogAction, setDialogAction] = useState(null)
    const [selectedRow, setSelectedRow] = useState(null)
    const [formData, setFormData] = useState({
        salesperson: '',
        ...months.reduce((acc, month) => ({ ...acc, [month]: 0 }), {}),
    })
    const [salesData, setSalesData] = useState(salesByPersonData)

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: field === 'salesperson' ? value : Number(value),
        }))
    }

    const handleAddNew = () => {
        setSelectedRow(null)
        setDialogAction('add')
        setIsDialogOpen(true)
    }

    const handleUpdate = (row) => {
        setSelectedRow(row)
        setDialogAction('update')
        setIsDialogOpen(true)
        setFormData({
            salesperson: row.salesperson,
            ...months.reduce(
                (acc, month) => ({ ...acc, [month]: row[month] || 0 }),
                {}
            ),
        })
    }

    const handleDelete = (row) => {
        setSelectedRow(row)
        setDialogAction('delete')
        setIsDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
        setDialogAction(null)
        setSelectedRow(null)
        setFormData({
            salesperson: '',
            ...months.reduce((acc, month) => ({ ...acc, [month]: 0 }), {}),
        })
    }

    const handleDialogSubmit = () => {
        if (dialogAction === 'add' || dialogAction === 'update') {
            if (!formData.salesperson.trim()) {
                alert('Please enter a salesperson name')
                return
            }

            setSalesData((prevData) => {
                if (dialogAction === 'add') {
                    return [...prevData, formData]
                } else {
                    return prevData.map((row) =>
                        row.salesperson === selectedRow.salesperson
                            ? formData
                            : row
                    )
                }
            })
        } else if (dialogAction === 'delete') {
            setSalesData((prevData) =>
                prevData.filter(
                    (row) => row.salesperson !== selectedRow.salesperson
                )
            )
        }

        handleCloseDialog()
    }

    const dataWithCalculations = useMemo(() => {
        return salesData.map((row) => {
            const total = months.reduce(
                (sum, month) => sum + (row[month] || 0),
                0
            )
            const average = total / 12
            const last6Months = months.slice(-6)
            const last6MonthTotal = last6Months.reduce(
                (sum, month) => sum + (row[month] || 0),
                0
            )
            const last6MonthAvg = last6MonthTotal / 6

            return {
                ...row,
                total,
                average,
                last6MonthAvg,
            }
        })
    }, [salesData])

    const monthlyTotals = useMemo(() => {
        const totals = {}
        months.forEach((month) => {
            totals[month] = salesData.reduce(
                (sum, row) => sum + (row[month] || 0),
                0
            )
        })
        return totals
    }, [salesData])

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header
                heading="Monthly Sales Report"
                description="Sales performance by salesperson for the current year"
                buttonName="Add New Entry"
                handleClick={handleAddNew}
            />

            <div className="px-8">
                <button
                    onClick={() => window.history.back()}
                    className="mb-8 flex items-center rounded-lg bg-white px-4 py-2 text-gray-700 shadow transition-all hover:bg-gray-50 hover:shadow-md"
                >
                    <FaArrowLeft className="mr-2" />
                    <span>Back</span>
                </button>
                <div className="mb-3 flex items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Monthly Totals
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <div className="inline-flex rounded-lg border border-gray-200 bg-white text-sm shadow dark:border-gray-700 dark:bg-gray-800">
                        <table className="w-auto divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr className="divide-x divide-gray-200 bg-blue-500 text-white dark:divide-gray-700">
                                    {months.map((month) => (
                                        <th
                                            key={month}
                                            className="w-24 px-3 py-2 text-center text-xs font-medium"
                                        >
                                            {month}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr className="divide-x divide-gray-200 dark:divide-gray-700">
                                    {months.map((month) => (
                                        <td
                                            key={month}
                                            className="w-24 px-3 py-1.5 text-center text-gray-900 dark:text-gray-300"
                                        >
                                            ₹
                                            {monthlyTotals[
                                                month
                                            ].toLocaleString()}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="divide-x divide-gray-200 bg-gray-50 text-xs dark:divide-gray-700 dark:bg-gray-700">
                                    {months.map((month, index) => {
                                        const currentTotal =
                                            monthlyTotals[month]
                                        const prevMonth = months[index - 1]
                                        const prevTotal = prevMonth
                                            ? monthlyTotals[prevMonth]
                                            : null
                                        const growth = prevTotal
                                            ? ((currentTotal - prevTotal) /
                                                  prevTotal) *
                                              100
                                            : null

                                        return (
                                            <td
                                                key={month}
                                                className={`w-24 px-3 py-1.5 text-center ${
                                                    growth > 0
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : growth < 0
                                                          ? 'text-red-600 dark:text-red-400'
                                                          : 'text-gray-500 dark:text-gray-400'
                                                }`}
                                            >
                                                {growth !== null
                                                    ? `${growth.toFixed(1)}%`
                                                    : '—'}
                                            </td>
                                        )
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Salesperson Breakdown Table */}
            <div className="px-4 py-6 md:px-8">
                <h2 className="mb-3 text-xl font-semibold text-gray-700 dark:text-gray-200">
                    Salesperson Breakdown
                </h2>
                <DataGridTable
                    data={dataWithCalculations}
                    columns={monthlySalesColumns}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            </div>

            {/* Dialog Box for Add/Update */}
            <DialogBox
                isOpen={isDialogOpen && dialogAction !== 'delete'}
                onClose={handleCloseDialog}
                title={
                    dialogAction === 'add'
                        ? 'Add New Sales Entry'
                        : `Update Entry for ${selectedRow?.salesperson}`
                }
                handleSubmit={handleDialogSubmit}
            >
                {dialogAction === 'add' && (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label
                                htmlFor="salesperson"
                                className="text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                                Salesperson Name
                            </label>
                            <input
                                type="text"
                                id="salesperson"
                                value={formData.salesperson}
                                onChange={(e) =>
                                    handleInputChange(
                                        'salesperson',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                                placeholder="Enter salesperson name"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {months.map((month) => (
                                <div key={month} className="grid gap-2">
                                    <label
                                        htmlFor={month}
                                        className="text-sm font-medium text-gray-700 dark:text-gray-200"
                                    >
                                        {month} Sales
                                    </label>
                                    <input
                                        type="number"
                                        id={month}
                                        value={formData[month]}
                                        onChange={(e) =>
                                            handleInputChange(
                                                month,
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                                        placeholder="Enter sales amount"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {dialogAction === 'update' && (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label
                                htmlFor="salesperson"
                                className="text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                                Salesperson Name
                            </label>
                            <input
                                type="text"
                                id="salesperson"
                                value={formData.salesperson}
                                onChange={(e) =>
                                    handleInputChange(
                                        'salesperson',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                                placeholder="Enter salesperson name"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {months.map((month) => (
                                <div key={month} className="grid gap-2">
                                    <label
                                        htmlFor={month}
                                        className="text-sm font-medium text-gray-700 dark:text-gray-200"
                                    >
                                        {month} Sales
                                    </label>
                                    <input
                                        type="number"
                                        id={month}
                                        value={formData[month]}
                                        onChange={(e) =>
                                            handleInputChange(
                                                month,
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                                        placeholder="Enter sales amount"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DialogBox>

            {/* Custom Delete Dialog */}
            <CustomDeleteDialog
                isOpen={isDialogOpen && dialogAction === 'delete'}
                onClose={handleCloseDialog}
                onConfirm={handleDialogSubmit}
                title={`Delete Sales Entry`}
                message={`Are you sure you want to delete the entry for ${selectedRow?.salesperson}? This action cannot be undone.`}
            />
        </div>
    )
}

export default MonthlyReport
