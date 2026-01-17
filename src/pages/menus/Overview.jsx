import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import DialogBox from '@components/DialogBox'
import { IoPeople } from 'react-icons/io5'
import { MdShoppingCart, MdInventory } from 'react-icons/md'
import {
    FaBoxOpen,
    FaClipboardList,
    FaUserFriends,
    FaShoppingBag,
    FaHistory,
    FaSearch,
    FaTimes,
    FaBell,
} from 'react-icons/fa'

import { FaChartLine } from 'react-icons/fa'

import Header from '@components/Header'
import Loading from '@loading'
import axios from '@axios'
import decryptData from '../../utils/Decrypt'

function Overview() {
    const [attendance, setAttendance] = useState([])
    const [employees, setEmployees] = useState([])
    const [logs, setLogs] = useState([])
    const [isViewAllOpen, setIsViewAllOpen] = useState(false)
    const [po, setPo] = useState(0)
    const [todos, setTodos] = useState(0)
    const [pendingTodos, setPendingTodos] = useState(0)
    const [raw, setRaw] = useState(0)
    const [packing, setPacking] = useState(0)
    const [customers, setCustomers] = useState(0)
    const [localPo, setLocalPo] = useState(0)
    const [loading, setLoading] = useState(true)
    const [filterText, setFilterText] = useState('')

    const navigate = useNavigate()
    const username = localStorage.getItem('username')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    employeesRes,
                    poRes,
                    todosRes,
                    rawRes,
                    packingRes,
                    customersRes,
                    localPoRes,
                    attendanceRes,
                    logsRes,
                ] = await Promise.all([
                    axios.get('employees'),
                    axios.get('po'),
                    axios.get('todos', { params: { username } }),
                    axios.get('raw'),
                    axios.get('packing'),
                    axios.get('customers'),
                    axios.get('polocal'),
                    axios.get('attendance'),
                    axios.get('api/logs'),
                ])

                const decryptedEmployees = decryptData(employeesRes.data)
                setEmployees(decryptedEmployees)

                setPo(poRes.data.length)

                const decryptedTodos = decryptData(todosRes.data)

                const pendingTodos = decryptedTodos.data.filter(
                    (todo) => todo.completed === false
                )
                setPendingTodos(pendingTodos.length)
                setTodos(decryptedTodos.data.length)

                const decryptedRaw = decryptData(rawRes.data)
                setRaw(decryptedRaw.length)

                const decryptedPacking = decryptData(packingRes.data)
                setPacking(decryptedPacking.length)

                const decryptedCustomers = decryptData(customersRes.data)
                setCustomers(decryptedCustomers.length)

                setLocalPo(localPoRes.data.length)

                const decryptedAttendance = decryptData(attendanceRes.data)
                setAttendance(decryptedAttendance)

                setLogs(decryptData(logsRes.data))
                setLoading(false)
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
                setLoading(false)
            }
        }

        fetchData()
    }, [username])

    function formatTimeAgo(date, currentDate) {
        const now = new Date(currentDate)
        const then = new Date(date)
        const diff = (now - then) / 1000

        if (diff < 60) return 'Just now'
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`

        return then.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    if (loading) return <Loading />

    const todayAttendance = attendance.filter(
        (a) => a.date === new Date().toISOString().split('T')[0]
    ).length
    const absentToday = employees.length - todayAttendance
    const attendanceRate =
        employees.length > 0
            ? Math.round((todayAttendance / employees.length) * 100)
            : 0

    return (
        <div className="min-h-screen bg-gray-100 pb-8 text-gray-900">
            <Header
                heading="Dashboard Overview"
                description="Overview of all activities"
            />

            <div className="px-4 md:px-8">
                {/* Navigation Buttons */}
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate('../menu')}
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-indigo-600 hover:to-indigo-700 hover:shadow-lg"
                    >
                        <FaChartLine className="h-4 w-4" />
                        Open Analytics Menu
                    </button>
                    <button
                        onClick={() => navigate('../po-summary')}
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg"
                    >
                        <MdShoppingCart className="h-4 w-4" />
                        PO Summary
                    </button>
                </div>

                {/* Dashboard summary */}
                <div className="mb-8">
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Welcome back, Admin!
                        </h2>
                        <div className="flex items-center gap-3">
                            <div
                                className="tooltip tooltip-left relative"
                                data-tip={`You have ${pendingTodos} pending tasks`}
                            >
                                <FaBell className="h-5 w-5 cursor-pointer text-gray-500 transition-colors hover:text-indigo-500" />
                                <span className="absolute -right-1 -top-1 flex h-4 w-4">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                                        {pendingTodos > 9 ? '9+' : pendingTodos}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-600">
                        Here&apos;s what&apos;s happening in your workspace
                        today.
                    </p>
                </div>

                {/* Main metrics cards - now with gradients and improved spacing */}
                <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Attendance"
                        value={`${attendanceRate}%`}
                        icon={<IoPeople className="h-6 w-6" />}
                        change={attendanceRate > 80 ? '+5%' : '-3%'}
                        trend={attendanceRate > 80 ? 'up' : 'down'}
                        details={[
                            { label: 'Present', value: todayAttendance },
                            { label: 'Absent', value: absentToday },
                        ]}
                        bgColor="from-blue-500 via-blue-600 to-blue-700"
                        action={() => navigate('../dashboard/customers')}
                        actionText="View Attendances"
                    />
                    <MetricCard
                        title="Tasks"
                        value={pendingTodos}
                        icon={<FaClipboardList className="h-6 w-6" />}
                        change="+2"
                        trend="up"
                        details={[
                            { label: 'Pending', value: pendingTodos },
                            { label: 'Total', value: todos },
                        ]}
                        bgColor="from-amber-500 via-amber-600 to-amber-700"
                        action={() => navigate('../dashboard/todos')}
                        actionText="View Tasks"
                    />
                    <MetricCard
                        title="Purchase Orders"
                        value={po}
                        icon={<MdShoppingCart className="h-6 w-6" />}
                        change={'+0'}
                        trend="neutral"
                        details={[
                            { label: 'International', value: po },
                            { label: 'Local', value: localPo },
                        ]}
                        bgColor="from-emerald-500 via-emerald-600 to-emerald-700"
                        action={() => navigate('../dashboard/po')}
                        actionText="View Orders"
                    />
                    <MetricCard
                        title="Customers"
                        value={customers}
                        icon={<FaUserFriends className="h-6 w-6" />}
                        change="+5"
                        trend="up"
                        details={[
                            {
                                label: 'Active',
                                value: Math.round(customers * 0.8),
                            },
                            {
                                label: 'New',
                                value: Math.round(customers * 0.1),
                            },
                        ]}
                        bgColor="from-violet-500 via-violet-600 to-violet-700"
                        action={() => navigate('../dashboard/customers')}
                        actionText="View Customers"
                    />
                </div>

                {/* Secondary stat cards - now with hover effects */}
                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Raw Materials"
                        value={raw}
                        icon={<MdInventory />}
                        color="blue"
                    />
                    <StatCard
                        title="Packing Materials"
                        value={packing}
                        icon={<FaBoxOpen />}
                        color="green"
                        action={() => navigate('../dashboard/packingmaterial')}
                    />
                    <StatCard
                        title="Local POs"
                        value={localPo}
                        icon={<FaShoppingBag />}
                        color="purple"
                    />
                    <StatCard
                        title="Employee Count"
                        value={employees.length}
                        icon={<FaUserFriends />}
                        color="amber"
                    />
                </div>

                {/* Recent Activity - now with improved search and animations */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
                    <div className="border-b border-gray-100 bg-gradient-to-br from-white to-gray-50">
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                                    <span className="inline-flex rounded-full bg-indigo-50 p-2 ring-4 ring-indigo-50">
                                        <FaHistory className="h-5 w-5 text-indigo-600" />
                                    </span>
                                    Recent Activity
                                </h2>
                                <div className="relative w-full sm:max-w-xs">
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 shadow-inner transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:shadow-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        placeholder="Search by username..."
                                        value={filterText}
                                        onChange={(e) =>
                                            setFilterText(e.target.value)
                                        }
                                    />
                                    <span className="absolute left-3 top-3 text-gray-400 transition-colors duration-200 group-focus-within:text-indigo-500">
                                        <FaSearch className="h-4 w-4" />
                                    </span>
                                    {filterText && (
                                        <button
                                            onClick={() => setFilterText('')}
                                            className="absolute right-3 top-3 rounded-full p-0.5 text-gray-400 transition-colors duration-200 hover:text-gray-600"
                                        >
                                            <FaTimes className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {logs.length > 0 ? (
                            <div className="space-y-1 p-4 sm:p-6">
                                {logs
                                    .filter((log) =>
                                        log.username
                                            .toLowerCase()
                                            .includes(filterText.toLowerCase())
                                    )
                                    .slice(0, 5) // Show only 5 most recent logs
                                    .map((log, index) => (
                                        <div
                                            key={index}
                                            className="group relative rounded-xl p-4 transition-all duration-200 hover:bg-slate-50 hover:shadow-md"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="relative">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-md shadow-indigo-200 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                                                        <span className="text-base font-semibold text-white">
                                                            {log.username[0].toUpperCase()}
                                                        </span>
                                                    </div>
                                                    {log.username ===
                                                        'arpitgoswami' &&
                                                        index ===
                                                            logs.findIndex(
                                                                (l) =>
                                                                    l.username ===
                                                                    'arpitgoswami'
                                                            ) && (
                                                            <span className="absolute -right-1 -top-1 flex h-4 w-4">
                                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                                                <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500"></span>
                                                            </span>
                                                        )}
                                                </div>

                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between gap-x-2">
                                                        <div className="flex items-center gap-x-2">
                                                            <p className="font-medium text-gray-900">
                                                                {log.username}
                                                            </p>
                                                            {log.username ===
                                                                'arpitgoswami' && (
                                                                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-2 ring-indigo-50">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <time
                                                            className="whitespace-nowrap text-sm font-medium text-gray-400"
                                                            dateTime={
                                                                log.createdAt
                                                            }
                                                            title={new Date(
                                                                log.createdAt
                                                            ).toLocaleString()}
                                                        >
                                                            {formatTimeAgo(
                                                                log.createdAt,
                                                                '2025-03-15 11:14:57'
                                                            )}
                                                        </time>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                                                        {log.action}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                {logs.length > 5 && (
                                    <div>
                                        <button
                                            onClick={() =>
                                                setIsViewAllOpen(true)
                                            }
                                            className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                                        >
                                            View All Activity
                                        </button>
                                    </div>
                                )}

                                <DialogBox
                                    isOpen={isViewAllOpen}
                                    onClose={() => setIsViewAllOpen(false)}
                                    title="All Activities"
                                    hideFooter={true}
                                >
                                    <div className="max-h-[70vh] overflow-y-auto">
                                        <div className="space-y-1">
                                            {logs
                                                .filter((log) =>
                                                    log.username
                                                        .toLowerCase()
                                                        .includes(
                                                            filterText.toLowerCase()
                                                        )
                                                )
                                                .map((log, index) => (
                                                    <div
                                                        key={index}
                                                        className="group relative rounded-xl p-4 transition-all duration-200 hover:bg-slate-50 hover:shadow-md"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="relative">
                                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-md shadow-indigo-200 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                                                                    <span className="text-base font-semibold text-white">
                                                                        {log.username[0].toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                {log.username ===
                                                                    'arpitgoswami' &&
                                                                    index ===
                                                                        logs.findIndex(
                                                                            (
                                                                                l
                                                                            ) =>
                                                                                l.username ===
                                                                                'arpitgoswami'
                                                                        ) && (
                                                                        <span className="absolute -right-1 -top-1 flex h-4 w-4">
                                                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                                                            <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500"></span>
                                                                        </span>
                                                                    )}
                                                            </div>

                                                            <div className="flex-1 space-y-1">
                                                                <div className="flex items-center justify-between gap-x-2">
                                                                    <div className="flex items-center gap-x-2">
                                                                        <p className="font-medium text-gray-900">
                                                                            {
                                                                                log.username
                                                                            }
                                                                        </p>
                                                                        {log.username ===
                                                                            'arpitgoswami' && (
                                                                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-2 ring-indigo-50">
                                                                                You
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <time
                                                                        className="whitespace-nowrap text-sm font-medium text-gray-400"
                                                                        dateTime={
                                                                            log.createdAt
                                                                        }
                                                                        title={new Date(
                                                                            log.createdAt
                                                                        ).toLocaleString()}
                                                                    >
                                                                        {formatTimeAgo(
                                                                            log.createdAt,
                                                                            '2025-03-15 11:14:57'
                                                                        )}
                                                                    </time>
                                                                </div>
                                                                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                                                                    {log.action}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </DialogBox>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <FaHistory className="mb-3 h-12 w-12 text-gray-300" />
                                <p className="text-lg font-medium">
                                    No activity logs found
                                </p>
                                <p className="text-sm">
                                    Recent actions will appear here
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function MetricCard({
    title,
    value,
    icon,
    details,
    bgColor,
    action,
    actionText,
}) {
    return (
        <div className="group overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className={`bg-gradient-to-br ${bgColor} p-6`}>
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                        {title}
                    </h3>
                    <div className="rounded-lg bg-white/20 p-2.5 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        {icon}
                    </div>
                </div>
                <div className="mt-3">
                    <div className="text-3xl font-bold text-white">{value}</div>
                </div>
            </div>
            <div className="bg-white p-5">
                {details && details.length > 0 && (
                    <div className="grid grid-cols-2 gap-6">
                        {details.map((detail, index) => (
                            <div key={index} className="text-center">
                                <div className="text-sm font-medium text-gray-500">
                                    {detail.label}
                                </div>
                                <div className="mt-1 text-lg font-bold text-gray-900">
                                    {detail.value}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {action && actionText && (
                    <button
                        onClick={action}
                        className="mt-4 w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    >
                        {actionText}
                    </button>
                )}
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, color, action }) {
    const colors = {
        blue: {
            bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
            shadow: 'shadow-blue-200',
            ringHover: 'group-hover:ring-blue-500/20',
        },
        green: {
            bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            shadow: 'shadow-emerald-200',
            ringHover: 'group-hover:ring-emerald-500/20',
        },
        purple: {
            bg: 'bg-gradient-to-br from-violet-500 to-violet-600',
            shadow: 'shadow-violet-200',
            ringHover: 'group-hover:ring-violet-500/20',
        },
        amber: {
            bg: 'bg-gradient-to-br from-amber-500 to-amber-600',
            shadow: 'shadow-amber-200',
            ringHover: 'group-hover:ring-amber-500/20',
        },
    }

    return (
        <div
            onClick={action}
            className={`group flex items-center justify-between rounded-xl bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-offset-2 ${
                colors[color].ringHover
            } ${action ? 'cursor-pointer' : ''}`}
        >
            <div>
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900">
                    {value}
                </p>
            </div>
            <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${
                    colors[color].shadow
                } ${
                    colors[color].bg
                } shadow-lg transition-transform duration-300 group-hover:scale-110`}
            >
                <span className="text-2xl text-white">{icon}</span>
            </div>
        </div>
    )
}

MetricCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.element.isRequired,
    details: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
        })
    ),
    bgColor: PropTypes.string.isRequired,
    action: PropTypes.func,
    actionText: PropTypes.string,
}

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.element.isRequired,
    color: PropTypes.oneOf(['blue', 'green', 'purple', 'amber']).isRequired,
    action: PropTypes.func,
}

export default Overview
