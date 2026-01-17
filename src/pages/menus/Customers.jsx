import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { 
  FiPlus, FiUsers, FiCreditCard, FiTrendingUp, 
  FiTrendingDown, FiActivity, FiAlertCircle, 
  FiCheckCircle, FiXCircle, FiUserX, FiUserCheck 
} from 'react-icons/fi'
import Loading from '@loading'
import Header from '@components/Header'
import DataGridTable from '@components/DataGridTable'
import CustomDeleteDialog from '@components/CustomDeleteDialog'
import DialogBox from '@components/DialogBox'
import axios from '@axios'
import decryptData from '../../utils/Decrypt'
import CustomerForm from '@components/CustomerForm'
import StatusBadge from '@components/StatusBadge'
import KYCBadge from '@components/KYCBadge'
import ImportCustomersDialog from '@components/ImportCustomersDialog'
import BlacklistDialog from '@components/BlacklistDialog'
import CreditRequestDialog from '@components/CreditRequestDialog'

function Customers() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showImportDialog, setShowImportDialog] = useState(false)
    const [showBlacklistDialog, setShowBlacklistDialog] = useState(false)
    const [showCreditRequestDialog, setShowCreditRequestDialog] = useState(false)
    const [showViewDialog, setShowViewDialog] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [formData, setFormData] = useState({})
    const [stats, setStats] = useState({
      total: 0,
      good: 0,
      moderate: 0,
      bad: 0,
      totalCredit: 0,
      blacklisted: 0,
      pendingCredit: 0
    })

    useEffect(() => {
      fetchCustomers()
    }, [])

    useEffect(() => {
      calculateStats()
    }, [records])

    const fetchCustomers = () => {
      setLoading(true)
      axios.get('customers')
        .then((response) => {
          const decryptedData = decryptData(response.data.payload)
          setRecords(Array.isArray(decryptedData) ? decryptedData : [])
          setLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setRecords([])
          setLoading(false)
          toast.error('Failed to load customers')
        })
    }

    const calculateStats = () => {
      const total = records.length
      const good = records.filter(r => r.relationshipStatus?.toLowerCase() === 'good').length
      const moderate = records.filter(r => r.relationshipStatus?.toLowerCase() === 'moderate').length
      const bad = records.filter(r => r.relationshipStatus?.toLowerCase() === 'bad').length
      const blacklisted = records.filter(r => r.isBlacklisted).length
      const pendingCredit = records.filter(r => r.creditApprovalStatus === 'Pending').length
      const totalCredit = records.reduce((sum, r) => sum + (parseFloat(r.creditLimit) || 0), 0)
      
      setStats({ 
        total, 
        good, 
        moderate, 
        bad, 
        blacklisted, 
        pendingCredit, 
        totalCredit 
      })
    }

    const handleAdd = () => {
        setFormData({
            customerID: '',
            customerName: '',
            relationshipStatus: '',
            address: '',
            creditLimit: '',
            paymentTerms: '',
            throughVia: '',
            gstrNo: '',
            kycProfile: '',
            contactName: '',
            contactPhone: '',
            contactEmail: '',
            contacts: [],
            remarks: '',
            gstCopy: '',
            dlExpiry: '',
        })
        setShowAddDialog(true)
    }

    const handleEdit = (customer) => {
        setSelectedCustomer(customer)
        setFormData(customer)
        setShowEditDialog(true)
    }

    const handleDelete = (customer) => {
        setSelectedCustomer(customer)
        setShowDeleteDialog(true)
    }

    const handleBlacklist = (customer) => {
        setSelectedCustomer(customer)
        setShowBlacklistDialog(true)
    }

    const handleRequestCredit = (customer) => {
        setSelectedCustomer(customer)
        setShowCreditRequestDialog(true)
    }

    const handleView = (customer) => {
        setSelectedCustomer(customer)
        setShowViewDialog(true)
    }

    const confirmBlacklist = (reason) => {
        axios.post('customers/blacklist', {
            customerId: selectedCustomer.id,
            blacklistReason: reason
        })
        .then(() => {
            toast.success('Customer blacklisted successfully')
            setShowBlacklistDialog(false)
            fetchCustomers()
        })
        .catch((err) => {
            toast.error(err?.response?.data?.message || 'Failed to blacklist customer')
        })
    }

    const confirmCreditRequest = (creditLimit) => {
        axios.post('customers/request-credit', {
            customerId: selectedCustomer.id,
            creditLimit: parseFloat(creditLimit)
        })
        .then(() => {
            toast.success('Credit approval requested successfully')
            setShowCreditRequestDialog(false)
            fetchCustomers()
        })
        .catch((err) => {
            toast.error(err?.response?.data?.message || 'Failed to request credit approval')
        })
    }

    const handleRemoveBlacklist = (customerId) => {
        axios.post(`customers/remove-blacklist/${customerId}`)
        .then(() => {
            toast.success('Customer removed from blacklist successfully')
            fetchCustomers()
        })
        .catch((err) => {
            toast.error('Failed to remove from blacklist')
        })
    }

    const handleFormChange = (e) => {
      const { name, value } = e.target
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    const handleSubmit = (e) => {
      e.preventDefault()

      const requiredFields = [
        'customerID', 'customerName', 'relationshipStatus', 'address',
        'creditLimit', 'paymentTerms', 'throughVia', 'gstrNo',
        'kycProfile', 'contactName', 'contactPhone',
      ]

      const missingFields = requiredFields.filter((field) => !formData[field])

      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
        return
      }

      const payload = {
        ...formData,
        creditLimit: formData.creditLimit ? Number(formData.creditLimit) : 0,
        dlExpiry: formData.dlExpiry ? new Date(formData.dlExpiry).toISOString() : null,
      }

      const request = showAddDialog 
        ? axios.post('customers/create', payload)
        : axios.put(`customers/${selectedCustomer.id}`, payload)

      request
        .then(() => {
          toast.success(`Customer ${showAddDialog ? 'added' : 'updated'} successfully`)
          setShowAddDialog(false)
          setShowEditDialog(false)
          fetchCustomers()
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || `Failed to ${showAddDialog ? 'add' : 'update'} customer.`)
        })
    }

    const confirmDelete = () => {
      axios.delete(`customers/${selectedCustomer._id}`)
        .then(() => {
          toast.success('Customer deleted successfully')
          setShowDeleteDialog(false)
          fetchCustomers()
        })
        .catch((err) => {
          toast.error('Failed to delete customer')
        })
    }

    const handleExport = () => {
      axios.get('customers/export', { responseType: 'blob' })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'customers.xlsx')
          document.body.appendChild(link)
          link.click()
          link.remove()
          URL.revokeObjectURL(url)
        })
        .catch((err) => {
          console.error(err)
          toast.error('Failed to export customers')
        })
    }

    const columns = [
        {
            field: 'customerID',
            header: 'Customer ID',
            sortable: true,
            width: 120,
        },
        {
            field: 'customerName',
            header: 'Customer Name',
            sortable: true,
            width: 180,
            renderCell: (value, row) => (
                <div className="flex items-center">
                    {row.isBlacklisted && (
                        <FiUserX className="mr-2 text-red-500" title="Blacklisted" />
                    )}
                    <span className={row.isBlacklisted ? 'line-through text-gray-500' : ''}>
                        {value}
                    </span>
                </div>
            ),
        },
        {
            field: 'gstrNo',
            header: 'GSTIN',
            sortable: true,
            width: 140,
        },
        {
            field: 'relationshipStatus',
            header: 'Relationship Status',
            sortable: true,
            width: 140,
            renderCell: (value) => <StatusBadge status={value} />,
        },
        {
            field: 'creditApprovalStatus',
            header: 'Credit Status',
            sortable: true,
            width: 140,
            renderCell: (value) => {
                let icon, color, bgColor;
                switch(value) {
                    case 'Approved':
                        icon = <FiCheckCircle className="mr-1" />;
                        color = 'text-green-600';
                        bgColor = 'bg-green-50';
                        break;
                    case 'Pending':
                        icon = <FiAlertCircle className="mr-1" />;
                        color = 'text-yellow-600';
                        bgColor = 'bg-yellow-50';
                        break;
                    case 'Rejected':
                        icon = <FiXCircle className="mr-1" />;
                        color = 'text-red-600';
                        bgColor = 'bg-red-50';
                        break;
                    default:
                        icon = <FiAlertCircle className="mr-1" />;
                        color = 'text-gray-600';
                        bgColor = 'bg-gray-50';
                }
                return (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${bgColor} ${color}`}>
                        {icon}
                        {value || 'N/A'}
                    </div>
                );
            },
        },
        {
            field: 'isBlacklisted',
            header: 'Blacklist Status',
            sortable: true,
            width: 160,
            renderCell: (value, row) => (
                value ? (
                    <div className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                        <FiUserX className="mr-1" />
                        Blacklisted
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveBlacklist(row.id);
                            }}
                            className="ml-2 text-xs text-red-800 hover:text-red-900 hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                        <FiUserCheck className="mr-1" />
                        Active
                    </div>
                )
            ),
        },
        {
            field: 'address',
            header: 'Address',
            sortable: true,
            width: 200,
            renderCell: (value) => (
              <div className="max-w-[200px] truncate" title={value}>
                {value || 'N/A'}
              </div>
            ),
        },
        {
            field: 'creditLimit',
            header: 'Credit Limit',
            sortable: true,
            width: 140,
            renderCell: (value, row) => (
              <div className="flex items-center font-medium">
                <FiCreditCard className={`mr-2 ${row.isBlacklisted ? 'text-gray-400' : 'text-blue-500'}`} />
                <span className={row.isBlacklisted ? 'text-gray-500 line-through' : 'text-gray-800'}>
                  ₹{value ? Number(value).toLocaleString('en-IN') : '0'}
                </span>
              </div>
            ),
        },
        {
            field: 'contactName',
            header: 'Primary Contact',
            sortable: true,
            width: 150,
        },
        {
            field: 'contacts',
            header: 'All Contacts',
            sortable: false,
            width: 120,
            renderCell: (value) => (
                <div className="flex items-center">
                    <FiUsers className="mr-2 text-gray-500" />
                    <span className="text-sm">
                        {value && Array.isArray(value) ? `${value.length} contacts` : 'No contacts'}
                    </span>
                </div>
            ),
        },
        {
            field: 'contactPhone',
            header: 'Phone',
            sortable: true,
            width: 130,
            renderCell: (value, row) => (
              <a 
                href={`tel:${value}`} 
                className={`hover:underline transition-colors duration-200 ${row.isBlacklisted ? 'text-gray-500' : 'text-blue-600 hover:text-blue-800'}`}
              >
                {value || 'N/A'}
              </a>
            ),
        },
        {
            field: 'kycProfile',
            header: 'KYC',
            sortable: true,
            width: 120,
            renderCell: (value) => <KYCBadge status={value} />,
        },
    ]

    if (loading) return <Loading />

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <Header
                heading="Customer Management"
                description="Track and manage your customer relationships, credit limits, and compliance"
                buttonName={
                    <>
                        <FiPlus className="mr-2 h-5 w-5" />
                        Add New Customer
                    </>
                }
                handleClick={handleAdd}
            />

            {/* Import / Export toolbar */}
            <div className="px-6 lg:px-8 mt-4 mb-6">
              <div className="flex items-center justify-end space-x-3">
                <button onClick={() => setShowImportDialog(true)} className="px-4 py-2 bg-white border border-blue-100 rounded-xl text-blue-700 hover:bg-blue-50 text-sm flex items-center space-x-2">
                  <span className="font-medium">Import</span>
                </button>
                <button onClick={handleExport} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm hover:from-blue-600 hover:to-blue-700 flex items-center space-x-2">
                  <span className="font-medium">Export</span>
                </button>
              </div>
            </div>
            
            {/* Stats Cards with Animation - Updated with new stats */}
            <div className="px-6 lg:px-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Total Customers Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg shadow-gray-100 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Total Customers</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                      <p className="text-xs text-gray-400 mt-2">Active in system</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl">
                      <FiUsers className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Good Relationships Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg shadow-gray-100 hover:shadow-xl hover:shadow-green-100 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Good Relationships</p>
                      <p className="text-3xl font-bold text-green-600">{stats.good}</p>
                      <div className="flex items-center text-xs text-green-500 mt-2">
                        <FiTrendingUp className="mr-1" />
                        <span>Excellent status</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl">
                      <div className="h-8 w-8 flex items-center justify-center">
                        <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Blacklisted Card - NEW */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg shadow-gray-100 hover:shadow-xl hover:shadow-red-100 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Blacklisted</p>
                      <p className="text-3xl font-bold text-red-600">{stats.blacklisted}</p>
                      <div className="flex items-center text-xs text-red-500 mt-2">
                        <FiUserX className="mr-1" />
                        <span>Requires attention</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-xl">
                      <FiUserX className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Credit Limit Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg shadow-gray-100 hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Total Credit Limit</p>
                      <p className="text-3xl font-bold text-purple-600">₹{(stats.totalCredit).toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-400 mt-2">Across all customers</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl">
                      <FiCreditCard className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Pending Credit Card - NEW */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg shadow-gray-100 hover:shadow-xl hover:shadow-yellow-100 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Pending Credit</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats.pendingCredit}</p>
                      <div className="flex items-center text-xs text-yellow-500 mt-2">
                        <FiAlertCircle className="mr-1" />
                        <span>Awaiting approval</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-xl">
                      <FiAlertCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table Section */}
            <div className="px-6 lg:px-8">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">Customer Directory</h2>
                        <p className="text-sm text-gray-500">Manage and review all customer records</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Showing <span className="font-semibold text-gray-700">{records.length}</span> customers
                      </div>
                    </div>
                  </div>
                  <DataGridTable
                      data={records}
                      columns={columns}
                      onView={handleView}
                      onUpdate={handleEdit}
                      onDelete={handleDelete}
                      onApprove={handleRequestCredit}
                      onWarning={handleBlacklist}
                      emptyMessage={
                        <div className="text-center py-12">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 mb-4">
                            <FiUsers className="h-10 w-10 text-blue-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">No customers found</h3>
                          <p className="text-gray-500 max-w-md mx-auto">
                            Start building your customer database by adding your first customer record
                          </p>
                          <button
                            onClick={handleAdd}
                            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl shadow-blue-200"
                          >
                            <FiPlus className="inline mr-2 h-5 w-5" />
                            Add First Customer
                          </button>
                        </div>
                      }
                  />
                </div>
            </div>

            {/* Add Customer Dialog */}
            <DialogBox
                isOpen={showAddDialog}
                onClose={() => setShowAddDialog(false)}
                title="Add New Customer"
                handleSubmit={handleSubmit}
                submitText="Create Customer"
                submitColor="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
                <CustomerForm
                  formData={formData}
                  handleChange={handleFormChange}
                />
            </DialogBox>

            {/* Import Customers Dialog */}
            <ImportCustomersDialog
              isOpen={showImportDialog}
              onClose={() => setShowImportDialog(false)}
              onImported={() => { setShowImportDialog(false); fetchCustomers(); }}
            />

            {/* Edit Customer Dialog */}
            <DialogBox
                isOpen={showEditDialog}
                onClose={() => setShowEditDialog(false)}
                title="Edit Customer"
                handleSubmit={handleSubmit}
                submitText="Save Changes"
                submitColor="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
                <CustomerForm
                  formData={formData}
                  handleChange={handleFormChange}
                />
            </DialogBox>

            {/* Blacklist Dialog */}
            {showBlacklistDialog && (
              <BlacklistDialog
                isOpen={showBlacklistDialog}
                onClose={() => setShowBlacklistDialog(false)}
                onConfirm={confirmBlacklist}
                customerName={selectedCustomer?.customerName}
              />
            )}

            {/* Credit Request Dialog */}
            {showCreditRequestDialog && (
              <CreditRequestDialog
                isOpen={showCreditRequestDialog}
                onClose={() => setShowCreditRequestDialog(false)}
                onConfirm={confirmCreditRequest}
                customerName={selectedCustomer?.customerName}
                currentCreditLimit={selectedCustomer?.creditLimit}
              />
            )}

            {/* Delete Confirmation Dialog */}
            <CustomDeleteDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDelete}
                title="Delete Customer"
                message={`Are you sure you want to delete "${selectedCustomer?.customerName}"? This action cannot be undone.`}
                confirmText="Delete Customer"
            />

            {/* View Customer Dialog */}
            <DialogBox
                isOpen={showViewDialog}
                onClose={() => setShowViewDialog(false)}
                title="View Customer Details"
                submitText="Close"
                submitColor="bg-gray-500"
            >
                {selectedCustomer && (
                    <div className="space-y-4">
                        <p><strong>Name:</strong> {selectedCustomer.customerName}</p>
                        <p><strong>Address:</strong> {selectedCustomer.address}</p>
                        <p><strong>Credit Limit:</strong> {selectedCustomer.creditLimit}</p>
                        <p><strong>Contact:</strong> {selectedCustomer.contactName} ({selectedCustomer.contactPhone})</p>
                        <p><strong>Email:</strong> {selectedCustomer.contactEmail}</p>
                        <p><strong>Status:</strong> {selectedCustomer.relationshipStatus}</p>
                    </div>
                )}
            </DialogBox>
        </div>
    )
}

export default Customers