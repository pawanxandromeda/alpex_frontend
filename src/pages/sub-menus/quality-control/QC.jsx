import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Loading from '@loading'
import axios from '@axios'
import CustomDeleteDialog from '@components/CustomDeleteDialog'
import DialogBox from '@components/DialogBox'
import decryptData from '../../../utils/Decrypt'
import Header from '@components/Header'
import DataGridTable from '@components/DataGridTable'

function QC() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        label: '',
        username: '',
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
                toast.error('Failed to fetch records')
            })
    }, [])

    const handleEdit = (record) => {
        setSelectedCustomer(record)
        setFormData({
            name: record.name || '',
            quantity: record.quantity || '',
            label: record.label || '',
            username: username,
        })
        setShowEditDialog(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.name || !formData.quantity || !formData.label) {
            toast.error('Please fill in all required fields')
            return
        }

        const updatedData = {
            ...formData,
            quantity: Number(formData.quantity),
        }

        axios
            .put(`raw/${selectedCustomer._id}`, updatedData)
            .then(() => {
                toast.success('Raw Material updated successfully', {
                    autoClose: 1500,
                })
                setRecords(
                    records.map((record) =>
                        record._id === selectedCustomer._id
                            ? { ...record, ...updatedData }
                            : record
                    )
                )
                setShowEditDialog(false)
            })
            .catch((err) => {
                toast.error(
                    err.response?.data?.message ||
                        'Failed to update raw material.'
                )
                console.error(err)
            })
    }

    const handleDelete = (data) => {
        setSelectedCustomer(data)
        setShowDeleteDialog(true)
    }

    const confirmDelete = async () => {
        try {
            await axios.delete(`raw/${selectedCustomer._id}`)
            toast.success('Raw material deleted successfully', {
                autoClose: 1500,
            })
            setRecords(
                records.filter((record) => record._id !== selectedCustomer._id)
            )
        } catch (err) {
            toast.error(
                err.response?.data?.message || 'Failed to delete raw material'
            )
            console.error('Delete Error:', err)
        }
    }

    const columns = [
        { field: 'name', header: 'Name', sortable: true },
        { field: 'api', header: 'API/EXEP', sortable: true },
        { field: 'quantity', header: 'Quantity', sortable: true },
        { field: 'username', header: 'Username', sortable: true },
        {
            field: 'label',
            header: 'Status',
            sortable: true,
            renderCell: (value) => (
                <div
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                        value === 'Good for Use'
                            ? 'bg-green-50 text-green-600'
                            : value === 'Should be Returned'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-yellow-50 text-yellow-600'
                    }`}
                >
                    {value}
                </div>
            ),
        },
    ]

    if (loading) return <Loading />

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header
                heading="QC - Raw Materials"
                description="Manage and monitor quality control for raw materials"
            />
            <div className="px-8">
                <DataGridTable
                    data={records}
                    columns={columns}
                    onUpdate={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
            <DialogBox
                isOpen={showEditDialog}
                onClose={() => setShowEditDialog(false)}
                title="Edit Raw Material Status"
                handleSubmit={handleSubmit}
            >
                <form className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            className="w-full rounded border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Quantity
                        </label>
                        <input
                            type="number"
                            min="1"
                            className="w-full rounded border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            className="w-full rounded border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            <option value="RM Quarantine">RM Quarantine</option>
                            <option value="Under Test">Under Test</option>
                            <option value="Good for Use">Good for Use</option>
                            <option value="Should be Returned">
                                Should be Returned
                            </option>
                        </select>
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
    )
}

export default QC
