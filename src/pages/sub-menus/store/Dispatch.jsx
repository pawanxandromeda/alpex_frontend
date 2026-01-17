import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Loading from '@loading'
import axios from '@axios'
import DataGridTable from '@components/DataGridTable'
import Header from '@components/Header'
import DialogBox from '@components/DialogBox'
import CustomDeleteDialog from '@components/CustomDeleteDialog'
import { FiPlus } from 'react-icons/fi'

const selectOptions = {
    roundOvalTablet: ['Round', 'Oval', 'Capsule', 'Diamond'],
    tabletColour: ['White', 'Pink', 'Yellow', 'Blue', 'Orange', 'Green'],
    pvcColourBase: ['Clear', 'Amber', 'White', 'Blue Tinted'],
    foil: ['Plain', 'Printed', 'Child Resistant', 'Peel-able'],
    changePart: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
}

function Dispatch() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [formData, setFormData] = useState({
        gateNumber: '',
        reason: '',
        invoiceNo: '',
        invoiceDate: '',
        noOfShippers: '',
        foilQuantity: '',
        person: '',
    })

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
            gateNumber: '',
            reason: '',
            invoiceNo: '',
            invoiceDate: '',
            noOfShippers: '',
            foilQuantity: '',
            person: '',
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

    const getFilteredRecords = () => {
        return records.filter((record) => {
            const matchesSearch = record.gstNo
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            return matchesSearch
        })
    }

    if (loading) return <Loading />

    const filteredRecords = getFilteredRecords()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full">
                <Header
                    heading="QA Approvals - Purchase Orders"
                    description="Review and manage purchase orders pending QA approval"
                    buttonName={
                        <>
                            <FiPlus className="mr-2" />
                            Add New Record
                        </>
                    }
                    handleClick={handleAdd}
                />
                <DataGridTable
                    data={records}
                    columns={[
                        {
                            field: 'poNo',
                            header: 'PO Number',
                            sortable: true,
                        },
                        {
                            field: 'person',
                            header: 'Person',
                            sortable: true,
                        },
                        {
                            field: 'brandName',
                            header: 'Brand Name',
                            sortable: true,
                        },
                        {
                            field: 'batchNo',
                            header: 'Batch No.',
                            sortable: true,
                        },
                        {
                            field: 'poQty',
                            header: 'PO Quantity',
                            sortable: true,
                        },
                        {
                            field: 'createdAt',
                            header: 'Created At',
                            sortable: true,
                            renderCell: (value) =>
                                new Date(value).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }),
                        },
                        {
                            field: 'gateNumber',
                            header: 'Gate Number',
                            sortable: true,
                        },
                        {
                            field: 'reason',
                            header: 'Reason',
                            sortable: true,
                        },
                    ]}
                    onUpdate={handleEdit}
                    onDelete={handleDelete}
                    className="px-4"
                />
                <DialogBox
                    isOpen={showAddDialog || showEditDialog}
                    onClose={() => {
                        showAddDialog
                            ? setShowAddDialog(false)
                            : setShowEditDialog(false)
                    }}
                    title={
                        showAddDialog
                            ? 'Add Purchase Order'
                            : 'Edit Purchase Order Details'
                    }
                    handleSubmit={handleSubmit}
                >
                    <div className="space-y-6">
                        <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="form-control">
                                    <label className="mb-1.5 block">
                                        <span className="text-sm font-medium text-gray-700">
                                            Gate Number
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        value={formData.gateNumber}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                gateNumber: e.target.value,
                                            })
                                        }
                                        placeholder="Enter gate number"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="mb-1.5 block">
                                        <span className="text-sm font-medium text-gray-700">
                                            Invoice Number
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        value={formData.invoiceNo}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                invoiceNo: e.target.value,
                                            })
                                        }
                                        placeholder="Enter invoice number"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="mb-1.5 block">
                                        <span className="text-sm font-medium text-gray-700">
                                            Invoice Date
                                        </span>
                                    </label>
                                    <input
                                        type="date"
                                        className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        value={formData.invoiceDate}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                invoiceDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="mb-1.5 block">
                                        <span className="text-sm font-medium text-gray-700">
                                            Number of Shippers
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        value={formData.noOfShippers}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                noOfShippers: e.target.value,
                                            })
                                        }
                                        placeholder="Enter number of shippers"
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
                                        placeholder="Enter foil quantity"
                                    />
                                </div>
                                <div className="form-control col-span-3">
                                    <label className="mb-1.5 block">
                                        <span className="text-sm font-medium text-gray-700">
                                            Reason
                                        </span>
                                    </label>
                                    <textarea
                                        className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        value={formData.reason}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                reason: e.target.value,
                                            })
                                        }
                                        placeholder="Enter reason"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Person Field */}
                        <div className="form-control col-span-3">
                            <label className="mb-1.5 block">
                                <span className="text-sm font-medium text-gray-700">
                                    Person *
                                </span>
                            </label>
                            <input
                                type="text"
                                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                value={formData.person}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        person: e.target.value,
                                    })
                                }
                                placeholder="Enter person name"
                                required
                            />
                        </div>
                    </div>
                </DialogBox>

                <CustomDeleteDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={confirmDelete}
                    title="Delete Purchase Order"
                    message="Are you sure you want to delete this purchase order? This action cannot be undone."
                />
            </div>
        </div>
    )
}

export default Dispatch
