import React, { useState, useEffect } from 'react'
import DialogBox from '@components/DialogBox'
import axios from '@axios'
import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'

const DB_FIELDS = [
  'customerID',
  'customerName',
  'gstrNo',
  'contactName',
  'contactPhone',
  'contactEmail',
  'address',
  'creditLimit',
  'paymentTerms',
  'relationshipStatus',
  'kycProfile',
  'remarks',
  'dlExpiry',
  'gstCopy',
  'throughVia'
]

const ImportCustomersDialog = ({ isOpen, onClose, onImported }) => {
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

      // special cases
      if (idx === -1 && (dbNorm.includes('gstr') || dbNorm.includes('gst'))) {
        idx = headerNorms.findIndex(hn => hn.includes('gst') || hn.includes('gstr'))
      }

      if (idx === -1 && dbNorm.includes('contact')) {
        idx = headerNorms.findIndex(hn => hn.includes('phone') || hn.includes('contact') || hn.includes('mobile'))
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

    if (Object.keys(mappingsObj).length === 0) { toast.error('Please map at least one field'); return }

    const form = new FormData()
    form.append('file', file)
    form.append('mappings', JSON.stringify(mappingsObj))

    setIsLoading(true)
    try {
      const resp = await axios.post('customers/import', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success(`Imported ${resp.data.inserted || 0} records`)
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
      title="Import Customers from Excel"
      handleSubmit={handleSubmit}
      submitText="Import"
      submitColor="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
      isLoading={isLoading}
      size="max-w-3xl"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Excel File</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={onFileChange}
            className="mt-2"
          />
          <p className="text-xs text-gray-400 mt-2">Upload an Excel file. The first sheet will be used.</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">Detected headers: <span className="font-semibold">{headers.length}</span></div>
          <div className="flex items-center space-x-2">
            <button onClick={autoMap} type="button" className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm">Auto-map</button>
            <button onClick={() => { setHeaders([]); setPreviewRows([]); setFile(null); setMapping(DB_FIELDS.reduce((acc, f) => ({ ...acc, [f]: '' }), {})) }} type="button" className="px-3 py-1.5 rounded-xl bg-white border border-gray-100 text-sm">Reset</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Map fields</div>
            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto border rounded-lg p-3 bg-white">
              {DB_FIELDS.map((db) => (
                <div key={db} className="flex items-center justify-between space-x-3">
                  <div className="text-sm text-gray-600">{db}</div>
                  <select value={mapping[db] || ''} onChange={(e) => setMapping({ ...mapping, [db]: e.target.value })} className="ml-3 text-sm rounded-lg border p-2">
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
            <div className="text-sm font-medium text-gray-700">Preview (first 5 rows)</div>
            <div className="max-h-72 overflow-y-auto border rounded-lg bg-white p-3 text-xs">
              {mappedPreview.length === 0 ? (
                <div className="text-gray-400">No preview available</div>
              ) : (
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr>
                      {DB_FIELDS.map((db) => (
                        <th key={db} className="text-left pr-3 pb-1 text-gray-600 border-b">{db}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mappedPreview.map((row, idx) => (
                      <tr key={idx} className="align-top">
                        {DB_FIELDS.map((db) => (
                          <td key={db} className="pr-3 py-1 align-top text-gray-700">{String(row[db] ?? '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400">Tip: Use <span className="font-medium">Auto-map</span> to automatically match headers to common field names.</div>
      </div>
    </DialogBox>
  )
}

export default ImportCustomersDialog
