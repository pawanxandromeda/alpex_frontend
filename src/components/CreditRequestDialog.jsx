import { useState } from 'react'
import { FiCreditCard } from 'react-icons/fi'

function CreditRequestDialog({ isOpen, onClose, onConfirm, customerName, currentCreditLimit }) {
    const [creditLimit, setCreditLimit] = useState(currentCreditLimit || '')
    const [notes, setNotes] = useState('')
    
    if (!isOpen) return null
    
    const handleSubmit = (e) => {
        e.preventDefault()
        const limit = parseFloat(creditLimit)
        if (isNaN(limit) || limit <= 0) {
            alert('Please enter a valid credit limit')
            return
        }
        onConfirm(limit)
        setCreditLimit('')
        setNotes('')
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md mx-4">
                <div className="p-6">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                        <FiCreditCard className="h-8 w-8 text-blue-600" />
                    </div>
                    
                    <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
                        Request Credit Approval
                    </h2>
                    
                    <p className="text-gray-600 text-center mb-6">
                        Request credit limit for <span className="font-semibold">{customerName}</span>
                        {currentCreditLimit && (
                            <span className="block text-sm text-gray-500 mt-1">
                                Current limit: ₹{Number(currentCreditLimit).toLocaleString('en-IN')}
                            </span>
                        )}
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Credit Limit (₹) *
                            </label>
                            <input
                                type="number"
                                value={creditLimit}
                                onChange={(e) => setCreditLimit(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter credit limit"
                                required
                                step="0.01"
                                min="0"
                            />
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Notes
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows="3"
                                placeholder="Any additional information for approval..."
                            />
                        </div>
                        
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
                            >
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreditRequestDialog