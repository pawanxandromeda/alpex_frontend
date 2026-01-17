// AnalyticsDashboard.jsx
import React from 'react';
import {
  AiOutlineShopping,
  AiOutlineDollar,
  AiOutlineTeam,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCalendar
} from 'react-icons/ai';

const AnalyticsDashboard = ({ analytics, loading, filters, onFilterChange, onApplyFilters, onClearFilters }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <AiOutlineCalendar />
          <span>
            {filters.fromDate ? new Date(filters.fromDate).toLocaleDateString() : 'All time'} - 
            {filters.toDate ? new Date(filters.toDate).toLocaleDateString() : 'Present'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Total POs</p>
              <p className="text-3xl font-bold text-blue-800 mt-2">{analytics.totalPOs}</p>
            </div>
            <AiOutlineShopping className="text-3xl text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Total Amount</p>
              <p className="text-3xl font-bold text-green-800 mt-2">
                ₹{analytics.totalAmount.toLocaleString()}
              </p>
            </div>
            <AiOutlineDollar className="text-3xl text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Average Amount</p>
              <p className="text-3xl font-bold text-purple-800 mt-2">
                ₹{Math.round(analytics.averageAmount).toLocaleString()}
              </p>
            </div>
            <AiOutlineTeam className="text-3xl text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700 font-medium">Approved POs</p>
              <p className="text-3xl font-bold text-amber-800 mt-2">
                {analytics.approvalStats.mdApproved}
              </p>
            </div>
            <AiOutlineCheckCircle className="text-3xl text-amber-600" />
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analytics.statusCounts.map((status) => (
            <div key={status.status} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">{status.status}</span>
                <span className="text-lg font-bold">{status.count}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(status.count / analytics.totalPOs) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Customers */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Top Customers by Amount</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GST No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PO Count
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.topCustomersByAmount.map((customer, index) => (
                <tr key={customer.gstNo}>
                  <td className="px-4 py-3 text-sm font-mono">{customer.gstNo}</td>
                  <td className="px-4 py-3 text-sm font-semibold">
                    ₹{customer.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {analytics.posPerCustomer.find(c => c.gstNo === customer.gstNo)?.count || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;