import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { ArrowLeft, LayoutDashboard } from 'lucide-react'
import Header from '@components/Header'
import axios from '@axios'

function SummaryItem({ label, value }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="mt-1 text-base font-semibold text-black">
                {value || '-'}
            </div>
        </div>
    )
}

function POSummary() {
    const [poNumber, setPoNumber] = useState('')
    const [poSummaryData, setPoSummaryData] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSearch = () => {
        if (!poNumber.trim()) {
            toast.error('Please enter a PO Number')
            return
        }

        setLoading(true)
        axios
            .get(`po/summary/${poNumber.toUpperCase()}`)
            .then((response) => {
                setPoSummaryData(response.data)
            })
            .catch((err) => {
                if (err.response?.status === 404) {
                    toast.error('PO not found')
                } else {
                    toast.error('Failed to fetch PO data')
                }
                setPoSummaryData(null)
            })
            .finally(() => setLoading(false))
    }

    return (
        <div className="min-h-screen bg-white pb-16">
            <Header
                heading="Purchase Order Summary"
                description="Enter PO number to fetch its details"
            />

            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-4xl items-center justify-between py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="white-button-custom"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back
                    </button>

                    <button
                        onClick={() => navigate('/dashboard/todos')}
                        className="white-button-custom"
                    >
                        <LayoutDashboard className="mr-1 h-4 w-4" />
                        Dashboard
                    </button>
                </div>
                <div className="space-y-4 rounded-xl border bg-white p-6 shadow-md">
                    <input
                        type="text"
                        placeholder="PO00001"
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-black shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                    >
                        {loading ? 'Searching...' : 'Search PO'}
                    </button>
                </div>

                {poSummaryData ? (
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <SummaryItem
                            label="PO Number"
                            value={poSummaryData.poNo}
                        />
                        <SummaryItem
                            label="PO Date"
                            value={new Date(
                                poSummaryData.poDate
                            ).toLocaleDateString()}
                        />
                        <SummaryItem
                            label="Brand Name"
                            value={poSummaryData.brandName}
                        />
                        <SummaryItem
                            label="Party Name"
                            value={poSummaryData.partyName}
                        />
                        <SummaryItem
                            label="GST No"
                            value={poSummaryData.gstNo}
                        />
                        <SummaryItem
                            label="Order Through"
                            value={poSummaryData.orderThrough}
                        />
                        <SummaryItem
                            label="Composition"
                            value={poSummaryData.composition}
                        />
                        <SummaryItem
                            label="PO Quantity"
                            value={poSummaryData.poQty}
                        />
                        <SummaryItem
                            label="PO Rate"
                            value={poSummaryData.poRate}
                        />
                        <SummaryItem
                            label="Amount"
                            value={poSummaryData.amount}
                        />
                        <SummaryItem label="MRP" value={poSummaryData.mrp} />
                        <SummaryItem
                            label="Status"
                            value={poSummaryData.overallStatus}
                        />
                        <SummaryItem
                            label="Section"
                            value={poSummaryData.section}
                        />
                        <SummaryItem
                            label="MD Approval"
                            value={poSummaryData.mdApproval}
                        />
                        <SummaryItem
                            label="Accounts Approval"
                            value={poSummaryData.accountsApproval}
                        />
                    </div>
                ) : (
                    !loading && (
                        <div className="mt-12 text-center text-gray-500">
                            No PO data available. Search using a PO number like{' '}
                            <strong>PO00001</strong>.
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

SummaryItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default POSummary
