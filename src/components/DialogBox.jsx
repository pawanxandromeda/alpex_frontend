import React, { Fragment } from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { FiX, FiSave, FiCheck, FiPlus, FiAlertCircle } from 'react-icons/fi'

const DialogBox = ({
    isOpen,
    onClose,
    title,
    children,
    handleSubmit,
    hideFooter = false,
    submitText = "Save & Submit",
    cancelText = "Cancel",
    submitColor = "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    cancelColor = "border border-blue-200 text-blue-700 hover:bg-blue-50",
    icon = null,
    size = "max-w-4xl",
    isLoading = false,
    disableSubmit = false,
    type = "default" // "default", "success", "warning", "danger"
}) => {
    const getTypeStyles = () => {
        switch(type) {
            case 'success':
                return {
                    headerBg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-600',
                    accentColor: 'border-emerald-100'
                }
            case 'warning':
                return {
                    headerBg: 'bg-gradient-to-r from-amber-500 to-amber-600',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    accentColor: 'border-amber-100'
                }
            case 'danger':
                return {
                    headerBg: 'bg-gradient-to-r from-rose-500 to-rose-600',
                    iconBg: 'bg-rose-100',
                    iconColor: 'text-rose-600',
                    accentColor: 'border-rose-100'
                }
            default:
                return {
                    headerBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    accentColor: 'border-blue-100'
                }
        }
    }

    const typeStyles = getTypeStyles()

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <HeadlessDialog
                as="div"
                className="relative z-50"
                onClose={onClose}
            >
                {/* Clean backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
              <div className="fixed inset-0 bg-black/40 backdrop-blur-md" />

                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <HeadlessDialog.Panel 
                                className={`w-full ${size} transform overflow-hidden rounded-2xl bg-white shadow-2xl shadow-blue-500/10 transition-all border border-blue-100/50`}
                            >
                                {/* Premium Minimalist Header */}
                               <div className="relative z-10 ">
                                    <div className={`absolute inset-0 ${typeStyles.headerBg} pointer-events-none`}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>
                                    
                                    <div className="relative flex items-center justify-between px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            {icon ? (
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${typeStyles.iconBg} ${typeStyles.iconColor} shadow-lg`}>
                                                    {icon}
                                                </div>
                                            ) : (
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${typeStyles.iconBg} ${typeStyles.iconColor} shadow-lg`}>
                                                    <FiAlertCircle className="h-6 w-6" />
                                                </div>
                                            )}
                                            <div className="text-left">
                                                <HeadlessDialog.Title className="text-2xl font-bold text-white">
                                                    {title}
                                                </HeadlessDialog.Title>
                                                <p className="text-sm text-blue-100/90 mt-1">
                                                    Complete the form below to proceed
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="group relative h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                                            aria-label="Close dialog"
                                        >
                                            <FiX className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                                        </button>
                                    </div>

                                    {/* Decorative line */}
                                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                                </div>

                                {/* Content Area */}
                                <div className="px-8 py-8 text-left max-h-[65vh] overflow-y-auto">
                                    {/* Premium Information Card */}
                                    <div className={`rounded-xl border ${typeStyles.accentColor} bg-gradient-to-r from-white to-blue-50/30 p-5 mb-6 shadow-sm`}>
                                        <div className="flex items-center space-x-3">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${typeStyles.iconBg} ${typeStyles.iconColor}`}>
                                                <FiCheck className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-blue-900">Required Information</p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Fields marked with <span className="font-bold text-red-500">*</span> are mandatory
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Content */}
                                    <div className="space-y-6">
                                        {children}
                                    </div>
                                </div>

                                {/* Footer - Minimal & Premium */}
                                {!hideFooter && (
                                    <div className="px-8 py-5 border-t border-blue-100/50 bg-gradient-to-b from-white to-blue-50/20">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-blue-600/70">
                                                <span className="font-medium">Step 2 of 2</span> • Complete form
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={onClose}
                                                    className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${cancelColor} hover:shadow-sm active:scale-95`}
                                                >
                                                    {cancelText}
                                                </button>
                                                <button
                                                    type="submit"
                                                    onClick={handleSubmit}
                                                    disabled={isLoading || disableSubmit}
                                                    className={`px-6 py-2.5 text-sm font-medium text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${submitColor} flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group`}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                            <span>Processing...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                                                                {submitText.includes('Add') || submitText.includes('Create') ? (
                                                                    <FiPlus className="h-4 w-4" />
                                                                ) : (
                                                                    <FiSave className="h-4 w-4" />
                                                                )}
                                                            </span>
                                                            <span>{submitText}</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Decorative corner elements */}
                                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-blue-100/30 rounded-tl-2xl"></div>
                                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-100/30 rounded-tr-2xl"></div>
                                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-100/30 rounded-bl-2xl"></div>
                                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-blue-100/30 rounded-br-2xl"></div>
                            </HeadlessDialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </HeadlessDialog>
        </Transition>
    )
}

export default DialogBox