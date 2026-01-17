import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MdCreate } from 'react-icons/md'
import { FiPlus } from 'react-icons/fi'
import { HiOutlineClipboardList, HiOutlineExternalLink } from 'react-icons/hi'

import axios from '@axios'
import Loading from '@loading'
import decryptData from '../../../utils/Decrypt'

import DataGridTable from '@components/DataGridTable'
import Header from '@components/Header'
import DialogBox from '@components/DialogBox'
import CustomDeleteDialog from '@components/CustomDeleteDialog'
import CustomViewDialog from '@components/CustomViewDialog'
import UpdatePasswordDialog from '@components/UpdatePasswordDialog'

function Employees() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(null)

    const [viewingEmployee, setViewingEmployee] = useState(null)

    const [editingId, setEditingId] = useState(null)
    const [deletingId, setDeletingId] = useState(null)

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        authorization: '',
        joiningDate: '',
        status: '',
        name: '',
        designation: '',
        department: '',
        ctc: '',
        pf: '',
        esic: '',
        shiftType: '',
        resume: '',
    })

    const handleFileUpload = (file) => {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file selected'))
                return
            }

            const reader = new FileReader()
            reader.onload = () => {
                const base64String = reader.result
                resolve(base64String)
            }
            reader.onerror = (error) => {
                console.error('Error reading file:', error)
                reject(error)
            }
            reader.readAsDataURL(file)
        })
    }

    const auth = [
        'admin',
        'designer',
        'accounts',
        'qa',
        'qc',
        'sales',
        'store',
        'production',
        'hr',
        'ppic',
    ]

    const handleUpdate = (row) => {
        setFormData(row)
        setEditingId(row._id)
        setIsModalOpen(true)
    }

    const handleView = (row) => {
        setViewingEmployee(row)
        setIsViewModalOpen(true)
    }

    useEffect(() => {
        axios.get('/employees').then((response) => {
            setData(decryptData(response.data))
            setLoading(false)
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (editingId) {
            axios
                .put(`employees/${editingId}`, formData)
                .then(() => {
                    toast.success('Employee updated successfully.', {
                        onClose: () => {
                            window.location.reload()
                        },
                        autoClose: 1000,
                    })
                })
                .catch((err) => {
                    toast.error('Failed to update employee.')
                    console.error(err)
                })
        } else {
            axios
                .post('employees', formData)
                .then(() => {
                    toast.success('Employee added successfully.', {
                        onClose: () => {
                            window.location.reload()
                        },
                        autoClose: 1000,
                    })
                })
                .catch((err) => {
                    toast.error('Failed to add employee.')
                    console.error(err)
                })
        }
    }

    const handleDelete2 = (row) => {
        setDeletingId(row._id)
        setIsDeleteModalOpen(true)
    }

    const handleDelete = () => {
        axios
            .delete(`employees/${deletingId}`)
            .then(() => {
                toast.success('Employee deleted successfully.', {
                    onClose: () => {
                        window.location.reload()
                    },
                    autoClose: 1000,
                })
            })
            .catch((err) => {
                toast.error('Failed to delete employee.')
                console.error(err)
            })
    }

    if (loading) return <Loading />

    const handlePasswordUpdate = async (newPassword) => {
        try {
            await axios.put(`employees/${selectedUserId}`, {
                password: newPassword,
            })
            toast.success('Password updated successfully.', {
                autoClose: 1000,
            })
            setIsPasswordModalOpen(false)
        } catch (err) {
            toast.error('Failed to update password.')
            console.error(err)
        }
    }

    const columns = [
        { field: 'name', header: 'Name' },
        { field: 'authorization', header: 'Authorization' },
        {
            field: 'ctc',
            header: 'Salary',
            renderCell: (value) => {
                return <>{isVisible ? value : '******'}</>
            },
        },
        {
            field: 'username',
            header: 'Username',
            renderCell: (value) => (
                <span
                    className={
                        value === 'Developer'
                            ? 'rounded bg-blue-100 px-2 py-1 text-blue-800'
                            : value === 'Designer'
                              ? 'rounded bg-green-100 px-2 py-1 text-green-800'
                              : 'rounded bg-yellow-100 px-2 py-1 text-yellow-800'
                    }
                >
                    {value}
                </span>
            ),
        },
    ]

    return (
        <div className="min-h-screen bg-gray-100 pb-8">
            <Header
                heading="Employees List"
                description="Add, Manage, Update or Delete Employees"
                buttonName={
                    <>
                        <FiPlus /> &nbsp;Add New Employee
                    </>
                }
                handleClick={() => setIsModalOpen(true)}
            />

            <div>
                <button
                    className="blue-button-custom mx-8 mb-8"
                    onClick={() => setIsVisible(!isVisible)}
                >
                    {!isVisible ? 'Show Salaries' : 'Hide Salaries'}
                </button>
            </div>

            <div>
                <div className="mx-8">
                    <DataGridTable
                        data={data}
                        columns={columns}
                        onDelete={handleDelete2}
                        onView={handleView}
                        onUpdate={handleUpdate}
                        onPasswordChange={(row) => {
                            setSelectedUserId(row._id)
                            setIsPasswordModalOpen(true)
                        }}
                    />
                </div>

                <DialogBox
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setEditingId(null)
                        setFormData({
                            username: '',
                            password: '',
                            authorization: '',
                            joiningDate: '',
                            status: '',
                            name: '',
                            designation: '',
                            department: '',
                            ctc: '',
                            pf: '',
                            esic: '',
                            shiftType: '',
                            resume: '',
                        })
                    }}
                    title={
                        <div className="flex items-center gap-2">
                            <MdCreate className="h-6 w-6" />
                            {editingId ? 'Edit Employee' : 'Create Employee'}
                        </div>
                    }
                    handleSubmit={handleSubmit}
                >
                    <form className="space-y-6">
                        <div className="rounded-lg bg-gray-50/50 p-6">
                            <h4 className="mb-4 text-lg font-medium text-gray-900">
                                Account Information
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Username{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                username: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                {!editingId && (
                                    <div className="form-control">
                                        <label className="mb-2 block text-sm font-medium text-gray-900">
                                            Password{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    password: e.target.value,
                                                })
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50/50 p-6">
                            <h4 className="mb-4 text-lg font-medium text-gray-900">
                                Personal Information
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Full Name{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Designation{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Designation"
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.designation}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                designation: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Department{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Department"
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.department}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                department: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Joining Date{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={
                                            formData.joiningDate?.split('T')[0]
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                joiningDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Status{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                status: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50/50 p-6">
                            <h4 className="mb-4 text-lg font-medium text-gray-900">
                                Authorization
                            </h4>
                            <div className="grid grid-cols-4 gap-4">
                                {auth.map((role) => (
                                    <label
                                        key={role}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500"
                                            value={role}
                                            checked={formData.authorization
                                                .split(' ')
                                                .includes(role)}
                                            onChange={(e) => {
                                                let updatedAuth =
                                                    formData.authorization
                                                        ? formData.authorization.split(
                                                              ' '
                                                          )
                                                        : []

                                                if (e.target.checked) {
                                                    updatedAuth.push(role)
                                                } else {
                                                    updatedAuth =
                                                        updatedAuth.filter(
                                                            (auth) =>
                                                                auth !== role
                                                        )
                                                }

                                                setFormData({
                                                    ...formData,
                                                    authorization:
                                                        updatedAuth.join(' '),
                                                })
                                            }}
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            {role.charAt(0).toUpperCase() +
                                                role.slice(1)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50/50 p-6">
                            <h4 className="mb-4 text-lg font-medium text-gray-900">
                                Salary Details
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        CTC{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="CTC"
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.ctc}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                ctc: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        PF{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="PF"
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.pf}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                pf: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        ESIC{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ESIC"
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.esic}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                esic: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Shift Type{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.shiftType}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                shiftType: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">
                                            Select Shift Type
                                        </option>
                                        <option value="Day">Day</option>
                                        <option value="Night">Night</option>
                                        <option value="Rotational">
                                            Rotational
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg bg-gray-50/50 p-6">
                            <h4 className="mb-4 text-lg font-medium text-gray-900">
                                Resume
                            </h4>
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Upload Resume (PDF only)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        onChange={async (e) => {
                                            const file = e.target.files[0]
                                            if (file) {
                                                const url =
                                                    await handleFileUpload(file)
                                                if (url) {
                                                    setFormData({
                                                        ...formData,
                                                        resume: url,
                                                    })
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogBox>

                <CustomDeleteDialog
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                    title="Delete Employee"
                    message="Are you sure you want to delete this employee? This action cannot be undone."
                />

                <CustomViewDialog
                    isOpen={isViewModalOpen}
                    onClose={() => {
                        setIsViewModalOpen(false)
                        setViewingEmployee(null)
                    }}
                    title={
                        <div className="flex items-center gap-2">
                            <HiOutlineClipboardList className="h-6 w-6" />
                            Employee Details
                        </div>
                    }
                >
                    {viewingEmployee && (
                        <>
                            <div className="space-y-8">
                                <div className="relative rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                                    <div className="flex items-start gap-6">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-3xl font-bold backdrop-blur-sm">
                                            {viewingEmployee.username
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold">
                                                {viewingEmployee.username
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    viewingEmployee.username.slice(
                                                        1
                                                    )}
                                            </h3>
                                            <p className="text-lg text-blue-100">
                                                {viewingEmployee.designation}
                                            </p>
                                            <div className="mt-3 flex items-center gap-3">
                                                <span className="inline-flex items-center rounded-full border border-white/30 px-2.5 py-0.5 text-sm">
                                                    {viewingEmployee.department}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm ${
                                                        viewingEmployee.status ===
                                                        'Active'
                                                            ? 'bg-green-400/20 text-green-100'
                                                            : 'bg-red-400/20 text-red-100'
                                                    }`}
                                                >
                                                    {viewingEmployee.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="rounded-xl bg-gray-50/50 p-6 shadow-sm">
                                        <h4 className="mb-4 text-base font-semibold text-gray-700">
                                            Account Information
                                        </h4>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    Username
                                                </p>
                                                <p className="mt-1 text-lg font-medium text-gray-900">
                                                    {viewingEmployee.username}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    Authorization
                                                </p>
                                                <p className="mt-1 text-lg font-medium text-gray-900">
                                                    {viewingEmployee.authorization
                                                        .split(' ')
                                                        .map(
                                                            (auth) =>
                                                                auth
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                auth.slice(1)
                                                        )
                                                        .join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-gray-50/50 p-6 shadow-sm">
                                        <h4 className="mb-4 text-base font-semibold text-gray-700">
                                            Work Details
                                        </h4>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    Department
                                                </p>
                                                <p className="mt-1 text-lg font-medium text-gray-900">
                                                    {viewingEmployee.department}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    Shift Type
                                                </p>
                                                <p className="mt-1 text-lg font-medium text-gray-900">
                                                    {viewingEmployee.shiftType}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    Joining Date
                                                </p>
                                                <p className="mt-1 text-lg font-medium text-gray-900">
                                                    {new Date(
                                                        viewingEmployee.joiningDate
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {viewingEmployee.resume && (
                                    <div className="rounded-xl bg-gray-50/50 p-6 shadow-sm">
                                        <h4 className="mb-4 text-base font-semibold text-gray-700">
                                            Resume
                                        </h4>
                                        <object
                                            data={viewingEmployee.resume}
                                            type="application/pdf"
                                            className="h-[500px] w-full rounded-lg border border-gray-200"
                                        >
                                            <p>
                                                Unable to display PDF file.{' '}
                                                <a
                                                    href={
                                                        viewingEmployee.resume
                                                    }
                                                    download="resume.pdf"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Download
                                                </a>{' '}
                                                instead.
                                            </p>
                                        </object>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </CustomViewDialog>
            </div>

            <UpdatePasswordDialog
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onUpdate={handlePasswordUpdate}
            />
        </div>
    )
}

export default Employees
