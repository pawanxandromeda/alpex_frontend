import React, { useState, useEffect } from 'react'
import { 
  FaSort, FaSortUp, FaSortDown, 
  FaEye, FaEdit, FaTrash, 
  FaCheck, FaKey, FaExclamationTriangle,
  FaPlus, FaMinus, FaClock, FaCreditCard
} from 'react-icons/fa'
import { 
  FiSearch, FiFilter, FiColumns, 
  FiChevronLeft, FiChevronRight, 
  FiChevronsLeft, FiChevronsRight,
  FiAlertCircle, FiUserCheck, FiUserX
} from 'react-icons/fi'

const DataGridTable = ({
    data,
    columns,
    className,
    onView,
    onUpdate,
    onDelete,
    onApprove,
    onPasswordChange,
    onWarning,
    emptyMessage = "No data available"
}) => {
    const safeData = Array.isArray(data) ? data : [];
    const safeColumns = Array.isArray(columns) ? columns : [];
    
    const [sortField, setSortField] = useState(null)
    const [sortDirection, setSortDirection] = useState('asc')
    const [searchTerm, setSearchTerm] = useState('')
    const [searchField, setSearchField] = useState(safeColumns[0]?.field || '')
    const [processedData, setProcessedData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [visibleColumns, setVisibleColumns] = useState(() =>
        safeColumns.map((col) => col.field)
    )
    const [showColumnSelector, setShowColumnSelector] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const rowsPerPage = 20

    const stats = {
        total: safeData.length,
        filtered: processedData.length,
        showing: Math.min(currentPage * rowsPerPage, processedData.length) - (currentPage - 1) * rowsPerPage
    }

    useEffect(() => {
        let result = [...safeData]

        // Apply search filter
        if (searchTerm && searchField) {
            result = result.filter(
                (item) =>
                    item[searchField] &&
                    String(item[searchField])
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            )
        }

        // Apply sorting
        if (sortField) {
            result.sort((a, b) => {
                const aValue = a[sortField]
                const bValue = b[sortField]

                if (aValue === null || aValue === undefined)
                    return sortDirection === 'asc' ? -1 : 1
                if (bValue === null || bValue === undefined)
                    return sortDirection === 'asc' ? 1 : -1

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortDirection === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue)
                }

                return sortDirection === 'asc'
                    ? aValue > bValue ? 1 : -1
                    : aValue > bValue ? -1 : 1
            })
        }

        setProcessedData(result)
        setTotalPages(Math.ceil(result.length / rowsPerPage))
        setCurrentPage(1)
    }, [safeData, sortField, sortDirection, searchTerm, searchField])

    const paginatedData = processedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    useEffect(() => {
        const handleScroll = () => {
            const table = document.querySelector('.data-grid-container')
            if (table) {
                setIsScrolled(table.scrollLeft > 0)
            }
        }

        const table = document.querySelector('.data-grid-container')
        if (table) {
            table.addEventListener('scroll', handleScroll)
            return () => table.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // Custom icon mapping for different action types
    const getActionIcon = (actionType) => {
        switch(actionType) {
            case 'view': return <FaEye className="h-3.5 w-3.5" />;
            case 'edit': return <FaEdit className="h-3.5 w-3.5" />;
            case 'delete': return <FaTrash className="h-3.5 w-3.5" />;
            case 'approve': return <FaCheck className="h-3.5 w-3.5" />;
            case 'password': return <FaKey className="h-3.5 w-3.5" />;
            case 'warning': return <FaExclamationTriangle className="h-3.5 w-3.5" />;
            case 'requestCredit': return <FaCreditCard className="h-3.5 w-3.5" />;
            case 'blacklist': return <FiUserX className="h-3.5 w-3.5" />;
            default: return <FaEye className="h-3.5 w-3.5" />;
        }
    }

    const getActionColor = (actionType) => {
        switch(actionType) {
            case 'view': return 'hover:bg-gray-800/20 active:bg-gray-800/30';
            case 'edit': return 'hover:bg-blue-500/10 active:bg-blue-500/20';
            case 'delete': return 'hover:bg-red-500/10 active:bg-red-500/20';
            case 'approve': return 'hover:bg-green-500/10 active:bg-green-500/20';
            case 'password': return 'hover:bg-yellow-500/10 active:bg-yellow-500/20';
            case 'warning': return 'hover:bg-orange-500/10 active:bg-orange-500/20';
            case 'requestCredit': return 'hover:bg-purple-500/10 active:bg-purple-500/20';
            case 'blacklist': return 'hover:bg-rose-500/10 active:bg-rose-500/20';
            default: return 'hover:bg-gray-800/20 active:bg-gray-800/30';
        }
    }

    const getActionTooltip = (actionType) => {
        switch(actionType) {
            case 'view': return 'View Details';
            case 'edit': return 'Edit';
            case 'delete': return 'Delete';
            case 'approve': return 'Approve';
            case 'password': return 'Change Password';
            case 'warning': return 'Warning';
            case 'requestCredit': return 'Request Credit';
            case 'blacklist': return 'Blacklist';
            default: return 'Action';
        }
    }

    const actionColumn = {
        field: 'actions',
        header: 'Actions',
        cellClassName: 'sticky right-0 z-30',
        sortable: false,
        searchable: false,
        alwaysVisible: true,
        renderCell: (_, row) => (
            <div className="flex items-center justify-center space-x-1 px-2">
                {onView && (
                    <button
                        onClick={() => onView(row)}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 group relative ${getActionColor('view')}`}
                        title={getActionTooltip('view')}
                    >
                        {getActionIcon('view')}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-40 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
                            {getActionTooltip('view')}
                        </div>
                    </button>
                )}
                {onUpdate && (
                    <button
                        onClick={() => onUpdate(row)}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 group relative ${getActionColor('edit')}`}
                        title={getActionTooltip('edit')}
                    >
                        {getActionIcon('edit')}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-40 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
                            {getActionTooltip('edit')}
                        </div>
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(row)}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 group relative ${getActionColor('delete')}`}
                        title={getActionTooltip('delete')}
                    >
                        {getActionIcon('delete')}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-40 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
                            {getActionTooltip('delete')}
                        </div>
                    </button>
                )}
                {onApprove && (
                    <button
                        onClick={() => onApprove(row)}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 group relative ${getActionColor('approve')}`}
                        title={getActionTooltip('approve')}
                    >
                        {getActionIcon('approve')}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-40 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
                            {getActionTooltip('approve')}
                        </div>
                    </button>
                )}
                {onWarning && (
                    <button
                        onClick={() => onWarning(row)}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 group relative ${getActionColor('warning')}`}
                        title={getActionTooltip('warning')}
                    >
                        {getActionIcon('warning')}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-40 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
                            {getActionTooltip('warning')}
                        </div>
                    </button>
                )}
                {onPasswordChange && (
                    <button
                        onClick={() => onPasswordChange(row)}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 group relative ${getActionColor('password')}`}
                        title={getActionTooltip('password')}
                    >
                        {getActionIcon('password')}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-40 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
                            {getActionTooltip('password')}
                        </div>
                    </button>
                )}
            </div>
        ),
    }

    const allColumns = [
      ...safeColumns,
      ...(onView || onUpdate || onDelete || onApprove || onPasswordChange || onWarning ? [actionColumn] : [])
    ];
    const searchableColumns = safeColumns.filter((col) => col.searchable !== false)

    const displayColumns = allColumns.filter(
        (col) => col.alwaysVisible || visibleColumns.includes(col.field)
    )

    const toggleColumnVisibility = (field) => {
        setVisibleColumns((prevVisible) => {
            if (prevVisible.includes(field)) {
                return prevVisible.filter((f) => f !== field)
            } else {
                return [...prevVisible, field]
            }
        })
    }

    if (!safeData.length) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-50 to-gray-100/50 flex items-center justify-center mb-6 backdrop-blur-sm border border-gray-200/50">
                    <FiSearch className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 font-sf-pro">No Data Available</h3>
                <p className="text-gray-500 text-center max-w-md font-sf-pro-text">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className={`w-full ${className || ''} font-sf-pro`}>
            {/* Search and Filter Section - Apple Style */}
            <div className="mb-6 bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-300/50 shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={`Search by ${safeColumns.find(c => c.field === searchField)?.header || searchField}...`}
                                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-300/80 bg-white/50 backdrop-blur-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-300/50 transition-all duration-300 font-sf-pro-text placeholder-gray-500"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter and Column Controls */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-300/80 px-3 py-2">
                            <FiFilter className="h-4 w-4 text-gray-600" />
                            <select
                                value={searchField}
                                onChange={(e) => setSearchField(e.target.value)}
                                className="text-sm bg-transparent focus:outline-none text-gray-700 font-sf-pro-text"
                            >
                                {searchableColumns.map((column) => (
                                    <option key={column.field} value={column.field}>
                                        {column.header || column.field}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={() => setShowColumnSelector(!showColumnSelector)}
                            className={`flex items-center space-x-2 px-4 py-2.5 text-sm rounded-xl transition-all duration-300 font-sf-pro-medium ${
                                showColumnSelector 
                                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                                    : 'bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-white/80 border border-gray-300/80'
                            }`}
                        >
                            <FiColumns className="h-4 w-4" />
                            <span>Columns</span>
                        </button>
                    </div>
                </div>

                {/* Column Visibility Selector */}
                {showColumnSelector && (
                    <div className="mt-6 pt-6 border-t border-gray-300/50">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 font-sf-pro-medium">Visible Columns</h4>
                        <div className="flex flex-wrap gap-2">
                            {allColumns.map(
                                (column) =>
                                    !column.alwaysVisible && (
                                        <label
                                            key={column.field}
                                            className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-gray-300/80 bg-white/50 backdrop-blur-sm hover:bg-white/80 cursor-pointer transition-all duration-300"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.includes(column.field)}
                                                onChange={() => toggleColumnVisibility(column.field)}
                                                className="h-4 w-4 text-gray-900 rounded focus:ring-gray-400/50"
                                            />
                                            <span className="text-sm text-gray-700 font-sf-pro-text">
                                                {column.header || column.field}
                                            </span>
                                        </label>
                                    )
                            )}
                        </div>
                    </div>
                )}

                {/* Results Summary */}
                <div className="flex flex-wrap items-center justify-between mt-6 pt-6 border-t border-gray-300/50">
                    <div className="text-sm text-gray-600 font-sf-pro-text">
                        Showing <span className="font-semibold text-gray-800">{stats.showing}</span> of{' '}
                        <span className="font-semibold text-gray-800">{stats.filtered}</span> filtered records
                        {stats.filtered !== stats.total && (
                            <span className="text-gray-500"> (from {stats.total} total)</span>
                        )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600 font-sf-pro-text">
                            Page <span className="font-semibold text-gray-800">{currentPage}</span> of{' '}
                            <span className="font-semibold text-gray-800">{totalPages}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl border border-gray-300/80 text-gray-700 hover:bg-white/50 backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                                title="First Page"
                            >
                                <FiChevronsLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl border border-gray-300/80 text-gray-700 hover:bg-white/50 backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                                title="Previous Page"
                            >
                                <FiChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-xl border border-gray-300/80 text-gray-700 hover:bg-white/50 backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                                title="Next Page"
                            >
                                <FiChevronRight className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-xl border border-gray-300/80 text-gray-700 hover:bg-white/50 backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                                title="Last Page"
                            >
                                <FiChevronsRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-300/50 shadow-lg overflow-hidden">
                <div className="overflow-x-auto data-grid-container">
                    <table className="min-w-full divide-y divide-gray-300/50">
                        <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm">
                            <tr>
                                {displayColumns.map((column, index) => (
                                    <th
                                        key={column.id || column.field}
                                        className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-sf-pro-medium ${
                                            column.field === 'actions' 
                                                ? 'sticky right-0 bg-gradient-to-r from-gray-900 to-gray-800 z-20 border-l border-gray-700/50 text-white shadow-lg'
                                                : index === 0 
                                                    ? 'sticky left-0 bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm z-10'
                                                    : ''
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <span className="truncate">
                                                {column.header || column.field}
                                            </span>
                                            {column.sortable !== false && (
                                                <button
                                                    onClick={() => {
                                                        if (sortField === column.field) {
                                                            setSortDirection(
                                                                sortDirection === 'asc' ? 'desc' : 'asc'
                                                            )
                                                        } else {
                                                            setSortField(column.field)
                                                            setSortDirection('asc')
                                                        }
                                                    }}
                                                    className="ml-2 focus:outline-none hover:bg-gray-300/30 rounded p-1 transition-colors duration-300"
                                                >
                                                    {sortField !== column.field ? (
                                                        <FaSort className="h-3 w-3 text-gray-500" />
                                                    ) : sortDirection === 'asc' ? (
                                                        <FaSortUp className="h-3 w-3 text-gray-900" />
                                                    ) : (
                                                        <FaSortDown className="h-3 w-3 text-gray-900" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300/30">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={displayColumns.length}
                                        className="px-6 py-12 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100/50 to-gray-200/50 backdrop-blur-sm flex items-center justify-center mb-4 border border-gray-300/50">
                                                <FiSearch className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <h4 className="text-lg font-medium text-gray-700 mb-2 font-sf-pro">No matching records found</h4>
                                            <p className="text-gray-500 max-w-md font-sf-pro-text">
                                                Try adjusting your search or filter to find what you're looking for.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row, rowIndex) => (
                                    <tr
                                        key={row.id || rowIndex}
                                        className="transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/30 active:bg-gray-100/40"
                                    >
                                        {displayColumns.map((column, colIndex) => (
                                            <td
                                                key={`${rowIndex}-${column.id || column.field}`}
                                                className={`px-6 py-4 text-sm text-gray-600 font-sf-pro-text ${
                                                    column.cellClassName || ''
                                                } ${
                                                    column.field === 'actions'
                                                        ? 'sticky right-0 bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-sm z-10 text-gray-200 border-l border-gray-700/50'
                                                        : colIndex === 0 
                                                            ? 'sticky left-0 bg-white/70 backdrop-blur-sm z-5'
                                                            : ''
                                                } ${
                                                    rowIndex % 2 === 0 
                                                        ? column.field !== 'actions' && colIndex !== 0 
                                                            ? 'bg-gray-50/30' 
                                                            : ''
                                                        : ''
                                                }`}
                                            >
                                                {column.renderCell
                                                    ? column.renderCell(row[column.field], row)
                                                    : (
                                                        <div className="truncate max-w-xs group relative" title={String(row[column.field] || '')}>
                                                            {row[column.field] || '-'}
                                                            <div className="absolute bottom-full left-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap backdrop-blur-sm border border-gray-700/50 shadow-lg z-30">
                                                                {row[column.field] || '-'}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-300/50 bg-gradient-to-r from-gray-50/50 to-gray-100/30 backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="text-sm text-gray-600 font-sf-pro-text">
                                Showing <span className="font-semibold text-gray-800">{paginatedData.length}</span> records on page{' '}
                                <span className="font-semibold text-gray-800">{currentPage}</span> of{' '}
                                <span className="font-semibold text-gray-800">{totalPages}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600 mr-2 font-sf-pro-text">Go to page:</span>
                                <select
                                    value={currentPage}
                                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                                    className="text-sm rounded-xl border border-gray-300/80 px-3 py-2 focus:outline-none bg-white/50 backdrop-blur-sm text-gray-700 font-sf-pro-text"
                                >
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <option key={page} value={page}>
                                            {page}
                                        </option>
                                    ))}
                                </select>
                                
                                <div className="flex items-center space-x-1 ml-2">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 font-sf-pro-medium ${
                                                    currentPage === pageNum
                                                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                                                        : 'text-gray-700 hover:bg-white/50 backdrop-blur-sm border border-gray-300/50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    
                                    {totalPages > 5 && currentPage < totalPages - 2 && (
                                        <>
                                            <span className="px-2 text-gray-400">...</span>
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 font-sf-pro-medium ${
                                                    currentPage === totalPages
                                                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                                                        : 'text-gray-700 hover:bg-white/50 backdrop-blur-sm border border-gray-300/50'
                                                }`}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Apple fonts to head */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&family=SF+Pro+Text:wght@300;400;500;600&display=swap');
                
                .font-sf-pro {
                    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                }
                
                .font-sf-pro-text {
                    font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                }
                
                .font-sf-pro-medium {
                    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    font-weight: 500;
                }
                
                .data-grid-container {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
                }
                
                .data-grid-container::-webkit-scrollbar {
                    height: 8px;
                    width: 8px;
                }
                
                .data-grid-container::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 4px;
                }
                
                .data-grid-container::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 4px;
                }
                
                .data-grid-container::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    )
}

export default DataGridTable