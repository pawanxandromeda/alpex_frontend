import React, { useState, useRef } from 'react'
import {
    Upload,
    FileSpreadsheet,
    AlertCircle,
    X,
    Check,
    RefreshCw,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { ArrowBack } from '@mui/icons-material'

function ApiHeaders() {
    const [headers, setHeaders] = useState([])
    const [sheets, setSheets] = useState([])
    const [selectedSheet, setSelectedSheet] = useState('')
    const [workbook, setWorkbook] = useState(null)
    const [fileName, setFileName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [fileError, setFileError] = useState('')
    const [selectedHeaders, setSelectedHeaders] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef(null)

    const extractHeaders = (worksheet) => {
        const range = XLSX.utils.decode_range(worksheet['!ref'])
        const headers = []

        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
            const cell = worksheet[cellAddress]
            headers.push(cell ? cell.v : '')
        }

        return headers
    }

    const handleSheetChange = (event) => {
        const sheetName = event.target.value
        setSelectedSheet(sheetName)
        setSelectedHeaders([])

        if (workbook && sheetName) {
            const worksheet = workbook.Sheets[sheetName]
            const headers = extractHeaders(worksheet)
            setHeaders(headers)
        }
    }

    const processFile = (file) => {
        setFileError('')

        if (file) {
            setIsLoading(true)
            setFileName(file.name)

            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result)
                    const wb = XLSX.read(data, { type: 'array' })

                    setWorkbook(wb)
                    setSheets(wb.SheetNames)
                    setSelectedSheet(wb.SheetNames[0])
                    setSelectedHeaders([])

                    // Get headers from first sheet
                    const worksheet = wb.Sheets[wb.SheetNames[0]]
                    const headers = extractHeaders(worksheet)
                    setHeaders(headers)
                } catch (error) {
                    setFileError(
                        "Failed to parse Excel file. Please ensure it's a valid Excel document."
                    )
                } finally {
                    setIsLoading(false)
                }
            }

            reader.onerror = () => {
                setFileError('Error reading file')
                setIsLoading(false)
            }

            reader.readAsArrayBuffer(file)
        }
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        processFile(file)
    }

    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files && files.length > 0) {
            processFile(files[0])
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current.click()
    }

    const resetFile = () => {
        setFileName('')
        setHeaders([])
        setSheets([])
        setSelectedSheet('')
        setWorkbook(null)
        setSelectedHeaders([])
        setFileError('')
    }

    const resetSelection = () => {
        setSelectedHeaders([])
    }

    const toggleHeaderSelection = (header) => {
        if (selectedHeaders.includes(header)) {
            setSelectedHeaders(selectedHeaders.filter((h) => h !== header))
        } else {
            setSelectedHeaders([...selectedHeaders, header])
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 p-6">
            <div className="w-full max-w-4xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-center text-2xl font-bold text-white">
                        API Headers Configuration
                    </h1>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center rounded-lg bg-white px-4 py-2 text-gray-700 shadow transition-all hover:bg-gray-50 hover:shadow-md"
                    >
                        <ArrowBack className="mr-2" />
                        <span>Back</span>
                    </button>
                </div>
                {/* Upload Card */}
                <div className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
                    {!fileName ? (
                        <div
                            className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 transition-all ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}
                            onClick={handleUploadClick}
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-500">
                                <span className="text-3xl font-light text-blue-500">
                                    +
                                </span>
                            </div>
                            <p className="text-center text-lg font-medium text-gray-700">
                                Click to browse or drag files
                                <br />
                                here to start sharing
                            </p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".xlsx,.xls"
                                onChange={handleFileUpload}
                            />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* File Info */}
                            <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
                                <div className="flex items-center">
                                    <FileSpreadsheet className="mr-3 h-8 w-8 text-blue-500" />
                                    <div>
                                        <h3 className="font-medium">
                                            {fileName}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {sheets.length} sheet
                                            {sheets.length !== 1
                                                ? 's'
                                                : ''} • {headers.length} headers
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={resetFile}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 hover:bg-red-50 hover:text-red-500"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {fileError && (
                                <div className="flex items-start rounded-xl bg-red-50 p-3 text-sm text-red-600">
                                    <AlertCircle className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                                    <span>{fileError}</span>
                                </div>
                            )}

                            {/* Sheet Selection */}
                            {sheets.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                        <label className="min-w-24 text-sm font-medium text-gray-700">
                                            Select Sheet:
                                        </label>
                                        <select
                                            value={selectedSheet}
                                            onChange={handleSheetChange}
                                            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            {sheets.map((sheet) => (
                                                <option
                                                    key={sheet}
                                                    value={sheet}
                                                >
                                                    {sheet}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Headers */}
                                    {headers.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-md font-medium text-gray-800">
                                                    Available Headers
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-500">
                                                        {selectedHeaders.length}{' '}
                                                        of {headers.length}{' '}
                                                        selected
                                                    </span>
                                                    {selectedHeaders.length >
                                                        0 && (
                                                        <button
                                                            onClick={
                                                                resetSelection
                                                            }
                                                            className="flex items-center p-1 text-sm text-blue-600 hover:text-blue-800"
                                                        >
                                                            <RefreshCw className="mr-1 h-3 w-3" />
                                                            Reset
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                {headers.map(
                                                    (header, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() =>
                                                                toggleHeaderSelection(
                                                                    header
                                                                )
                                                            }
                                                            className={`flex cursor-pointer items-center justify-between rounded-xl p-3 transition-colors ${
                                                                selectedHeaders.includes(
                                                                    header
                                                                )
                                                                    ? 'border border-blue-200 bg-blue-100'
                                                                    : 'border border-gray-200 bg-gray-50 hover:bg-gray-100'
                                                            }`}
                                                        >
                                                            <span className="truncate text-sm font-medium">
                                                                {header}
                                                            </span>
                                                            {selectedHeaders.includes(
                                                                header
                                                            ) && (
                                                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                                                                    <Check className="h-3 w-3 text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex justify-between pt-4">
                                        <button
                                            onClick={resetFile}
                                            className="rounded-xl border border-gray-300 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            <RefreshCw className="mr-2 inline-block h-4 w-4" />
                                            Start Over
                                        </button>

                                        <button
                                            disabled={
                                                selectedHeaders.length === 0
                                            }
                                            className={`rounded-xl px-6 py-2.5 font-medium text-white ${
                                                selectedHeaders.length === 0
                                                    ? 'cursor-not-allowed bg-gray-300'
                                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                                            }`}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ApiHeaders
