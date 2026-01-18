import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import decryptData from '../../utils/Decrypt'
import Header from '@components/Header'
import DialogBox from '@components/DialogBox'
import CustomDeleteDialog from '@components/CustomDeleteDialog'
import CustomApproveDialog from '@components/CustomApproveDialog'

import { 
  FiSearch, 
  FiTrash2, 
  FiFilter, 
  FiPlus, 
  FiCheck, 
  FiUser,
  FiCalendar,
  FiFlag,
  FiEye,
  FiEyeOff
} from 'react-icons/fi'
import { HiOutlineClipboardList } from 'react-icons/hi'

import axios from '@axios'
import Loading from '@loading'

function Todos() {
    const [data, setData] = useState([])
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('pending')
    const [viewType, setViewType] = useState('created') // 'created' or 'assigned'

    const [showDialog, setShowDialog] = useState(false)
    const [showApproval, setShowApproval] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [approveId, setApproveId] = useState(null)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    
    const [newTodo, setNewTodo] = useState({
        title: '',
        description: '',
        assignedToUsername: '',
        priority: 'Medium',
        dueDate: ''
    })

    const username = localStorage.getItem('username')

    useEffect(() => {
        fetchTodos()
        fetchEmployees()
    }, [viewType])

    const fetchTodos = () => {
        setLoading(true)
        axios
            .get('todos', {
                params: { 
                    username,
                    role: viewType === 'assigned' ? 'assigned' : undefined
                },
            })
            .then((response) => {
                if (!response.data) {
                    setData([])
                    setLoading(false)
                    return
                }

                const decryptedData = decryptData(response.data)

                if (!decryptedData || !decryptedData.data) {
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
    }

    const fetchEmployees = () => {
        axios
            .get('todos/employees')
            .then((response) => {
                const decryptedData = decryptData(response.data)
                if (decryptedData?.data) {
                    setEmployees(decryptedData.data)
                }
            })
            .catch((error) => {
                console.error('Error fetching employees:', error)
            })
    }

    const handleDelete = () => {
        axios
            .delete(`todos/${deleteId}`)
            .then(() => {
                toast.success('Todo deleted successfully.', {
                    onClose: () => {
                        fetchTodos()
                    },
                    autoClose: 1000,
                })
                setShowDialog(false)
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
                        fetchTodos()
                    },
                    autoClose: 1000,
                })
                setShowApproval(false)
            })
            .catch((err) => {
                toast.error('Failed to complete todo.')
                console.error(err)
            })
    }

    const handleCreate = () => {
        if (!newTodo.title.trim()) {
            toast.error('Please enter a title for the task.')
            return
        }

        axios
            .post('todos/create', {
                title: newTodo.title,
                description: newTodo.description,
                createdByUsername: username,
                assignedToUsername: newTodo.assignedToUsername || null,
                priority: newTodo.priority,
                dueDate: newTodo.dueDate || null
            })
            .then(() => {
                toast.success('Todo created successfully.', {
                    onClose: () => {
                        fetchTodos()
                        setShowCreateDialog(false)
                        setNewTodo({
                            title: '',
                            description: '',
                            assignedToUsername: '',
                            priority: 'Medium',
                            dueDate: ''
                        })
                    },
                    autoClose: 1000,
                })
            })
            .catch((err) => {
                toast.error('Failed to create todo.')
                console.error(err)
            })
    }

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'Low': return 'bg-blue-100 text-blue-800'
            case 'Medium': return 'bg-yellow-100 text-yellow-800'
            case 'High': return 'bg-orange-100 text-orange-800'
            case 'Urgent': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const filteredData = data.filter((todo) => {
        const matchesSearch = todo.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
            (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()))
        
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
                description="Organize, track, and assign tasks efficiently..."
                buttonName={
                    <>
                        <FiPlus className="mr-1" /> Add New Task
                    </>
                }
                handleClick={() => setShowCreateDialog(true)}
            />

            <div className="mx-auto max-w-full px-8">
                {/* View Type Toggle */}
                <div className="mb-6 flex space-x-4">
                    <button
                        className={`flex items-center rounded-lg px-4 py-2 font-medium transition-colors ${
                            viewType === 'created' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setViewType('created')}
                    >
                        <FiEye className="mr-2" />
                        Tasks I Created
                    </button>
                    <button
                        className={`flex items-center rounded-lg px-4 py-2 font-medium transition-colors ${
                            viewType === 'assigned' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setViewType('assigned')}
                    >
                        <FiEyeOff className="mr-2" />
                        Tasks Assigned to Me
                    </button>
                </div>

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

                        <div className="flex items-center space-x-4">
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
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                        <div className="flex items-center space-x-2">
                            <FiFilter className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                                Viewing: <span className="font-medium capitalize text-gray-700">{viewType}</span> | 
                                Filter: <span className="font-medium capitalize text-gray-700">{statusFilter}</span>
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
                                key={todo.id || index}
                                className="group relative flex flex-col overflow-hidden rounded-md bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                            >
                                <div className="absolute right-4 top-4 flex flex-col items-end space-y-2">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            todo.completed
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-amber-100 text-amber-800'
                                        }`}
                                    >
                                        {todo.completed ? 'Completed' : 'In Progress'}
                                    </span>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(todo.priority)}`}
                                    >
                                        {todo.priority}
                                    </span>
                                </div>

                                <div className="flex-1 p-5">
                                    <div className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Task #{index + 1}
                                    </div>

                                    <h3 className="mb-3 line-clamp-2 font-medium leading-snug text-gray-900">
                                        {todo.title}
                                    </h3>

                                    {todo.description && (
                                        <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                                            {todo.description}
                                        </p>
                                    )}

                                    {/* Assignment Info */}
                                    <div className="mb-4 space-y-2">
                                        {viewType === 'created' && todo.assignedTo && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FiUser className="mr-2 h-4 w-4 text-gray-400" />
                                                <span>Assigned to: <span className="font-medium">{todo.assignedTo.name}</span></span>
                                            </div>
                                        )}
                                        
                                        {viewType === 'assigned' && todo.createdBy && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FiUser className="mr-2 h-4 w-4 text-gray-400" />
                                                <span>Assigned by: <span className="font-medium">{todo.createdBy.name}</span></span>
                                            </div>
                                        )}
                                        
                                        {todo.dueDate && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                                                <span>Due: <span className="font-medium">
                                                    {new Date(todo.dueDate).toLocaleDateString()}
                                                </span></span>
                                            </div>
                                        )}
                                    </div>

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
                                                    setApproveId(todo.id)
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
                                                setDeleteId(todo.id)
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
                                : `You don't have any ${statusFilter} ${viewType} tasks.`}
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

            {/* Create Todo Dialog */}
            <DialogBox
                isOpen={showCreateDialog}
                onClose={() => {
                    setShowCreateDialog(false)
                    setNewTodo({
                        title: '',
                        description: '',
                        assignedToUsername: '',
                        priority: 'Medium',
                        dueDate: ''
                    })
                }}
                title="Create New Task"
                handleSubmit={handleCreate}
            >
                <div className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            value={newTodo.title}
                            onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                            placeholder="Enter task title..."
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Description (Optional)
                        </label>
                        <textarea
                            value={newTodo.description}
                            onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                            placeholder="Enter task description..."
                            rows={3}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Assign To (Optional)
                        </label>
                        <select
                            value={newTodo.assignedToUsername}
                            onChange={(e) => setNewTodo({...newTodo, assignedToUsername: e.target.value})}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Select an employee</option>
                            {employees.map((emp) => (
                                <option key={emp.username} value={emp.username}>
                                    {emp.name} - {emp.designation} ({emp.department})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Priority
                            </label>
                            <select
                                value={newTodo.priority}
                                onChange={(e) => setNewTodo({...newTodo, priority: e.target.value})}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Due Date (Optional)
                            </label>
                            <input
                                type="datetime-local"
                                value={newTodo.dueDate}
                                onChange={(e) => setNewTodo({...newTodo, dueDate: e.target.value})}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
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