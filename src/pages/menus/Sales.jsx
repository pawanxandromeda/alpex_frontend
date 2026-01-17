// PurchaseOrders.jsx (or Sales.jsx)
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import axios from '@utils/Axios';
import Header from '@components/Header'
import ImportPurchaseOrdersDialog from '@components/ImportPurchaseOrdersDialog';

import {
  AiOutlineSearch,
  AiOutlineFilter,
  AiOutlineDownload,
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineDollar,
  AiOutlineShopping,
  AiOutlineTeam,
  AiOutlineCalendar
} from 'react-icons/ai';
import {
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import Loading from '@components/Loading';
import DataGridTable from '@components/DataGridTable';
import PurchaseOrderDialog from '@components/PurchaseOrderDialog';
import CustomDeleteDialog from '@components/CustomDeleteDialog';
import CustomApproveDialog from '@components/CustomApproveDialog';
import AnalyticsDashboard from '@components/AnalyticsDashboard';
import DateRangePicker from '@components/DateRangePicker';
import decryptData from '../../utils/Decrypt';

const TABS = [
  { key: 'all', label: 'All', count: 0 },
  { key: 'pending', label: 'Pending', count: 0 },
  { key: 'md-pending', label: 'MD Pending', count: 0 },
  { key: 'approved', label: 'Approved', count: 0 },
  { key: 'completed', label: 'Completed', count: 0 },
  { key: 'drafts', label: 'Drafts', count: 0 }
];

const STATUS_COLORS = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Approved': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
  'Completed': 'bg-blue-100 text-blue-800',
  'Draft': 'bg-gray-100 text-gray-800'
};

const initialFormState = (username, poNumber = '') => ({
  gstNo: '',
  poNo: poNumber,
  poDate: new Date().toISOString().split('T')[0],
  brandName: '',
  composition: '',
  productNewOld: '',
  packStyle: '',
  notes: '',
  section: '',
  poQty: 0,
  mrp: 0,
  poRate: 0,
  cyc: 0,
  advance: 0,
  overallStatus: 'Pending',
  mdApproval: 'Pending',
  accountsApproval: 'Pending',
  designerApproval: 'Pending',
  ppicApproval: 'Pending',
  partyName: '',
  orderThrough: username,
  amount: 0,
  aluAluBlisterStripBottle: '',
  tabletCapsuleDrySyrupBottle: '',
  paymentTerms: '',
  batchQty: '',
  batchNo: '',
  showStatus: true,
  items: [] // Added this line
});

function Sales() {
  const [state, setState] = useState({
    records: [],
    filteredRecords: [],
    loading: true,
    analyticsLoading: false,
    searchTerm: '',
    activeTab: 'all',
    filters: {
      gstNo: '',
      poNo: '',
      overallStatus: '',
      fromDate: null,
      toDate: null
    },
    showFilters: false,
    showAddDialog: false,
    showEditDialog: false,
    showDeleteDialog: false,
    showApproveDialog: false,
    showAnalytics: false,
    selectedPO: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    },
    sortConfig: {
      field: 'createdAt',
      order: 'desc'
    },
    analytics: null,
    // Added these two states
    gstrData: [],
    compositions: []
  });

  const [formData, setFormData] = useState(() =>
    initialFormState(localStorage.getItem('username'))
  );
const [showImportDialog, setShowImportDialog] = useState(false);  
  const username = useMemo(() => localStorage.getItem('username'), []);
  const userRole = useMemo(() => localStorage.getItem('role'), []);
  const isAdmin = userRole === 'admin';
  const isMD = userRole === 'md';
  const isAccounts = userRole === 'accounts';
  const isDesigner = userRole === 'designer';
  const isPPIC = userRole === 'ppic';
  

  // Fetch purchase orders with filters
 

const fetchPurchaseOrders = useCallback(async () => {
  setState(prev => ({ ...prev, loading: true }));
  try {
    const { page, limit } = state.pagination;
    const { field, order } = state.sortConfig;
    const { filters } = state;
    
    const params = new URLSearchParams({
      page,
      limit,
      sortBy: field,
      order,
      ...(filters.gstNo && { gstNo: filters.gstNo }),
      ...(filters.poNo && { poNo: filters.poNo }),
      ...(filters.overallStatus && { overallStatus: filters.overallStatus }),
      ...(filters.fromDate && { fromDate: filters.fromDate.toISOString() }),
      ...(filters.toDate && { toDate: filters.toDate.toISOString() })
    });

    const response = await axios.get(`po?${params}`);
    // -----------------------
    // 🔒 DECRYPT HERE (supports encrypted payload or plain JSON)
    // -----------------------
    const payload = response?.data?.payload ?? response?.data;
    // Try to decrypt when payload is a string. If decryption fails, try JSON.parse fallback.
    let decrypted = payload;
    if (typeof payload === 'string') {
      console.debug('[Sales] payload string length:', payload.length, 'preview:', payload.slice(0, 200));
      decrypted = decryptData(payload);
      if (decrypted === null) {
        try {
          decrypted = JSON.parse(payload);
          console.debug('[Sales] parsed JSON from payload as fallback');
        } catch (e) {
          console.warn('[Sales] payload is not valid JSON and decryption failed');
        }
      }
    }
    console.debug('[Sales] decrypted value type:', typeof decrypted, decrypted && (Array.isArray(decrypted) ? `array(${decrypted.length})` : Object.keys(decrypted || {}).slice(0,6)));
    const data = Array.isArray(decrypted)
      ? decrypted
      : decrypted?.data ?? decrypted?.records ?? [];

    const pagination = decrypted?.pagination ?? response.data.pagination ?? {};

    // Filter records based on role & tab
    let filteredData = data.slice();
    if (!isAdmin) {
      filteredData = filteredData.filter(po => po.orderThrough === username);
    }

    if (state.activeTab !== 'all') {
      filteredData = filteredData.filter(po => {
        switch (state.activeTab) {
          case 'pending': return po.overallStatus === 'Pending';
          case 'md-pending': return po.mdApproval === 'Pending';
          case 'approved': return po.mdApproval === 'Approved' && po.overallStatus !== 'Completed';
          case 'completed': return po.overallStatus === 'Completed';
          case 'drafts': return po.overallStatus === 'Draft';
          default: return true;
        }
      });
    }

    // Apply search
    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase();
      filteredData = filteredData.filter(po =>
        po.poNo.toLowerCase().includes(term) ||
        po.brandName.toLowerCase().includes(term) ||
        po.partyName.toLowerCase().includes(term) ||
        po.gstNo.toLowerCase().includes(term)
      );
    }

    // Tab counts
    const counts = { all: data.length };
    TABS.forEach(tab => {
      if (tab.key !== 'all') {
        counts[tab.key] = data.filter(po => {
          switch (tab.key) {
            case 'pending': return po.overallStatus === 'Pending';
            case 'md-pending': return po.mdApproval === 'Pending';
            case 'approved': return po.mdApproval === 'Approved' && po.overallStatus !== 'Completed';
            case 'completed': return po.overallStatus === 'Completed';
            case 'drafts': return po.overallStatus === 'Draft';
            default: return false;
          }
        }).length;
      }
    });

    setState(prev => ({
      ...prev,
      records: data,
      filteredRecords: filteredData,
      loading: false,
      pagination: {
        ...prev.pagination,
        total: pagination.total,
        totalPages: pagination.totalPages
      }
    }));

    // Update tab labels
    TABS.forEach(tab => {
      const tabElement = document.querySelector(`[data-tab="${tab.key}"] .tab-count`);
      if (tabElement) tabElement.textContent = `(${counts[tab.key] || 0})`;
    });

  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    toast.error('Failed to load purchase orders');
    setState(prev => ({ ...prev, loading: false }));
  }
}, [state.pagination, state.sortConfig, state.filters, state.activeTab, state.searchTerm, isAdmin, username]);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    setState(prev => ({ ...prev, analyticsLoading: true }));
    try {
      const { fromDate, toDate } = state.filters;
      const params = new URLSearchParams();
      if (fromDate) params.append('fromDate', fromDate.toISOString());
      if (toDate) params.append('toDate', toDate.toISOString());

      const response = await axios.get(`po/analytics?${params}`);
      const payload = response?.data?.payload ?? response?.data;
      const decrypted = typeof payload === 'string' ? decryptData(payload) : payload;
      setState(prev => ({ ...prev, analytics: decrypted, analyticsLoading: false }));
    } catch (error) {
      console.error('Error fetching analytics:', error, {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        url: error?.config?.url,
        request: error?.request
      });
      toast.error('Failed to load analytics');
      setState(prev => ({ ...prev, analyticsLoading: false }));
    }
  }, [state.filters]);

  // Fetch GSTR data
  const fetchGstrData = useCallback(async () => {
    try {
      const response = await axios.get('po/gstr');
      const payload = response?.data?.payload ?? response?.data;
      const decrypted = typeof payload === 'string' ? decryptData(payload) : payload;
      let gstr = Array.isArray(decrypted) ? decrypted : decrypted?.data ?? decrypted?.records ?? [];

      setState(prev => ({ ...prev, gstrData: gstr }));
    } catch (error) {
      console.error('Error fetching GSTR data:', error, {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        url: error?.config?.url,
        request: error?.request
      });
      // If the route doesn't exist (404) treat as empty list (non-fatal)
      if (error?.response?.status === 404) {
        setState(prev => ({ ...prev, gstrData: [] }));
        return;
      }
      toast.error('Failed to load GST data');
    }
  }, []);

  // Automatic fetch on component mount
  useEffect(() => {
    fetchGstrData();
  }, [fetchGstrData]);


  // Fetch compositions
  const fetchCompositions = useCallback(async () => {
    try {
      const response = await axios.get('po/compositions');
      const payload = response?.data?.payload ?? response?.data;
      const decrypted = typeof payload === 'string' ? decryptData(payload) : payload;
      let comps = Array.isArray(decrypted) ? decrypted : decrypted?.data ?? decrypted?.records ?? [];
      setState(prev => ({ ...prev, compositions: comps }));
    } catch (error) {
      console.error('Error fetching compositions:', error, {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        url: error?.config?.url,
        request: error?.request
      });
      if (error?.response?.status === 404) {
        setState(prev => ({ ...prev, compositions: [] }));
        return;
      }
      toast.error('Failed to load compositions');
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchPurchaseOrders();
    fetchAnalytics();
    fetchGstrData();
    fetchCompositions();
  }, []);

 

  // Handle form amount calculation
  useEffect(() => {
    const amount = (formData.poQty || 0) * (formData.poRate || 0);
    setFormData(prev => ({ ...prev, amount }));
  }, [formData.poQty, formData.poRate]);

  // Handle search
  const handleSearch = (e) => {
    setState(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value }
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setState(prev => ({ ...prev, pagination: { ...prev.pagination, page: 1 } }));
    fetchPurchaseOrders();
    if (state.showAnalytics) {
      fetchAnalytics();
    }
  };

  // Clear filters
  const clearFilters = () => {
    setState(prev => ({
      ...prev,
      filters: {
        gstNo: '',
        poNo: '',
        overallStatus: '',
        fromDate: null,
        toDate: null
      },
      searchTerm: '',
      pagination: { ...prev.pagination, page: 1 }
    }));
  };

  // Handle sort
  const handleSort = (field) => {
    setState(prev => ({
      ...prev,
      sortConfig: {
        field,
        order: prev.sortConfig.field === field && prev.sortConfig.order === 'asc' ? 'desc' : 'asc'
      }
    }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page }
    }));
  };

  // Generate new PO number
  const generatePONumber = async () => {
    try {
      const response = await axios.get('po/count');
      const payload = response?.data?.payload ?? response?.data;
      const decrypted = typeof payload === 'string' ? decryptData(payload) : payload;
      const count = decrypted?.count ?? response?.data?.count ?? 0;
      return `PO${String(count + 1).padStart(5, '0')}`;
    } catch (error) {
      console.error('Error generating PO number:', error);
      return `PO${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`;
    }
  };

  // Handle add PO
  const handleAdd = async () => {
    try {
      const poNumber = await generatePONumber();
      setFormData(initialFormState(username, poNumber));
      setState(prev => ({ ...prev, showAddDialog: true }));
    } catch (error) {
      toast.error('Failed to generate PO number');
    }
  };

  // Handle edit PO
  const handleEdit = (po) => {
    setFormData({
      ...po,
      poDate: new Date(po.poDate).toISOString().split('T')[0],
      items: po.items || [] // Ensure items array exists
    });
    setState(prev => ({
      ...prev,
      selectedPO: po,
      showEditDialog: true
    }));
  };

  // Handle delete PO
  const handleDelete = (po) => {
    setState(prev => ({
      ...prev,
      selectedPO: po,
      showDeleteDialog: true
    }));
  };

  // Handle approve PO (for MD)
  const handleApprove = (po) => {
    setState(prev => ({
      ...prev,
      selectedPO: po,
      showApproveDialog: true
    }));
  };

  // Handle form submission
 const handleDialogSubmit = async (dialogFormData) => {
  try {
    // ✅ clone data
    const dataToSubmit = { ...dialogFormData };

    // 🚨 OPTION 1 FIX — remove items completely
    delete dataToSubmit.items;

    // ✅ type safety fixes (VERY IMPORTANT)
    dataToSubmit.batchQty = dataToSubmit.batchQty
      ? Number(dataToSubmit.batchQty)
      : null;

    dataToSubmit.showStatus = String(dataToSubmit.showStatus);

    const endpoint = state.showAddDialog
      ? 'po/create'
      : `po/${state.selectedPO.id}`;

    const method = state.showAddDialog ? 'post' : 'put';

    await axios[method](endpoint, dataToSubmit);

    toast.success(
      `Purchase Order ${state.showAddDialog ? 'created' : 'updated'} successfully`
    );

    fetchPurchaseOrders();

    setState(prev => ({
      ...prev,
      showAddDialog: false,
      showEditDialog: false,
      selectedPO: null
    }));
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operation failed');
  }
};

  // Handle PO completion
  const handleCompletePO = async (poNo) => {
    try {
      await axios.put(`po/complete/${poNo}`);
      toast.success('Purchase Order marked as completed');
      fetchPurchaseOrders();
    } catch (error) {
      toast.error('Failed to complete purchase order');
    }
  };

  // Handle department approval
  const handleDepartmentApproval = async (poId, department, status) => {
    try {
      const updateData = { [`${department}Approval`]: status };
      await axios.put(`po/${poId}`, updateData);
      toast.success(`${department.toUpperCase()} approval updated`);
      fetchPurchaseOrders();
    } catch (error) {
      toast.error('Failed to update approval');
    }
  };

// Update the exportToExcel function
const exportToExcel = async () => {
  try {
    const { fromDate, toDate } = state.filters;
    const params = new URLSearchParams();

    if (fromDate) params.append('fromDate', fromDate.toISOString());
    if (toDate) params.append('toDate', toDate.toISOString());

    const response = await axios.get(`po/export?${params}`, {
      responseType: 'blob', // ✅ IMPORTANT
    });

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `purchase_orders_${new Date().toISOString().split('T')[0]}.xlsx`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success('Purchase orders exported successfully');
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Failed to export purchase orders');
  }
};
  

  if (state.loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        heading="Purchase Orders Management"
        description="Manage and track all purchase orders efficiently"
        buttonName={
          <>
            <FiPlus className="mr-2 h-5 w-5" />
            New Purchase Order
          </>
        }
        handleClick={handleAdd}
      />
      <div className="px-6 lg:px-8">      {/* Analytics / Export toolbar */}
    <div className="px-6 lg:px-8 mt-4 mb-6 ml-4">
  <div className="flex items-center justify-end space-x-3">
    <button
      onClick={() => setShowImportDialog(true)}
      className="px-4 py-2 bg-white border border-blue-100 rounded-xl text-blue-700 hover:bg-blue-50 text-sm flex items-center space-x-2"
    >
      <span className="font-medium">Import</span>
    </button>
    
    <button
      onClick={() => setState(prev => ({ ...prev, showAnalytics: !prev.showAnalytics }))}
      className="px-4 py-2 bg-white border border-blue-100 rounded-xl text-blue-700 hover:bg-blue-50 text-sm flex items-center space-x-2"
    >
      <AiOutlineEye className="mr-2" />
      <span className="font-medium">{state.showAnalytics ? 'Hide Analytics' : 'Show Analytics'}</span>
    </button>

    <button
      onClick={exportToExcel}
      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm hover:from-blue-600 hover:to-blue-700 flex items-center space-x-2"
    >
      <AiOutlineDownload className="mr-2" />
      <span className="font-medium">Export</span>
    </button>
  </div>
</div>


      {/* Analytics Dashboard */}
      {state.showAnalytics && (
        <AnalyticsDashboard
          analytics={state.analytics}
          loading={state.analyticsLoading}
          filters={state.filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
        />
      )}

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by PO No, Brand, Party, or GST..."
              value={state.searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setState(prev => ({ ...prev, showFilters: !prev.showFilters }))}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AiOutlineFilter className="mr-2" />
              Filters
              {state.showFilters ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {state.showFilters && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST No
                </label>
                <input
                  type="text"
                  value={state.filters.gstNo}
                  onChange={(e) => handleFilterChange('gstNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PO No
                </label>
                <input
                  type="text"
                  value={state.filters.poNo}
                  onChange={(e) => handleFilterChange('poNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={state.filters.overallStatus}
                  onChange={(e) => handleFilterChange('overallStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              
              <DateRangePicker
                fromDate={state.filters.fromDate}
                toDate={state.filters.toDate}
                onFromDateChange={(date) => handleFilterChange('fromDate', date)}
                onToDateChange={(date) => handleFilterChange('toDate', date)}
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            data-tab={tab.key}
            onClick={() => setState(prev => ({ ...prev, activeTab: tab.key, pagination: { ...prev.pagination, page: 1 } }))}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              state.activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className="tab-count ml-2 text-sm opacity-75">
              (0)
            </span>
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <DataGridTable
  data={state.filteredRecords}
  columns={[
    {
      field: 'poNo',
      header: 'PO Number',
      sortable: true,
      renderCell: (value) => (
        <span className="font-mono font-semibold text-blue-600">
          {value}
        </span>
      )
    },
    {
      field: 'poDate',
      header: 'Date',
      sortable: true,
      renderCell: (value) => new Date(value).toLocaleDateString()
    },
    {
      field: 'gstNo',
      header: 'GST No',
      sortable: true,
      renderCell: (value) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    {
      field: 'partyName',
      header: 'Party Name',
      sortable: true
    },
    {
      field: 'brandName',
      header: 'Brand',
      sortable: true
    },
    {
      field: 'poQty',
      header: 'Quantity',
      sortable: true,
      renderCell: (value) => value?.toLocaleString()
    },
    {
      field: 'amount',
      header: 'Amount',
      sortable: true,
      renderCell: (value) => (
        <span className="font-semibold">
          ₹{value?.toLocaleString()}
        </span>
      )
    },
    {
      field: 'overallStatus',
      header: 'Status',
      sortable: true,
      renderCell: (value, row) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[value] || 'bg-gray-100 text-gray-800'}`}>
          {value}
        </span>
      )
    },
    {
      field: 'mdApproval',
      header: 'MD Status',
      sortable: true,
      renderCell: (value) => (
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
          value === 'Approved' ? 'bg-green-100 text-green-800' :
          value === 'Rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    }
  ]}
  // Use individual action props as the DataGridTable expects:
  onView={(po) => handleEdit(po)}
  onUpdate={(po) => {
    if (po.overallStatus !== 'Completed') {
      handleEdit(po);
    }
  }}
  onDelete={(po) => {
    if (po.overallStatus !== 'Completed') {
      handleDelete(po);
    }
  }}
  onApprove={isMD ? (po) => {
    if (po.mdApproval === 'Pending') {
      handleApprove(po);
    }
  } : null}
  // Remove these props that aren't supported:
  // onSort={handleSort}
  // sortConfig={state.sortConfig}
  // actions={[...]}
  // rowActions={true}
/>

        {/* Pagination */}
        {state.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing page {state.pagination.page} of {state.pagination.totalPages}
              {' '}({state.filteredRecords.length} of {state.pagination.total} records)
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(state.pagination.page - 1)}
                disabled={state.pagination.page === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <FiChevronLeft />
              </button>
              
              {[...Array(Math.min(5, state.pagination.totalPages))].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg ${
                      state.pagination.page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {state.pagination.totalPages > 5 && (
                <span className="px-2">...</span>
              )}
              
              <button
                onClick={() => handlePageChange(state.pagination.page + 1)}
                disabled={state.pagination.page === state.pagination.totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Department Approval Panel */}
      {(isAccounts || isDesigner || isPPIC) && (
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Department Approvals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isAccounts && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-3">Accounts Department</h3>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200">
                    View Pending Approvals
                  </button>
                </div>
              </div>
            )}
            
            {isDesigner && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-3">Designer Department</h3>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    View Pending Designs
                  </button>
                </div>
              </div>
            )}
            
            {isPPIC && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-3">PPIC Department</h3>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200">
                    View Batches
                  </button>
                  <button className="w-full px-3 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200">
                    Production Planning
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dialogs */}
      <PurchaseOrderDialog
        show={state.showAddDialog || state.showEditDialog}
        onClose={() => setState(prev => ({
          ...prev,
          showAddDialog: false,
          showEditDialog: false,
          selectedPO: null
        }))}
        onSubmit={handleDialogSubmit}
        initialData={formData}
        mode={state.showAddDialog ? 'add' : 'edit'}
        title={state.showAddDialog ? 'Create New Purchase Order' : 'Edit Purchase Order'}
        // Added these props
        gstrData={state.gstrData}
    compositions={[
    'Composition A',
    'Composition B',
    'Composition C'
  ]}   />

      <CustomDeleteDialog
        isOpen={state.showDeleteDialog}
        onClose={() => setState(prev => ({ ...prev, showDeleteDialog: false }))}
        onConfirm={async () => {
          try {
            await axios.delete(`po/${state.selectedPO.id}`);
            toast.success('Purchase Order deleted successfully');
            fetchPurchaseOrders();
            setState(prev => ({ ...prev, showDeleteDialog: false }));
          } catch (error) {
            toast.error('Failed to delete purchase order');
          }
        }}
        title="Delete Purchase Order"
        message="Are you sure you want to delete this purchase order? This action cannot be undone."
      />

      <CustomApproveDialog
        isOpen={state.showApproveDialog}
        onClose={() => setState(prev => ({ ...prev, showApproveDialog: false }))}
        onConfirm={async () => {
          try {
            await handleDepartmentApproval(state.selectedPO.id, 'md', 'Approved');
            setState(prev => ({ ...prev, showApproveDialog: false }));
          } catch (error) {
            toast.error('Failed to approve purchase order');
          }
        }}
        title="Approve Purchase Order"
        message={`Approve PO ${state.selectedPO?.poNo} for ${state.selectedPO?.partyName}?`}
      />
<ImportPurchaseOrdersDialog
  isOpen={showImportDialog}
  onClose={() => setShowImportDialog(false)}
  onImported={() => { 
    setShowImportDialog(false); 
    fetchPurchaseOrders(); // Refresh the list
  }}
/>
    </div>
    
  );
}

export default Sales;