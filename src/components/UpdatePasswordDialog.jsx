import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { HiX, HiKey } from 'react-icons/hi'

const UpdatePasswordDialog = ({ isOpen, onClose, onUpdate }) => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = () => {
        // Reset error
        setError('')

        // Validate passwords
        if (!newPassword || !confirmPassword) {
            setError('All fields are required')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long')
            return
        }

        // Call update function
        onUpdate(newPassword)

        // Reset form
        setNewPassword('')
        setConfirmPassword('')
    }

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
                                        <div className="rounded-full bg-blue-100 p-3">
                                            <HiKey className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-semibold text-gray-900"
                                        >
                                            Update Password
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
                                    <div className="space-y-4">
                                        {error && (
                                            <p className="text-sm text-red-500">
                                                {error}
                                            </p>
                                        )}
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) =>
                                                    setNewPassword(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>

                                    {/* Footer with buttons */}
                                    <div className="mt-8 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-medium text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-lg bg-blue-500 px-4 py-2.5 font-medium text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                            onClick={handleSubmit}
                                        >
                                            Update Password
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

export default UpdatePasswordDialog
