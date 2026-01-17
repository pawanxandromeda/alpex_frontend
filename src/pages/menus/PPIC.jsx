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
                    heading="PPIC - Purchase Orders"
                    description="Manage and track purchase orders in the PPIC department"
                />
                <div className="px-8">
                    <DataGridTable
                        data={records}
                        columns={[
                            {
                                field: 'gstNo',
                                header: 'GST No.',
                            },
                            {
                                field: 'poNo',
                                header: 'PO No.',
                                renderCell: (value) => `${value}`,
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
                                field: 'poQty',
                                header: 'Quantity',
                            },
                            {
                                field: 'poDate',
                                header: 'PO Date',
                                renderCell: (value) =>
                                    new Date(value).toLocaleDateString(
                                        'en-US',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        }
                                    ),
                            },
                            {
                                field: 'poRate',
                                header: 'Rate',
                                renderCell: (value) => `₹${value}`,
                            },
                            {
                                field: 'amount',
                                header: 'Amount',
                                renderCell: (value) => `₹${value}`,
                            },
                            {
                                field: 'mrp',
                                header: 'MRP',
                                renderCell: (value) => `₹${value}`,
                            },
                            {
                                field: 'designerApproval',
                                header: 'Designer',
                                renderCell: (value) => (
                                    <div className="flex items-center gap-1">
                                        <span
                                            className={`text-xs font-medium ${value === 'Approved' ? 'text-green-600' : 'text-yellow-600'}`}
                                        >
                                            {value || 'Pending'}
                                        </span>
                                    </div>
                                ),
                            },
                            {
                                field: 'accountsApproval',
                                header: 'Accounts',
                                renderCell: (value) => (
                                    <div className="flex items-center">
                                        <span
                                            className={`text-xs font-medium ${value === 'Approved' ? 'text-green-600' : 'text-yellow-600'}`}
                                        >
                                            {value || 'Pending'}
                                        </span>
                                    </div>
                                ),
                            },
                            {
                                field: 'overallStatus',
                                header: 'Status',
                                renderCell: (value) => (
                                    <div className="flex items-center">
                                        <span
                                            className={`rounded px-2 py-1 text-xs font-medium ${
                                                value === 'Completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                        >
                                            {value}
                                        </span>
                                    </div>
                                ),
                            },
                            {
                                field: 'changePart',
                                header: 'Part Status',
                                renderCell: (value) => (
                                    <div className="flex items-center">
                                        <span
                                            className={`rounded px-2 py-1 text-xs font-medium ${
                                                value
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {value
                                                ? 'Available'
                                                : 'Unavailable'}
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
                <CustomViewDialog
                    isOpen={showViewDialog}
                    onClose={() => setShowViewDialog(false)}
                    title={
                        <div className="flex items-center gap-2">
                            <HiClipboardList className="h-6 w-6" />
                            <span>PPIC Register Details</span>
                        </div>
                    }
                >
                    {selectedPO && (
                        <div className="space-y-6 p-6">
                            {/* Basic Information */}
                            <div className="space-y-4 rounded-lg bg-gray-50 p-6 shadow-sm">
                                <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">
                                            GST Number
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.gstNo}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">
                                            PO Number
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.poNo}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">
                                            PO Date
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.poDate &&
                                                new Date(
                                                    selectedPO.poDate
                                                ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">
                                            Dispatch Date
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.dispatchDate &&
                                                new Date(
                                                    selectedPO.dispatchDate
                                                ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">
                                            Brand Name
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.brandName}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">
                                            Party Name
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.partyName}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">
                                            Batch Number
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.batchNo}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Notes and Composition section */}
                            <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
                                <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-900">
                                    Additional Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Notes
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.notes}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Composition
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.composition}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Financial Information */}
                            <div className="space-y-4 rounded-lg bg-gray-50 p-6">
                                <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
                                    Financial Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            PO Quantity
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.poQty}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            PO Rate
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            ₹{selectedPO.poRate}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Amount
                                        </label>
                                        <p className="mt-1 text-blue-600">
                                            ₹{selectedPO.amount}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            MRP
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            ₹{selectedPO.mrp}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Payment Terms
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.paymentTerms}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Order Through
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.orderThrough}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Product Details */}
                            <div className="space-y-4 rounded-lg bg-gray-50 p-6">
                                <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
                                    Product Details
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Section
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.section}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Product Type
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {
                                                selectedPO.tabletCapsuleDrySyrupBottle
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Round/Oval Tablet
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.roundOvalTablet}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Tablet Color
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.tabletColour}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Packaging Type
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {
                                                selectedPO.aluAluBlisterStripBottle
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Pack Style
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.packStyle}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Product Status
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.productNewOld}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            QA Observations
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.qaObservations}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Batch Quantity
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.batchQty}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Packaging Materials & Additional Info */}
                            <div className="space-y-4 rounded-lg bg-gray-50 p-6">
                                <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
                                    Packaging & Additional Info
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            PVC Color Base
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.pvcColourBase}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Foil
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.foil}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Foil Size
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.foilSize}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Foil PO Vendor
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.foilPoVendor}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Carton PO Vendor
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.cartonPoVendor}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            RM Status
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.rmStatus}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Address
                                        </label>
                                        <p className="mt-1 text-gray-800">
                                            {selectedPO.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
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
                        Are you sure you want to approve this purchase order?
                        This action will:
                        <ul className="mt-2 list-inside list-disc">
                            <li>Mark the PO as approved by PPIC</li>
                            <li>Create a new production record</li>
                            <li>This action cannot be undone</li>
                        </ul>
                    </>
                }
            />

            <CustomDeleteDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDelete}
                title="Delete Purchase Order"
                message="Are you sure you want to delete this purchase order? This action cannot be undone."
            />

            <DialogBox
                isOpen={showEditDialog}
                onClose={() => setShowEditDialog(false)}
                title="Edit Purchase Order"
                handleSubmit={confirmUpdate}
            >
                {editingPO && (
                    <div className="mx-auto max-w-7xl space-y-8 p-6">
                        {/* Basic Information */}
                        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-2 h-5 w-5 text-indigo-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Basic Information
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            GST Number
                                        </label>
                                        <input
                                            type="text"
                                            value={editingPO.gstNo || ''}
                                            onChange={(e) =>
                                                setEditingPO({
                                                    ...editingPO,
                                                    gstNo: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            placeholder="Enter GST Number"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            PO Number
                                        </label>
                                        <input
                                            type="text"
                                            value={editingPO.poNo || ''}
                                            onChange={(e) =>
                                                setEditingPO({
                                                    ...editingPO,
                                                    poNo: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            placeholder="Enter PO Number"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Brand Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editingPO.brandName || ''}
                                            onChange={(e) =>
                                                setEditingPO({
                                                    ...editingPO,
                                                    brandName: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            placeholder="Enter Brand Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            PO Date
                                        </label>
                                        <input
                                            type="date"
                                            value={
                                                editingPO.poDate
                                                    ? new Date(editingPO.poDate)
                                                          .toISOString()
                                                          .split('T')[0]
                                                    : ''
                                            }
                                            onChange={(e) =>
                                                setEditingPO({
                                                    ...editingPO,
                                                    poDate: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Dispatch Date
                                        </label>
                                        <input
                                            type="date"
                                            value={
                                                editingPO.dispatchDate
                                                    ? new Date(
                                                          editingPO.dispatchDate
                                                      )
                                                          .toISOString()
                                                          .split('T')[0]
                                                    : ''
                                            }
                                            onChange={(e) =>
                                                setEditingPO({
                                                    ...editingPO,
                                                    dispatchDate:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Party Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editingPO.partyName || ''}
                                            onChange={(e) =>
                                                setEditingPO({
                                                    ...editingPO,
                                                    partyName: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            placeholder="Enter Party Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Batch Number
                                        </label>
                                        <input
                                            type="text"
                                            value={editingPO.batchNo || ''}
                                            onChange={(e) =>
                                                setEditingPO({
                                                    ...editingPO,
                                                    batchNo: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            placeholder="Enter Batch Number"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Information */}
                        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-2 h-5 w-5 text-green-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Financial Information
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            PO Quantity
                                        </label>
                                        <input
                                            type="number"
                                            value={editingPO.poQty || ''}
                                            onChange={(e) =>
                                                setEditingPO({
                                                    ...editingPO,
                                                    poQty: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            PO Rate
                                        </label>
                                        <div className="relative mt-1 rounded-md shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="text-gray-500 sm:text-sm">
                                                    ₹
                                                </span>
                                            </div>
                                            <input
                                                type="number"
                                                value={editingPO.poRate || ''}
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        poRate: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Amount
                                        </label>
                                        <div className="relative mt-1 rounded-md shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="text-gray-500 sm:text-sm">
                                                    ₹
                                                </span>
                                            </div>
                                            <input
                                                type="number"
                                                value={editingPO.amount || ''}
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        amount: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            MRP
                                        </label>
                                        <div className="relative mt-1 rounded-md shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="text-gray-500 sm:text-sm">
                                                    ₹
                                                </span>
                                            </div>
                                            <input
                                                type="number"
                                                value={editingPO.mrp || ''}
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        mrp: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Payment Terms
                                        </label>
                                        <input
                                            type="text"
                                            value={editingPO.paymentTerms || ''}
                                            onChange={(e) =>
                                                setEditingPO({
                                                    ...editingPO,
                                                    paymentTerms:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            placeholder="Net 30 days"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Order Through
                                        </label>
                                        <input
                                            type="text"
                                            value={editingPO.orderThrough || ''}
                                            onChange={(e) =>
                                                setEditingPO({
                                                    ...editingPO,
                                                    orderThrough:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            placeholder="Enter order method"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Two columns for the remaining sections on larger screens */}
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {/* Product Details */}
                            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                                <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                                    <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-2 h-5 w-5 text-blue-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                            />
                                        </svg>
                                        Product Details
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Section
                                            </label>
                                            <input
                                                type="text"
                                                value={editingPO.section || ''}
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        section: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                placeholder="Enter section"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Product Type
                                            </label>
                                            <select
                                                value={
                                                    editingPO.tabletCapsuleDrySyrupBottle ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        tabletCapsuleDrySyrupBottle:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            >
                                                <option value="">
                                                    Select product type
                                                </option>
                                                <option value="Tablet">
                                                    Tablet
                                                </option>
                                                <option value="Capsule">
                                                    Capsule
                                                </option>
                                                <option value="Dry Syrup">
                                                    Dry Syrup
                                                </option>
                                                <option value="Bottle">
                                                    Bottle
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Tablet Shape
                                            </label>
                                            <select
                                                value={
                                                    editingPO.roundOvalTablet ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        roundOvalTablet:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            >
                                                <option value="">
                                                    Select shape
                                                </option>
                                                <option value="Round">
                                                    Round
                                                </option>
                                                <option value="Oval">
                                                    Oval
                                                </option>
                                                <option value="Other">
                                                    Other
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Tablet Color
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    editingPO.tabletColour || ''
                                                }
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        tabletColour:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                placeholder="Enter tablet color"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Packaging Type
                                            </label>
                                            <select
                                                value={
                                                    editingPO.aluAluBlisterStripBottle ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        aluAluBlisterStripBottle:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            >
                                                <option value="">
                                                    Select packaging
                                                </option>
                                                <option value="Alu-Alu">
                                                    Alu-Alu
                                                </option>
                                                <option value="Blister">
                                                    Blister
                                                </option>
                                                <option value="Strip">
                                                    Strip
                                                </option>
                                                <option value="Bottle">
                                                    Bottle
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Pack Style
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    editingPO.packStyle || ''
                                                }
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        packStyle:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                placeholder="Enter pack style"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Product Status
                                            </label>
                                            <select
                                                value={
                                                    editingPO.productNewOld ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        productNewOld:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            >
                                                <option value="">
                                                    Select status
                                                </option>
                                                <option value="New">New</option>
                                                <option value="Existing">
                                                    Existing
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Batch Quantity
                                            </label>
                                            <input
                                                type="number"
                                                value={editingPO.batchQty || ''}
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        batchQty:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Packaging Materials */}
                            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                                <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                                    <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-2 h-5 w-5 text-purple-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                            />
                                        </svg>
                                        Packaging Materials
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                PVC Color Base
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    editingPO.pvcColourBase ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        pvcColourBase:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                placeholder="Enter PVC color"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Foil
                                            </label>
                                            <input
                                                type="text"
                                                value={editingPO.foil || ''}
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        foil: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                placeholder="Enter foil details"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Foil Size
                                            </label>
                                            <input
                                                type="text"
                                                value={editingPO.foil || ''}
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        foil: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                placeholder="Enter foil details"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Foil PO Vendor
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    editingPO.foilPoVendor || ''
                                                }
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        foilPoVendor:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                placeholder="Enter vendor name"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Carton PO Vendor
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    editingPO.cartonPoVendor ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        cartonPoVendor:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                placeholder="Enter vendor name"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                RM Status
                                            </label>
                                            <select
                                                value={editingPO.rmStatus || ''}
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        rmStatus:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            >
                                                <option value="">
                                                    Select status
                                                </option>
                                                <option value="Available">
                                                    Available
                                                </option>
                                                <option value="Pending">
                                                    Pending
                                                </option>
                                                <option value="Ordered">
                                                    Ordered
                                                </option>
                                                <option value="Partial">
                                                    Partial
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Address
                                            </label>
                                            <textarea
                                                value={editingPO.address || ''}
                                                onChange={(e) =>
                                                    setEditingPO({
                                                        ...editingPO,
                                                        address: e.target.value,
                                                    })
                                                }
                                                rows={3}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                placeholder="Enter delivery address"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes and Composition */}
                        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-2 h-5 w-5 text-amber-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Additional Information
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Notes
                                        </label>
                                        <textarea
                                            value={editingPO.notes || ''}
                                            onChange={(e) =>
                                                setEditingPO({
                                                    ...editingPO,
                                                    notes: e.target.value,
                                                })
                                            }
                                            rows={4}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            placeholder="Add any special instructions or notes here"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Composition
                                        </label>
                                        <textarea
                                            value={editingPO.composition || ''}
                                            onChange={(e) =>
                                                setEditingPO({
                                                    ...editingPO,
                                                    composition: e.target.value,
                                                })
                                            }
                                            rows={4}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            placeholder="Enter product composition details"
                                        ></textarea>
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
