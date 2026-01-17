import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { HiOutlineExclamation, HiX } from 'react-icons/hi'
import PropTypes from 'prop-types'

const CustomWarningDialog = ({
    isOpen,
    onClose,
    title = 'Warning',
    message = 'This item requires attention.',
}) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop overlay */}
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

                {/* Dialog positioning */}
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-0 text-left align-middle shadow-xl transition-all">
                                {/* Header section */}
                                <div className="flex items-center justify-between border-b border-gray-100 p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-yellow-100 p-3">
                                            <HiOutlineExclamation className="h-6 w-6 text-yellow-600" />
                                        </div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-semibold text-gray-900"
                                        >
                                            {title}
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        type="button"
                                        className="rounded-full bg-gray-50 p-1.5 text-gray-400 hover:bg-gray-100"
                                        onClick={onClose}
                                    >
                                        <HiX className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Content section */}
                                <div className="p-6">
                                    <p className="text-gray-600">{message}</p>

                                    {/* Footer with button */}
                                    <div className="mt-8 flex justify-end">
                                        <button
                                            type="button"
                                            className="rounded-lg bg-yellow-500 px-4 py-2.5 font-medium text-white transition-all hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
                                            onClick={onClose}
                                        >
                                            Acknowledge
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

CustomWarningDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
}

export default CustomWarningDialog
