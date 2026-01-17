import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import Loading from '@loading'
import axios from '@axios'
import Header from '@components/Header'
import DataGridTable from '@components/DataGridTable'
import DialogBox from '@components/DialogBox'
import CustomApproveDialog from '@components/CustomApproveDialog'
import { HiOutlineBeaker, HiCube, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi'
import decryptData from '../../utils/Decrypt'

const selectOptions = {
    roundOvalTablet: ['Round', 'Oval', 'Capsule', 'Diamond'],
    tabletColour: ['White', 'Pink', 'Yellow', 'Blue', 'Orange', 'Green'],
}

const initialFormState = {  
    roundOvalTablet: '',
    tabletColour: '',
    designerRemarks: '',
}

function Designer() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showApproveDialog, setShowApproveDialog] = useState(false)
    const [selectedPO, setSelectedPO] = useState(null)
    const [formData, setFormData] = useState(initialFormState)

    const fetchPOs = useCallback(async () => {
        try {
            setLoading(true)

            const response = await axios.get('designer/')
            const payload = response?.data?.payload ?? response?.data

            let decrypted = payload

            if (typeof payload === 'string') {
                decrypted = decryptData(payload)
            }

            if (!decrypted || !Array.isArray(decrypted.data)) {
                console.error('Invalid PO response:', decrypted)
                toast.error('Invalid PO data format')
                return
            }
console.log('Decrypted POs:', decrypted.data)   
            setRecords(decrypted.data)
        } catch (err) {
            console.error(err)
            toast.error('Failed to load POs')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPOs()
    }, [fetchPOs])

    const handleEdit = useCallback((po) => {
        setSelectedPO(po)
        setFormData({
            roundOvalTablet: po.roundOvalTablet || '',
            tabletColour: po.tabletColour || '',
            designerRemarks: po.designerRemarks || '',
        })
        setShowEditDialog(true)
    }, [])

    const handleUpload = useCallback(async (row, file) => {
        if (!file) return

        const uploadFormData = new FormData()
        uploadFormData.append('file', file)

        try {
            await axios.patch(`designer/${row.id}/design`, uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            toast.success('Design uploaded successfully')
            fetchPOs()
        } catch (err) {
            console.error(err)
            toast.error('Upload failed. Please try again.')
        }
    }, [fetchPOs])

    const handleSubmit = useCallback(async () => {
        if (!selectedPO) return
        
        try {
            await axios.put(`designer/${selectedPO.id}/specs`, formData)
            toast.success('Design details updated successfully')
            setShowEditDialog(false)
            fetchPOs()
        } catch (err) {
            console.error(err)
            toast.error('Update failed. Please try again.')
        }
    }, [selectedPO, formData, fetchPOs])

    const handleApprove = useCallback(async () => {
        if (!selectedPO) return
        
        try {
            await axios.post(`designer/${selectedPO.id}/action`, {
                action: 'approve'
            })
            toast.success('PO approved successfully')
            setShowApproveDialog(false)
            fetchPOs()
        } catch (err) {
            console.error(err)
            toast.error('Approval failed. Please try again.')
        }
    }, [selectedPO, fetchPOs])

    const columns = useMemo(() => [
        { 
            field: 'poNo', 
            header: 'PO Number', 
            searchable: true,
            width: '120px'
        },
        { 
            field: 'poDate', 
            header: 'PO Date',
            width: '150px',
            renderCell: (value) => value ? new Date(value).toLocaleDateString() : ''
        },
        { 
            field: 'brandName', 
            header: 'Brand',
            width: '150px'
        },
        { 
            field: 'partyName', 
            header: 'Party',
            width: '180px'
        },
        { 
            field: 'orderThrough', 
            header: 'Order Through',
            width: '150px'
        },
        { 
            field: 'composition', 
            header: 'Composition',
            width: '200px'
        },
        { 
            field: 'section', 
            header: 'Section',
            width: '120px'
        },
        { 
            field: 'tabletCapsuleDrySyrupBottle', 
            header: 'Type',
            width: '180px'
        },
        { 
            field: 'roundOvalTablet', 
            header: 'Shape',
            width: '120px'
        },
        { 
            field: 'tabletColour', 
            header: 'Colour',
            width: '120px'
        },
        { 
            field: 'aluAluBlisterStripBottle', 
            header: 'Packing Type',
            width: '180px'
        },
        { 
            field: 'packStyle', 
            header: 'Pack Style',
            width: '150px'
        },
        { 
            field: 'productNewOld', 
            header: 'New/Old',
            width: '100px'
        },
        { 
            field: 'batchQty', 
            header: 'Quantity',
            width: '100px',
            renderCell: (value) => (
                <span className="font-medium">{value?.toLocaleString()}</span>
            )
        },
        { 
            field: 'pvcColourBase', 
            header: 'PVC Colour',
            width: '150px'
        },
        { 
            field: 'foilSize', 
            header: 'Foil Size',
            width: '120px'
        },
        { 
            field: 'design', 
            header: 'Design',
            width: '200px',
            renderCell: (value, row) => {
                if (value) {
                    return (
                        <a 
                            href={value} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline"
                        >
                            View Design
                        </a>
                    )
                } else {
                    return (
                        <label className="px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer">
                            Upload
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handleUpload(row, e.target.files?.[0])}
                            />
                        </label>
                    )
                }
            }
        },
        {
            field: 'designerApproval',
            header: 'Status',
            width: '140px',
            renderCell: (value) => {
                const status = value || 'Pending'
                const isApproved = status === 'Approved'
                
                return (
                    <div className="flex items-center gap-2">
                        {isApproved ? (
                            <HiOutlineCheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                            <HiOutlineClock className="w-4 h-4 text-amber-500" />
                        )}
                        <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                            isApproved
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                            {status}
                        </span>
                    </div>
                )
            },
        },
        { 
            field: 'createdAt', 
            header: 'Created At',
            width: '150px',
            renderCell: (value) => value ? new Date(value).toLocaleDateString() : ''
        },
        {
            field: 'actions',
            header: 'Actions',
            width: '180px',
            renderCell: (_, row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
                    >
                        Edit Design
                    </button>
                    <button
                        onClick={() => {
                            setSelectedPO(row)
                            setFormData({
                                roundOvalTablet: row.roundOvalTablet || '',
                                tabletColour: row.tabletColour || '',
                                designerRemarks: row.designerRemarks || '',
                            })
                            setShowApproveDialog(true)
                        }}
                        className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 border border-green-200 transition-colors"
                    >
                        Approve
                    </button>
                </div>
            ),
        },
    ], [handleEdit, handleUpload])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loading />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <Header
                    heading="Designer Dashboard"
                    description="Manage and approve design specifications for purchase orders"
                    className="px-6 py-4"
                />
            </div>

            <main className="px-4 sm:px-6 lg:px-8 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total POs</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{records.length}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <HiOutlineBeaker className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                                <p className="text-2xl font-bold text-amber-600 mt-2">
                                    {records.filter(r => !r.designerApproval || r.designerApproval === 'Pending').length}
                                </p>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <HiOutlineClock className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Approved</p>
                                <p className="text-2xl font-bold text-green-600 mt-2">
                                    {records.filter(r => r.designerApproval === 'Approved').length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <HiOutlineCheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Ready for Design</p>
                                <p className="text-2xl font-bold text-purple-600 mt-2">
                                    {records.filter(r => !r.roundOvalTablet || !r.tabletColour).length}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <HiCube className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Grid */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Purchase Orders</h2>
                        <p className="text-sm text-gray-600 mt-1">Manage design specifications and approvals</p>
                    </div>
                    
                    <div className="p-4 sm:p-6 overflow-x-auto">
                        <DataGridTable
                            data={records}
                            columns={columns}
                            key={records.length} // Force re-render when data changes
                            loading={loading}
                        />
                    </div>
                </div>
            </main>

            {/* EDIT DIALOG */}
            <DialogBox
                isOpen={showEditDialog}
                onClose={() => {
                    setShowEditDialog(false)
                    setFormData(initialFormState)
                }}
                title="Edit Design Specifications"
                submitLabel="Save Changes"
                cancelLabel="Cancel"
                handleSubmit={handleSubmit}
                size="lg"
            >
                <div className="space-y-8">
                    {/* Tablet Section */}
                    <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border border-blue-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-white rounded-lg shadow-sm border border-blue-200">
                                <HiOutlineBeaker className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Tablet Specifications</h3>
                                <p className="text-sm text-gray-600 mt-1">Define tablet shape and color properties</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tablet Shape <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.roundOvalTablet}
                                    onChange={(e) =>
                                        setFormData({ ...formData, roundOvalTablet: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                >
                                    <option value="">Select shape</option>
                                    {selectOptions.roundOvalTablet.map((o) => (
                                        <option key={o} value={o} className="py-2">{o}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tablet Colour <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.tabletColour}
                                    onChange={(e) =>
                                        setFormData({ ...formData, tabletColour: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                >
                                    <option value="">Select colour</option>
                                    {selectOptions.tabletColour.map((o) => (
                                        <option key={o} value={o} className="py-2">{o}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Designer Remarks
                            </label>
                            <textarea
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[120px] resize-y"
                                placeholder="Add any additional notes or special instructions..."
                                value={formData.designerRemarks}
                                onChange={(e) =>
                                    setFormData({ ...formData, designerRemarks: e.target.value })
                                }
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Optional: Add comments or special requirements for this design
                            </p>
                        </div>
                    </div>
                </div>
            </DialogBox>

            {/* APPROVE DIALOG */}
            <CustomApproveDialog
                isOpen={showApproveDialog}
                onClose={() => {
                    setShowApproveDialog(false)
                    setFormData(initialFormState)
                }}
                onConfirm={handleApprove}
                title="Approve Design"
                message={`Are you sure you want to approve the design specifications for PO ${selectedPO?.poNo}?`}
                confirmLabel="Yes, Approve Design"
                cancelLabel="Review Again"
                severity="success"
            />
        </div>
    )
}

export default Designer