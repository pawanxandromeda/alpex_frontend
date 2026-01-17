import { useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { toast } from 'react-toastify'
import { BiTime, BiSearch } from 'react-icons/bi'
import { FiX } from 'react-icons/fi'
import { BsBuilding, BsCheck, BsPencil, BsCheckAll } from 'react-icons/bs'
import { HiOutlineUserGroup } from 'react-icons/hi'

import axios from '@utils/Axios'
import Loading from '@loading'
import decryptData from '@utils/Decrypt'

import AttendanceRecord from '@components/AttendanceRecords'

function Attendance() {
    const [attendance, setAttendance] = useState([])
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false)
    const [isMarkAttendanceModalOpen, setIsMarkAttendanceModalOpen] =
        useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [remarks, setRemarks] = useState('')
    const [selectedEmployees, setSelectedEmployees] = useState({})
    const [selectAll, setSelectAll] = useState(false)
    const [isBulkMarking, setIsBulkMarking] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const [attendanceRes, employeesRes] = await Promise.all([
                axios.get('employee/attendance'),
                axios.get('/employees'),
            ])

            const decryptedAttendance = decryptData(attendanceRes.data)

            const todayRecords = decryptedAttendance.filter((record) => {
                const recordDate = new Date(record.createdAt)
                recordDate.setHours(0, 0, 0, 0)
                return recordDate.getTime() === today.getTime()
            })

            setAttendance(todayRecords)
            const decryptedEmployees = decryptData(employeesRes.data)
            setEmployees(decryptedEmployees)
            setLoading(false)
        } catch (error) {
            toast.error('Failed to load data')
            console.error(error)
            setLoading(false)
        }
    }

    const updateRemarks = async () => {
        try {
            await axios.put(`/attendance/${selectedRecord._id}`, {
                remarks: remarks,
            })
            toast.success('Remarks updated successfully')
            setIsRemarksModalOpen(false)
            fetchData()
        } catch (error) {
            toast.error('Failed to update remarks')
            console.error(error)
        }
    }

    const markAttendance = async () => {
        try {
            await axios.post('/attendance', {
                username: selectedEmployee.username,
                remarks: remarks || 'Present',
            })
            toast.success('Attendance marked successfully')
            setIsMarkAttendanceModalOpen(false)
            fetchData()
        } catch (error) {
            toast.error('Failed to mark attendance')
            console.error(error)
        }
    }

    const markBulkAttendance = async () => {
        try {
            setIsBulkMarking(true)
            const selectedIds = Object.keys(selectedEmployees).filter(
                (id) => selectedEmployees[id]
            )

            if (selectedIds.length === 0) {
                toast.info('No employees selected')
                return
            }

            const selectedEmps = employees.filter((emp) =>
                selectedIds.includes(emp._id)
            )

            const promises = selectedEmps.map((emp) =>
                axios.post('/attendance', {
                    username: emp.username,
                    remarks: 'Present',
                })
            )

            await Promise.all(promises)

            toast.success(`Marked ${selectedIds.length} employees as present`)
            setSelectedEmployees({})
            setSelectAll(false)
            fetchData()
        } catch (error) {
            toast.error('Failed to mark bulk attendance')
            console.error(error)
        } finally {
            setIsBulkMarking(false)
        }
    }

    const toggleSelectAll = (forceSelect) => {
        const newState =
            typeof forceSelect === 'boolean' ? forceSelect : !selectAll
        setSelectAll(newState)

        const newSelected = {}
        remainingEmployees.forEach((emp) => {
            newSelected[emp._id] = newState
        })
        setSelectedEmployees(newSelected)
    }

    const openRemarksModal = (record) => {
        setSelectedRecord(record)
        setRemarks(record.remarks)
        setIsRemarksModalOpen(true)
    }

    const openMarkAttendanceModal = (employee) => {
        setSelectedEmployee(employee)
        setRemarks('')
        setIsMarkAttendanceModalOpen(true)
    }

    const formatName = (name) => {
        return name
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    const getRemainingEmployees = () => {
        return employees.filter((emp) => {
            const isNotMarked = !attendance.some(
                (record) => record.username === emp.username
            )
            const matchesSearch = emp.username
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            return isNotMarked && matchesSearch
        })
    }

    if (loading) return <Loading />

    const remainingEmployees = getRemainingEmployees()
    const selectedCount =
        Object.values(selectedEmployees).filter(Boolean).length

    return (
        <div className="min-h-screen bg-gray-200">
            <AttendanceRecord />

            <div className="p-8">
                <section className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b px-4 py-3 md:px-6">
                        <h2 className="font-medium text-gray-800">
                            Mark Attendance
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                                {remainingEmployees.length} Remaining
                            </span>

                            {/* Add Select All button */}
                            {remainingEmployees.length > 0 && (
                                <button
                                    onClick={() => toggleSelectAll(true)}
                                    className="inline-flex items-center rounded-lg border border-blue-600 bg-white px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                                >
                                    <HiOutlineUserGroup className="mr-1 h-4 w-4" />
                                    Select All
                                </button>
                            )}

                            {/* Show bulk action button when employees are selected */}
                            {selectedCount > 0 && (
                                <button
                                    onClick={markBulkAttendance}
                                    disabled={isBulkMarking}
                                    className="inline-flex items-center rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-70"
                                >
                                    <BsCheckAll className="mr-1 h-4 w-4" />
                                    Mark {selectedCount} as Present
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-4 md:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="relative flex-1">
                                <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            {/* Keep existing checkbox for toggling */}
                            {remainingEmployees.length > 0 && (
                                <div className="ml-4 flex items-center">
                                    <label className="flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={() => toggleSelectAll()}
                                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-600">
                                            Select All
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>

                        {remainingEmployees.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {remainingEmployees.map((employee) => (
                                    <div
                                        key={employee._id}
                                        className="flex items-center justify-between py-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Add checkbox for each employee */}
                                            <input
                                                type="checkbox"
                                                checked={
                                                    !!selectedEmployees[
                                                        employee._id
                                                    ]
                                                }
                                                onChange={() => {
                                                    setSelectedEmployees(
                                                        (prev) => ({
                                                            ...prev,
                                                            [employee._id]:
                                                                !prev[
                                                                    employee._id
                                                                ],
                                                        })
                                                    )
                                                }}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />

                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                                {employee.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800">
                                                    {formatName(employee.name)}
                                                </div>
                                                <div className="mt-0.5 flex gap-3 text-xs text-gray-500">
                                                    <span className="flex items-center">
                                                        <BiTime className="mr-1 h-3.5 w-3.5" />
                                                        {employee.shiftType}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <BsBuilding className="mr-1 h-3.5 w-3.5" />
                                                        {employee.department}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                openMarkAttendanceModal(
                                                    employee
                                                )
                                            }
                                            className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                        >
                                            <BsCheck className="mr-1 h-4 w-4" />
                                            Mark Present
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-20 items-center justify-center text-sm text-gray-500">
                                All employees have been marked for attendance
                                today
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <Transition appear show={isRemarksModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => setIsRemarksModalOpen(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-xl transition-all">
                                    <div className="bg-blue-600 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <Dialog.Title className="flex items-center text-lg font-medium text-white">
                                                Edit Attendance Remarks
                                            </Dialog.Title>
                                            <button
                                                onClick={() =>
                                                    setIsRemarksModalOpen(false)
                                                }
                                                className="rounded-md bg-blue-900/20 p-1.5 text-blue-100 transition-colors hover:bg-blue-700/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                            >
                                                <FiX className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="px-6 py-5">
                                        <p className="mb-4 text-sm text-gray-600">
                                            Update remarks for{' '}
                                            {selectedRecord?.username}
                                        </p>

                                        <textarea
                                            value={remarks}
                                            onChange={(e) =>
                                                setRemarks(e.target.value)
                                            }
                                            className="w-full rounded-lg border-2 border-gray-200 bg-gray-50/50 px-5 py-3 text-gray-700 transition-all duration-300 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:outline-none"
                                            rows={4}
                                            placeholder="Enter remarks..."
                                        />

                                        <div className="mt-4 flex justify-end space-x-3">
                                            <button
                                                onClick={() =>
                                                    setIsRemarksModalOpen(false)
                                                }
                                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={updateRemarks}
                                                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isMarkAttendanceModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => setIsMarkAttendanceModalOpen(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-xl transition-all">
                                    <div className="bg-blue-600 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <Dialog.Title className="flex items-center text-lg font-medium text-white">
                                                Mark Attendance
                                            </Dialog.Title>
                                            <button
                                                onClick={() =>
                                                    setIsMarkAttendanceModalOpen(
                                                        false
                                                    )
                                                }
                                                className="rounded-md bg-blue-900/20 p-1.5 text-blue-100 transition-colors hover:bg-blue-700/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                            >
                                                <FiX className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="px-6 py-5">
                                        {selectedEmployee && (
                                            <div className="mb-5 flex items-center gap-3">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-600">
                                                    {selectedEmployee.username
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800">
                                                        {formatName(
                                                            selectedEmployee.username
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {
                                                            selectedEmployee.department
                                                        }{' '}
                                                        •{' '}
                                                        {
                                                            selectedEmployee.shiftType
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="relative">
                                            <label
                                                htmlFor="attendance-remarks"
                                                className="mb-2 block text-sm font-medium tracking-wide text-gray-500"
                                            >
                                                Remarks
                                            </label>
                                            <textarea
                                                id="attendance-remarks"
                                                value={remarks}
                                                onChange={(e) =>
                                                    setRemarks(e.target.value)
                                                }
                                                className="w-full rounded-lg border-2 border-gray-200 bg-gray-50/50 px-5 py-3 text-gray-700 transition-all duration-300 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:outline-none"
                                                rows={4}
                                                placeholder="Enter remarks (optional)..."
                                            />
                                        </div>

                                        <div className="mt-4 flex justify-end space-x-3">
                                            <button
                                                onClick={() =>
                                                    setIsMarkAttendanceModalOpen(
                                                        false
                                                    )
                                                }
                                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={markAttendance}
                                                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
                                            >
                                                Mark Present
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

export default Attendance
