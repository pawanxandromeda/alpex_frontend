import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Loading from '@loading';
import axios from '@axios';

import decryptData from '../../utils/Decrypt';
import Header from '@components/Header';
import DataGridTable from '@components/DataGridTable';

function Accounts() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [showPoDisputeDialog, setShowPoDisputeDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  
  const [selectedBill, setSelectedBill] = useState(null);
  const [disputeComments, setDisputeComments] = useState('');
  const [poDisputeComments, setPoDisputeComments] = useState('');
  const [salesComments, setSalesComments] = useState('');
  
  const [createForm, setCreateForm] = useState({
    purchaseOrderId: '',
    billNo: '',
    billAmt: '',
    partyName: '',
    dueDate: '',
    salesComments: '',
  });

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/accounts?page=${page}&limit=${limit}`);
        console.log('Fetched bills:', res.data);
        let decrypted = null;
        if (res.data.payload) {
          decrypted = decryptData(res.data.payload);
          console.log('Decrypted payload:', decrypted);
        } else if (res.data.data && typeof res.data.data === 'string') {
          decrypted = decryptData(res.data.data);
        } else {
          decrypted = res.data.data || res.data;
        }
        const arr = Array.isArray(decrypted.data) ? decrypted.data : (Array.isArray(decrypted) ? decrypted : []);
        setBills(arr);
        setTotal(decrypted.total || 0);
      } catch (err) {
        toast.error('Failed to load bills');
        setBills([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, [page, limit]);

  const handleCreateBill = async () => {
    try {
      await axios.post('/accounts', createForm);
      toast.success('Bill created successfully');
      setShowCreateDialog(false);
      setCreateForm({ purchaseOrderId: '', billNo: '', billAmt: '', partyName: '', dueDate: '', salesComments: '' });
      setPage(1);
      setLoading(true);
      const res = await axios.get(`/accounts?page=1&limit=${limit}`);
      let decrypted = null;
      if (res.data.payload) {
        decrypted = decryptData(res.data.payload);
      } else if (res.data.data && typeof res.data.data === 'string') {
        decrypted = decryptData(res.data.data);
      } else {
        decrypted = res.data.data || res.data;
      }
      const arr = Array.isArray(decrypted.data) ? decrypted.data : (Array.isArray(decrypted) ? decrypted : []);
      setBills(arr);
      setTotal(decrypted.total || 0);
    } catch (err) {
      toast.error('Failed to create bill');
    }
  };

  const handleView = (row) => {
    setSelectedBill(row.raw || row);
    setShowViewDialog(true);
  };

  const handleEdit = (row) => {
    console.log('Edit bill:', row);
  };

  const handleDelete = async (row) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await axios.delete(`/accounts/${row.id}`);
        toast.success('Bill deleted successfully');
        setPage(1);
        setLoading(true);
        const res = await axios.get(`/accounts?page=1&limit=${limit}`);
        let decrypted = null;
        if (res.data.payload) {
          decrypted = decryptData(res.data.payload);
        } else if (res.data.data && typeof res.data.data === 'string') {
          decrypted = decryptData(res.data.data);
        } else {
          decrypted = res.data.data || res.data;
        }
        const arr = Array.isArray(decrypted.data) ? decrypted.data : (Array.isArray(decrypted) ? decrypted : []);
        setBills(arr);
        setTotal(decrypted.total || 0);
      } catch (err) {
        toast.error('Failed to delete bill');
      }
    }
  };

  const handleRaiseDispute = async (row) => {
    setSelectedBill(row);
    setDisputeComments('');
    setShowDisputeDialog(true);
  };

  const handleRaisePoDispute = async (row) => {
    setSelectedBill(row);
    setPoDisputeComments('');
    setShowPoDisputeDialog(true);
  };

  const handleAddSalesComment = (row) => {
    setSelectedBill(row);
    setSalesComments(row.salesComments || '');
    setShowCommentDialog(true);
  };

  const submitDispute = async () => {
    if (!disputeComments.trim()) {
      toast.error('Please enter dispute comments');
      return;
    }

    try {
      await axios.post(`/accounts/${selectedBill.billNo}/dispute`, { comments: disputeComments });
      toast.success("Dispute raised successfully");
      setShowDisputeDialog(false);
      setDisputeComments('');
      refreshBills();
    } catch (err) {
      toast.error("Failed to raise dispute");
    }
  };

  const submitPoDispute = async () => {
    if (!poDisputeComments.trim()) {
      toast.error('Please enter PO-level dispute comments');
      return;
    }

    try {
      await axios.post(`/accounts/po/${selectedBill.billNo}/dispute`, { comments: poDisputeComments });
      toast.success("PO-level dispute raised successfully");
      setShowPoDisputeDialog(false);
      setPoDisputeComments('');
      refreshBills();
    } catch (err) {
      toast.error("Failed to raise PO-level dispute");
    }
  };

  const submitSalesComment = async () => {
    if (!salesComments.trim()) {
      toast.error('Please enter sales comments');
      return;
    }

    try {
      await axios.post(`/accounts/po/${selectedBill.billNo}/sales-comment`, { salesComments });
      toast.success("Sales comment added successfully");
      setShowCommentDialog(false);
      setSalesComments('');
      refreshBills();
    } catch (err) {
      toast.error("Failed to add sales comment");
    }
  };

  const refreshBills = async () => {
    setPage(1);
    setLoading(true);
    try {
      const res = await axios.get(`/accounts?page=1&limit=${limit}`);
      let decrypted = null;
      if (res.data.payload) {
        decrypted = decryptData(res.data.payload);
      } else if (res.data.data && typeof res.data.data === "string") {
        decrypted = decryptData(res.data.data);
      } else {
        decrypted = res.data.data || res.data;
      }
      const arr = Array.isArray(decrypted.data) ? decrypted.data : (Array.isArray(decrypted) ? decrypted : []);
      setBills(arr);
      setTotal(decrypted.total || 0);
    } catch (err) {
      toast.error("Failed to refresh bills");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        heading="Accounts - Bills"
        description="View and manage bills across all purchase orders"
      />
      <div className="px-8 flex justify-between items-center mb-4">
        <span className="text-gray-600">Total: {total}</span>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={() => setShowCreateDialog(true)}
        >
          + Create Bill
        </button>
      </div>
      <div className="px-8">
       <DataGridTable
          data={Array.isArray(bills) ? bills.map((bill, idx) => ({
            sNo: idx + 1 + (page - 1) * limit,
            billNo: bill.billNo,
            poNo: bill.billNo,
            partyName: bill.partyName,
            billAmt: bill.billAmt,
            receivedAmount: bill.receivedAmount,
            balanceAmount: bill.balanceAmount,
            dueDate: bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : '',
            dueDays: bill.dueDays,
            salesComments: bill.salesComments,
            id: bill.id,
            purchaseOrderId: bill.purchaseOrderId,
            pdcAmount: bill.pdcAmount,
            pdcDate: bill.pdcDate ? new Date(bill.pdcDate).toLocaleDateString() : '',
            chqNo: bill.chqNo,
            pdcReceiveDate: bill.pdcReceiveDate ? new Date(bill.pdcReceiveDate).toLocaleDateString() : '',
            marketingPersonnelName: bill.marketingPersonnelName,
            accountsComments: bill.accountsComments,
            chequesExpected: bill.chequesExpected,
            remarks: bill.remarks,
            poDate: bill.poDate ? new Date(bill.poDate).toLocaleDateString() : '',
            poCreatedAt: bill.poCreatedAt ? new Date(bill.poCreatedAt).toLocaleDateString() : '',
            poAmount: bill.poAmount,
            poOverallStatus: bill.poOverallStatus,
            invoiceNo: bill.invoiceNo,
            invoiceDate: bill.invoiceDate ? new Date(bill.invoiceDate).toLocaleDateString() : '',
            gstNo: bill.gstNo,
            raw: bill,
          })) : []}
          columns={[
            { field: 'sNo', header: 'S.No', sortable: false },
            { field: 'billNo', header: 'Bill No', sortable: true },
            { field: 'poNo', header: 'PO No', sortable: true },
            { field: 'partyName', header: 'Party Name', sortable: true },
            { field: 'billAmt', header: 'Bill Amount', sortable: true },
            { field: 'receivedAmount', header: 'Received', sortable: true },
            { field: 'balanceAmount', header: 'Balance', sortable: true },
            { field: 'dueDate', header: 'Due Date', sortable: true },
            { field: 'dueDays', header: 'Due Days', sortable: true },
            { field: 'salesComments', header: 'Sales Comments', sortable: false },
            { field: 'pdcAmount', header: 'PDC Amount', sortable: true },
            { field: 'pdcDate', header: 'PDC Date', sortable: true },
            { field: 'chqNo', header: 'Cheque No', sortable: true },
            { field: 'pdcReceiveDate', header: 'PDC Receive Date', sortable: true },
            { field: 'marketingPersonnelName', header: 'Marketing Personnel', sortable: true },
            { field: 'accountsComments', header: 'Accounts Comments', sortable: false },
            { field: 'chequesExpected', header: 'Cheques Expected', sortable: true },
            { field: 'remarks', header: 'Remarks', sortable: false },
            { field: 'poDate', header: 'PO Date', sortable: true },
            { field: 'poCreatedAt', header: 'PO Created At', sortable: true },
            { field: 'poAmount', header: 'PO Amount', sortable: true },
            { field: 'poOverallStatus', header: 'PO Status', sortable: true },
  
            {
              field: 'actions',
              header: 'Actions',
              sortable: false,
              renderCell: (_, row) => (
               <div className="flex gap-3">
  <button
    onClick={() => handleView(row)}
    className="px-4 py-2 bg-white text-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 font-medium border border-gray-200 hover:bg-gray-50"
  >
    View
  </button>

  <button
    onClick={() => handleRaiseDispute(row)}
    className="px-4 py-2 bg-white text-yellow-600 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 font-medium border border-yellow-200 hover:bg-yellow-50"
  >
    Raise Dispute
  </button>

  <button
    onClick={() => handleRaisePoDispute(row)}
    className="px-4 py-2 bg-white text-orange-600 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 font-medium border border-orange-200 hover:bg-orange-50"
  >
    PO Dispute
  </button>

  <button
    onClick={() => handleAddSalesComment(row)}
    className="px-4 py-2 bg-white text-purple-600 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 font-medium border border-purple-200 hover:bg-purple-50"
  >
    Add Comment
  </button>
</div>

              ),
            },
          ]}
        />
      </div>

      {/* Create Bill Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create Bill</h2>
            <div className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Purchase Order ID"
                value={createForm.purchaseOrderId}
                onChange={e => setCreateForm(f => ({ ...f, purchaseOrderId: e.target.value }))}
              />
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Bill No"
                value={createForm.billNo}
                onChange={e => setCreateForm(f => ({ ...f, billNo: e.target.value }))}
              />
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Bill Amount"
                type="number"
                value={createForm.billAmt}
                onChange={e => setCreateForm(f => ({ ...f, billAmt: e.target.value }))}
              />
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Party Name"
                value={createForm.partyName}
                onChange={e => setCreateForm(f => ({ ...f, partyName: e.target.value }))}
              />
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Due Date (YYYY-MM-DD)"
                type="date"
                value={createForm.dueDate}
                onChange={e => setCreateForm(f => ({ ...f, dueDate: e.target.value }))}
              />
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Sales Comments"
                value={createForm.salesComments}
                onChange={e => setCreateForm(f => ({ ...f, salesComments: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleCreateBill}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Raise Dispute Dialog */}
      {showDisputeDialog && selectedBill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Raise Dispute</h2>
              <button
                onClick={() => setShowDisputeDialog(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Bill No:</span> {selectedBill.billNo}
              </p>
              <p className="text-sm text-yellow-800 mt-1">
                <span className="font-medium">Party:</span> {selectedBill.partyName}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dispute Comments <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                rows={5}
                placeholder="Enter detailed comments about the dispute..."
                value={disputeComments}
                onChange={(e) => setDisputeComments(e.target.value)}
                autoFocus
              />
              <p className="mt-1 text-sm text-gray-500">
                Please provide specific details about the issue
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                onClick={() => setShowDisputeDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors duration-200"
                onClick={submitDispute}
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Raise PO Dispute Dialog */}
      {showPoDisputeDialog && selectedBill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Raise PO-Level Dispute</h2>
              <button
                onClick={() => setShowPoDisputeDialog(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-orange-50 border border-orange-100 rounded-lg">
              <p className="text-sm text-orange-800">
                <span className="font-medium">PO No:</span> {selectedBill.billNo}
              </p>
              <p className="text-sm text-orange-800 mt-1">
                <span className="font-medium">Party:</span> {selectedBill.partyName}
              </p>
              <p className="text-xs text-orange-600 mt-2">
                Note: This will raise a dispute at the Purchase Order level
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PO-Level Dispute Comments <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                rows={5}
                placeholder="Enter detailed comments about the PO-level dispute..."
                value={poDisputeComments}
                onChange={(e) => setPoDisputeComments(e.target.value)}
                autoFocus
              />
              <p className="mt-1 text-sm text-gray-500">
                Provide reasons for disputing at the Purchase Order level
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                onClick={() => setShowPoDisputeDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors duration-200"
                onClick={submitPoDispute}
              >
                Submit PO Dispute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Sales Comment Dialog */}
      {showCommentDialog && selectedBill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add Sales Comment</h2>
              <button
                onClick={() => setShowCommentDialog(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg">
              <p className="text-sm text-purple-800">
                <span className="font-medium">Bill No:</span> {selectedBill.billNo}
              </p>
              <p className="text-sm text-purple-800 mt-1">
                <span className="font-medium">Party:</span> {selectedBill.partyName}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sales Comments <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows={5}
                placeholder="Enter sales comments or updates..."
                value={salesComments}
                onChange={(e) => setSalesComments(e.target.value)}
                autoFocus
              />
              <p className="mt-1 text-sm text-gray-500">
                These comments will be visible to accounts and sales teams
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                onClick={() => setShowCommentDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200"
                onClick={submitSalesComment}
              >
                Save Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Bill Dialog - Apple-like Design */}
      {showViewDialog && selectedBill && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowViewDialog(false)}
            />
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            
            <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl sm:my-8 sm:align-middle sm:max-w-4xl">
              {/* Modal Header */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Bill Details
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Bill No: {selectedBill.billNo || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowViewDialog(false)}
                    className="inline-flex items-center justify-center w-8 h-8 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-4">
                {/* Top Section - Financial Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                    <p className="text-sm text-blue-600 font-medium">Bill Amount</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(selectedBill.billAmt)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                    <p className="text-sm text-green-600 font-medium">Received Amount</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(selectedBill.receivedAmount)}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${selectedBill.balanceAmount > 0 ? 'bg-gradient-to-r from-red-50 to-red-100' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
                    <p className="text-sm font-medium">Balance Amount</p>
                    <p className={`text-2xl font-bold mt-1 ${selectedBill.balanceAmount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatCurrency(selectedBill.balanceAmount)}
                    </p>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-500">Party Name</span>
                          <span className="text-sm text-gray-900">{selectedBill.partyName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-500">PO Number</span>
                          <span className="text-sm text-gray-900">{selectedBill.billNo || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-500">Purchase Order ID</span>
                          <span className="text-sm text-gray-900">{selectedBill.purchaseOrderId || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dates Information */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Dates</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-500">Due Date</span>
                          <span className={`text-sm font-medium ${selectedBill.dueDays > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {selectedBill.dueDate ? new Date(selectedBill.dueDate).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            }) : 'N/A'}
                            {selectedBill.dueDays > 0 && ` (${selectedBill.dueDays} days overdue)`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-500">PO Date</span>
                          <span className="text-sm text-gray-900">
                            {selectedBill.poDate ? new Date(selectedBill.poDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-500">PO Created At</span>
                          <span className="text-sm text-gray-900">
                            {selectedBill.poCreatedAt ? new Date(selectedBill.poCreatedAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* PDC Information */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">PDC Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-500">PDC Amount</span>
                          <span className="text-sm text-gray-900">{formatCurrency(selectedBill.pdcAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-500">PDC Date</span>
                          <span className="text-sm text-gray-900">
                            {selectedBill.pdcDate ? new Date(selectedBill.pdcDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-500">Cheque Number</span>
                          <span className="text-sm text-gray-900">{selectedBill.chqNo || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-500">PDC Receive Date</span>
                          <span className="text-sm text-gray-900">
                            {selectedBill.pdcReceiveDate ? new Date(selectedBill.pdcReceiveDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Additional Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Status & Additional Info</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-500">PO Status</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            selectedBill.poOverallStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                            selectedBill.poOverallStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            selectedBill.poOverallStatus === 'Disputed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedBill.poOverallStatus || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-500">Marketing Personnel</span>
                          <span className="text-sm text-gray-900">{selectedBill.marketingPersonnelName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-500">Cheques Expected</span>
                          <span className="text-sm text-gray-900">{selectedBill.chequesExpected || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="mt-6 bg-gray-50 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Comments</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Sales Comments</p>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-900">
                          {selectedBill.salesComments || 'No sales comments available'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Accounts Comments</p>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-900">
                          {selectedBill.accountsComments || 'No accounts comments available'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Remarks</p>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-900">
                          {selectedBill.remarks || 'No remarks available'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowViewDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewDialog(false);
                    handleAddSalesComment(selectedBill);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Accounts;