// @components/ImportPurchaseOrdersDialog.jsx
import React, { useState, useEffect } from 'react'
import DialogBox from '@components/DialogBox'
import axios from '@axios'
import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'

const DB_FIELDS = [
  'gstNo',
  'poNo',
  'brandName',
  'partyName',
  'batchNo',
  'paymentTerms',
  'invCha',
  'cylChar',
  'orderThrough',
  'address',
  'composition',
  'notes',
  'rmStatus',
  'section',
  'tabletCapsuleDrySyrupBottle',
  'roundOvalTablet',
  'tabletColour',
  'aluAluBlisterStripBottle',
  'packStyle',
  'productNewOld',
  'qaObservations',
  'pvcColourBase',
  'foil',
  'lotNo',
  'foilSize',
  'foilPoVendor',
  'cartonPoVendor',
  'design',
  'overallStatus',
  'invoiceNo',
  'showStatus',
  'mdApproval',
  'accountsApproval',
  'designerApproval',
  'ppicApproval',
  'salesComments',
  'poQty',
  'batchQty',
  'foilQuantity',
  'cartonQuantity',
  'qtyPacked',
  'noOfShippers',
  'changePart',
  'cyc',
  'poRate',
  'amount',
  'mrp',
  'advance',
  'poDate',
  'dispatchDate',
  'expiry',
  'foilPoDate',
  'foilBillDate',
  'cartonPoDate',
  'cartonBillDate',
  'packingDate',
  'invoiceDate'
]

const ImportPurchaseOrdersDialog = ({ isOpen, onClose, onImported }) => {
  const [file, setFile] = useState(null)
  const [headers, setHeaders] = useState([])
  const [previewRows, setPreviewRows] = useState([])
  const [mapping, setMapping] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) reset()
  }, [isOpen])

  const reset = () => {
    setFile(null)
    setHeaders([])
    setPreviewRows([])
    setMapping(DB_FIELDS.reduce((acc, f) => ({ ...acc, [f]: '' }), {}))
    setIsLoading(false)
  }

  const onFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)

    const reader = new FileReader()
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]

      // Get header row
      const rowsAsArrays = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      const hdrs = rowsAsArrays[0] ? rowsAsArrays[0].map((h) => (h === undefined || h === null) ? '' : String(h).trim()) : []
      setHeaders(hdrs)

      const jsonRows = XLSX.utils.sheet_to_json(sheet)
      setPreviewRows(jsonRows.slice(0, 5))

      // initialize mapping with empty values
      setMapping(DB_FIELDS.reduce((acc, f) => ({ ...acc, [f]: '' }), {}))
    }
    reader.readAsArrayBuffer(f)
  }

  const normalize = (s = '') => s.toString().toLowerCase().replace(/[^a-z0-9]/g, '')

  const autoMap = () => {
    if (!headers?.length) return
    const headerNorms = headers.map(h => normalize(h))
    const newMap = {}

    DB_FIELDS.forEach(db => {
      const dbNorm = normalize(db)
      let idx = headerNorms.findIndex(hn => hn === dbNorm || hn.includes(dbNorm) || dbNorm.includes(hn))

      // Special cases for common variations
      if (idx === -1) {
        const variations = {
          'gstno': ['gst', 'gstin', 'gstr'],
          'pono': ['po', 'purchaseorder', 'orderno'],
          'partyname': ['party', 'customername', 'client'],
          'brandname': ['brand', 'productname'],
          'podate': ['date', 'orderdate', 'purchasedate'],
          'poqty': ['quantity', 'qty', 'orderqty'],
          'porate': ['rate', 'unitprice', 'price'],
          'amount': ['total', 'value', 'totalamount'],
          'overallstatus': ['status', 'orderstatus']
        }

        for (const [field, aliases] of Object.entries(variations)) {
          if (dbNorm === field) {
            for (const alias of aliases) {
              idx = headerNorms.findIndex(hn => hn.includes(alias) || alias.includes(hn))
              if (idx !== -1) break
            }
          }
        }
      }

      newMap[db] = idx >= 0 ? headers[idx] : ''
    })

    setMapping(newMap)
    toast.info('Auto-mapped fields where possible')
  }

  const mappedPreview = previewRows.map((row) => {
    const mapped = {}
    DB_FIELDS.forEach(db => {
      const h = mapping[db]
      mapped[db] = h ? (row[h] ?? null) : null
    })
    return mapped
  })

  const handleSubmit = async () => {
    if (!file) { toast.error('Please select an Excel file'); return }

    const mappingsObj = {}
    Object.entries(mapping).forEach(([db, hdr]) => {
      if (hdr) mappingsObj[db] = hdr
    })

    // Check for required fields
    const requiredFields = ['gstNo', 'poNo']
    const missingRequired = requiredFields.filter(field => !mappingsObj[field])
    
    if (missingRequired.length > 0) {
      toast.error(`Required fields not mapped: ${missingRequired.join(', ')}`)
      return
    }

    if (Object.keys(mappingsObj).length === 0) { 
      toast.error('Please map at least one field'); 
      return 
    }

    const form = new FormData()
    form.append('file', file)
    form.append('mappings', JSON.stringify(mappingsObj))

    setIsLoading(true)
    try {
      const resp = await axios.post('po/import', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success(`Imported ${resp.data.inserted || 0} purchase orders (${resp.data.skipped || 0} skipped)`)
      onImported && onImported(resp.data)
      setIsLoading(false)
      reset()
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Import failed')
      console.error(err)
      setIsLoading(false)
    }
  }

  return (
    <DialogBox
      isOpen={isOpen}
      onClose={onClose}
      title="Import Purchase Orders from Excel"
      handleSubmit={handleSubmit}
      submitText="Import"
      submitColor="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
      isLoading={isLoading}
      size="max-w-4xl"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Excel File</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={onFileChange}
            className="mt-2 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-400 mt-2">
            Upload an Excel file with purchase order data. The first sheet will be used.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Detected headers: <span className="font-semibold">{headers.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={autoMap} 
              type="button" 
              className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm hover:bg-blue-100 transition-colors"
            >
              Auto-map
            </button>
            <button 
              onClick={reset} 
              type="button" 
              className="px-3 py-1.5 rounded-xl bg-white border border-gray-100 text-sm hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Map fields (scroll to see all)</div>
            <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto border rounded-lg p-3 bg-white">
              {DB_FIELDS.map((db) => (
                <div key={db} className="flex items-center justify-between space-x-3">
                  <div className="text-xs text-gray-600 truncate min-w-[120px]">
                    <span className={['gstNo', 'poNo'].includes(db) ? 'font-semibold text-red-600' : ''}>
                      {db}
                    </span>
                    {['gstNo', 'poNo'].includes(db) && <span className="text-red-500 ml-1">*</span>}
                  </div>
                  <select 
                    value={mapping[db] || ''} 
                    onChange={(e) => setMapping({ ...mapping, [db]: e.target.value })} 
                    className="text-xs rounded-lg border p-2 w-40"
                  >
                    <option value="">-- Ignore --</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">Preview (first 5 rows)</div>
              <div className="text-xs text-gray-500">
                {previewRows.length} rows available
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto border rounded-lg bg-white p-3">
              {mappedPreview.length === 0 ? (
                <div className="text-gray-400 text-sm text-center py-8">
                  No preview available. Upload a file first.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b">
                        {DB_FIELDS.filter(db => mapping[db]).map((db) => (
                          <th 
                            key={db} 
                            className="text-left p-2 text-gray-600 font-medium truncate max-w-[120px]"
                            title={db}
                          >
                            {db}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mappedPreview.map((row, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          {DB_FIELDS.filter(db => mapping[db]).map((db) => (
                            <td 
                              key={db} 
                              className="p-2 text-gray-700 truncate max-w-[120px] align-top"
                              title={String(row[db] ?? '')}
                            >
                              {row[db] !== null && row[db] !== undefined ? String(row[db]) : ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 pt-2 border-t">
          <p className="font-medium mb-1">Notes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Required fields: <span className="font-semibold text-red-600">gstNo</span> and <span className="font-semibold text-red-600">poNo</span></li>
            <li>Use <span className="font-medium">Auto-map</span> to automatically match headers</li>
            <li>Date fields will be automatically converted from Excel format</li>
            <li>Numeric fields (qty, rate, amount) will be converted to numbers</li>
            <li>Duplicate PO numbers will be skipped</li>
          </ul>
        </div>
      </div>
    </DialogBox>
  )
}

export default ImportPurchaseOrdersDialog