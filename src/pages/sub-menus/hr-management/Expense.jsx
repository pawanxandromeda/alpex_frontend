import React, { useState, useEffect } from 'react'
import axios from '@axios'
import { FiPlus, FiAlertCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Header from '@components/Header'
import DialogBox from '@components/DialogBox'
import DataGridTable from '@components/DataGridTable'
import CustomDeleteDialog from '@components/CustomDeleteDialog'

const Expense = () => {
    const [expenses, setExpenses] = useState([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedExpense, setSelectedExpense] = useState(null)
    const [loading, setLoading] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const [formData, setFormData] = useState({
        username: 'arpit',
        amount: '',
        category: '',
        description: '',
        paymentMethod: '',
    })

    useEffect(() => {
        fetchExpenses()
    }, [])

    const fetchExpenses = async () => {
        setLoading(true)
        try {
            const response = await axios.get('/api/expense')
            setExpenses(response.data)
        } catch (err) {
            toast.error(
                'Failed to fetch expenses: ' +
                    (err.response?.data?.error || err.message)
            )
        } finally {
            setLoading(false)
        }
    }

    const validateForm = () => {
        const errors = {}
        if (!formData.amount) {
            errors.amount = 'Amount is required'
        } else if (formData.amount <= 0) {
            errors.amount = 'Amount must be greater than 0'
        }
        if (!formData.category) {
            errors.category = 'Category is required'
        }
        if (!formData.paymentMethod) {
            errors.paymentMethod = 'Payment method is required'
        }
        if (!formData.description.trim()) {
            errors.description = 'Description is required'
        }
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly')
            return
        }

        try {
            if (selectedExpense) {
                const response = await axios.put(
                    `/api/expense/${selectedExpense._id}`,
                    formData
                )
                setExpenses(
                    expenses.map((exp) =>
                        exp._id === selectedExpense._id ? response.data : exp
                    )
                )
            } else {
                const response = await axios.post('/api/expense', formData)
                setExpenses([...expenses, response.data])
            }
            handleCloseModal()
            toast.success(
                selectedExpense
                    ? 'Expense updated successfully'
                    : 'Expense created successfully'
            )
        } catch (err) {
            toast.error(
                selectedExpense
                    ? 'Failed to update expense'
                    : 'Failed to create expense'
            )
        }
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/expense/${selectedExpense._id}`)
            setExpenses(
                expenses.filter((exp) => exp._id !== selectedExpense._id)
            )
            setIsDeleteModalOpen(false)
            setSelectedExpense(null)
            toast.success('Expense deleted successfully')
        } catch (err) {
            toast.error(
                'Failed to delete expense: ' +
                    (err.response?.data?.error || err.message)
            )
        }
    }

    const handleEdit = (expense) => {
        setSelectedExpense(expense)
        setFormData({
            username: expense.username,
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            paymentMethod: expense.paymentMethod,
        })
        setFormErrors({})
        setIsAddModalOpen(true)
    }

    const handleDeleteClick = (expense) => {
        setSelectedExpense(expense)
        setIsDeleteModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsAddModalOpen(false)
        setSelectedExpense(null)
        setFormErrors({})
        setFormData({
            username: 'arpit',
            amount: '',
            category: '',
            description: '',
            paymentMethod: '',
        })
    }

    const columns = [
        {
            field: 'createdAt',
            header: 'Date',
            renderCell: (value) =>
                new Date(value).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
        },
        { field: 'category', header: 'Category' },
        { field: 'description', header: 'Description' },
        {
            field: 'amount',
            header: 'Amount',
            renderCell: (value) => `₹${value.toFixed(2)}`,
        },
        { field: 'paymentMethod', header: 'Payment Method' },
    ]

    const formClasses = {
        input: 'w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
        label: 'mb-2 block text-sm font-medium text-gray-700',
        error: 'mt-1 text-xs text-red-500',
        helpText: 'mt-1 text-xs text-gray-500',
    }

    const renderForm = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="amount" className={formClasses.label}>
                        Amount *
                    </label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            setFormErrors((prev) => ({
                                ...prev,
                                amount: undefined,
                            }))
                            setFormData((prev) => ({
                                ...prev,
                                amount: value || '',
                            }))
                        }}
                        className={formClasses.input}
                        required
                        step="0.01"
                        min="0"
                        placeholder="Enter amount"
                    />
                    {formErrors.amount && (
                        <p className={formClasses.error}>{formErrors.amount}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="category" className={formClasses.label}>
                        Category *
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={(e) => {
                            setFormErrors((prev) => ({
                                ...prev,
                                category: undefined,
                            }))
                            setFormData((prev) => ({
                                ...prev,
                                category: e.target.value,
                            }))
                        }}
                        className={formClasses.input}
                        required
                    >
                        <option value="">Select a category</option>
                        {[
                            'Food',
                            'Transportation',
                            'Housing',
                            'Utilities',
                            'Entertainment',
                            'Healthcare',
                            'Education',
                            'Personal',
                            'Other',
                        ].map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    {formErrors.category && (
                        <p className={formClasses.error}>
                            {formErrors.category}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="paymentMethod"
                        className={formClasses.label}
                    >
                        Payment Method *
                    </label>
                    <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={(e) => {
                            setFormErrors((prev) => ({
                                ...prev,
                                paymentMethod: undefined,
                            }))
                            setFormData((prev) => ({
                                ...prev,
                                paymentMethod: e.target.value,
                            }))
                        }}
                        className={formClasses.input}
                        required
                    >
                        <option value="">Select payment method</option>
                        {[
                            'Cash',
                            'Credit Card',
                            'Debit Card',
                            'Bank Transfer',
                            'UPI',
                            'Other',
                        ].map((method) => (
                            <option key={method} value={method}>
                                {method}
                            </option>
                        ))}
                    </select>
                    {formErrors.paymentMethod && (
                        <p className={formClasses.error}>
                            {formErrors.paymentMethod}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className={formClasses.label}>
                    Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => {
                        setFormErrors((prev) => ({
                            ...prev,
                            description: undefined,
                        }))
                        setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                        }))
                    }}
                    rows={3}
                    className={formClasses.input}
                    required
                    placeholder="Enter expense description"
                />
                {formErrors.description ? (
                    <p className={formClasses.error}>
                        {formErrors.description}
                    </p>
                ) : (
                    <p className={formClasses.helpText}>
                        Add details about the expense to help you track it
                        better.
                    </p>
                )}
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100 pb-8">
            <Header
                heading="Expense Manager"
                description="Track and manage your expenses efficiently"
                buttonName={
                    <>
                        <FiPlus className="mr-2" />
                        Add New Expense
                    </>
                }
                handleClick={() => setIsAddModalOpen(true)}
            />

            <div className="px-8">
                {loading ? (
                    <div className="flex h-64 items-center justify-center rounded-lg bg-white shadow-sm">
                        <div className="flex items-center space-x-4 text-gray-500">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
                            <span>Loading expenses...</span>
                        </div>
                    </div>
                ) : (
                    <DataGridTable
                        data={expenses}
                        columns={columns}
                        onUpdate={handleEdit}
                        onDelete={handleDeleteClick}
                    />
                )}
            </div>

            <DialogBox
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                title={selectedExpense ? 'Edit Expense' : 'Add New Expense'}
                handleSubmit={handleSubmit}
                hideFooter={false}
            >
                <div className="mb-4 space-y-1 border-b border-gray-200 pb-4">
                    <h3 className="text-sm font-medium text-gray-900">
                        {selectedExpense
                            ? 'Update expense details'
                            : 'Enter expense details'}
                    </h3>
                    <p className="text-xs text-gray-500">
                        Fill in the information below to{' '}
                        {selectedExpense ? 'update the' : 'create a new'}{' '}
                        expense record.
                    </p>
                </div>
                {renderForm()}
            </DialogBox>

            <CustomDeleteDialog
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedExpense(null)
                }}
                onConfirm={handleDelete}
                title="Delete Expense"
                message="Are you sure you want to delete this expense? This action cannot be undone."
            />
        </div>
    )
}

export default Expense
