import React, { useState, useEffect, Fragment } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import {
    productTypeOptions,
    sectionOptions,
    paymentTermsOptions,
    aluAluOptions,
    tabletOptions,
} from '@data/PO-Data'  // Correct: uppercase and .jsx extension
import {
    FiX,
    FiSave,
    FiDollarSign,
    FiPackage,
    FiShoppingCart,
    FiCalendar,
    FiTag,
    FiUser,
    FiGrid,
    FiLayers,
    FiBox,
    FiPercent,
    FiClipboard,
    FiEdit,
    FiCreditCard,
    FiFileText,
} from 'react-icons/fi'
import { AiOutlineSearch } from 'react-icons/ai'

const PurchaseOrderDialog = ({
    show,
    onClose,
    onSubmit,
    gstrData,
    compositions,
    initialData,
    mode = 'add',
    title,
}) => {
    const [formData, setFormData] = useState(initialData)
    const [query, setQuery] = useState('')
    const [compositionQuery, setCompositionQuery] = useState('')
    const [filteredGstr, setFilteredGstr] = useState(gstrData)

    useEffect(() => {
        setFormData(initialData)
    }, [initialData])

    useEffect(() => {
        const filtered = query === ''
            ? gstrData
            : gstrData.filter((g) => {
                  const name = g.customerName || g.partyName || g.name || '';
                  return name.toLowerCase().includes(query.toLowerCase());
              });
        setFilteredGstr(filtered);
    }, [query, gstrData]);

    const handleSubmit = (e) => {
        e.preventDefault()
        const numericFormData = {
            ...formData,
            poQty: Number(formData.poQty),
            poRate: Number(formData.poRate),
            mrp: formData.mrp ? Number(formData.mrp) : null,
            cyc: formData.cyc ? Number(formData.cyc) : null,
            advance: formData.advance ? Number(formData.advance) : null,
            amount: Number(formData.poQty) * Number(formData.poRate),
        }
        onSubmit(numericFormData)
    }

    const calculateTotal = () => {
        const qty = Number(formData.poQty) || 0
        const rate = Number(formData.poRate) || 0
        return (qty * rate).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
        })
    }

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-400"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-500"
                            enterFrom="opacity-0 scale-95 translate-y-4"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-400"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-4"
                        >
                            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl transition-all border border-white/20">
                                {/* Header */}
                                <div className="border-b border-gray-300/50">
                                    <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl bg-white/10 p-2 backdrop-blur-sm">
                                                {mode === 'add' ? (
                                                    <FiShoppingCart size={22} className="text-white" />
                                                ) : (
                                                    <FiEdit size={22} className="text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <Dialog.Title
                                                    as="h2"
                                                    className="text-2xl font-bold text-white font-sf-pro"
                                                >
                                                    {title ||
                                                        (mode === 'add'
                                                            ? 'Create Purchase Order'
                                                            : 'Edit Purchase Order')}
                                                </Dialog.Title>
                                                <p className="text-sm text-gray-300/80 font-sf-pro-text mt-1">
                                                    {mode === 'add' 
                                                        ? 'Add new purchase order details'
                                                        : 'Update existing purchase order'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="rounded-xl p-2.5 text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                                        >
                                            <FiX size={24} />
                                        </button>
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="max-h-[80vh] overflow-y-auto p-8"
                                >
                                    {/* Basic Information Section */}
                                    <div className="mb-10">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="rounded-lg bg-blue-100/50 p-2">
                                                <FiFileText className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800 font-sf-pro-medium">Basic Information</h3>
                                            <div className="h-px flex-1 bg-gradient-to-r from-gray-300/50 to-transparent ml-4"></div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {/* PO Number */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium flex items-center justify-between">
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-red-500">*</span>
                                                        PO Number
                                                    </span>
                                                    <span className="text-xs text-blue-600/70 bg-blue-50 px-2 py-1 rounded-full">
                                                        Auto-generated
                                                    </span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        className="w-full rounded-xl border border-gray-300/70 bg-white/50 px-4 py-3.5 shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300"
                                                        value={formData.poNo}
                                                        disabled
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Party Name */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium flex items-center gap-2">
                                                    <FiUser className="h-4 w-4 text-gray-500" />
                                                    <span>Party Name <span className="text-red-500">*</span></span>
                                                </label>
                                                <div className="relative">
                                                    <Combobox
                                                        value={formData.partyName}
                                                        onChange={(value) => {
                                                            const selectedParty = gstrData.find(
                                                                g =>
                                                                    g.customerName === value ||
                                                                    g.partyName === value ||
                                                                    g.name === value
                                                            )

                                                            setFormData({
                                                                ...formData,
                                                                partyName: value,
                                                                gstNo: selectedParty?.gstNo || selectedParty?.gstrNo || '',
                                                            })
                                                        }}
                                                    >
                                                        <div className="relative">
                                                            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                            <Combobox.Input
                                                                className="w-full rounded-xl border border-gray-300/70 pl-10 pr-4 py-3.5 shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300"
                                                                placeholder="Search party name..."
                                                                displayValue={(partyName) => partyName}
                                                                onChange={(event) => {
                                                                    const inputValue = event.target.value;
                                                                    setQuery(inputValue);
                                                                }}
                                                                required
                                                            />
                                                        </div>
                                                        <Combobox.Options className="absolute z-10 mt-2 max-h-72 w-full overflow-auto rounded-2xl bg-white/95 backdrop-blur-xl py-2 shadow-2xl border border-gray-300/50">
                                                            {filteredGstr.length > 0 ? (
                                                                filteredGstr.map((gst) => (
                                                                    <Combobox.Option
                                                                        key={gst.id || gst.gstNo || gst.gstrNo}
                                                                        value={gst.customerName || gst.partyName || gst.name}
                                                                        className={({ active }) =>
                                                                            `relative cursor-pointer select-none px-4 py-3.5 mx-2 rounded-xl transition-all duration-300 ${
                                                                                active ? 'bg-gray-100/70' : 'text-gray-900'
                                                                            }`
                                                                        }
                                                                    >
                                                                        {({ selected }) => (
                                                                            <div className="flex items-center justify-between">
                                                                                <div>
                                                                                    <div className={`font-medium ${selected ? 'text-gray-900 font-sf-pro-medium' : 'text-gray-800 font-sf-pro-text'}`}>
                                                                                        {gst.customerName || gst.partyName || gst.name}
                                                                                    </div>
                                                                                    <div className={`text-sm mt-0.5 ${selected ? 'text-gray-600' : 'text-gray-500'}`}>
                                                                                        {gst.gstNo || gst.gstrNo || 'No GST'}
                                                                                    </div>
                                                                                </div>
                                                                                {selected && (
                                                                                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </Combobox.Option>
                                                                ))
                                                            ) : (
                                                                <div className="px-4 py-3.5 text-center text-gray-500">
                                                                    No party found.
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => window.location.href = './customers'}
                                                                        className="text-blue-600 hover:text-blue-800 ml-2 underline transition-colors duration-300"
                                                                    >
                                                                        Add new party
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </Combobox.Options>
                                                    </Combobox>
                                                </div>
                                            </div>

                                            {/* GST Number */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    GST Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="GST number will appear here"
                                                    className="w-full rounded-xl border border-gray-300/70 bg-gray-50/50 px-4 py-3.5 shadow-sm font-sf-pro-text"
                                                    value={formData.gstNo}
                                                    disabled
                                                />
                                            </div>

                                            {/* PO Date */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium flex items-center gap-2">
                                                    <FiCalendar className="h-4 w-4 text-gray-500" />
                                                    PO Date
                                                </label>
                                                <input
                                                    type="date"
                                                    className="w-full rounded-xl border border-gray-300/70 px-4 py-3.5 shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300"
                                                    value={formData.poDate}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            poDate: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            {/* Product Type */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    Product Type
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full rounded-xl border border-gray-300/70 px-4 py-3.5 appearance-none shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300 bg-white/50"
                                                        value={formData.productNewOld}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                productNewOld: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        {productTypeOptions.map(
                                                            (option, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={option.value}
                                                                >
                                                                    {option.value}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    Section
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full rounded-xl border border-gray-300/70 px-4 py-3.5 appearance-none shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300 bg-white/50"
                                                        value={formData.section}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                section: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        {sectionOptions.map(
                                                            (option, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={option.value}
                                                                >
                                                                    {option.value}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Details Section */}
                                    <div className="mb-10">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="rounded-lg bg-green-100/50 p-2">
                                                <FiPackage className="h-5 w-5 text-green-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800 font-sf-pro-medium">Product Details</h3>
                                            <div className="h-px flex-1 bg-gradient-to-r from-gray-300/50 to-transparent ml-4"></div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {/* Brand Name */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium flex items-center gap-2">
                                                    <FiTag className="h-4 w-4 text-gray-500" />
                                                    <span>Brand Name <span className="text-red-500">*</span></span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter brand name"
                                                    className="w-full rounded-xl border border-gray-300/70 px-4 py-3.5 shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300"
                                                    value={formData.brandName}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            brandName: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>

                                            {/* Composition */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    Composition <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Combobox
                                                        value={formData.composition}
                                                        onChange={(value) => {
                                                            setFormData({
                                                                ...formData,
                                                                composition: value,
                                                            })
                                                        }}
                                                    >
                                                        <div className="relative">
                                                            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                            <Combobox.Input
                                                                className="w-full rounded-xl border border-gray-300/70 pl-10 pr-4 py-3.5 shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300"
                                                                placeholder="Search or enter composition..."
                                                                onChange={(e) =>
                                                                    setCompositionQuery(e.target.value)
                                                                }
                                                                required
                                                            />
                                                        </div>
                                                        <Combobox.Options className="absolute z-10 mt-2 max-h-72 w-full overflow-auto rounded-2xl bg-white/95 backdrop-blur-xl py-2 shadow-2xl border border-gray-300/50">
                                                            {compositions
                                                                .filter((comp) =>
                                                                    comp
                                                                        .toLowerCase()
                                                                        .includes(compositionQuery.toLowerCase())
                                                                )
                                                                .map((composition) => (
                                                                    <Combobox.Option
                                                                        key={composition}
                                                                        value={composition}
                                                                        className={({ active }) =>
                                                                            `relative cursor-pointer select-none px-4 py-3.5 mx-2 rounded-xl transition-all duration-300 ${
                                                                                active ? 'bg-gray-100/70' : 'text-gray-900'
                                                                            }`
                                                                        }
                                                                    >
                                                                        {({ selected }) => (
                                                                            <div className="flex items-center justify-between">
                                                                                <span className={`font-sf-pro-text ${selected ? 'text-gray-900 font-medium' : 'text-gray-800'}`}>
                                                                                    {composition}
                                                                                </span>
                                                                                {selected && (
                                                                                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </Combobox.Option>
                                                                ))}
                                                        </Combobox.Options>
                                                    </Combobox>
                                                </div>
                                            </div>

                                            {/* Pack Style */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    Pack Style
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter pack style"
                                                    className="w-full rounded-xl border border-gray-300/70 px-4 py-3.5 shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300"
                                                    value={formData.packStyle}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            packStyle: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            {/* Batch Quantity */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    Batch Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="Enter batch quantity"
                                                    className="w-full rounded-xl border border-gray-300/70 px-4 py-3.5 shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300"
                                                    value={formData.batchQty}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            batchQty: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            {/* Payment Terms */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    Payment Terms
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full rounded-xl border border-gray-300/70 px-4 py-3.5 appearance-none shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300 bg-white/50"
                                                        value={formData.paymentTerms}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                paymentTerms: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        {paymentTermsOptions.map(
                                                            (option, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={option.value}
                                                                >
                                                                    {option.value}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ALU ALU/ BLISTER/ STRIP BOTTLE */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    ALU ALU/ BLISTER/ STRIP BOTTLE
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full rounded-xl border border-gray-300/70 px-4 py-3.5 appearance-none shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300 bg-white/50"
                                                        value={formData.aluAluBlisterStripBottle}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                aluAluBlisterStripBottle: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        {aluAluOptions.map(
                                                            (option, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={option.value}
                                                                >
                                                                    {option.value}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tablet/ Capsule/ Syrup */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    Tablet/ Capsule/ Syrup
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full rounded-xl border border-gray-300/70 px-4 py-3.5 appearance-none shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300 bg-white/50"
                                                        value={formData.tabletCapsuleDrySyrupBottle}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                tabletCapsuleDrySyrupBottle: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        {tabletOptions.map(
                                                            (option, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={option.value}
                                                                >
                                                                    {option.value}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="mb-10 rounded-2xl bg-gradient-to-r from-blue-50/50 to-blue-100/30 backdrop-blur-sm p-6 border border-blue-200/30">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xl bg-blue-100/70 p-2.5">
                                                    <FiDollarSign className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-blue-900 font-sf-pro-medium">Order Summary</h4>
                                                    <p className="text-sm text-blue-700/70 font-sf-pro-text mt-0.5">
                                                        Total amount calculated automatically
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-blue-700/70 font-sf-pro-text">Total Amount</div>
                                                <div className="text-2xl font-bold text-blue-900 font-sf-pro mt-1">
                                                    {calculateTotal()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing Details Section */}
                                    <div className="mb-10">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="rounded-lg bg-purple-100/50 p-2">
                                                <FiCreditCard className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800 font-sf-pro-medium">Pricing Details</h3>
                                            <div className="h-px flex-1 bg-gradient-to-r from-gray-300/50 to-transparent ml-4"></div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {/* PO Quantity */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    PO Quantity <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="Enter quantity"
                                                    className="w-full rounded-xl border border-gray-300/70 px-4 py-3.5 shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300"
                                                    value={formData.poQty}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            poQty: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>

                                            {/* PO Rate */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    PO Rate <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                                                        ₹
                                                    </span>
                                                    <input
                                                        type="number"
                                                        placeholder="Enter PO rate"
                                                        className="w-full rounded-xl border border-gray-300/70 pl-10 pr-4 py-3.5 shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300"
                                                        value={formData.poRate}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                poRate: e.target.value,
                                                            })
                                                        }
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* MRP */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    MRP <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                                                        ₹
                                                    </span>
                                                    <input
                                                        type="number"
                                                        placeholder="Enter MRP"
                                                        className="w-full rounded-xl border border-gray-300/70 pl-10 pr-4 py-3.5 shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300"
                                                        value={formData.mrp}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                mrp: e.target.value,
                                                            })
                                                        }
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* CYC */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    CYC
                                                </label>
                                                <div className="relative">
                                                    <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                    <input
                                                        type="number"
                                                        placeholder="Enter CYC"
                                                        className="w-full rounded-xl border border-gray-300/70 pl-10 pr-4 py-3.5 shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300"
                                                        value={formData.cyc}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                cyc: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* Advance */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    Advance
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                                                        ₹
                                                    </span>
                                                    <input
                                                        type="number"
                                                        placeholder="Enter advance amount"
                                                        className="w-full rounded-xl border border-gray-300/70 pl-10 pr-4 py-3.5 shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300"
                                                        value={formData.advance}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                advance: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* Total Amount */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                    Total Amount
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                                                        ₹
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="w-full rounded-xl border border-gray-300/70 bg-gray-50/50 pl-10 pr-4 py-3.5 shadow-sm font-sf-pro-text"
                                                        value={(
                                                            Number(formData.poQty) *
                                                            Number(formData.poRate)
                                                        ).toFixed(2)}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Special Requirements */}
                                    <div className="mb-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="rounded-lg bg-amber-100/50 p-2">
                                                <FiClipboard className="h-5 w-5 text-amber-600" />
                                            </div>
                                            <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
                                                Special Requirements / Notes
                                            </label>
                                        </div>
                                        <textarea
                                            placeholder="Enter any special requirements, notes, or additional information..."
                                            className="w-full rounded-xl border border-gray-300/70 px-4 py-3.5 shadow-sm focus:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-text transition-all duration-300"
                                            rows="4"
                                            value={formData.notes}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    notes: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="mt-10 border-t border-gray-300/50 pt-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="text-sm text-gray-500 font-sf-pro-text">
                                                <span className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                    {mode === 'add'
                                                        ? 'Creating new purchase order'
                                                        : 'Updating purchase order'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    className="rounded-xl border border-gray-300/70 bg-white/50 backdrop-blur-sm px-6 py-3.5 font-medium text-gray-700 transition-all duration-300 hover:bg-white/80 hover:border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-gray-300/30 font-sf-pro-medium"
                                                    onClick={onClose}
                                                >
                                                    <FiX
                                                        size={18}
                                                        className="mr-2 inline"
                                                    />
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-3.5 font-medium text-white transition-all duration-300 hover:from-gray-800 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/30 font-sf-pro-medium shadow-lg"
                                                >
                                                    <FiSave
                                                        size={18}
                                                        className="mr-2 inline"
                                                    />
                                                    {mode === 'add'
                                                        ? 'Save & Submit'
                                                        : 'Update Order'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>

                {/* Add Apple fonts and global styles */}
                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&family=SF+Pro+Text:wght@300;400;500;600&display=swap');
                    
                    .font-sf-pro {
                        font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    }
                    
                    .font-sf-pro-text {
                        font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    }
                    
                    .font-sf-pro-medium {
                        font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        font-weight: 500;
                    }
                    
                    /* Custom scrollbar */
                    ::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }
                    
                    ::-webkit-scrollbar-track {
                        background: rgba(0, 0, 0, 0.05);
                        border-radius: 4px;
                    }
                    
                    ::-webkit-scrollbar-thumb {
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 4px;
                    }
                    
                    ::-webkit-scrollbar-thumb:hover {
                        background: rgba(0, 0, 0, 0.3);
                    }
                    
                    /* Remove number input arrows */
                    input[type="number"]::-webkit-inner-spin-button,
                    input[type="number"]::-webkit-outer-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                    
                    input[type="number"] {
                        -moz-appearance: textfield;
                    }
                `}</style>
            </Dialog>
        </Transition>
    )
}

export default PurchaseOrderDialog