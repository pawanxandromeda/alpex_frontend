import React from 'react';
import { FiCheck, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'good':
        return {
          bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: <FiCheck className="h-3.5 w-3.5" />,
          dot: 'bg-emerald-500',
          glow: 'shadow-emerald-200'
        }
      case 'bad':
        return {
          bg: 'bg-gradient-to-r from-rose-50 to-red-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          icon: <FiXCircle className="h-3.5 w-3.5" />,
          dot: 'bg-rose-500',
          glow: 'shadow-rose-200'
        }
      case 'moderate':
        return {
          bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: <FiAlertTriangle className="h-3.5 w-3.5" />,
          dot: 'bg-amber-500',
          glow: 'shadow-amber-200'
        }
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: null,
          dot: 'bg-gray-500',
          glow: 'shadow-gray-200'
        }
    }
  }

  const styles = getStatusStyles(status)

  return (
    <div className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 ${styles.bg} ${styles.text} ${styles.border} ${styles.glow}`}>
      <div className={`mr-2 h-2 w-2 rounded-full ${styles.dot} animate-pulse`}></div>
      {styles.icon && <span className="mr-1.5">{styles.icon}</span>}
      <span className="font-semibold">{status || 'N/A'}</span>
    </div>
  )
}

export default StatusBadge