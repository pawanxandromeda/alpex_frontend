import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Loading from '@loading'
import axios from '@axios'
import Header from '@components/Header'
import DataGridTable from '@components/DataGridTable'
import DialogBox from '@components/DialogBox'
import CustomDeleteDialog from '@components/CustomDeleteDialog'
import { FiPlus } from 'react-icons/fi'

function Dispencing() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [formData, setFormData] = useState({
        foilBillDate: '',
        foilQuantity: '',
        cartonBillDate: '',
        cartonQuantity: '',
    })

    const columns = [
        {
            field: 'gstNo',
            header: 'GST Number',
            sortable: true,
            searchable: true,
        },
        {
            field: 'poNo',
            header: 'PO Number',
            sortable: true,
            searchable: true,
        },
        {
            field: 'foilBillDate',
            header: 'Foil Bill Date',
            sortable: true,
        },
        {
            field: 'foilQuantity',
            header: 'Foil Quantity',
            sortable: true,
        },
        {
            field: 'cartonBillDate',
            header: 'Carton Bill Date',
            sortable: true,
        },
        {
            field: 'cartonQuantity',
            header: 'Carton Quantity',
            sortable: true,
        },
    ]

    useEffect(() => {
        axios
            .get('po/md-approved/designer-pending')
            .then((response) => {
                setRecords(response.data)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error fetching customers:', err)
            })
    }, [])

    const handleAdd = () => {
        setFormData({
            foilBillDate: '',
            foilQuantity: '',
            cartonBillDate: '',
            cartonQuantity: '',
        })
        setShowAddDialog(true)
    }

    const handleEdit = (po) => {
        setSelectedCustomer(po)
        setFormData(po)
        setShowEditDialog(true)
    }

    const handleDelete = (record) => {
        setSelectedCustomer(record)
        setShowDeleteDialog(true)
    }

    const confirmDelete = () => {
        axios
            .delete(`po/${selectedCustomer._id}`)
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

    const handleSubmit = () => {
        const endpoint = showAddDialog ? 'po' : `po/${selectedCustomer._id}`
        const method = showAddDialog ? 'post' : 'put'

        axios[method](endpoint, formData)
            .then(() => {
                toast.success('PO Data updated successfully', {
                    autoClose: 1000,
                    onClose: () => window.location.reload(),
                })
                setShowEditDialog(false)
            })
            .catch((err) => {
                toast.error('Failed to update purchase order.')
                console.error(err)
            })
    }

    if (loading) return <Loading />

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full">
                <Header
                    heading="Dispencing Data Management"
                    description="Manage and update dispencing related information"
                    buttonName={
                        <>
                            <FiPlus className="mr-2" />
                            Add New Record
                        </>
                    }
                    handleClick={handleAdd}
                />
                <div className="px-4">
                    <DataGridTable
                        data={records}
                        columns={columns}
                        onUpdate={handleEdit}
                        onDelete={handleDelete}
                        className="mt-4"
                    />
                </div>
                <DialogBox
                    isOpen={showAddDialog || showEditDialog}
                    onClose={() => {
                        showAddDialog
                            ? setShowAddDialog(false)
                            : setShowEditDialog(false)
                    }}
                    title={
                        showAddDialog
                            ? 'Add Dispencing Record'
                            : 'Edit Purchase Order Details'
                    }
                    handleSubmit={handleSubmit}
                >
                    <div className="space-y-6">
                        <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="mb-1.5 block">
                                        <span className="text-sm font-medium text-gray-700">
                                            Foil Bill Date
                                        </span>
                                    </label>
                                    <input
                                        type="date"
                                        className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        value={formData.foilBillDate}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                foilBillDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="mb-1.5 block">
                                        <span className="text-sm font-medium text-gray-700">
                                            Foil Quantity
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        value={formData.foilQuantity}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                foilQuantity: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="mb-1.5 block">
                                        <span className="text-sm font-medium text-gray-700">
                                            Carton Bill Date
                                        </span>
                                    </label>
                                    <input
                                        type="date"
                                        className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        value={formData.cartonBillDate}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                cartonBillDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="mb-1.5 block">
                                        <span className="text-sm font-medium text-gray-700">
                                            Carton Quantity
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        value={formData.cartonQuantity}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                cartonQuantity: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogBox>

                <CustomDeleteDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={confirmDelete}
                    title="Delete Record"
                    message="Are you sure you want to delete this record? This action cannot be undone."
                />
            </div>
        </div>
    )
}

export default Dispencing
