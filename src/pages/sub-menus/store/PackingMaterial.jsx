import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import Loading from '@loading'
import axios from '@axios'
import decryptData from '../../../utils/Decrypt'
import Header from '@components/Header'
import DataGridTable from '@components/DataGridTable'
import DialogBox from '@components/DialogBox'
import CustomDeleteDialog from '@components/CustomDeleteDialog'

function PackingMaterial() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)

    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [formData, setFormData] = useState({
        type: '',
        quantity: '',
        username: '',
        vendorName: '',
    })

    const username = localStorage.getItem('username')

    const materialTypes = [
        'Cardboard Box',
        'Bubble Wrap',
        'Plastic Wrap',
        'Foam Peanuts',
        'Packing Tape',
        'Air Pillows',
        'Wooden Crate',
        'Padded Envelopes',
    ]

    const quantityOptions = [
        '10 units',
        '25 units',
        '50 units',
        '100 units',
        '250 units',
        '500 units',
        '1000 units',
    ]

    useEffect(() => {
        axios
            .get('packing')
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
            type: '',
            quantity: '',
            username: username,
            vendorName: '',
        })
        setShowAddDialog(true)
    }

    const handleEdit = (record) => {
        setSelectedCustomer(record)
        setFormData(record)
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
                .post('packing', formData)
                .then(() => {
                    toast.success('Packing Material added successfully', {
                        autoClose: 1000,
                        onClose: () => window.location.reload(),
                    })
                    setShowAddDialog(false)
                })
                .catch((err) => {
                    toast.error('Failed to add packing material')
                    console.error(err)
                })
        } else if (showEditDialog) {
            axios
                .put(`packing/${selectedCustomer._id}`, formData)
                .then(() => {
                    toast.success('Packing Material updated successfully', {
                        autoClose: 1000,
                        onClose: () => window.location.reload(),
                    })
                    setShowEditDialog(false)
                })
                .catch((err) => {
                    toast.error('Failed to update packing material')
                    console.error(err)
                })
        }
    }

    const confirmDelete = () => {
        axios
            .delete(`packing/${selectedCustomer._id}`)
            .then(() => {
                toast.success('Record deleted successfully', {
                    autoClose: 1000,
                    onClose: () => window.location.reload(),
                })
                setShowDeleteDialog(false)
            })
            .catch((err) => {
                toast.error('Failed to delete record')
                console.error(err)
            })
    }

    const columns = [
        {
            field: 'type',
            header: 'Material Type',
            sortable: true,
            searchable: true,
        },
        {
            field: 'vendorName',
            header: 'Vendor Name',
            sortable: true,
            searchable: true,
        },
        {
            field: 'quantity',
            header: 'Quantity',
            sortable: true,
            searchable: true,
        },
        {
            field: 'username',
            header: 'Created By',
            sortable: true,
            searchable: true,
        },
    ]

    if (loading) return <Loading />

    return (
        <div className="min-h-screen">
            <Header
                heading="Packing Material Management"
                description="Manage your packing material inventory efficiently"
                buttonName="Add New Packing Material"
                handleClick={handleAdd}
            />
            <div className="px-8">
                <DataGridTable
                    data={records}
                    columns={columns}
                    onUpdate={handleEdit}
                    onDelete={handleDelete}
                />

                <DialogBox
                    isOpen={showAddDialog}
                    onClose={() => setShowAddDialog(false)}
                    title="Add New Packing Material"
                    handleSubmit={handleSubmit}
                >
                    <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Material Type *
                            </label>
                            <select
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={formData.type}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        type: e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">Select material type</option>
                                {materialTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Quantity *
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.quantity}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            quantity: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">Select quantity</option>
                                    {quantityOptions.map((qty) => (
                                        <option key={qty} value={qty}>
                                            {qty}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Vendor Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter vendor name"
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    title="Edit Packing Material"
                    handleSubmit={handleSubmit}
                >
                    <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Material Type *
                            </label>
                            <select
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={formData.type}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        type: e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">Select material type</option>
                                {materialTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Quantity *
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.quantity}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            quantity: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">Select quantity</option>
                                    {quantityOptions.map((qty) => (
                                        <option key={qty} value={qty}>
                                            {qty}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Vendor Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter vendor name"
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    title="Delete Packing Material"
                    message="Are you sure you want to delete this packing material? This action cannot be undone."
                />
            </div>
        </div>
    )
}

export default PackingMaterial
