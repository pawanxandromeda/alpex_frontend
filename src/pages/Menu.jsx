import { Link, useNavigate } from 'react-router-dom'
import {
    ClipboardList,
    LineChart,
    Wrench,
    ArrowLeft,
    Code,
    BarChart,
    Inbox,
} from 'lucide-react'

const MenuPage = () => {
    const navigate = useNavigate()

    const handleGoBack = () => {
        navigate(-1)
    }

    const menuItems = [
        {
            to: '/creditor-list',
            icon: <Inbox size={24} />,
            title: 'Creditor List',
            description: 'Manage and view creditor information',
            color: 'bg-indigo-50 text-indigo-600',
        },
        {
            to: '/debtor-list',
            icon: <Inbox size={24} />,
            title: 'Debtor List',
            description: 'Manage and view debtor information',
            color: 'bg-cyan-50 text-cyan-600',
        },
        {
            to: '/monthly-sales',
            icon: <BarChart size={24} />,
            title: 'Monthly Sales Report',
            description: 'View monthly sales analytics',
            color: 'bg-emerald-50 text-emerald-600',
        },
        {
            to: '/sales-report',
            icon: <LineChart size={24} />,
            title: 'Sales Report',
            description: 'Detailed sales performance analysis',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            to: '/machine-maintenance',
            icon: <Wrench size={24} />,
            title: 'Machine Maintenance',
            description: 'Track equipment maintenance schedules',
            color: 'bg-amber-50 text-amber-600',
        },
        {
            to: '/enquiries',
            icon: <ClipboardList size={24} />,
            title: 'Enquiries Demo',
            description: 'Manage customer enquiries',
            color: 'bg-rose-50 text-rose-600',
        },
        {
            to: '/api-headers',
            icon: <Code size={24} />,
            title: 'API Headers',
            description: 'View and manage API configuration',
            color: 'bg-purple-50 text-purple-600',
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-6xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="mb-2 text-4xl font-bold text-gray-800">
                                Analytics Dashboard
                            </h1>
                            <p className="mb-10 text-gray-600">
                                Select a module to view detailed insights and
                                reports
                            </p>
                        </div>
                        <button
                            onClick={handleGoBack}
                            className="mb-6 flex items-center rounded-lg bg-white px-4 py-2 text-gray-700 shadow transition-all hover:bg-gray-50 hover:shadow-md"
                        >
                            <ArrowLeft size={18} className="mr-2" />
                            <span>Back</span>
                        </button>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.to}
                                className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gray-100 opacity-20 transition-transform group-hover:scale-150"></div>
                                <div
                                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-lg ${item.color}`}
                                >
                                    {item.icon}
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {item.description}
                                </p>
                                <div className="mt-4 flex items-center text-sm font-medium text-gray-500 group-hover:text-blue-600">
                                    View details
                                    <svg
                                        className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MenuPage
