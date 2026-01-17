import { useState } from 'react'
import { FiAlertTriangle } from 'react-icons/fi'

function BlacklistDialog({ isOpen, onClose, onConfirm, customerName }) {
    const [reason, setReason] = useState('')
    
    if (!isOpen) return null
    
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!reason.trim()) {
            alert('Please provide a reason for blacklisting')
            return
        }
        onConfirm(reason)
        setReason('')
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md mx-4">
                <div className="p-6">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                        <FiAlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    
                    <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
                        Blacklist Customer
                    </h2>
                    
                    <p className="text-gray-600 text-center mb-6">
                        Are you sure you want to blacklist <span className="font-semibold">{customerName}</span>?
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Blacklisting *
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                rows="3"
                                placeholder="Provide detailed reason for blacklisting..."
                                required
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
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all"
                            >
                                Confirm Blacklist
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BlacklistDialog