import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import decryptData from '../../utils/Decrypt'
import Header from '@components/Header'
import DialogBox from '@components/DialogBox'
import CustomDeleteDialog from '@components/CustomDeleteDialog'
import CustomApproveDialog from '@components/CustomApproveDialog'

import { FiSearch, FiTrash2, FiFilter, FiPlus, FiCheck } from 'react-icons/fi'
import { HiOutlineClipboardList } from 'react-icons/hi'

import axios from '@axios'
import Loading from '@loading'

function Todos() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('pending')

    const [showDialog, setShowDialog] = useState(false)
    const [showApproval, setShowApproval] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [approveId, setApproveId] = useState(null)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [newTodoTitle, setNewTodoTitle] = useState('')

    const username = localStorage.getItem('username')

  useEffect(() => {
  axios
    .get('todos', {
      params: { username },
    })
    .then((response) => {
      if (!response.data) {
        setData([])      // no todos yet
        setLoading(false)
        return
      }

      const decryptedData = decryptData(response.data)

      if (!decryptedData || !decryptedData.data) {
        // Either decryption failed or empty
        setData([])
        setLoading(false)
        return
      }

      setData(decryptedData.data)
      setLoading(false)
    })
    .catch((error) => {
      console.error(
        'Error fetching todos:',
        error.response ? error.response.data : error.message
      )
      setData([])
      setLoading(false)
    })
}, [])


    const handleDelete = () => {
        axios
            .delete(`todos/${deleteId}`)
            .then(() => {
                toast.success('Todo deleted successfully.', {
                    onClose: () => {
                        window.location.reload()
                    },
                    autoClose: 1000,
                })
            })
            .catch((err) => {
                toast.error('Failed to delete todo.')
                console.error(err)
            })
    }

    const finalApproval = () => {
        axios
            .put(`todos/${approveId}`)
            .then(() => {
                toast.success('Todo completed successfully.', {
                    onClose: () => {
                        window.location.reload()
                    },
                    autoClose: 1000,
                })
            })
            .catch((err) => {
                toast.error('Failed to complete todo.')
                console.error(err)
            })
    }

    const handleCreate = () => {
        axios
            .post('todos/create', {
                title: newTodoTitle,
                username: username,
            })
            .then(() => {
                toast.success('Todo created successfully.', {
                    onClose: () => {
                        window.location.reload()
                    },
                    autoClose: 1000,
                })
            })
            .catch((err) => {
                toast.error('Failed to create todo.')
                console.error(err)
            })
    }

    const filteredData = data.filter((todo) => {
        const matchesSearch = todo.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        if (statusFilter === 'all') return matchesSearch
        if (statusFilter === 'completed') return matchesSearch && todo.completed
        if (statusFilter === 'pending') return matchesSearch && !todo.completed
        return matchesSearch
    })

    if (loading) return <Loading />

    return (
        <div className="min-h-screen bg-gray-200">
            <Header
                heading="My Todos"
                description="Organize, track, and complete your tasks
                                efficiently ..."
                buttonName={
                    <>
                        <FiPlus className="mr-1" /> Add New Task
                    </>
                }
                handleClick={() => setShowCreateDialog(true)}
            />

            <div className="mx-auto max-w-full px-8">
                <div className="mb-8 rounded-md bg-white p-6 shadow-sm">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="relative max-w-md flex-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <FiSearch className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full rounded-md border border-gray-200 bg-gray-200 py-3 pl-10 pr-3 text-sm text-gray-700 placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="hidden text-sm font-medium text-gray-500 sm:inline-block">
                                Filter by:
                            </span>
                            <div className="inline-flex overflow-hidden rounded-md border border-gray-200 bg-white">
                                <button
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                                        statusFilter === 'all'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setStatusFilter('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                                        statusFilter === 'pending'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setStatusFilter('pending')}
                                >
                                    Pending
                                </button>
                                <button
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                                        statusFilter === 'completed'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setStatusFilter('completed')}
                                >
                                    Completed
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                        <div className="flex items-center space-x-2">
                            <FiFilter className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                                Applied Filter:{' '}
                                <span className="font-medium capitalize text-gray-700">
                                    {statusFilter}
                                </span>
                            </span>
                        </div>
                        <div className="text-sm text-gray-500">
                            Showing{' '}
                            <span className="font-medium text-gray-700">
                                {filteredData.length}
                            </span>{' '}
                            out of{' '}
                            <span className="font-medium text-gray-700">
                                {data.length}
                            </span>{' '}
                            tasks
                        </div>
                    </div>
                </div>

                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredData.map((todo, index) => (
                            <div
                                key={todo._id || index}
                                className="group relative flex flex-col overflow-hidden rounded-md bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                            >
                                <div className="absolute right-4 top-4">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            todo.completed
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-amber-100 text-amber-800'
                                        }`}
                                    >
                                        {todo.completed ? (
                                            <>Completed</>
                                        ) : (
                                            'In Progress'
                                        )}
                                    </span>
                                </div>

                                <div className="flex-1 p-5">
                                    <div className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Task #{index + 1}
                                    </div>

                                    <h3 className="mb-3 line-clamp-2 font-medium leading-snug text-gray-900">
                                        {todo.title}
                                    </h3>

                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                        <span>Created: </span>
                                        <time
                                            className="ml-1"
                                            dateTime={todo.createdAt}
                                        >
                                            {new Date(
                                                todo.createdAt
                                            ).toLocaleString('en-US', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </time>
                                    </div>
                                </div>

                                <div className="text flex items-center justify-between bg-blue-600 px-5 py-3">
                                    <span className="text-xs font-medium uppercase tracking-wider text-white">
                                        Actions
                                    </span>
                                    <div className="flex space-x-2">
                                        {!todo.completed && (
                                            <button
                                                onClick={() => {
                                                    setApproveId(todo._id)
                                                    setShowApproval(true)
                                                }}
                                                className="inline-flex items-center rounded-md bg-green-200 p-2 text-green-700 transition-colors hover:bg-green-100"
                                                aria-label="Complete task"
                                                title="Complete task"
                                            >
                                                <FiCheck className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                setDeleteId(todo._id)
                                                setShowDialog(true)
                                            }}
                                            className="inline-flex items-center rounded-md bg-red-200 p-2 text-red-700 transition-colors hover:bg-red-100"
                                            aria-label="Delete task"
                                            title="Delete task"
                                        >
                                            <FiTrash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-md bg-white py-16 text-center shadow-sm">
                        <HiOutlineClipboardList className="h-16 w-16 text-gray-300" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            No tasks found
                        </h3>
                        <p className="mt-2 max-w-md text-sm text-gray-500">
                            {searchQuery
                                ? `No tasks matching "${searchQuery}" in the ${statusFilter} category.`
                                : `You don't have any ${statusFilter} tasks. Try creating a new task or changing filters.`}
                        </p>
                        <button
                            onClick={() => setShowCreateDialog(true)}
                            className="mt-6 inline-flex items-center rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200"
                        >
                            <FiPlus className="mr-1 h-5 w-5" />
                            Create a new task
                        </button>
                    </div>
                )}
            </div>

            <DialogBox
                isOpen={showCreateDialog}
                onClose={() => {
                    setShowCreateDialog(false)
                    setNewTodoTitle('')
                }}
                title="Create New Task"
                handleSubmit={() => {
                    if (newTodoTitle.trim()) {
                        handleCreate()
                    }
                }}
            >
                <div className="relative">
                    <label
                        htmlFor="todo-title"
                        className="mb-2 block text-sm tracking-wide text-gray-500"
                    >
                        Task Title
                    </label>
                    <input
                        id="todo-title"
                        type="text"
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        placeholder="Enter a descriptive title for your task..."
                        className="w-full rounded-lg border-2 border-gray-200 bg-gray-50/50 px-5 py-2 text-gray-700 transition-all duration-300 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:outline-none"
                        aria-describedby="title-hint"
                    />
                    <p
                        id="title-hint"
                        className="mt-2.5 text-sm font-medium text-gray-500"
                    >
                        Be clear and specific about what needs to be done
                    </p>
                </div>
            </DialogBox>

            <CustomDeleteDialog
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                onConfirm={handleDelete}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
            />

            <CustomApproveDialog
                isOpen={showApproval}
                onClose={() => setShowApproval(false)}
                onConfirm={finalApproval}
                title="Complete Task"
                message="Are you sure you want to mark this task as completed?"
            />
        </div>
    )
}

export default Todos
