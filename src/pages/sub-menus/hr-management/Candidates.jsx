import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
    AiOutlineEye,
    AiOutlineUser,
    AiOutlineMail,
    AiOutlinePhone,
} from 'react-icons/ai'
import { MdPersonAdd, MdOutlineWork, MdOutlineSchool } from 'react-icons/md'
import { HiOutlineClipboardList, HiOutlineOfficeBuilding } from 'react-icons/hi'
import { FiPlus } from 'react-icons/fi'
import { BiCommentDetail } from 'react-icons/bi'
import CustomDeleteDialog from '@components/CustomDeleteDialog'
import DialogBox from '@components/DialogBox'
import CustomViewDialog from '@components/CustomViewDialog'
import DataGridTable from '@components/DataGridTable'

import axios from '@axios'
import Loading from '@loading'
import decryptData from '../../../utils/Decrypt'
import Header from '@components/Header'

const initialFormState = {
    name: '',
    department: '',
    highestQualification: '',
    degree: '',
    employmentHistory: '',
    salaryAsked: '',
    phone: '',
    email: '',
    interviewDate: '',
    status: '',
    comment: '',
}

function Candidates() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedCandidate, setSelectedCandidate] = useState(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [formData, setFormData] = useState(initialFormState)

    const validateField = (name, value) => {
        if (!value) {
            return 'This field is required'
        }

        switch (name) {
            case 'email':
                return !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
                    ? 'Please enter a valid email address'
                    : ''
            case 'phone':
                return !value.match(/^\+?[\d\s-]{10,}$/)
                    ? 'Please enter a valid phone number'
                    : ''
            case 'salaryAsked':
                const salary = Number(value)
                if (isNaN(salary)) {
                    return 'Please enter a valid number'
                }
                if (salary <= 0) {
                    return 'Salary must be greater than 0'
                }
                if (salary > 1000000000) {
                    // 1 billion limit
                    return 'Salary value is too high'
                }
                return ''
            case 'interviewDate':
                const date = new Date(value)
                if (isNaN(date.getTime())) {
                    return 'Please enter a valid date'
                }
                if (date < new Date()) {
                    return 'Interview date cannot be in the past'
                }
                return ''
            default:
                return ''
        }
    }

    const handleBlur = (e) => {
        const { name, value } = e.target
        setTouched({ ...touched, [name]: true })
        setErrors({
            ...errors,
            [name]: validateField(name, value),
        })
    }

    useEffect(() => {
        axios
            .get('candidate')
            .then((res) => {
                const decryptedData = decryptData(res.data)
                setData(decryptedData)

                setLoading(false)
            })
            .catch((err) => console.log(err.message))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate all required fields
        const fieldsToValidate = [
            'name',
            'department',
            'interviewDate',
            'salaryAsked',
            'highestQualification',
            'degree',
            'phone',
            'email',
            'status',
        ]

        const newErrors = {}
        fieldsToValidate.forEach((field) => {
            const validationError = validateField(field, formData[field])
            if (validationError) {
                newErrors[field] = validationError
            }
        })

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setTouched(
                fieldsToValidate.reduce(
                    (acc, field) => ({ ...acc, [field]: true }),
                    {}
                )
            )
            toast.error('Please fill all required fields correctly.')
            return
        }

        // Format the data according to schema
        const candidateData = {
            name: formData.name.trim(),
            department: formData.department.trim(),
            employmentHistory: formData.employmentHistory.trim(),
            interviewDate: new Date(formData.interviewDate).toISOString(),
            salaryAsked: Number(formData.salaryAsked),
            highestQualification: formData.highestQualification.trim(),
            degree: formData.degree.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim().toLowerCase(),
            status: formData.status,
            comment: formData.comment ? formData.comment.trim() : undefined,
        }

        try {
            if (isEditMode) {
                await axios.put(`candidate/${formData._id}`, candidateData)
                toast.success('Candidate updated successfully')
            } else {
                await axios.post('candidate', candidateData)
                toast.success('Candidate added successfully')
            }

            setFormData(initialFormState)
            setErrors({})
            setTouched({})
            setIsFormModalOpen(false)
            setIsEditMode(false)
            window.location.reload()
        } catch (err) {
            if (err.response?.data?.includes('duplicate key error')) {
                setErrors((prev) => ({
                    ...prev,
                    email: 'This email is already registered',
                }))
                setTouched((prev) => ({ ...prev, email: true }))
                toast.error('This email is already registered.')
            } else {
                toast.error('Failed to add candidate.')
                console.error(err)
            }
        }
    }

    const handleRowClick = (record) => {
        setSelectedCandidate(record)
        setIsViewModalOpen(true)
    }

    const filteredData = data

    const getStatusColor = (status) => {
        switch (status) {
            case 'shortlisted':
                return 'bg-blue-100 text-blue-800'
            case 'interviewed':
                return 'bg-yellow-100 text-yellow-800'
            case 'selected':
                return 'bg-green-100 text-green-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            case 'on-hold':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const handleUpdate = (row) => {
        setIsEditMode(true)
        setFormData({
            ...row,
            interviewDate: new Date(row.interviewDate)
                .toISOString()
                .split('T')[0],
        })
        setIsFormModalOpen(true)
    }

    const handleDelete = (row) => {
        setDeletingId(row._id)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`candidate/${deletingId}`)
            toast.success('Candidate deleted successfully.')
            window.location.reload()
        } catch (err) {
            toast.error('Failed to delete candidate.')
            console.error(err)
        } finally {
            setIsDeleteModalOpen(false)
            setDeletingId(null)
        }
    }

    const columns = [
        { field: 'name', header: 'Name' },
        { field: 'department', header: 'Department' },
        { field: 'email', header: 'Email' },
        { field: 'phone', header: 'Phone' },
        {
            field: 'interviewDate',
            header: 'Interview Date',
            renderCell: (value) => <>{new Date(value).toLocaleDateString()}</>,
        },
        {
            field: 'status',
            header: 'Status',
            renderCell: (value) => (
                <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(value)}`}
                >
                    {value}
                </span>
            ),
        },
    ]

    if (loading) return <Loading />

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-8">
            <Header
                heading="Potential Candidates"
                description="Add, modify, and manage"
                buttonName={
                    <>
                        <FiPlus /> &nbsp;Add New Candidate
                    </>
                }
                handleClick={() => {
                    setIsEditMode(false)
                    setFormData(initialFormState)
                    setIsFormModalOpen(true)
                }}
            />
            <div className="px-8">
                <DataGridTable
                    data={data}
                    columns={columns}
                    onView={handleRowClick}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />

                <CustomDeleteDialog
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false)
                        setDeletingId(null)
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Candidate"
                    message="Are you sure you want to delete this candidate? This action cannot be undone."
                />
            </div>

            {/* Add/Edit Modal */}
            <DialogBox
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false)
                    setFormData(initialFormState)
                    setErrors({})
                    setTouched({})
                }}
                title={isEditMode ? 'Update Candidate' : 'Add New Candidate'}
                handleSubmit={handleSubmit}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section transitions */}
                    <style jsx global>{`
                        .form-section {
                            transform-origin: top;
                            transition: all 300ms ease-in-out;
                        }
                        .form-section:hover {
                            transform: translateY(-2px);
                        }
                        .form-section + .form-section {
                            margin-top: 2rem;
                        }
                    `}</style>

                    {/* Personal Information */}
                    <div
                        className="form-section relative rounded-lg bg-gray-50/50 p-6"
                        role="group"
                        aria-labelledby="personal-info-heading"
                    >
                        <div className="absolute -top-3 right-6 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            Required Section
                        </div>
                        {errors.name && touched.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                        <div className="mb-4 flex items-center gap-2">
                            <AiOutlineUser className="h-5 w-5 text-primary" />
                            <h4
                                id="personal-info-heading"
                                className="text-lg font-medium text-gray-900"
                            >
                                Personal Information
                            </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
                                    <AiOutlineUser className="h-4 w-4 text-gray-400" />
                                    <span>Name</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 ${
                                        errors.name && touched.name
                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/40'
                                            : touched.name && !errors.name
                                              ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-500/40'
                                              : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500/40'
                                    }`}
                                    onBlur={handleBlur}
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter candidate's full name"
                                    required
                                    name="name"
                                />
                            </div>
                            <div>
                                <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
                                    <AiOutlineMail className="h-4 w-4 text-gray-400" />
                                    <span>Email</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className={`block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 ${
                                        errors.email && touched.email
                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/40'
                                            : touched.email && !errors.email
                                              ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-500/40'
                                              : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500/40'
                                    }`}
                                    onBlur={handleBlur}
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="candidate@example.com"
                                    required
                                />
                                {errors.email && touched.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
                                    <AiOutlinePhone className="h-4 w-4 text-gray-400" />
                                    <span>Phone</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className={`block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 ${
                                        errors.phone && touched.phone
                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/40'
                                            : touched.phone && !errors.phone
                                              ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-500/40'
                                              : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500/40'
                                    }`}
                                    onBlur={handleBlur}
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value,
                                        })
                                    }
                                    placeholder="+1 (555) 000-0000"
                                    required
                                />
                                {errors.phone && touched.phone && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Department & Interview Details */}
                    <div
                        className="form-section relative rounded-lg bg-gray-50/50 p-6"
                        role="group"
                        aria-labelledby="department-info-heading"
                    >
                        <div className="absolute -top-3 right-6 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            Required Section
                        </div>
                        <div className="mb-4 flex items-center gap-2">
                            <HiOutlineOfficeBuilding className="h-5 w-5 text-primary" />
                            <h4
                                id="department-info-heading"
                                className="text-lg font-medium text-gray-900"
                            >
                                Department & Interview Details
                            </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
                                    <HiOutlineOfficeBuilding className="h-4 w-4 text-gray-400" />
                                    <span>Department</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.department}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            department: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. Engineering, Sales, HR"
                                    required
                                    name="department"
                                    onBlur={handleBlur}
                                />
                                {errors.department && touched.department && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.department}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
                                    <HiOutlineClipboardList className="h-4 w-4 text-gray-400" />
                                    <span>Interview Date</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="interviewDate"
                                    className={`block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 ${
                                        errors.interviewDate &&
                                        touched.interviewDate
                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/40'
                                            : touched.interviewDate &&
                                                !errors.interviewDate
                                              ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-500/40'
                                              : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500/40'
                                    }`}
                                    onBlur={handleBlur}
                                    value={formData.interviewDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            interviewDate: e.target.value,
                                        })
                                    }
                                    required
                                />
                                {errors.interviewDate &&
                                    touched.interviewDate && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.interviewDate}
                                        </p>
                                    )}
                            </div>
                            <div>
                                <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
                                    <AiOutlineEye className="h-4 w-4 text-gray-400" />
                                    <span>Status</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    className={`block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 ${
                                        errors.status && touched.status
                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/40'
                                            : touched.status && !errors.status
                                              ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-500/40'
                                              : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500/40'
                                    }`}
                                    onBlur={handleBlur}
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            status: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="shortlisted">
                                        Shortlisted
                                    </option>
                                    <option value="interviewed">
                                        Interviewed
                                    </option>
                                    <option value="selected">Selected</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="on-hold">On Hold</option>
                                </select>
                                {errors.status && touched.status && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.status}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Educational Background */}
                    <div
                        className="form-section relative rounded-lg bg-gray-50/50 p-6"
                        role="group"
                        aria-labelledby="education-info-heading"
                    >
                        <div className="absolute -top-3 right-6 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            Required Section
                        </div>
                        <div className="mb-4 flex items-center gap-2">
                            <MdOutlineSchool className="h-5 w-5 text-primary" />
                            <h4
                                id="education-info-heading"
                                className="text-lg font-medium text-gray-900"
                            >
                                Educational Background
                            </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
                                    <MdOutlineSchool className="h-4 w-4 text-gray-400" />
                                    <span>Highest Qualification</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="highestQualification"
                                    className={`block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 ${
                                        errors.highestQualification &&
                                        touched.highestQualification
                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/40'
                                            : touched.highestQualification &&
                                                !errors.highestQualification
                                              ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-500/40'
                                              : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500/40'
                                    }`}
                                    onBlur={handleBlur}
                                    value={formData.highestQualification}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            highestQualification:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="e.g. Bachelor's, Master's, Ph.D."
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
                                    <MdOutlineSchool className="h-4 w-4 text-gray-400" />
                                    <span>Degree</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="degree"
                                    className={`block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 ${
                                        errors.degree && touched.degree
                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/40'
                                            : touched.degree && !errors.degree
                                              ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-500/40'
                                              : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500/40'
                                    }`}
                                    onBlur={handleBlur}
                                    value={formData.degree}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            degree: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. Computer Science, Business Administration"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    {/* Experience & Compensation */}
                    <div
                        className="form-section relative rounded-lg bg-gray-50/50 p-6"
                        role="group"
                        aria-labelledby="experience-info-heading"
                    >
                        <div className="absolute -top-3 right-6 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            Required Section
                        </div>
                        <div className="mb-4 flex items-center gap-2">
                            <MdOutlineWork className="h-5 w-5 text-primary" />
                            <h4
                                id="experience-info-heading"
                                className="text-lg font-medium text-gray-900"
                            >
                                Experience & Compensation
                            </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
                                    <MdOutlineWork className="h-4 w-4 text-gray-400" />
                                    <span>Employment History</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    rows={3}
                                    value={formData.employmentHistory}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            employmentHistory: e.target.value,
                                        })
                                    }
                                    placeholder="Brief description of previous work experience and roles"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
                                    <BiCommentDetail className="h-4 w-4 text-gray-400" />
                                    <span>Expected Salary</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="group flex">
                                    <div className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 transition-colors group-focus-within:border-blue-500 group-focus-within:bg-blue-50 group-focus-within:text-blue-600 group-hover:border-gray-400">
                                        ₹
                                    </div>
                                    <input
                                        type="number"
                                        className="block w-full rounded-r-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                        value={formData.salaryAsked}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                salaryAsked: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Comments */}
                    <div
                        className="form-section relative rounded-lg bg-gray-50/50 p-6"
                        role="group"
                        aria-labelledby="comments-heading"
                    >
                        <div className="mb-4 flex items-center gap-2">
                            <BiCommentDetail className="h-5 w-5 text-primary" />
                            <h4
                                id="comments-heading"
                                className="text-lg font-medium text-gray-900"
                            >
                                Additional Comments
                            </h4>
                        </div>
                        <div>
                            <textarea
                                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                rows={3}
                                value={formData.comment}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        comment: e.target.value,
                                    })
                                }
                                placeholder="Add any additional notes or comments about the candidate"
                            />
                        </div>
                    </div>
                </form>
            </DialogBox>

            {/* View Dialog */}
            <CustomViewDialog
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title={selectedCandidate?.name}
            >
                {selectedCandidate && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                                {selectedCandidate.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    {selectedCandidate.department}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Qualification
                                    </h4>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {selectedCandidate.highestQualification}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {selectedCandidate.degree}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Expected Salary
                                    </h4>
                                    <p className="mt-1 text-sm text-gray-900">
                                        ₹
                                        {selectedCandidate.salaryAsked.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Contact Information
                                    </h4>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {selectedCandidate.phone}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {selectedCandidate.email}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Interview Date
                                    </h4>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(
                                            selectedCandidate.interviewDate
                                        ).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Employment History
                                    </h4>
                                    <p className="mt-1 whitespace-pre-line text-sm text-gray-900">
                                        {selectedCandidate.employmentHistory}
                                    </p>
                                </div>
                                {selectedCandidate.comment && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">
                                            Comment
                                        </h4>
                                        <p className="mt-1 whitespace-pre-line text-sm text-gray-900">
                                            {selectedCandidate.comment}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </CustomViewDialog>
        </div>
    )
}

export default Candidates
