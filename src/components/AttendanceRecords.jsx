import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
    FiSearch,
    FiUser,
    FiChevronLeft,
    FiChevronRight,
    FiEdit2,
} from 'react-icons/fi'
import { IoCalendarOutline } from 'react-icons/io5'

import Loading from '@loading'
import axios from '@axios'
import decryptData from '../utils/Decrypt'
import HolidayCalendar from '@components/HolidayCalendar'
import Header from '@components/Header'
import DialogBox from '@components/DialogBox'

function AttendanceRecord() {
    const [attendance, setAttendance] = useState([])
    const [employees, setEmployees] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [remarks, setRemarks] = useState('')
    const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false)
    const [searchUsername, setSearchUsername] = useState('')
    const [data, setData] = useState([])
    const [deduction, setDeduction] = useState(0)
    const [presentDays, setPresentDays] = useState(0)
    const [absentDays, setAbsentDays] = useState(0)
    const [warningDays, setWarningDays] = useState(0)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    )

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const getDaysInMonth = (year, month) =>
        new Date(year, month + 1, 0).getDate()

    const getFirstDayOfMonth = (year, month) =>
        new Date(year, month, 1).getDay()

    const getWorkingDaysInMonth = (year, month) => {
        const daysInMonth = getDaysInMonth(year, month)
        let workingDays = 0

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            if (date.getDay() !== 0) {
                // 0 is Sunday
                workingDays++
            }
        }

        return workingDays
    }

    const getMonthlyAttendance = (attendanceData, year, month) => {
        const monthlyRecords = attendanceData.filter((record) => {
            const recordDate = new Date(record.createdAt)
            return (
                recordDate.getFullYear() === year &&
                recordDate.getMonth() === month
            )
        })

        let presentCount = 0
        let warningCount = 0

        monthlyRecords.forEach((record) => {
            if (record.remarks === 'Present') {
                presentCount++
            } else if (record.remarks) {
                warningCount++
            }
        })

        const workingDays = getWorkingDaysInMonth(year, month)
        const absentCount = workingDays - (presentCount + warningCount)

        return {
            presentDays: presentCount,
            absentDays: Math.max(0, absentCount),
            warningDays: warningCount,
            totalDeduction: absentCount * 1000 + warningCount * 500,
        }
    }

    const handlePrevMonth = () => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() - 1)
            return newDate
        })
    }

    const handleNextMonth = () => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() + 1)
            return newDate
        })
    }

    const handleSubmit = () => {
        if (!searchUsername.trim()) {
            toast.error('Please enter a username', { autoClose: 2000 })
            return
        }

        axios
            .get(`/attendance/${searchUsername}`)
            .then((res) => {
                setData(res.data)
                toast.success('Attendance retrieved successfully', {
                    autoClose: 2000,
                })
            })
            .catch((err) => {
                console.error(err)
                toast.error('Failed to get attendance', { autoClose: 2000 })
            })
    }

    const handleCloseSearchDialog = () => {
        setSearchUsername('')
        setData([])
        setDeduction(0)
        setPresentDays(0)
        setAbsentDays(0)
        setWarningDays(0)
        setIsOpen(false)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employeesRes, attendanceRes] = await Promise.all([
                    axios.get('employees'),
                    axios.get('attendance'),
                ])

                setEmployees(decryptData(employeesRes.data))
                setAttendance(decryptData(attendanceRes.data))
                setLoading(false)
            } catch (err) {
                console.error('Error fetching data:', err)
                toast.error('Failed to load data')
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (data.length > 0) {
            const { presentDays, absentDays, warningDays, totalDeduction } =
                getMonthlyAttendance(
                    data,
                    currentDate.getFullYear(),
                    currentDate.getMonth()
                )

            setPresentDays(presentDays)
            setAbsentDays(absentDays)
            setWarningDays(warningDays)
            setDeduction(totalDeduction)
        }
    }, [data, currentDate])

    if (loading) return <Loading />

    const filteredAttendance = attendance.filter((record) =>
        selectedDate ? record.date.startsWith(selectedDate) : true
    )

    const attendanceMap = filteredAttendance.reduce((acc, record) => {
        acc[record.username] = record
        return acc
    }, {})

    const renderSearchContent = () => (
        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
                <div>
                    <label
                        htmlFor="username"
                        className="mb-2 block text-sm font-medium text-gray-500"
                    >
                        Enter Username *
                    </label>
                    <div className="relative">
                        <input
                            id="username"
                            type="text"
                            value={searchUsername}
                            onChange={(e) => setSearchUsername(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleSubmit()
                            }
                            className="w-full rounded-lg border-2 border-gray-200 bg-gray-50/50 px-5 py-2.5 pr-10 text-gray-700 transition-all duration-300 focus:border-indigo-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] focus:outline-none"
                            placeholder="e.g. john.doe"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                {data.length > 0 && (
                    <>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">
                                Statistics for {months[currentDate.getMonth()]}{' '}
                                {currentDate.getFullYear()}
                            </h3>
                            <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                                {getWorkingDaysInMonth(
                                    currentDate.getFullYear(),
                                    currentDate.getMonth()
                                )}{' '}
                                Working Days
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-xs font-medium text-emerald-600">
                                        Present Days
                                    </div>
                                    <div className="text-lg font-bold text-emerald-700">
                                        {presentDays}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-rose-600">
                                        Absent Days
                                    </div>
                                    <div className="text-lg font-bold text-rose-700">
                                        {absentDays}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-amber-600">
                                        Warning Days
                                    </div>
                                    <div className="text-lg font-bold text-amber-700">
                                        {warningDays}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 rounded-lg border border-rose-200 bg-rose-50 p-4">
                            <div className="flex items-baseline justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-medium text-rose-700">
                                        Total Deduction
                                    </div>
                                    <div className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-800">
                                        For Current Month
                                    </div>
                                </div>
                                <div className="text-lg font-bold text-rose-800">
                                    ₹{deduction}
                                </div>
                            </div>
                            <p className="text-xs text-rose-600">
                                Deductions: ₹1000 × {absentDays} absent days +
                                ₹500 × {warningDays} warning days
                            </p>
                        </div>
                    </>
                )}
            </div>

            <div>
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevMonth}
                            className="rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200"
                        >
                            <FiChevronLeft className="h-5 w-5" />
                        </button>
                        <h4 className="text-sm font-medium text-gray-900">
                            {months[currentDate.getMonth()]}{' '}
                            {currentDate.getFullYear()}
                        </h4>
                        <button
                            onClick={handleNextMonth}
                            className="rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200"
                        >
                            <FiChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    {searchUsername && (
                        <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-indigo-700/10">
                            @{searchUsername}
                        </div>
                    )}
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                {weekdays.map((day) => (
                                    <th
                                        key={day}
                                        className="border-b border-gray-200 p-2 text-center text-xs font-medium text-gray-500"
                                    >
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 6 }, (_, weekIndex) => {
                                const days = []
                                for (let i = 0; i < 7; i++) {
                                    const dayNumber =
                                        weekIndex * 7 +
                                        i -
                                        getFirstDayOfMonth(
                                            currentDate.getFullYear(),
                                            currentDate.getMonth()
                                        ) +
                                        1
                                    const isValidDay =
                                        dayNumber > 0 &&
                                        dayNumber <=
                                            getDaysInMonth(
                                                currentDate.getFullYear(),
                                                currentDate.getMonth()
                                            )
                                    const dateStr = isValidDay
                                        ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
                                        : ''

                                    const record = data.find(
                                        (item) =>
                                            new Date(item.createdAt)
                                                .toISOString()
                                                .split('T')[0] === dateStr
                                    )

                                    days.push(
                                        <td
                                            key={i}
                                            className="relative border-b border-r border-gray-200 p-0 last:border-r-0"
                                        >
                                            {isValidDay && (
                                                <div className="group relative aspect-square">
                                                    <div
                                                        className={`flex h-full w-full items-center justify-center transition-colors ${
                                                            record?.remarks
                                                                ? record.remarks ===
                                                                  'Present'
                                                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                                                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                                                        }`}
                                                    >
                                                        <span className="text-sm">
                                                            {dayNumber}
                                                        </span>
                                                    </div>
                                                    {record?.remarks && (
                                                        <div className="invisible absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg group-hover:visible">
                                                            {record.remarks}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    )
                                }
                                return (
                                    <tr
                                        key={weekIndex}
                                        className="last:border-b-0"
                                    >
                                        {days}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-200">
            <Header
                heading="Attendance Record"
                description="Manage employee attendance records ..."
                buttonName={
                    <>
                        <FiSearch className="mr-1" />
                        Search Attendance
                    </>
                }
                handleClick={() => setIsOpen(true)}
            />

            <div className="mx-auto flex max-w-full justify-end px-8 pt-6">
                <button
                    onClick={() => setIsHolidayDialogOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 ring-1 ring-indigo-700/10 transition-all duration-200 hover:bg-indigo-100"
                >
                    <IoCalendarOutline className="h-5 w-5" />
                    View Holiday Calendar
                </button>
            </div>

            <div className="mx-auto max-w-full p-8 pt-4">
                <main className="rounded-xl bg-white p-6 shadow-lg">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-semibold text-slate-800">
                            Attendance Records
                        </h2>
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="date-selector"
                                className="text-sm font-medium text-slate-700"
                            >
                                Filter by date:
                            </label>
                            <input
                                id="date-selector"
                                type="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {employees.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg border border-slate-200">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="bg-slate-100">
                                        <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-700">
                                            Employee
                                        </th>
                                        <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-700">
                                            Status
                                        </th>
                                        <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-700">
                                            Designation
                                        </th>
                                        <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-700">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {employees.map((employee, index) => (
                                        <tr
                                            key={employee.username || index}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700">
                                                        {employee.name
                                                            ?.charAt(0)
                                                            .toUpperCase() || (
                                                            <FiUser className="h-5 w-5" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800">
                                                            {employee.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            @{employee.username}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {attendanceMap[
                                                        employee.username
                                                    ] ? (
                                                        <>
                                                            <span
                                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                                    attendanceMap[
                                                                        employee
                                                                            .username
                                                                    ]
                                                                        .remarks ===
                                                                    'Present'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-yellow-100 text-yellow-800'
                                                                }`}
                                                            >
                                                                {attendanceMap[
                                                                    employee
                                                                        .username
                                                                ].remarks ===
                                                                'Present'
                                                                    ? 'Present'
                                                                    : 'Warning'}
                                                            </span>
                                                            {attendanceMap[
                                                                employee
                                                                    .username
                                                            ].remarks && (
                                                                <button
                                                                    onClick={() => {
                                                                        const record =
                                                                            attendanceMap[
                                                                                employee
                                                                                    .username
                                                                            ]
                                                                        setSelectedRecord(
                                                                            record
                                                                        )
                                                                        setRemarks(
                                                                            record.remarks
                                                                        )
                                                                        setShowEditDialog(
                                                                            true
                                                                        )
                                                                    }}
                                                                    className="rounded-full bg-indigo-50 p-1.5 text-indigo-600 hover:bg-indigo-100"
                                                                    title="Edit Remarks"
                                                                >
                                                                    <FiEdit2 className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800">
                                                            Absent
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-700">
                                                {employee.designation || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-500">
                                                {attendanceMap[
                                                    employee.username
                                                ]?.date || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
                            <p className="text-slate-500">No employees found</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Search Dialog */}
            <DialogBox
                isOpen={isOpen}
                onClose={handleCloseSearchDialog}
                title="Search Attendance Record"
                handleSubmit={handleSubmit}
            >
                {renderSearchContent()}
            </DialogBox>

            {/* Holiday Calendar Dialog */}
            <DialogBox
                isOpen={isHolidayDialogOpen}
                onClose={() => setIsHolidayDialogOpen(false)}
                title="Corporate Holiday Calendar"
                hideFooter={true}
            >
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-4 pb-6">
                    <HolidayCalendar />
                </div>
            </DialogBox>

            {/* Edit Remarks Dialog */}
            <DialogBox
                isOpen={showEditDialog}
                onClose={() => {
                    setShowEditDialog(false)
                    setSelectedRecord(null)
                    setRemarks('')
                }}
                title="Edit Remarks"
                handleSubmit={(e) => {
                    e.preventDefault()
                    if (!selectedRecord || !remarks) return

                    axios
                        .put(`attendance/${selectedRecord._id}`, { remarks })
                        .then(() => {
                            toast.success('Remarks updated successfully')
                            // Refresh attendance data
                            axios.get('attendance').then((res) => {
                                setAttendance(decryptData(res.data))
                            })
                            setShowEditDialog(false)
                            setSelectedRecord(null)
                            setRemarks('')
                        })
                        .catch((err) => {
                            console.error('Error updating remarks:', err)
                            toast.error('Failed to update remarks')
                        })
                }}
            >
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="remarks"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Remarks *
                        </label>
                        <input
                            id="remarks"
                            type="text"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="Enter remarks"
                        />
                    </div>
                </div>
            </DialogBox>
        </div>
    )
}

export default AttendanceRecord
