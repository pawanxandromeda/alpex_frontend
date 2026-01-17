import React, { useState } from 'react'
import Header from '@components/Header'
import StatCard from '@components/StatCard'
import { BsInbox, BsExclamationCircle, BsCheckCircle } from 'react-icons/bs'
import { FaArrowLeft } from 'react-icons/fa'

const Enquiries = () => {
    const [enquiries, setEnquiries] = useState([
        {
            id: 1,
            date: '2025-03-28',
            name: 'Dr. Sarah Johnson',
            organization: 'Central Medical Center',
            email: 's.johnson@centralmed.org',
            phone: '(555) 123-4567',
            subject: 'Availability of Cardiomax-XR',
            status: 'Open',
            priority: 'High',
            message:
                "We're experiencing shortages of Cardiomax-XR 50mg tablets. When can we expect the next shipment? We have several cardiac patients who rely on this medication.",
        },
        {
            id: 2,
            date: '2025-03-25',
            name: 'James Wilson',
            organization: 'Westside Pharmacy',
            email: 'jwilson@westsidepharm.com',
            phone: '(555) 987-6543',
            subject: 'Discount program for Neuroxetine',
            status: 'Pending',
            priority: 'Medium',
            message:
                "I'd like more information about the patient assistance program for Neuroxetine. We have elderly customers who are finding it difficult to afford their monthly prescriptions.",
        },
        {
            id: 3,
            date: '2025-03-22',
            name: 'Prof. Michael Chang',
            organization: 'University Research Hospital',
            email: 'm.chang@urh.edu',
            phone: '(555) 234-5678',
            subject: 'Clinical trial participation',
            status: 'Closed',
            priority: 'Medium',
            message:
                'Our research department is interested in participating in the upcoming clinical trials for your new oncology treatment. Please provide details about how we can apply to be a trial site.',
        },
        {
            id: 4,
            date: '2025-03-20',
            name: 'Lisa Rodriguez, PharmD',
            organization: 'Healthcare Partners',
            email: 'lrodriguez@hcp.net',
            phone: '(555) 345-6789',
            subject: 'Side effects reporting for ImmunoBoost',
            status: 'Open',
            priority: 'High',
            message:
                "We've had three patients report unusual side effects after taking ImmunoBoost. I'd like to speak with your pharmacovigilance team to provide more details and determine if this requires formal reporting.",
        },
        {
            id: 5,
            date: '2025-03-15',
            name: 'Dr. Robert Williams',
            organization: 'Eastside Medical Group',
            email: 'r.williams@eastsidemed.com',
            phone: '(555) 456-7890',
            subject: 'Sample request for new antibiotic',
            status: 'Pending',
            priority: 'Low',
            message:
                'I would like to request samples of your newly approved antibiotic to evaluate its efficacy for my patients with complicated UTIs who have shown resistance to standard treatments.',
        },
    ])

    // Filter functionality
    const [statusFilter, setStatusFilter] = useState('All')
    const [priorityFilter, setPriorityFilter] = useState('All')

    const filteredEnquiries = enquiries.filter(
        (enquiry) =>
            (statusFilter === 'All' || enquiry.status === statusFilter) &&
            (priorityFilter === 'All' || enquiry.priority === priorityFilter)
    )

    // Status badge color mapping
    const getStatusColor = (status) => {
        switch (status) {
            case 'Open':
                return 'bg-green-100 text-green-800'
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'Closed':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-blue-100 text-blue-800'
        }
    }

    // Priority badge color mapping
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-800'
            case 'Medium':
                return 'bg-orange-100 text-orange-800'
            case 'Low':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header
                heading="Customer Enquiries"
                description="Manage and track customer inquiries and responses"
            />

            <button
                onClick={() => window.history.back()}
                className="mx-8 mb-8 flex items-center rounded-lg bg-white px-4 py-2 text-gray-700 shadow transition-all hover:bg-gray-50 hover:shadow-md"
            >
                <FaArrowLeft className="mr-2" />
                <span>Back</span>
            </button>

            {/* Summary stats */}
            <div className="px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        icon={BsInbox}
                        title="Open Enquiries"
                        value={
                            enquiries.filter((e) => e.status === 'Open').length
                        }
                        description="Active enquiries requiring attention"
                        variant="blue"
                    />
                    <StatCard
                        icon={BsExclamationCircle}
                        title="High Priority"
                        value={
                            enquiries.filter((e) => e.priority === 'High')
                                .length
                        }
                        description="Urgent enquiries needing immediate response"
                        variant="red"
                    />
                    <StatCard
                        icon={BsCheckCircle}
                        title="Response Rate"
                        value="92%"
                        description="Average response time within 24 hours"
                        variant="green"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="mx-8 my-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div>
                    <label
                        htmlFor="statusFilter"
                        className="mr-2 font-medium text-gray-700"
                    >
                        Status:
                    </label>
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded border border-gray-300 px-3 py-1"
                    >
                        <option value="All">All</option>
                        <option value="Open">Open</option>
                        <option value="Pending">Pending</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="priorityFilter"
                        className="mr-2 font-medium text-gray-700"
                    >
                        Priority:
                    </label>
                    <select
                        id="priorityFilter"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="rounded border border-gray-300 px-3 py-1"
                    >
                        <option value="All">All</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            {/* Enquiries List */}
            <div className="space-y-8 px-8 pb-8">
                {filteredEnquiries.length > 0 ? (
                    filteredEnquiries.map((enquiry) => (
                        <div
                            key={enquiry.id}
                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-md hover:shadow-lg"
                        >
                            <div className="mb-3 flex flex-wrap items-center justify-between">
                                <div className="mb-2 md:mb-0">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {enquiry.subject}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        From: {enquiry.name},{' '}
                                        {enquiry.organization}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(enquiry.status)}`}
                                    >
                                        {enquiry.status}
                                    </span>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(enquiry.priority)}`}
                                    >
                                        {enquiry.priority}
                                    </span>
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                                        {enquiry.date}
                                    </span>
                                </div>
                            </div>

                            <p className="mb-3 text-gray-700">
                                {enquiry.message}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center justify-between border-t border-gray-100 pt-3">
                                <div className="text-sm text-gray-600">
                                    <p>Email: {enquiry.email}</p>
                                    <p>Phone: {enquiry.phone}</p>
                                </div>
                                <div className="mt-2 md:mt-0">
                                    <button className="blue-button-custom">
                                        Respond
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-md">
                        <p className="text-gray-600">
                            No enquiries match your current filters.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Enquiries
