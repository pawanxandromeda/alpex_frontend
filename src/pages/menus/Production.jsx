import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FiCalendar } from 'react-icons/fi'
import Loading from '@loading'
import Header from '@components/Header'
import DataGridTable from '@components/DataGridTable'
import CustomDeleteDialog from '@components/CustomDeleteDialog'
import DialogBox from '@components/DialogBox'
import axios from '@axios'
import decryptData from '../../utils/Decrypt'

function Production() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [ppicApproval, setPpicApproval] = useState([])
    const [genericNames] = useState([
        'Paracetamol',
        'Amoxicillin',
        'Ibuprofen',
        'Omeprazole',
        'Metformin',
        'Aspirin',
        'Cetirizine',
        'Losartan',
    ])

    // Improved form data initialization
    const initialFormData = {
        genericName: '',
        batchNumber: '',
        batchSize: '',
        productName: '',
        type: '',
        fgQuantity: '',
        mrp: '',
        dispencing: '',
        granulation: '',
        resultGranulation: '',
        compressionFilling: '',
        coating: '',
        resultCoating: '',
        materialHandover: '',
        readyToDispatch: '',
        carton: '',
        foil: '',
        remarks: '',
        foilsize: '',
        childBatch: '',
        qcApproval: false,
    }

    const [formData, setFormData] = useState(initialFormData)

    // Format date for input fields
    const formatDateForInput = (dateString) => {
        if (!dateString) return ''
        try {
            const date = new Date(dateString)
            return date.toISOString().split('T')[0]
        } catch (e) {
            return ''
        }
    }

    const fetchData = () => {
        setLoading(true)
        Promise.all([axios.get('production'), axios.get('po/batchNumbers')])
            .then(([productionResponse, batchResponse]) => {
                setRecords(decryptData(productionResponse.data))
                setPpicApproval(batchResponse.data.data)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error fetching data:', err)
                toast.error('Failed to load data')
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = (record) => {
        const formattedRecord = {
            ...record,
            dispencing: formatDateForInput(record.dispencing),
            granulation: formatDateForInput(record.granulation),
            resultGranulation: formatDateForInput(record.resultGranulation),
            compressionFilling: formatDateForInput(record.compressionFilling),
            coating: formatDateForInput(record.coating),
            resultCoating: formatDateForInput(record.resultCoating),
            materialHandover: formatDateForInput(record.materialHandover),
            readyToDispatch: formatDateForInput(record.readyToDispatch),
            qcApproval: record.qcApproval || false, // Ensure it's included
        }
        setSelectedRecord(record)
        setFormData(formattedRecord)
        setShowEditDialog(true)
    }

    const handleDelete = (record) => {
        setSelectedRecord(record)
        setShowDeleteDialog(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validate required fields
        if (
            !formData.genericName ||
            !formData.batchNumber ||
            !formData.batchSize ||
            !formData.productName
        ) {
            toast.error('Please fill all required fields')
            return
        }

        setLoading(true)

        // List of date fields to check
        const dateFields = [
            'dispencing',
            'granulation',
            'resultGranulation',
            'compressionFilling',
            'coating',
            'resultCoating',
            'materialHandover',
            'readyToDispatch',
        ]

        // Check if any date field has been updated or added
        let updatedFormData = { ...formData }
        if (selectedRecord) {
            // For updates, compare with the original record
            const hasDateChanged = dateFields.some(
                (field) =>
                    formData[field] && formData[field] !== selectedRecord[field]
            )
            if (hasDateChanged) {
                updatedFormData.qcApproval = true
            }
        } else {
            // For new records, check if any date field is provided
            const hasDateAdded = dateFields.some((field) => formData[field])
            if (hasDateAdded) {
                updatedFormData.qcApproval = true
            }
        }

        if (selectedRecord) {
            // Update existing record
            axios
                .put(`production/${selectedRecord._id}`, updatedFormData)
                .then(() => {
                    toast.success('Production record updated successfully')
                    setShowEditDialog(false)
                    fetchData() // Refresh data instead of page reload
                })
                .catch((err) => {
                    toast.error('Failed to update record')
                    console.error(err)
                })
                .finally(() => setLoading(false))
        } else {
            // Create new record
            axios
                .post('production', updatedFormData)
                .then(() => {
                    toast.success('Production record created successfully')
                    setShowEditDialog(false)
                    fetchData() // Refresh data instead of page reload
                })
                .catch((err) => {
                    toast.error('Failed to create new record')
                    console.error(err)
                })
                .finally(() => setLoading(false))
        }
    }

    const confirmDelete = () => {
        setLoading(true)
        axios
            .delete(`production/${selectedRecord._id}`)
            .then(() => {
                toast.success('Record deleted successfully')
                setShowDeleteDialog(false)
                fetchData() // Refresh data instead of page reload
            })
            .catch((err) => {
                toast.error('Failed to delete record')
                console.error(err)
            })
            .finally(() => setLoading(false))
    }

    if (loading && records.length === 0) return <Loading />

    return (
        <div className="min-h-screen bg-gray-100">
            <Header
                heading="Production Records"
                description="Manage and track production records"
                buttonName="Add New Entry"
                handleClick={() => {
                    setSelectedRecord(null)
                    setFormData(initialFormData)
                    setShowEditDialog(true)
                }}
            />
            <div className="px-8">
                {!loading && (
                    <DataGridTable
                        data={records}
                        columns={[
                            {
                                field: 'genericName',
                                header: 'Generic Name',
                                sortable: true,
                                searchable: true,
                            },
                            {
                                field: 'batchNumber',
                                header: 'Batch Number',
                                sortable: true,
                                searchable: true,
                            },
                            {
                                field: 'productName',
                                header: 'Product Name',
                                sortable: true,
                                searchable: true,
                            },
                            {
                                field: 'batchSize',
                                header: 'Batch Size',
                                sortable: true,
                            },
                            {
                                field: 'type',
                                header: 'Type',
                                sortable: true,
                                renderCell: (value) => value || 'N/A',
                            },
                            {
                                field: 'granulation',
                                header: 'Granulation Date',
                                sortable: true,
                                renderCell: (value) =>
                                    value
                                        ? new Date(value).toLocaleDateString()
                                        : 'N/A',
                            },
                            {
                                field: 'compressionFilling',
                                header: 'Compression Date',
                                sortable: true,
                                renderCell: (value) =>
                                    value
                                        ? new Date(value).toLocaleDateString()
                                        : 'N/A',
                            },
                            {
                                field: 'qcApproval',
                                header: 'Status',
                                sortable: true,
                                renderCell: (value) => (
                                    <span
                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                            value
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}
                                    >
                                        {value
                                            ? 'Pending QC Side'
                                            : 'In Production'}
                                    </span>
                                ),
                            },
                        ]}
                        onUpdate={(row) =>
                            !row.qcApproval ? handleEdit(row) : null
                        }
                        onDelete={(row) =>
                            !row.qcApproval ? handleDelete(row) : null
                        }
                    />
                )}
                {selectedRecord && (
                    <CustomDeleteDialog
                        isOpen={showDeleteDialog}
                        onClose={() => {
                            setShowDeleteDialog(false)
                            setSelectedRecord(null)
                        }}
                        onConfirm={confirmDelete}
                        title="Delete Production Record"
                        message={`Are you sure you want to delete the production record for ${selectedRecord.genericName} with batch number ${selectedRecord.batchNumber}? This action cannot be undone.`}
                    />
                )}
                <DialogBox
                    isOpen={showEditDialog}
                    onClose={() => {
                        setShowEditDialog(false)
                        setSelectedRecord(null)
                        setFormData(initialFormData)
                    }}
                    title={
                        selectedRecord
                            ? 'Edit Production Record'
                            : 'Add New Production Record'
                    }
                    handleSubmit={(e) => {
                        e?.preventDefault()
                        handleSubmit(e)
                    }}
                    disabled={loading || formData.qcApproval}
                >
                    <form onSubmit={(e) => e.preventDefault()} className="mt-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Generic Name{' '}
                                        <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <select
                                    className={`input-custom ${
                                        formData.qcApproval
                                            ? 'cursor-not-allowed opacity-60'
                                            : ''
                                    }`}
                                    value={formData.genericName || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            genericName: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={formData.qcApproval}
                                >
                                    <option value="" disabled>
                                        Select Generic Name
                                    </option>
                                    {genericNames.map((name, index) => (
                                        <option key={index} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Batch Number{' '}
                                        <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <select
                                    className={`input-custom ${
                                        formData.qcApproval
                                            ? 'cursor-not-allowed opacity-60'
                                            : ''
                                    }`}
                                    value={formData.batchNumber || ''}
                                    disabled={formData.qcApproval}
                                    onChange={(e) => {
                                        const selectedPO = ppicApproval.find(
                                            (po) =>
                                                po.batchNo === e.target.value
                                        )
                                        if (selectedPO) {
                                            setFormData({
                                                ...formData,
                                                batchNumber: e.target.value,
                                                productName:
                                                    selectedPO.brandName || '',
                                            })
                                        } else {
                                            setFormData({
                                                ...formData,
                                                batchNumber: e.target.value,
                                            })
                                        }
                                    }}
                                    required
                                >
                                    <option value="" disabled>
                                        Select Batch Number
                                    </option>
                                    {ppicApproval.map((po, index) => (
                                        <option key={index} value={po.batchNo}>
                                            {po.batchNo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Batch Size{' '}
                                        <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input-custom"
                                    placeholder="Enter batch size"
                                    value={formData.batchSize || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            batchSize: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Product Name{' '}
                                        <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input-custom"
                                    placeholder="Enter product name"
                                    value={formData.productName || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            productName: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Type</span>
                                </label>
                                <input
                                    type="text"
                                    className="input-custom"
                                    placeholder="Enter type"
                                    value={formData.type || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            type: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        FG Quantity
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-custom ${
                                        formData.qcApproval
                                            ? 'cursor-not-allowed opacity-60'
                                            : ''
                                    }`}
                                    disabled={formData.qcApproval}
                                    placeholder="Enter FG quantity"
                                    value={formData.fgQuantity || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            fgQuantity: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">MRP</span>
                                </label>
                                <input
                                    type="text"
                                    className="input-custom"
                                    placeholder="Enter MRP"
                                    value={formData.mrp || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            mrp: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Dispencing Date
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    className={`input-custom ${
                                        formData.qcApproval
                                            ? 'cursor-not-allowed opacity-60'
                                            : ''
                                    }`}
                                    disabled={formData.qcApproval}
                                    value={formData.dispencing || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            dispencing: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Granulation Date
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    className={`input-custom ${
                                        formData.qcApproval
                                            ? 'cursor-not-allowed opacity-60'
                                            : ''
                                    }`}
                                    disabled={formData.qcApproval}
                                    value={formData.granulation || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            granulation: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Result Granulation Date
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    className="input-custom"
                                    value={formData.resultGranulation || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            resultGranulation: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Compression Filling Date
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    className="input-custom"
                                    value={formData.compressionFilling || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            compressionFilling: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Coating Date
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    className="input-custom"
                                    value={formData.coating || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            coating: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Result Coating Date
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    className="input-custom"
                                    value={formData.resultCoating || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            resultCoating: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Material Handover Date
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    className="input-custom"
                                    value={formData.materialHandover || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            materialHandover: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Ready to Dispatch Date
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    className="input-custom"
                                    value={formData.readyToDispatch || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            readyToDispatch: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Carton</span>
                                </label>
                                <input
                                    type="text"
                                    className="input-custom"
                                    placeholder="Enter carton details"
                                    value={formData.carton || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            carton: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Foil</span>
                                </label>
                                <input
                                    type="text"
                                    className="input-custom"
                                    placeholder="Enter foil details"
                                    value={formData.foil || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            foil: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Foil Size
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input-custom"
                                    placeholder="Enter foil size"
                                    value={formData.foilsize || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            foilsize: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Child Batch
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input-custom"
                                    placeholder="Enter child batch"
                                    value={formData.childBatch || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            childBatch: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Remarks</span>
                                </label>
                                <textarea
                                    className={`input-custom ${
                                        formData.qcApproval
                                            ? 'cursor-not-allowed opacity-60'
                                            : ''
                                    }`}
                                    disabled={formData.qcApproval}
                                    placeholder="Enter remarks"
                                    value={formData.remarks || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            remarks: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </form>
                </DialogBox>
            </div>
        </div>
    )
}

export default Production
