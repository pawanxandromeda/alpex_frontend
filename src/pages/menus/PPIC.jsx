import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { AiOutlineCheckCircle, AiOutlineClockCircle } from 'react-icons/ai'
import { HiClipboardList } from 'react-icons/hi'
import { RxCross2 } from 'react-icons/rx'
import DialogBox from '@components/DialogBox'
import CustomDeleteDialog from '@components/CustomDeleteDialog'
import CustomViewDialog from '@components/CustomViewDialog'
import CustomApproveDialog from '@components/CustomApproveDialog'
import DataGridTable from '@components/DataGridTable'
import Loading from '@loading'
import axios from '@axios'
import Header from '@components/Header'
import decryptData from '../../utils/Decrypt'

function PPIC() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('Pending')

    const [showViewDialog, setShowViewDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showApproveDialog, setShowApproveDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [editingPO, setEditingPO] = useState(null)
    const [poToDelete, setPoToDelete] = useState(null)

    const [selectedPO, setSelectedPO] = useState(null)

    const role = localStorage.getItem('role')

    useEffect(() => {
        axios.get('po/md-approved')
            .then((response) => {
                console.log('RAW RESPONSE:', response.data)

                let finalData = response.data

                // Decrypt ONLY payload
                if (
                    response.data &&
                    typeof response.data === 'object' &&
                    typeof response.data.payload === 'string'
                ) {
                    finalData = decryptData(response.data.payload)
                }

                console.log('FINAL DATA:', finalData)

                // If decryptData still returns { payload: "..." }, decrypt again
                if (
                    finalData &&
                    typeof finalData === 'object' &&
                    typeof finalData.payload === 'string'
                ) {
                    finalData = decryptData(finalData.payload)
                }

                // Now validate
                if (Array.isArray(finalData)) {
                    setRecords(finalData)
                } else if (Array.isArray(finalData?.data)) {
                    setRecords(finalData.data)
                } else {
                    console.error('Invalid PO response:', finalData)
                    toast.error('Invalid PO data format')
                }

                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                toast.error('Failed to load purchase orders')
                setLoading(false)
            })
    }, [])

    const handleView = (po) => {
        setSelectedPO(po)
        setShowViewDialog(true)
    }

    const handlePPICApproval = (po) => {
        setSelectedPO(po)
        setShowApproveDialog(true)
    }

    const confirmPPICApproval = () => {
        if (!selectedPO) return

        const updatedPO = { ...selectedPO, ppicApproval: 'Approved' }

        axios
            .put(`po/${selectedPO._id}`, updatedPO)
            .then(() => {
                toast.success('PPIC Approval updated successfully', {
                    autoClose: 1000,
                    onClose: () => {
                        setLoading(true)
                        window.location.reload()
                    },
                })
                setShowApproveDialog(false)
                setShowViewDialog(false)
            })
            .catch((err) => {
                toast.error('Failed to update PPIC Approval')
                console.error(err)
            })
    }

    const handleEdit = (po) => {
        setEditingPO(po)
        setShowEditDialog(true)
    }

    const handleDelete = (po) => {
        setPoToDelete(po)
        setShowDeleteDialog(true)
    }

    const confirmDelete = () => {
        if (!poToDelete) return

        axios
            .delete(`po/${poToDelete._id}`)
            .then(() => {
                toast.success('Purchase order deleted successfully', {
                    autoClose: 1000,
                    onClose: () => {
                        setLoading(true)
                        window.location.reload()
                    },
                })
            })
            .catch((err) => {
                toast.error('Failed to delete purchase order')
                console.error(err)
            })
    }
    
    const handleUpdate = (po) => {
        setEditingPO(po)
        setShowEditDialog(true)
    }

    const confirmUpdate = () => {
        if (!editingPO) return

        axios
            .put(`po/${editingPO._id}`, editingPO)
            .then(() => {
                toast.success('Purchase order updated successfully', {
                    autoClose: 1000,
                    onClose: () => {
                        setLoading(true)
                        window.location.reload()
                    },
                })
                setShowEditDialog(false)
            })
            .catch((err) => {
                toast.error('Failed to update purchase order')
                console.error(err)
            })
    }

    if (loading) return <Loading />

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full">
                <Header
                    heading="PPIC - Production Planning & Inventory Control"
                    description="Manage production planning, inventory control, and track production status"
                />
                <div className="px-8">
                    <DataGridTable
                        data={records}
                        columns={[
                            {
                                field: 'poNo',
                                header: 'PO No.',
                                renderCell: (value) => `${value}`,
                            },
                            {
                                field: 'poDate',
                                header: 'PO Date',
                                renderCell: (value) =>
                                    new Date(value).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    }),
                            },
                            {
                                field: 'brandName',
                                header: 'Brand Name',
                            },
                            {
                                field: 'partyName',
                                header: 'Party Name',
                            },
                            {
                                field: 'batchNo',
                                header: 'Batch No.',
                                renderCell: (value) => value || '-',
                            },
                            {
                                field: 'foilSize',
                                header: 'Foil Size',
                                renderCell: (value) => value || '-',
                            },
                            {
                                field: 'composition',
                                header: 'Composition',
                            },
                            {
                                field: 'rmStatus',
                                header: 'RM Status',
                                renderCell: (value) => (
                                    <div className="flex items-center">
                                        <span className={`rounded px-2 py-1 text-xs font-medium ${value === 'Available' ? 'bg-green-100 text-green-700' : value === 'Partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            {value || 'Pending'}
                                        </span>
                                    </div>
                                ),
                            },
                            {
                                field: 'poQty',
                                header: 'PO Qty',
                            },
                            {
                                field: 'poRate',
                                header: 'PO Rate',
                                renderCell: (value) => `₹${value}`,
                            },
                            {
                                field: 'amount',
                                header: 'Amount',
                                renderCell: (value) => `₹${value}`,
                            },
                            {
                                field: 'batchQty',
                                header: 'Batch Qty',
                                renderCell: (value) => value || '-',
                            },
                            {
                                field: 'aluAluBlisterStripBottle',
                                header: 'Packaging Type',
                                renderCell: (value) => value || '-',
                            },
                            {
                                field: 'packStyle',
                                header: 'Pack Style',
                                renderCell: (value) => value || '-',
                            },
                            {
                                field: 'qtyPacked',
                                header: 'Qty Packed',
                                renderCell: (value) => value || '-',
                            },
                            {
                                field: 'noOfShippers',
                                header: 'Shippers',
                                renderCell: (value) => value || '-',
                            },
                            {
                                field: 'overallStatus',
                                header: 'Status',
                                renderCell: (value) => (
                                    <div className="flex items-center">
                                        <span className={`rounded px-2 py-1 text-xs font-medium ${value === 'Completed' ? 'bg-green-100 text-green-700' : value === 'In Production' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {value || 'Pending'}
                                        </span>
                                    </div>
                                ),
                            },
                            {
                                field: 'designerApproval',
                                header: 'Design',
                                renderCell: (value) => (
                                    <div className="flex items-center gap-1">
                                        <span className={`text-xs font-medium ${value === 'Approved' ? 'text-green-600' : value === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                            {value || 'Pending'}
                                        </span>
                                    </div>
                                ),
                            },
                            {
                                field: 'ppicApproval',
                                header: 'PPIC',
                                renderCell: (value) => (
                                    <div className="flex items-center gap-1">
                                        <span className={`text-xs font-medium ${value === 'Approved' ? 'text-green-600' : value === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                            {value || 'Pending'}
                                        </span>
                                    </div>
                                ),
                            },
                        ]}
                        onView={handleView}
                        onUpdate={(row) => handleEdit(row)}
                        onDelete={role === 'admin' ? handleDelete : undefined}
                        onApprove={(row) =>
                            row.ppicApproval !== 'Approved'
                                ? handlePPICApproval(row)
                                : undefined
                        }
                        className="rounded-lg shadow-sm"
                    />
                </div>
                
                {/* View Dialog - Updated for PPIC focus */}
                <CustomViewDialog
                    isOpen={showViewDialog}
                    onClose={() => setShowViewDialog(false)}
                    title={
                        <div className="flex items-center gap-2">
                            <HiClipboardList className="h-6 w-6" />
                            <span>PPIC Production Details</span>
                        </div>
                    }
                >
                    {selectedPO && (
                        <div className="space-y-6 p-6">
                            {/* Production Header */}
                            <div className="rounded-lg bg-blue-50 p-6 shadow-sm">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-500">PO Number</p>
                                        <p className="text-2xl font-bold text-gray-900">{selectedPO.poNo}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-500">Batch Number</p>
                                        <p className="text-2xl font-bold text-gray-900">{selectedPO.batchNo || 'Not Assigned'}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-500">Overall Status</p>
                                        <p className={`text-2xl font-bold ${selectedPO.overallStatus === 'Completed' ? 'text-green-600' : selectedPO.overallStatus === 'In Production' ? 'text-blue-600' : 'text-yellow-600'}`}>
                                            {selectedPO.overallStatus || 'Pending'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Production Details */}
                            <div className="space-y-4 rounded-lg bg-gray-50 p-6 shadow-sm">
                                <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
                                    Production Information
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">PO Date</label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.poDate && new Date(selectedPO.poDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Brand Name</label>
                                        <p className="mt-1 text-gray-800">{selectedPO.brandName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Party Name</label>
                                        <p className="mt-1 text-gray-800">{selectedPO.partyName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Composition</label>
                                        <p className="mt-1 text-gray-800">{selectedPO.composition}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Packaging Type</label>
                                        <p className="mt-1 text-gray-800">{selectedPO.aluAluBlisterStripBottle}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Pack Style</label>
                                        <p className="mt-1 text-gray-800">{selectedPO.packStyle}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity & Batch Information */}
                            <div className="space-y-4 rounded-lg bg-gray-50 p-6 shadow-sm">
                                <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
                                    Quantity Information
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="bg-white p-4 rounded-lg border">
                                        <label className="block text-sm font-medium text-gray-500">PO Quantity</label>
                                        <p className="mt-1 text-2xl font-bold text-blue-600">{selectedPO.poQty}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border">
                                        <label className="block text-sm font-medium text-gray-500">Batch Quantity</label>
                                        <p className="mt-1 text-2xl font-bold text-green-600">{selectedPO.batchQty || 0}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border">
                                        <label className="block text-sm font-medium text-gray-500">Quantity Packed</label>
                                        <p className="mt-1 text-2xl font-bold text-purple-600">{selectedPO.qtyPacked || 0}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border">
                                        <label className="block text-sm font-medium text-gray-500">Number of Shippers</label>
                                        <p className="mt-1 text-2xl font-bold text-orange-600">{selectedPO.noOfShippers || 0}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Materials Status */}
                            <div className="space-y-4 rounded-lg bg-gray-50 p-6 shadow-sm">
                                <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
                                    Materials & Packaging
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">RM Status</label>
                                        <p className={`mt-1 inline-block rounded px-3 py-1 text-sm font-medium ${selectedPO.rmStatus === 'Available' ? 'bg-green-100 text-green-700' : selectedPO.rmStatus === 'Partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            {selectedPO.rmStatus || 'Pending'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Foil Size</label>
                                        <p className="mt-1 text-gray-800">{selectedPO.foilSize || 'Not Specified'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Product Type</label>
                                        <p className="mt-1 text-gray-800">{selectedPO.tabletCapsuleDrySyrupBottle || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Product Status</label>
                                        <p className="mt-1 text-gray-800">{selectedPO.productNewOld || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Foil & Carton Information */}
                            <div className="space-y-4 rounded-lg bg-gray-50 p-6 shadow-sm">
                                <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
                                    Packaging Materials Order Details
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-700">Foil Details</h4>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Foil PO Date</label>
                                                <p className="mt-1 text-gray-800">
                                                    {selectedPO.foilPoDate ? new Date(selectedPO.foilPoDate).toLocaleDateString() : 'Not Ordered'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Foil Quantity Ordered</label>
                                                <p className="mt-1 text-gray-800">{selectedPO.foilQuantity || '-'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Foil PO Vendor</label>
                                                <p className="mt-1 text-gray-800">{selectedPO.foilPoVendor || '-'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Foil Bill Date</label>
                                                <p className="mt-1 text-gray-800">
                                                    {selectedPO.foilBillDate ? new Date(selectedPO.foilBillDate).toLocaleDateString() : '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-700">Carton Details</h4>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Carton PO Vendor</label>
                                                <p className="mt-1 text-gray-800">{selectedPO.cartonPoVendor || '-'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Carton Bill Date</label>
                                                <p className="mt-1 text-gray-800">
                                                    {selectedPO.cartonBillDate ? new Date(selectedPO.cartonBillDate).toLocaleDateString() : '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Carton Quantity</label>
                                                <p className="mt-1 text-gray-800">{selectedPO.cartonQuantity || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Design & Production Status */}
                            <div className="space-y-4 rounded-lg bg-gray-50 p-6 shadow-sm">
                                <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
                                    Design & Production Status
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Design Status</label>
                                        <p className="mt-1 text-gray-800">{selectedPO.design || 'Not Available'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Dispatch Status</label>
                                        <p className={`mt-1 inline-block rounded px-3 py-1 text-sm font-medium ${selectedPO.dispatchDate ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {selectedPO.dispatchDate ? `Dispatched on ${new Date(selectedPO.dispatchDate).toLocaleDateString()}` : 'Pending Dispatch'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Approvals Status */}
                            <div className="space-y-4 rounded-lg bg-gray-50 p-6 shadow-sm">
                                <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
                                    Approval Status
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="bg-white p-4 rounded-lg border text-center">
                                        <label className="block text-sm font-medium text-gray-500 mb-2">Designer</label>
                                        <p className={`text-lg font-medium ${selectedPO.designerApproval === 'Approved' ? 'text-green-600' : selectedPO.designerApproval === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                            {selectedPO.designerApproval || 'Pending'}
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border text-center">
                                        <label className="block text-sm font-medium text-gray-500 mb-2">Accounts</label>
                                        <p className={`text-lg font-medium ${selectedPO.accountsApproval === 'Approved' ? 'text-green-600' : selectedPO.accountsApproval === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                            {selectedPO.accountsApproval || 'Pending'}
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border text-center">
                                        <label className="block text-sm font-medium text-gray-500 mb-2">MD</label>
                                        <p className={`text-lg font-medium ${selectedPO.mdApproval === 'Approved' ? 'text-green-600' : selectedPO.mdApproval === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                            {selectedPO.mdApproval || 'Pending'}
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border text-center">
                                        <label className="block text-sm font-medium text-gray-500 mb-2">PPIC</label>
                                        <p className={`text-lg font-medium ${selectedPO.ppicApproval === 'Approved' ? 'text-green-600' : selectedPO.ppicApproval === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                            {selectedPO.ppicApproval || 'Pending'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedPO.notes && selectedPO.notes !== 'None' && (
                                <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
                                    <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">Notes</h3>
                                    <p className="mt-2 text-gray-800">{selectedPO.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </CustomViewDialog>
            </div>

            <CustomApproveDialog
                isOpen={showApproveDialog}
                onClose={() => setShowApproveDialog(false)}
                onConfirm={confirmPPICApproval}
                title="Confirm PPIC Approval"
                message={
                    <>
                        Are you sure you want to approve this production order?
                        This action will:
                        <ul className="mt-2 list-inside list-disc">
                            <li>Mark the order as approved by PPIC</li>
                            <li>Move the order to production queue</li>
                            <li>Update production planning</li>
                        </ul>
                    </>
                }
            />

            <CustomDeleteDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDelete}
                title="Delete Production Order"
                message="Are you sure you want to delete this production order? This action cannot be undone."
            />

            {/* Edit Dialog - Updated for PPIC fields */}
            <DialogBox
                isOpen={showEditDialog}
                onClose={() => setShowEditDialog(false)}
                title="Edit PPIC Details"
                handleSubmit={confirmUpdate}
            >
                {editingPO && (
                    <div className="mx-auto max-w-7xl space-y-8 p-6">
                        {/* Production Information */}
                        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    Production Information
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Batch Number</label>
                                        <input
                                            type="text"
                                            value={editingPO.batchNo || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, batchNo: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            placeholder="Enter batch number"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Foil Size</label>
                                        <input
                                            type="text"
                                            value={editingPO.foilSize || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, foilSize: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            placeholder="Enter foil size"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Composition</label>
                                        <input
                                            type="text"
                                            value={editingPO.composition || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, composition: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            placeholder="Enter composition"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">RM Status</label>
                                        <select
                                            value={editingPO.rmStatus || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, rmStatus: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        >
                                            <option value="">Select RM status</option>
                                            <option value="Available">Available</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Partial">Partial</option>
                                            <option value="Ordered">Ordered</option>
                                            <option value="Not Required">Not Required</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Packaging Type</label>
                                        <select
                                            value={editingPO.aluAluBlisterStripBottle || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, aluAluBlisterStripBottle: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        >
                                            <option value="">Select packaging type</option>
                                            <option value="ALU-ALU">Alu-Alu</option>
                                            <option value="BLISTER">Blister</option>
                                            <option value="STRIP">Strip</option>
                                            <option value="BOTTLE">Bottle</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Pack Style</label>
                                        <input
                                            type="text"
                                            value={editingPO.packStyle || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, packStyle: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            placeholder="Enter pack style"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Product Type</label>
                                        <select
                                            value={editingPO.tabletCapsuleDrySyrupBottle || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, tabletCapsuleDrySyrupBottle: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        >
                                            <option value="">Select product type</option>
                                            <option value="Tablet">Tablet</option>
                                            <option value="Capsule">Capsule</option>
                                            <option value="Dry Syrup">Dry Syrup</option>
                                            <option value="Bottle">Bottle</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Product Status</label>
                                        <select
                                            value={editingPO.productNewOld || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, productNewOld: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        >
                                            <option value="">Select status</option>
                                            <option value="New">New</option>
                                            <option value="Old">Old</option>
                                            <option value="Repeat">Repeat</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Section</label>
                                        <input
                                            type="text"
                                            value={editingPO.section || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, section: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            placeholder="Enter section"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Batch & Packing Information */}
                        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Batch & Packing Information
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Batch Quantity</label>
                                        <input
                                            type="number"
                                            value={editingPO.batchQty || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, batchQty: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Quantity Packed</label>
                                        <input
                                            type="number"
                                            value={editingPO.qtyPacked || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, qtyPacked: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Number of Shippers</label>
                                        <input
                                            type="number"
                                            value={editingPO.noOfShippers || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, noOfShippers: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Overall Status</label>
                                        <select
                                            value={editingPO.overallStatus || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, overallStatus: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Production">In Production</option>
                                            <option value="Completed">Completed</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Packaging Materials Orders */}
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {/* Foil Order Details */}
                            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                                <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                                    <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        Foil Order Details
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Foil PO Date</label>
                                            <input
                                                type="date"
                                                value={editingPO.foilPoDate ? new Date(editingPO.foilPoDate).toISOString().split('T')[0] : ''}
                                                onChange={(e) => setEditingPO({ ...editingPO, foilPoDate: e.target.value })}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Foil Quantity Ordered</label>
                                            <input
                                                type="number"
                                                value={editingPO.foilQuantity || ''}
                                                onChange={(e) => setEditingPO({ ...editingPO, foilQuantity: e.target.value })}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Foil PO Vendor</label>
                                            <input
                                                type="text"
                                                value={editingPO.foilPoVendor || ''}
                                                onChange={(e) => setEditingPO({ ...editingPO, foilPoVendor: e.target.value })}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                                placeholder="Enter vendor name"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Foil Bill Date</label>
                                            <input
                                                type="date"
                                                value={editingPO.foilBillDate ? new Date(editingPO.foilBillDate).toISOString().split('T')[0] : ''}
                                                onChange={(e) => setEditingPO({ ...editingPO, foilBillDate: e.target.value })}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Carton Order Details */}
                            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                                <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                                    <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        Carton Order Details
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Carton PO Vendor</label>
                                            <input
                                                type="text"
                                                value={editingPO.cartonPoVendor || ''}
                                                onChange={(e) => setEditingPO({ ...editingPO, cartonPoVendor: e.target.value })}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                                placeholder="Enter vendor name"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Carton Bill Date</label>
                                            <input
                                                type="date"
                                                value={editingPO.cartonBillDate ? new Date(editingPO.cartonBillDate).toISOString().split('T')[0] : ''}
                                                onChange={(e) => setEditingPO({ ...editingPO, cartonBillDate: e.target.value })}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Carton Quantity</label>
                                            <input
                                                type="number"
                                                value={editingPO.cartonQuantity || ''}
                                                onChange={(e) => setEditingPO({ ...editingPO, cartonQuantity: e.target.value })}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Dispatch Date</label>
                                            <input
                                                type="date"
                                                value={editingPO.dispatchDate ? new Date(editingPO.dispatchDate).toISOString().split('T')[0] : ''}
                                                onChange={(e) => setEditingPO({ ...editingPO, dispatchDate: e.target.value })}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Design & Additional Info */}
                        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Design & Additional Information
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Design Status/File</label>
                                        <input
                                            type="text"
                                            value={editingPO.design || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, design: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                            placeholder="Design file name or status"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Designer Actions</label>
                                        <input
                                            type="text"
                                            value={editingPO.designerActions || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, designerActions: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                            placeholder="Designer notes or actions"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">QA Observations</label>
                                        <textarea
                                            value={editingPO.qaObservations || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, qaObservations: e.target.value })}
                                            rows={3}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                            placeholder="QA observations and notes"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                                        <textarea
                                            value={editingPO.notes || ''}
                                            onChange={(e) => setEditingPO({ ...editingPO, notes: e.target.value })}
                                            rows={3}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                            placeholder="Additional notes"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DialogBox>
        </div>
    )
}
export default PPIC