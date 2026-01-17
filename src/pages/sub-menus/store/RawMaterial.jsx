import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FiPackage, FiEdit3, FiPlus } from 'react-icons/fi'

import Loading from '@loading'
import axios from '@axios'
import decryptData from '../../../utils/Decrypt'
import Header from '@components/Header'
import DialogBox from '@components/DialogBox'
import CustomDeleteDialog from '@components/CustomDeleteDialog'
import DataGridTable from '@components/DataGridTable'

function RawMaterial() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)

    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [formData, setFormData] = useState({
        api: '',
        name: '',
        quantity: '',
        username: '',
        label: '',
        vendorName: '',
    })

    const username = localStorage.getItem('username')

    useEffect(() => {
        axios
            .get('raw')
            .then((response) => {
                setRecords(decryptData(response.data))

                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
            })
    }, [])

    const handleAdd = () => {
        setFormData({
            api: '',
            name: '',
            quantity: '',
            username: username,
            label: '',
            vendorName: '',
        })
        setShowAddDialog(true)
    }

    const handleEdit = (record) => {
        setSelectedCustomer(record)
        setFormData({
            api: record.api,
            name: record.name,
            quantity: record.quantity,
            username: record.username,
            label: record.label,
            vendorName: record.vendorName,
        })
        setShowEditDialog(true)
    }

    const handleDelete = (record) => {
        setSelectedCustomer(record)
        setShowDeleteDialog(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (showAddDialog) {
            axios
                .post('raw', formData)
                .then(() => {
                    toast.success('Raw Material added successfully', {
                        autoClose: 1000,
                        onClose: () => window.location.reload(),
                    })
                    setShowAddDialog(false)
                })
                .catch((err) => {
                    toast.error('Failed to add raw material.')
                    console.error(err)
                })
        } else if (showEditDialog) {
            axios
                .put(`raw/${selectedCustomer._id}`, formData)
                .then(() => {
                    toast.success('Raw Material updated successfully', {
                        autoClose: 1000,
                        onClose: () => window.location.reload(),
                    })
                    setShowEditDialog(false)
                })
                .catch((err) => {
                    toast.error('Failed to update raw material.')
                    console.error(err)
                })
        }
    }

    const confirmDelete = () => {
        axios
            .delete(`raw/${selectedCustomer._id}`)
            .then(() => {
                toast.success('Record deleted successfully', {
                    autoClose: 1000,
                    onClose: () => window.location.reload(),
                })
            })
            .catch((err) => {
                toast.error('Failed to delete raw material.')
                console.error(err)
            })
    }
    const columns = [
        { field: 'name', header: 'Name' },
        { field: 'api', header: 'API/EXEP' },
        { field: 'vendorName', header: 'Vendor Name' },
        {
            field: 'quantity',
            header: 'Quantity',
            renderCell: (value) => (
                <div className="flex items-baseline gap-1">
                    <span className="font-medium">{value}</span>
                    <span className="text-xs text-gray-500">units</span>
                </div>
            ),
        },
        {
            field: 'label',
            header: 'Status',
            renderCell: (value) => (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        value === 'Good for Use'
                            ? 'bg-green-100 text-green-700'
                            : value === 'Should be Returned'
                              ? 'bg-red-100 text-red-700'
                              : value === 'Under Test'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                    {value}
                </span>
            ),
        },
        { field: 'username', header: 'Added By' },
    ]

    if (loading) return <Loading />

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                heading="Raw Materials"
                description="Manage and track your raw materials inventory"
                buttonName={
                    <>
                        <FiPlus className="mr-2" />
                        Add New Material
                    </>
                }
                handleClick={handleAdd}
            />

            <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
                <DataGridTable
                    data={records}
                    columns={columns}
                    onUpdate={handleEdit}
                    onDelete={handleDelete}
                />

                <DialogBox
                    isOpen={showAddDialog}
                    onClose={() => setShowAddDialog(false)}
                    title={
                        <div className="flex items-center gap-2">
                            <FiPackage className="h-6 w-6" />
                            Add New Raw Material
                        </div>
                    }
                    handleSubmit={handleSubmit}
                >
                    <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                API *
                            </label>
                            <select
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={formData.api}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        api: e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">Select API</option>
                                <option value="API">API</option>
                                <option value="EXEP">EXEP</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter material name"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Quantity *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Enter quantity"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.quantity}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            quantity: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Label *
                            </label>
                            <select
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={formData.label}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        label: e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">Select Label</option>
                                <option value="RM Quarantine">
                                    RM Quarantine
                                </option>
                                <option value="Under Test">Under Test</option>
                                <option value="Good for Use">
                                    Good for Use
                                </option>
                                <option value="Should be Returned">
                                    Should be Returned
                                </option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Vendor Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter vendor name"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={formData.vendorName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        vendorName: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                    </form>
                </DialogBox>

                <DialogBox
                    isOpen={showEditDialog}
                    onClose={() => setShowEditDialog(false)}
                    title={
                        <div className="flex items-center gap-2">
                            <FiEdit3 className="h-6 w-6" />
                            Edit Raw Material
                        </div>
                    }
                    handleSubmit={handleSubmit}
                >
                    <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                API *
                            </label>
                            <select
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={formData.api}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        api: e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">Select API</option>
                                <option value="API">API</option>
                                <option value="EXEP">EXEP</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter material name"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Quantity *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Enter quantity"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.quantity}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            quantity: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Label *
                            </label>
                            <select
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={formData.label}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        label: e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">Select Label</option>
                                <option value="RM Quarantine">
                                    RM Quarantine
                                </option>
                                <option value="Under Test">Under Test</option>
                                <option value="Good for Use">
                                    Good for Use
                                </option>
                                <option value="Should be Returned">
                                    Should be Returned
                                </option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Vendor Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter vendor name"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={formData.vendorName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        vendorName: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                    </form>
                </DialogBox>

                <CustomDeleteDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={confirmDelete}
                    title="Delete Raw Material"
                    message="Are you sure you want to delete this raw material? This action cannot be undone."
                />
            </div>
        </div>
    )
}

export default RawMaterial
