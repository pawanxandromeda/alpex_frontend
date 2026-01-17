import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { HiX } from 'react-icons/hi'

const CustomViewDialog = ({ isOpen, onClose, title, children }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-0 text-left align-middle shadow-xl transition-all">
                                {/* Header section */}
                                <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/10 to-primary/5 p-6">
                                    {title && (
                                        <Dialog.Title
                                            as="h3"
                                            className="text-xl font-semibold text-gray-900"
                                        >
                                            {title}
                                        </Dialog.Title>
                                    )}
                                    <button
                                        type="button"
                                        className="rounded-full bg-gray-50 p-2 text-gray-400 hover:bg-gray-100"
                                        onClick={onClose}
                                    >
                                        <HiX className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Content section */}
                                <div className="p-6">{children}</div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default CustomViewDialog
