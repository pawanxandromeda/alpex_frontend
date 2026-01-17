import React, { useState, useMemo } from 'react'
import { FaArrowLeft } from 'react-icons/fa'

import Header from '@components/Header'
import DialogBox from '@components/DialogBox'
import DataGridTable from '@components/DataGridTable'
import CustomDeleteDialog from '@components/CustomDeleteDialog'

const sampleLeadsData = [
    {
        id: 1,
        name: 'Alice Green',
        phone: '555-1234',
        status: 'Converted',
        callbackDate: null,
    },
    {
        id: 2,
        name: 'Bob White',
        phone: '555-5678',
        status: 'Waiting',
        callbackDate: '2025-04-10',
    },
    {
        id: 3,
        name: 'Charlie Black',
        phone: '555-9876',
        status: 'Not Interested',
        callbackDate: null,
    },
    {
        id: 4,
        name: 'David Blue',
        phone: '555-4321',
        status: 'Called',
        callbackDate: null,
    }, // Will not appear in tabs
    {
        id: 5,
        name: 'Eve Yellow',
        phone: '555-1122',
        status: 'Converted',
        callbackDate: null,
    },
    {
        id: 6,
        name: 'Frank Red',
        phone: '555-3344',
        status: 'Waiting',
        callbackDate: '2025-04-15',
    },
    {
        id: 7,
        name: 'Grace Purple',
        phone: '555-5566',
        status: 'Not Interested',
        callbackDate: null,
    },
    {
        id: 8,
        name: 'Henry Orange',
        phone: '555-7788',
        status: 'Waiting',
        callbackDate: '2025-04-05',
    }, // Past date
    {
        id: 9,
        name: 'Ivy Cyan',
        phone: '555-9900',
        status: 'Converted',
        callbackDate: null,
    },
    {
        id: 10,
        name: 'Jack Magenta',
        phone: '555-0011',
        status: 'Waiting',
        callbackDate: '2025-05-01',
    },
    {
        id: 11,
        name: 'Kate Silver',
        phone: '555-2233',
        status: 'Not Interested',
        callbackDate: null,
    },
]

// --- Column Definitions ---
const leadColumns = [
    {
        field: 'id',
        header: 'ID',
        sortable: true,
        searchable: true,
        cellClassName: 'w-1/12',
    }, // Assign relative widths
    {
        field: 'name',
        header: 'Contact Name',
        sortable: true,
        searchable: true,
        cellClassName: 'w-3/12',
    },
    {
        field: 'phone',
        header: 'Phone Number',
        sortable: false,
        searchable: true,
        cellClassName: 'w-2/12',
    },
    {
        field: 'status',
        header: 'Status',
        sortable: true,
        searchable: true,
        cellClassName: 'w-2/12',
        renderCell: (value) => {
            let colorClass = 'bg-gray-100 text-gray-800' // Default for 'Called' or others
            if (value === 'Converted')
                colorClass = 'bg-green-100 text-green-800'
            else if (value === 'Not Interested')
                colorClass = 'bg-red-100 text-red-800'
            else if (value === 'Waiting')
                colorClass = 'bg-yellow-100 text-yellow-800'
            return (
                <span
                    className={`rounded px-2 py-1 text-xs font-medium ${colorClass}`}
                >
                    {value}
                </span>
            )
        },
    },
    {
        field: 'calledBy',
        header: 'Called By',
        sortable: true,
        searchable: true,
        cellClassName: 'w-2/12',
    },
    {
        field: 'callbackDate',
        header: 'Callback Date',
        sortable: true,
        searchable: true,
        cellClassName: 'w-3/12',
        renderCell: (value) => value || 'N/A', // Display N/A if no date
    },
    // Add an action column if needed, e.g., to update status or add notes
    // {
    //     field: 'actions', header: 'Actions', sortable: false, searchable: false, cellClassName: 'w-1/12',
    //     renderCell: (_, row) => (
    //         <button onClick={() => console.log('Edit:', row)} className="text-blue-500 hover:underline text-xs">Edit</button>
    //     )
    // }
]

// --- Tab Categories ---
const TABS = {
    CONVERTED: 'Converted',
    NOT_INTERESTED: 'Not Interested',
    WAITING: 'Waiting',
}

const SalesReport = () => {
    const [activeTab, setActiveTab] = useState(TABS.CONVERTED)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedLead, setSelectedLead] = useState(null)
    const [dialogAction, setDialogAction] = useState(null) // 'add' or 'update'
    const [leadData, setLeadData] = useState({
        name: '',
        phone: '',
        status: TABS.WAITING,
        callbackDate: null,
        calledBy: localStorage.getItem('username') || '',
    })

    const handleAddNew = () => {
        setSelectedLead(null)
        setDialogAction('add')
        setLeadData({
            name: '',
            phone: '',
            status: TABS.WAITING,
            callbackDate: null,
            calledBy: localStorage.getItem('username') || '',
        })
        setIsDialogOpen(true)
    }

    const handleUpdate = (lead) => {
        setSelectedLead(lead)
        setDialogAction('update')
        setLeadData({ ...lead })
        setIsDialogOpen(true)
    }

    const handleDelete = (lead) => {
        setSelectedLead(lead)
        setIsDeleteDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
        setDialogAction(null)
        setSelectedLead(null)
        setLeadData({
            name: '',
            phone: '',
            status: TABS.WAITING,
            callbackDate: null,
            calledBy: localStorage.getItem('username') || '',
        })
    }

    const handleDialogSubmit = () => {
        // TODO: Implement actual API call
        console.log('Submit:', dialogAction, leadData)
        handleCloseDialog()
    }

    const handleDeleteConfirm = () => {
        // TODO: Implement actual API call
        console.log('Delete:', selectedLead)
        setIsDeleteDialogOpen(false)
        setSelectedLead(null)
    }

    // Filter data based on the active tab
    const filteredData = useMemo(() => {
        return sampleLeadsData.filter((lead) => lead.status === activeTab)
    }, [activeTab]) // Recalculate only when activeTab changes

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header
                heading="Sales Leads Report"
                description="Track and manage sales leads and their status"
                buttonName="Add New Lead"
                handleClick={handleAddNew}
            />

            <button
                onClick={() => window.history.back()}
                className="mx-8 flex items-center rounded-lg bg-white px-4 py-2 text-gray-700 shadow transition-all hover:bg-gray-50 hover:shadow-md"
            >
                <FaArrowLeft className="mr-2" />
                <span>Back</span>
            </button>

            {/* Tab Navigation */}
            <div className="my-8 px-8">
                <div className="mb-6 border-b border-gray-300">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {Object.values(TABS).map((tabName) => (
                            <button
                                key={tabName}
                                onClick={() => setActiveTab(tabName)}
                                className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors duration-150 ease-in-out ${
                                    activeTab === tabName
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                } rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1`}
                                aria-current={
                                    activeTab === tabName ? 'page' : undefined
                                }
                            >
                                {tabName} Leads
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Displaying DataGridTable for the active tab */}
                <DataGridTable
                    data={filteredData}
                    columns={leadColumns}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />

                {/* Add/Update Dialog */}
                <DialogBox
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                    title={
                        dialogAction === 'add'
                            ? 'Add New Lead'
                            : `Update Lead: ${selectedLead?.name}`
                    }
                    handleSubmit={handleDialogSubmit}
                >
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Contact Name
                            </label>
                            <input
                                type="text"
                                value={leadData.name}
                                onChange={(e) =>
                                    setLeadData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                className="input-custom"
                                placeholder="Enter contact name"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={leadData.phone}
                                onChange={(e) =>
                                    setLeadData((prev) => ({
                                        ...prev,
                                        phone: e.target.value,
                                    }))
                                }
                                className="input-custom"
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Status
                            </label>
                            <select
                                value={leadData.status}
                                onChange={(e) =>
                                    setLeadData((prev) => ({
                                        ...prev,
                                        status: e.target.value,
                                    }))
                                }
                                className="input-custom"
                            >
                                {Object.values(TABS).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Callback Date
                            </label>
                            <input
                                type="date"
                                value={leadData.callbackDate || ''}
                                onChange={(e) =>
                                    setLeadData((prev) => ({
                                        ...prev,
                                        callbackDate: e.target.value,
                                    }))
                                }
                                className="input-custom"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Called By
                            </label>
                            <input
                                type="text"
                                value={leadData.calledBy}
                                readOnly
                                disabled
                                className="input-custom opacity-70"
                            />
                        </div>
                    </div>
                </DialogBox>

                {/* Delete Confirmation Dialog */}
                <CustomDeleteDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Lead"
                    message={`Are you sure you want to delete the lead for ${selectedLead?.name}? This action cannot be undone.`}
                />
            </div>
        </div>
    )
}

export default SalesReport
