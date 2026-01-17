import React from 'react';
import { FiCheck, FiX, FiClock, FiAlertCircle } from 'react-icons/fi';

const KYCBadge = ({ status }) => {
  const getKYCStatus = (status) => {
    const statusLower = status?.toLowerCase()
    
    if (statusLower === 'verified' || statusLower === 'complete' || statusLower === 'approved') {
      return {
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: <FiCheck className="h-3.5 w-3.5" />,
        label: 'Verified'
      }
    } else if (statusLower === 'pending' || statusLower === 'in progress' || statusLower === 'processing') {
      return {
        bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: <FiClock className="h-3.5 w-3.5" />,
        label: 'Pending'
      }
    } else if (statusLower === 'rejected' || statusLower === 'failed') {
      return {
        bg: 'bg-gradient-to-r from-rose-50 to-red-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        icon: <FiX className="h-3.5 w-3.5" />,
        label: 'Rejected'
      }
    } else if (statusLower === 'incomplete' || statusLower === 'partial') {
      return {
        bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: <FiAlertCircle className="h-3.5 w-3.5" />,
        label: 'Incomplete'
      }
    } else {
      return {
        bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        icon: <FiClock className="h-3.5 w-3.5" />,
        label: status || 'Pending'
      }
    }
  }

  const kycStatus = getKYCStatus(status)

  return (
    <div className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 ${kycStatus.bg} ${kycStatus.text} ${kycStatus.border} shadow-sm hover:shadow-md`}>
      <span className="mr-1.5">{kycStatus.icon}</span>
      <span className="font-semibold">{kycStatus.label}</span>
    </div>
  )
}

export default KYCBadge