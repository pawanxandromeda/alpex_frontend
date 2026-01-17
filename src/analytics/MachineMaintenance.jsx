import React, { useState, useMemo } from 'react'
import DataGridTable from '@components/DataGridTable'
import Header from '@components/Header'
import DialogBox from '@components/DialogBox'
import { BsClock, BsTools, BsCheckCircle } from 'react-icons/bs'
import { FaArrowLeft } from 'react-icons/fa'

import StatCard from '@components/StatCard'

const sampleMachineMaintenanceData = [
    {
        id: 'M001',
        name: 'CNC Mill',
        status: 'Healthy',
        expectedFixDate: null,
        maintenanceCost: 150.0,
        fixedDate: null,
        lastMonthlyMaintenance: '2025-03-15',
    },
    {
        id: 'M002',
        name: 'Laser Cutter',
        status: 'Under Maintenance',
        expectedFixDate: '2025-04-08',
        maintenanceCost: 450.5,
        fixedDate: null,
        lastMonthlyMaintenance: '2025-03-10',
    },
    {
        id: 'M003',
        name: '3D Printer A',
        status: 'Healthy',
        expectedFixDate: null,
        maintenanceCost: 75.0,
        fixedDate: null,
        lastMonthlyMaintenance: '2025-03-20',
    },
    {
        id: 'M004',
        name: 'Robot Arm X',
        status: 'Fixed',
        expectedFixDate: null,
        maintenanceCost: 210.0,
        fixedDate: '2025-03-30',
        lastMonthlyMaintenance: '2025-03-05',
    },
    {
        id: 'M005',
        name: '3D Printer B',
        status: 'Under Maintenance',
        expectedFixDate: '2025-04-12',
        maintenanceCost: 320.75,
        fixedDate: null,
        lastMonthlyMaintenance: '2025-03-18',
    },
    {
        id: 'M006',
        name: 'Packaging Line',
        status: 'Healthy',
        expectedFixDate: null,
        maintenanceCost: 180.0,
        fixedDate: null,
        lastMonthlyMaintenance: '2025-03-25',
    },
    {
        id: 'M007',
        name: 'Conveyor Belt Alpha',
        status: 'Fixed',
        expectedFixDate: null,
        maintenanceCost: 550.0,
        fixedDate: '2025-03-25',
        lastMonthlyMaintenance: '2025-03-01',
    },
    {
        id: 'M008',
        name: 'Welding Station',
        status: 'Healthy',
        expectedFixDate: null,
        maintenanceCost: 95.2,
        fixedDate: null,
        lastMonthlyMaintenance: '2025-03-12',
    },
]

// --- Column Definitions ---
const columns = [
    {
        field: 'id',
        header: 'Machine ID',
        sortable: true,
        searchable: true,
        cellClassName: 'w-1/12',
    },
    {
        field: 'name',
        header: 'Machine Name',
        sortable: true,
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
            let colorClass = 'bg-gray-100 text-gray-800' // Default
            if (value === 'Healthy') colorClass = 'bg-green-100 text-green-800'
            else if (value === 'Under Maintenance')
                colorClass = 'bg-yellow-100 text-yellow-800'
            else if (value === 'Fixed') colorClass = 'bg-blue-100 text-blue-800'
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
        field: 'lastMonthlyMaintenance',
        header: 'Last Monthly Maintenance',
        sortable: true,
        searchable: false,
        cellClassName: 'w-2/12',
        renderCell: (value) => {
            if (!value) return 'Not Available'
            return new Date(value).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
        },
    },
    {
        field: 'expectedFixDate',
        header: 'Expected Fix Date',
        sortable: true,
        searchable: true,
        cellClassName: 'w-2/12',
        renderCell: (value) => value || 'N/A',
    },
    {
        field: 'fixedDate',
        header: 'Fixed Date',
        sortable: true,
        searchable: true,
        cellClassName: 'w-2/12',
        renderCell: (value) => value || 'N/A',
    },
    {
        field: 'maintenanceCost',
        header: 'Maint. Cost',
        sortable: true,
        searchable: false,
        cellClassName: 'w-1/12 text-right',
        renderCell: (value) =>
            value
                ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '$0.00',
    },
]

const MachineMaintenance = () => {
    const [machines, setMachines] = useState(sampleMachineMaintenanceData)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [editingMachine, setEditingMachine] = useState(null)

    const stats = useMemo(() => {
        const now = new Date()
        const needsMaintenance = machines.filter((machine) => {
            const lastMaintenance = new Date(machine.lastMonthlyMaintenance)
            const daysSinceLastMaintenance = Math.floor(
                (now - lastMaintenance) / (1000 * 60 * 60 * 24)
            )
            return daysSinceLastMaintenance > 50
        }).length

        const underMaintenance = machines.filter(
            (machine) => machine.status === 'Under Maintenance'
        ).length

        const healthy = machines.filter(
            (machine) => machine.status === 'Healthy'
        ).length

        return {
            needsMaintenance,
            underMaintenance,
            healthy,
        }
    }, [machines])
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        status: 'Healthy',
        maintenanceCost: '',
        lastMonthlyMaintenance: '',
        expectedFixDate: '',
        fixedDate: null,
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleAddMachine = () => {
        setFormData({
            id: `M${String(machines.length + 1).padStart(3, '0')}`,
            name: '',
            status: 'Healthy',
            maintenanceCost: '',
            lastMonthlyMaintenance: new Date().toISOString().split('T')[0],
            expectedFixDate: '',
            fixedDate: null,
        })
        setShowAddDialog(true)
    }

    const handleEditMachine = (machine) => {
        setEditingMachine(machine)
        setFormData(machine)
        setShowEditDialog(true)
    }

    const handleDeleteMachine = (machine) => {
        if (window.confirm('Are you sure you want to delete this machine?')) {
            setMachines((prev) => prev.filter((m) => m.id !== machine.id))
        }
    }

    const handleSubmitAdd = () => {
        setMachines((prev) => [...prev, formData])
        setShowAddDialog(false)
    }

    const handleSubmitEdit = () => {
        setMachines((prev) =>
            prev.map((machine) =>
                machine.id === editingMachine.id ? formData : machine
            )
        )
        setShowEditDialog(false)
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-8">
            <Header
                heading="Machine Maintenance Status"
                description="Manage and track machine maintenance records"
                buttonName="Add Machine"
                handleClick={handleAddMachine}
            />

            <button
                onClick={() => window.history.back()}
                className="mx-8 mb-8 flex items-center rounded-lg bg-white px-4 py-2 text-gray-700 shadow transition-all hover:bg-gray-50 hover:shadow-md"
            >
                <FaArrowLeft className="mr-2" />
                <span>Back</span>
            </button>

            <div className="px-4 md:px-8">
                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        icon={BsClock}
                        title="Needs Maintenance"
                        value={stats.needsMaintenance}
                        description="Last maintenance exceeded 50 days"
                        variant="red"
                    />
                    <StatCard
                        icon={BsTools}
                        title="Under Maintenance"
                        value={stats.underMaintenance}
                        description="Machines being serviced"
                        variant="yellow"
                    />
                    <StatCard
                        icon={BsCheckCircle}
                        title="Healthy Machines"
                        value={stats.healthy}
                        description="Machines in good condition"
                        variant="green"
                    />
                </div>

                <DataGridTable
                    data={machines}
                    columns={columns}
                    onUpdate={(row) =>
                        !row.status || row.status !== 'Approved'
                            ? handleEditMachine(row)
                            : null
                    }
                    onDelete={(row) =>
                        !row.status || row.status !== 'Approved'
                            ? handleDeleteMachine(row)
                            : null
                    }
                />
            </div>

            {/* Add Machine Dialog */}
            <DialogBox
                isOpen={showAddDialog}
                onClose={() => setShowAddDialog(false)}
                title="Add New Machine"
                handleSubmit={handleSubmitAdd}
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Machine Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Maintenance Cost
                        </label>
                        <input
                            type="number"
                            name="maintenanceCost"
                            value={formData.maintenanceCost}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Last Monthly Maintenance
                        </label>
                        <input
                            type="date"
                            name="lastMonthlyMaintenance"
                            value={formData.lastMonthlyMaintenance}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </DialogBox>

            {/* Edit Machine Dialog */}
            <DialogBox
                isOpen={showEditDialog}
                onClose={() => setShowEditDialog(false)}
                title="Edit Machine"
                handleSubmit={handleSubmitEdit}
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Machine Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="Healthy">Healthy</option>
                            <option value="Under Maintenance">
                                Under Maintenance
                            </option>
                            <option value="Fixed">Fixed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Maintenance Cost
                        </label>
                        <input
                            type="number"
                            name="maintenanceCost"
                            value={formData.maintenanceCost}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Last Monthly Maintenance
                        </label>
                        <input
                            type="date"
                            name="lastMonthlyMaintenance"
                            value={formData.lastMonthlyMaintenance}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </DialogBox>
        </div>
    )
}

export default MachineMaintenance
