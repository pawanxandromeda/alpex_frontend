import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
    IoCheckmarkCircleOutline,
    IoTimeOutline,
    IoAddOutline,
} from 'react-icons/io5'

import Loading from '@loading'
import CustomApproveDialog from '@components/CustomApproveDialog'
import axios from '@axios'
import decryptData from '../../../utils/Decrypt'
import Header from '@components/Header'
import DataGridTable from '@components/DataGridTable'

function Approvals() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [showApproveDialog, setShowApproveDialog] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)

    useEffect(() => {
        const fetchRecords = async () => {
            setLoading(true) // Ensure loading is true at the start
            try {
                const response = await axios.get('production/qcApproval')
                // Assuming decryptData returns an array or handles errors appropriately
                const decryptedData = decryptData(response.data)
                setRecords(Array.isArray(decryptedData) ? decryptedData : [])
            } catch (err) {
                console.error('Error fetching records:', err)
                toast.error(
                    'Failed to load QC records. Please try again later.'
                )
                setRecords([]) // Set to empty array on error
            } finally {
                setLoading(false)
            }
        }
        fetchRecords()
    }, [])

    const handleApprove = (id) => {
        const recordToUpdate = records.find((record) => record._id === id)
        if (!recordToUpdate || !recordToUpdate.qcApproval) return // Already approved or not found
        setSelectedRecord(recordToUpdate)
        setShowApproveDialog(true)
    }

    const confirmApprove = async () => {
        if (!selectedRecord) return

        setLoading(true)
        try {
            await axios.put(`/production/${selectedRecord._id}`, {
                qcApproval: false,
            })

            setRecords(
                records.map((record) =>
                    record._id === selectedRecord._id
                        ? { ...record, qcApproval: false }
                        : record
                )
            )
            toast.success(
                `Batch ${selectedRecord.batchNumber} approved successfully!`
            )
        } catch (err) {
            console.error('Error updating approval:', err)
            toast.error(
                `Failed to approve Batch ${selectedRecord.batchNumber}. Please try again.`
            )
        } finally {
            setLoading(false)
        }
    }

    // Placeholder for Add New Entry functionality
    const handleAddNewEntry = () => {
        toast.info('Add New Entry functionality is not yet implemented.')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                heading="QC Production Approvals"
                description="Review and approve production batches"
                buttonName="Add New Entry"
                handleClick={handleAddNewEntry}
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {loading && records.length === 0 ? (
                    <Loading />
                ) : (
                    <DataGridTable
                        data={records}
                        columns={[
                            {
                                field: 'batchNumber',
                                header: 'Batch Number',
                                sortable: true,
                            },
                            {
                                field: 'batchSize',
                                header: 'Batch Size',
                                sortable: true,
                            },
                            {
                                field: 'productName',
                                header: 'Product Name',
                                sortable: true,
                            },
                            {
                                field: 'genericName',
                                header: 'Generic Name',
                                sortable: true,
                            },
                            { field: 'type', header: 'Type', sortable: true },
                            {
                                field: 'fgQuantity',
                                header: 'FG Quantity',
                                sortable: true,
                            },
                            { field: 'mrp', header: 'MRP', sortable: true },
                            {
                                field: 'dispencing',
                                header: 'Dispencing',
                                sortable: true,
                            },
                            {
                                field: 'granulation',
                                header: 'Granulation',
                                sortable: true,
                                renderCell: (value) =>
                                    value
                                        ? new Date(value).toLocaleDateString()
                                        : '-',
                            },
                            {
                                field: 'resultGranulation',
                                header: 'Result Granulation',
                                sortable: true,
                                renderCell: (value) =>
                                    value
                                        ? new Date(value).toLocaleDateString()
                                        : '-',
                            },
                            {
                                field: 'compressionFilling',
                                header: 'Compression/Filling',
                                sortable: true,
                                renderCell: (value) => value || '-',
                            },
                            {
                                field: 'coating',
                                header: 'Coating',
                                sortable: true,
                                renderCell: (value) => value || '-',
                            },
                            {
                                field: 'resultCoating',
                                header: 'Result Coating',
                                sortable: true,
                                renderCell: (value) => value || '-',
                            },
                            {
                                field: 'materialHandover',
                                header: 'Material Handover',
                                sortable: true,
                                renderCell: (value) => value || '-',
                            },
                            {
                                field: 'carton',
                                header: 'Carton',
                                sortable: true,
                            },
                            {
                                field: 'childBatch',
                                header: 'Child Batch',
                                sortable: true,
                            },
                            { field: 'foil', header: 'Foil', sortable: true },
                            {
                                field: 'foilsize',
                                header: 'Foil Size',
                                sortable: true,
                            },
                            {
                                field: 'status',
                                header: 'Status',
                                sortable: true,
                                renderCell: (value, row) =>
                                    row.qcApproval ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                            <IoTimeOutline className="h-4 w-4" />
                                            Pending Approval
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                            <IoCheckmarkCircleOutline className="h-4 w-4" />
                                            Approved
                                        </span>
                                    ),
                            },
                            {
                                field: 'readyToDispatch',
                                header: 'Ready To Dispatch',
                                sortable: true,
                                renderCell: (value) =>
                                    value === null ? '-' : value ? 'Yes' : 'No',
                            },
                            {
                                field: 'remarks',
                                header: 'Remarks',
                                sortable: true,
                            },
                            {
                                field: 'createdAt',
                                header: 'Created At',
                                sortable: true,
                                renderCell: (value) =>
                                    value
                                        ? new Date(value).toLocaleString()
                                        : '-',
                            },
                        ]}
                        onApprove={(row) =>
                            row.qcApproval ? handleApprove(row._id) : null
                        }
                    />
                )}
            </div>
            <CustomApproveDialog
                isOpen={showApproveDialog}
                onClose={() => setShowApproveDialog(false)}
                onConfirm={confirmApprove}
                title="Approve Batch"
                message={`Are you sure you want to approve Batch ${selectedRecord?.batchNumber}?`}
            />
        </div>
    )
}

export default Approvals
