import { useState } from 'react'
import Header from '@components/Header'
import DataGridTable from '@components/DataGridTable'
import DialogBox from '@components/DialogBox'
import { FaArrowLeft } from 'react-icons/fa'
import { FiPlus } from 'react-icons/fi'

const DebtorList = () => {
    const [dialogMode, setDialogMode] = useState('update') // 'add' or 'update'
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedDebtor, setSelectedDebtor] = useState(null)
    const [formData, setFormData] = useState({
        ponumber: '',
        salesperson: '',
        advance: '',
        amount: '',
        status: '',
        remainingAmount: '',
    })
    const columns = [
        {
            field: 'ponumber',
            header: 'PO Number',
            sortable: true,
            searchable: true,
        },
        {
            field: 'salesperson',
            header: 'Sales Person',
            sortable: true,
            searchable: true,
        },
        {
            field: 'advance',
            header: 'Advance',
            sortable: true,
            searchable: true,
        },
        {
            field: 'amount',
            header: 'Amount',
            sortable: true,
            searchable: true,
        },
        {
            field: 'status',
            header: 'Status',
            sortable: true,
            searchable: true,
            renderCell: (value) => {
                const colorClasses = {
                    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    Completed: 'bg-green-100 text-green-800 border-green-200',
                }
                return (
                    <span
                        className={`rounded-full border px-2 py-1 text-xs font-medium ${
                            colorClasses[value] ||
                            'border-gray-200 bg-gray-100 text-gray-800'
                        }`}
                    >
                        {value}
                    </span>
                )
            },
        },
        {
            field: 'remainingAmount',
            header: 'Remaining Amount',
            sortable: true,
            searchable: true,
        },
    ]

    const mockData = [
        {
            id: 1,
            ponumber: 'PO-001',
            salesperson: 'John Doe',
            advance: 5000,
            amount: 10000,
            status: 'Pending',
            remainingAmount: 5000,
        },
        {
            id: 2,
            ponumber: 'PO-002',
            salesperson: 'Jane Smith',
            advance: 3000,
            amount: 8000,
            status: 'Completed',
            remainingAmount: 5000,
        },
    ]

    const handleAdd = () => {
        setDialogMode('add')
        setSelectedDebtor(null)
        setFormData({
            ponumber: '',
            salesperson: '',
            advance: '',
            amount: '',
            status: 'Pending',
            remainingAmount: '',
        })
        setIsDialogOpen(true)
    }

    const handleUpdate = (row) => {
        setDialogMode('update')
        setSelectedDebtor(row)
        setFormData({
            ponumber: row.ponumber,
            salesperson: row.salesperson,
            advance: row.advance,
            amount: row.amount,
            status: row.status,
            remainingAmount: row.remainingAmount,
        })
        setIsDialogOpen(true)
    }

    const handleSubmit = () => {
        // Here you would typically make an API call to add/update the data
        if (dialogMode === 'add') {
            console.log('Added data:', formData)
        } else {
            console.log('Updated data:', {
                id: selectedDebtor.id,
                ...formData,
            })
        }
        setIsDialogOpen(false)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <div className="container mx-auto min-h-screen bg-gray-100">
            <Header
                heading="Debtor List"
                description="Manage your debtors and their transactions"
                buttonName={
                    <>
                        <FiPlus className="mr-2" />
                        Add New Debtor
                    </>
                }
                handleClick={handleAdd}
            />

            <button
                onClick={() => window.history.back()}
                className="mx-8 mb-8 flex items-center rounded-lg bg-white px-4 py-2 text-gray-700 shadow transition-all hover:bg-gray-50 hover:shadow-md"
            >
                <FaArrowLeft className="mr-2" />
                <span>Back</span>
            </button>

            <div className="mx-8">
                <DataGridTable
                    data={mockData}
                    columns={columns}
                    onUpdate={handleUpdate}
                />
            </div>

            <DialogBox
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title={dialogMode === 'add' ? 'Add Debtor' : 'Update Debtor'}
                handleSubmit={handleSubmit}
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            PO Number
                        </label>
                        <input
                            type="text"
                            name="ponumber"
                            value={formData.ponumber}
                            onChange={handleInputChange}
                            className="input-text-custom mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Sales Person
                        </label>
                        <input
                            type="text"
                            name="salesperson"
                            value={formData.salesperson}
                            onChange={handleInputChange}
                            className="input-text-custom mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Advance
                        </label>
                        <input
                            type="number"
                            name="advance"
                            value={formData.advance}
                            onChange={handleInputChange}
                            className="input-text-custom mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Amount
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            className="input-text-custom mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="input-select-custom mt-1"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Remaining Amount
                        </label>
                        <input
                            type="number"
                            name="remainingAmount"
                            value={formData.remainingAmount}
                            onChange={handleInputChange}
                            className="input-text-custom mt-1"
                        />
                    </div>
                </div>
            </DialogBox>
        </div>
    )
}

export default DebtorList
