import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from '@axios'
import Loading from '@loading'
import Header from '@components/Header'
import DataGridTable from '@components/DataGridTable'
import CustomApproveDialog from '@components/CustomApproveDialog'
import DialogBox from '@components/DialogBox'
import CustomWarningDialog from '@components/CustomWarningDialog'

function QA() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [showViewDialog, setShowViewDialog] = useState(false)
    const [showApproveDialog, setShowApproveDialog] = useState(false)
    const [showWarningDialog, setShowWarningDialog] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [formData, setFormData] = useState({
        poNo: '',
        brandName: '',
        partyName: '',
        batchNo: '',
        composition: '',
        mrp: '',
        qaObservations: '',
        section: '',
        tabletCapsuleDrySyrupBottle: '',
        aluAluBlisterStripBottle: '',
        packstyle: '',
        batchQty: '',
    })

    useEffect(() => {
        axios
            .get('po/md-approved/designer-pending')
            .then((response) => {
                setRecords(response.data)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error fetching data:', err)
            })
    }, [])

    const handleView = (po) => {
        setSelectedCustomer(po)
        setFormData(po)
        setShowViewDialog(true)
    }

    const handleWarning = (customer) => {
        setSelectedCustomer(customer)
        setShowWarningDialog(true)
    }

    const handleApprove = (customer) => {
        setSelectedCustomer(customer)
        setShowApproveDialog(true)
    }

    const confirmApprove = async () => {
        if (!selectedCustomer) return

        try {
            await axios.put(`po/${selectedCustomer._id}`, {
                ...selectedCustomer,
                designerApproval: 'Approved',
            })
            toast.success('PO approved successfully', {
                autoClose: 1000,
                onClose: () => window.location.reload(),
            })
        } catch (err) {
            toast.error('Failed to approve purchase order.')
            console.error(err)
        }
    }

    if (loading) return <Loading />

    const columns = [
        { field: 'poNo', header: 'PO No.', sortable: true },
        { field: 'brandName', header: 'Brand Name', sortable: true },
        { field: 'partyName', header: 'Party Name', sortable: true },
        { field: 'batchNo', header: 'Batch No.', sortable: true },
        { field: 'composition', header: 'Composition', sortable: true },
        { field: 'mrp', header: 'MRP', sortable: true },
        { field: 'qaObservations', header: 'QA Observations', sortable: true },
        { field: 'section', header: 'Section', sortable: true },
        {
            field: 'tabletCapsuleDrySyrupBottle',
            header: 'Tablet/Capsule/Dry Syrup Bottle',
            sortable: true,
        },
        {
            field: 'aluAluBlisterStripBottle',
            header: 'Alu Alu/Blister Strip/Bottle',
            sortable: true,
        },
        { field: 'packstyle', header: 'Pack Style', sortable: true },
        { field: 'batchQty', header: 'Batch Quantity', sortable: true },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full">
                <Header
                    heading="QA Approvals - Purchase Orders"
                    description="Manage and approve purchase orders"
                />

                <div className="mx-8">
                    <DataGridTable
                        data={records}
                        columns={columns}
                        onView={handleView}
                        onApprove={handleApprove}
                        onWarning={handleWarning}
                    />
                </div>

                <DialogBox
                    isOpen={showViewDialog}
                    onClose={() => setShowViewDialog(false)}
                    title="View Purchase Order Details"
                    hideFooter={true}
                >
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        PO No.
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter PO number"
                                    value={formData.poNo}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            poNo: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        Brand Name
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter brand name"
                                    value={formData.brandName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            brandName: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        Party Name
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter party name"
                                    value={formData.partyName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            partyName: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        Batch Number
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter batch number"
                                    value={formData.batchNo}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            batchNo: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        Composition
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter composition"
                                    value={formData.composition}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            composition: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        MRP
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter MRP"
                                    value={formData.mrp}
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
                                    <span className="label-text font-medium text-gray-700">
                                        QA Observations
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter QA observations"
                                    value={formData.qaObservations}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            qaObservations: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        Section
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter section"
                                    value={formData.section}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            section: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        Tablet/Capsule/Dry Syrup Bottle
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Specify tablet, capsule, or dry syrup bottle type"
                                    value={formData.tabletCapsuleDrySyrupBottle}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            tabletCapsuleDrySyrupBottle:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        Alu Alu/Blister Strip/Bottle
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter alu alu, blister strip, or bottle details"
                                    value={formData.aluAluBlisterStripBottle}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            aluAluBlisterStripBottle:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        Pack Style
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter pack style format (e.g., 10x10)"
                                    value={formData.packstyle}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            packstyle: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        Batch Quantity
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter batch quantity"
                                    value={formData.batchQty}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            batchQty: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </form>
                </DialogBox>

                <CustomWarningDialog
                    isOpen={showWarningDialog}
                    onClose={() => setShowWarningDialog(false)}
                    title="Quality Control Warning"
                    message={`PO ${selectedCustomer?.poNo} has been marked for quality concerns. Please review the QA observations.`}
                />
                <CustomApproveDialog
                    isOpen={showApproveDialog}
                    onClose={() => setShowApproveDialog(false)}
                    onConfirm={confirmApprove}
                    title="Approve Purchase Order"
                    message={`Are you sure you want to approve PO ${selectedCustomer?.poNo}?`}
                />
            </div>
        </div>
    )
}

export default QA
