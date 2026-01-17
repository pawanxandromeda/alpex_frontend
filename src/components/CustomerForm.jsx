import React, { useState, useEffect } from 'react';
import { FiInfo, FiAlertCircle, FiPlus, FiTrash2, FiUser, FiMail, FiPhone } from 'react-icons/fi';

const CustomerForm = ({ formData, handleChange }) => {
  const [contacts, setContacts] = useState([]);
  const commonInputClasses = "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:shadow-blue-100"

  // Initialize contacts from formData
  useEffect(() => {
    if (formData.contacts && Array.isArray(formData.contacts)) {
      setContacts(formData.contacts);
    } else if (formData.contactName || formData.contactPhone) {
      // Convert old single contact to new format
      setContacts([{
        name: formData.contactName || '',
        phone: formData.contactPhone || '',
        email: formData.contactEmail || '',
        role: 'Primary Contact'
      }]);
    } else {
      setContacts([{ name: '', phone: '', email: '', role: '' }]);
    }
  }, [formData]);

  // Update formData when contacts change
  const updateContacts = (newContacts) => {
    setContacts(newContacts);
    handleChange({
      target: { name: 'contacts', value: newContacts }
    });
  };

  const addContact = () => {
    const newContacts = [...contacts, { name: '', phone: '', email: '', role: '' }];
    updateContacts(newContacts);
  };

  const updateContactField = (index, field, value) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    updateContacts(newContacts);
  };

  const removeContact = (index) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    updateContacts(newContacts);
  };

  const renderFormField = (label, name, type = 'text', required = false, placeholder = '', tooltip = '') => {
    if (name === 'relationshipStatus') {
      const options = ['Good', 'Moderate', 'Bad'];
      return (
        <div className="space-y-2 relative">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              {label} {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {tooltip && (
              <div className="group relative">
                <FiInfo className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute right-0 top-6 w-48 bg-gray-800 text-white text-xs rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  {tooltip}
                  <div className="absolute -top-1 right-2 h-2 w-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
            )}
          </div>
          <select
            name={name}
            className={commonInputClasses}
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
          >
            <option value="" disabled>Select Relationship Status</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (name === 'creditApprovalStatus') {
      const options = ['Approved', 'Pending', 'Rejected'];
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
          <select
            name={name}
            className={commonInputClasses}
            value={formData[name] || 'Approved'}
            onChange={handleChange}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            name={name}
            placeholder={placeholder || `Enter ${label}`}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 min-h-[100px] resize-none"
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
            rows={3}
          />
        </div>
      );
    }

    if (type === 'checkbox') {
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name={name}
              checked={formData[name] || false}
              onChange={(e) => handleChange({
                target: { name, value: e.target.checked }
              })}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">
              {label}
            </label>
          </div>
          {tooltip && (
            <p className="text-xs text-gray-500">{tooltip}</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2 relative">
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <input
            name={name}
            type={type}
            placeholder={placeholder || `Enter ${label}`}
            className={commonInputClasses}
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
          />
          {required && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContactForm = (contact, index) => {
    const contactTypes = ['Primary Contact', 'Driver', 'Dispatcher', 'Manager', 'Accounts', 'Other'];
    
    return (
      <div key={index} className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FiUser className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-800">Contact {index + 1}</span>
            {contact.role === 'Primary Contact' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Primary</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {contacts.length > 1 && index > 0 && (
              <button
                type="button"
                onClick={() => {
                  const newContacts = [...contacts];
                  [newContacts[0], newContacts[index]] = [newContacts[index], newContacts[0]];
                  updateContacts(newContacts);
                }}
                className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
              >
                Make Primary
              </button>
            )}
            
            {contacts.length > 1 && (
              <button
                type="button"
                onClick={() => removeContact(index)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Type
            </label>
            <select
              value={contact.role || ''}
              onChange={(e) => updateContactField(index, 'role', e.target.value)}
              className={commonInputClasses}
              required={index === 0}
            >
              <option value="">Select Contact Type</option>
              {contactTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name {index === 0 && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                value={contact.name || ''}
                onChange={(e) => updateContactField(index, 'name', e.target.value)}
                placeholder="Contact person name"
                className={commonInputClasses}
                required={index === 0}
              />
              {index === 0 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone {index === 0 && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FiPhone className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="tel"
                value={contact.phone || ''}
                onChange={(e) => updateContactField(index, 'phone', e.target.value)}
                placeholder="10-digit mobile number"
                className={`${commonInputClasses} pl-10`}
                required={index === 0}
              />
              {index === 0 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FiMail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                value={contact.email || ''}
                onChange={(e) => updateContactField(index, 'email', e.target.value)}
                placeholder="contact@business.com"
                className={`${commonInputClasses} pl-10`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const formFields = [
    { label: 'Customer ID', name: 'customerID', type: 'text', required: true, placeholder: 'e.g., CUST-001' },
    { label: 'Customer Name', name: 'customerName', type: 'text', required: true, placeholder: 'Enter full business name' },
    { 
      label: 'Relationship Status', 
      name: 'relationshipStatus', 
      type: 'select', 
      required: true,
      tooltip: 'Good: Regular payments, Moderate: Occasional delays, Bad: Frequent issues'
    },
    { label: 'Credit Approval Status', name: 'creditApprovalStatus', type: 'select' },
    { label: 'Address', name: 'address', type: 'text', required: true, placeholder: 'Complete business address' },
    { label: 'Credit Limit (₹)', name: 'creditLimit', type: 'number', required: true, placeholder: 'Enter amount in rupees' },
    { label: 'Payment Terms', name: 'paymentTerms', type: 'text', required: true, placeholder: 'e.g., Net 30, COD' },
    { label: 'Through/Via', name: 'throughVia', type: 'text', required: true, placeholder: 'Reference or introduction source' },
    { label: 'GSTIN Number', name: 'gstrNo', type: 'text', required: true, placeholder: '15-digit GST number' },
    { label: 'KYC Status', name: 'kycProfile', type: 'text', required: true, placeholder: 'e.g., Verified, Pending' },
    { label: 'Blacklisted', name: 'isBlacklisted', type: 'checkbox', tooltip: 'Mark customer as blacklisted' },
    { label: 'Blacklist Reason', name: 'blacklistReason', type: 'textarea', placeholder: 'Reason for blacklisting (if applicable)' },
    { label: 'Remarks', name: 'remarks', type: 'textarea', required: false, placeholder: 'Additional notes or special instructions' },
    { label: 'GST Certificate', name: 'gstCopy', type: 'text', required: false, placeholder: 'URL or document reference' },
    { label: 'Drug License Expiry', name: 'dlExpiry', type: 'date', required: false },
  ];

  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {formFields.map((field) => (
          renderFormField(
            field.label,
            field.name,
            field.type,
            field.required,
            field.placeholder,
            field.tooltip
          )
        ))}
      </div>

      {/* Multiple Contacts Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiUser className="mr-2 h-5 w-5" />
              Contacts Management
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Add multiple contacts like drivers, dispatchers, managers, etc.
            </p>
          </div>
          <button
            type="button"
            onClick={addContact}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center space-x-2 transition-all"
          >
            <FiPlus className="h-4 w-4" />
            <span>Add Contact</span>
          </button>
        </div>

        <div className="space-y-4">
          {contacts.map((contact, index) => renderContactForm(contact, index))}
        </div>

        {contacts.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
            <FiUser className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-700 mb-2">No Contacts Added</h4>
            <p className="text-gray-500 mb-4">Add at least one contact person for this customer</p>
            <button
              type="button"
              onClick={addContact}
              className="px-6 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
            >
              Add First Contact
            </button>
          </div>
        )}
      </div>

      {/* Legend Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 flex items-center space-x-6">
          <div className="flex items-center">
            <div className="h-2 w-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            <span>Required field</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 border-2 border-blue-500 rounded mr-2"></div>
            <span>Optional field</span>
          </div>
          <div className="flex items-center">
            <FiUser className="h-3 w-3 text-blue-500 mr-2" />
            <span>Primary contact required</span>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      {contacts.length > 0 && contacts.some(c => !c.name || !c.phone || !c.role) && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-start">
            <FiAlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Incomplete Contacts</p>
              <p className="text-xs text-yellow-700 mt-1">
                Please ensure all contacts have at least Name, Phone, and Contact Type filled.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerForm;